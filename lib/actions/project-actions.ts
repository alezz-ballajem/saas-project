'use server';

import { getGitLabClient } from '@/lib/gitlab/client';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export interface CreateProjectData {
  name: string;
  description?: string;
  groupId: string;
}

export interface CreateProjectResult {
  success: boolean;
  project?: any;
  error?: string;
}

export async function createProject(data: CreateProjectData): Promise<CreateProjectResult> {
  try {
    const gitlab = getGitLabClient();
    
    // Check if project already exists
    const existingProjects = await gitlab.searchProjects(data.name);
    const existingProject = existingProjects.find(p => p.name === data.name);
    
    if (existingProject) {
      return {
        success: false,
        error: `Project '${data.name}' already exists`
      };
    }

    // Create project in GitLab
    const gitlabProject = await gitlab.createProject(
      data.name,
      data.groupId,
      data.description
    );

    // Store project in database
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        gitlabId: gitlabProject.id.toString(),
        gitlabUrl: gitlabProject.web_url,
        userId: 'system', // TODO: Get from session
      }
    });

    // Create webhook for pipeline events
    const webhookUrl = `${process.env.NEXTAUTH_URL}/api/webhooks/gitlab`;
    await gitlab.createWebhook(
      gitlabProject.id,
      webhookUrl,
      ['pipeline_events', 'job_events']
    );

    revalidatePath('/dashboard');
    
    return {
      success: true,
      project
    };
  } catch (error) {
    console.error('Error creating project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: true,
        pipelines: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProject(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: true,
        pipelines: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return project;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function deleteProject(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return {
        success: false,
        error: 'Project not found'
      };
    }

    // Delete from GitLab
    const gitlab = getGitLabClient();
    await gitlab.deleteProject(project.gitlabId);

    // Delete from database
    await prisma.project.delete({
      where: { id }
    });

    revalidatePath('/dashboard');
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function triggerProjectPipeline(projectId: string, variables: Record<string, string> = {}) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return {
        success: false,
        error: 'Project not found'
      };
    }

    const gitlab = getGitLabClient();
    
    // Trigger the SaaS pipeline with project variables
    const pipeline = await gitlab.triggerPipeline(
      process.env.PIPELINE_PROJECT_ID!,
      'trigger',
      {
        APP_NAME: project.name,
        GITLAB_TOKEN: process.env.GITLAB_TOKEN!,
        ...variables
      }
    );

    // Store pipeline in database
    await prisma.pipeline.create({
      data: {
        gitlabId: pipeline.id.toString(),
        status: 'PENDING',
        projectId: project.id
      }
    });

    revalidatePath(`/projects/${projectId}`);
    
    return {
      success: true,
      pipeline
    };
  } catch (error) {
    console.error('Error triggering pipeline:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
