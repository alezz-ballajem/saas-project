import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { getGitLabClient } from '@/lib/gitlab/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Read header directly from the incoming request
    const gitlabToken = request.headers.get('x-gitlab-token');
    
    // Verify webhook token (optional but recommended)
    if (process.env.GITLAB_WEBHOOK_TOKEN && gitlabToken !== process.env.GITLAB_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { object_kind, object_attributes, project } = body;

    if (object_kind === 'pipeline') {
      const pipelineId = object_attributes.id.toString();
      const status = object_attributes.status;
      const stage = object_attributes.stage;
      
      // Find project by GitLab project ID
      const dbProject = await prisma.project.findFirst({
        where: { gitlabId: project.id.toString() }
      });

      if (dbProject) {
        // Update or create pipeline record
        await prisma.pipeline.upsert({
          where: { gitlabId: pipelineId },
          update: {
            status: status.toUpperCase() as any,
            stage,
            startedAt: object_attributes.started_at ? new Date(object_attributes.started_at) : null,
            finishedAt: object_attributes.finished_at ? new Date(object_attributes.finished_at) : null,
            duration: object_attributes.duration,
            updatedAt: new Date()
          },
          create: {
            gitlabId: pipelineId,
            status: status.toUpperCase() as any,
            stage,
            startedAt: object_attributes.started_at ? new Date(object_attributes.started_at) : null,
            finishedAt: object_attributes.finished_at ? new Date(object_attributes.finished_at) : null,
            duration: object_attributes.duration,
            projectId: dbProject.id
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
