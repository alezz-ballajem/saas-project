'use server';

import { getGitLabClient } from '@/lib/gitlab/client';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function getPipelines(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return [];
    }

    const gitlab = getGitLabClient();
    const pipelines = await gitlab.getPipelines(project.gitlabId);

    // Update database with latest pipeline data
    for (const pipeline of pipelines) {
      await prisma.pipeline.upsert({
        where: { gitlabId: pipeline.id.toString() },
        update: {
          status: pipeline.status.toUpperCase() as any,
          stage: pipeline.stages?.[0],
          startedAt: pipeline.started_at ? new Date(pipeline.started_at) : null,
          finishedAt: pipeline.finished_at ? new Date(pipeline.finished_at) : null,
          duration: pipeline.duration
        },
        create: {
          gitlabId: pipeline.id.toString(),
          status: pipeline.status.toUpperCase() as any,
          stage: pipeline.stages?.[0],
          startedAt: pipeline.started_at ? new Date(pipeline.started_at) : null,
          finishedAt: pipeline.finished_at ? new Date(pipeline.finished_at) : null,
          duration: pipeline.duration,
          projectId: project.id
        }
      });
    }

    // Return pipelines from database
    const dbPipelines = await prisma.pipeline.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });

    return dbPipelines;
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    return [];
  }
}

export async function getPipelineDetails(projectId: string, pipelineId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return null;
    }

    const gitlab = getGitLabClient();
    const pipeline = await gitlab.getPipeline(project.gitlabId, pipelineId);
    const jobs = await gitlab.getPipelineJobs(project.gitlabId, pipelineId);

    return {
      pipeline,
      jobs
    };
  } catch (error) {
    console.error('Error fetching pipeline details:', error);
    return null;
  }
}

export async function getJobLogs(projectId: string, jobId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return null;
    }

    const gitlab = getGitLabClient();
    const logs = await gitlab.getJobLogs(project.gitlabId, jobId);

    return logs;
  } catch (error) {
    console.error('Error fetching job logs:', error);
    return null;
  }
}

export async function updatePipelineStatus(pipelineId: string, status: string, stage?: string) {
  try {
    await prisma.pipeline.update({
      where: { gitlabId: pipelineId },
      data: {
        status: status.toUpperCase() as any,
        stage,
        updatedAt: new Date()
      }
    });

    revalidatePath('/dashboard');
    revalidatePath('/projects');
  } catch (error) {
    console.error('Error updating pipeline status:', error);
  }
}

export async function getRecentPipelines(limit: number = 10) {
  try {
    const pipelines = await prisma.pipeline.findMany({
      include: {
        project: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return pipelines;
  } catch (error) {
    console.error('Error fetching recent pipelines:', error);
    return [];
  }
}
