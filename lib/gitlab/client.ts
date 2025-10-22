import axios, { AxiosInstance } from 'axios';

export interface GitLabProject {
  id: number;
  name: string;
  description?: string;
  web_url: string;
  ssh_url_to_repo: string;
  http_url_to_repo: string;
  namespace: {
    id: number;
    name: string;
    path: string;
    kind: string;
    full_path: string;
  };
  created_at: string;
  last_activity_at: string;
}

export interface GitLabPipeline {
  id: number;
  status: 'pending' | 'running' | 'success' | 'failed' | 'canceled' | 'skipped';
  ref: string;
  sha: string;
  web_url: string;
  created_at: string;
  updated_at: string;
  started_at?: string;
  finished_at?: string;
  duration?: number;
  stages?: string[];
  jobs?: GitLabJob[];
}

export interface GitLabJob {
  id: number;
  status: 'pending' | 'running' | 'success' | 'failed' | 'canceled' | 'skipped';
  stage: string;
  name: string;
  ref: string;
  created_at: string;
  started_at?: string;
  finished_at?: string;
  duration?: number;
  web_url: string;
  artifacts_file?: {
    filename: string;
    size: number;
  };
}

export interface GitLabGroup {
  id: number;
  name: string;
  path: string;
  full_path: string;
  description?: string;
  web_url: string;
}

export class GitLabClient {
  private client: AxiosInstance;
  private baseURL: string;
  private token: string;

  constructor(baseURL: string, token: string) {
    this.baseURL = baseURL;
    this.token = token;
    
    this.client = axios.create({
      baseURL: `${baseURL}/api/v4`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`GitLab API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('GitLab API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('GitLab API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // User and Authentication
  async getCurrentUser() {
    const response = await this.client.get('/user');
    return response.data;
  }

  // Groups
  async getGroup(groupId: string | number): Promise<GitLabGroup> {
    const response = await this.client.get(`/groups/${groupId}`);
    return response.data;
  }

  async searchGroups(query: string): Promise<GitLabGroup[]> {
    const response = await this.client.get('/groups', {
      params: { search: query }
    });
    return response.data;
  }

  // Projects
  async createProject(name: string, groupId: string | number, description?: string): Promise<GitLabProject> {
    const response = await this.client.post('/projects', {
      name,
      namespace_id: groupId,
      description,
      visibility: 'private',
      initialize_with_readme: true,
    });
    return response.data;
  }

  async getProject(projectId: string | number): Promise<GitLabProject> {
    const response = await this.client.get(`/projects/${projectId}`);
    return response.data;
  }

  async searchProjects(query: string): Promise<GitLabProject[]> {
    const response = await this.client.get('/projects', {
      params: { 
        search: query,
        membership: false,
        order_by: 'last_activity_at',
        sort: 'desc'
      }
    });
    return response.data;
  }

  async deleteProject(projectId: string | number): Promise<void> {
    await this.client.delete(`/projects/${projectId}`);
  }

  // Pipelines
  async triggerPipeline(projectId: string | number, ref: string = 'main', variables: Record<string, string> = {}): Promise<GitLabPipeline> {
    const response = await this.client.post(`/projects/${projectId}/trigger/pipeline`, {
      ref,
      variables: Object.entries(variables).map(([key, value]) => ({
        key,
        value
      }))
    });
    return response.data;
  }

  async getPipelines(projectId: string | number, page: number = 1, perPage: number = 20): Promise<GitLabPipeline[]> {
    const response = await this.client.get(`/projects/${projectId}/pipelines`, {
      params: {
        page,
        per_page: perPage,
        order_by: 'updated_at',
        sort: 'desc'
      }
    });
    return response.data;
  }

  async getPipeline(projectId: string | number, pipelineId: string | number): Promise<GitLabPipeline> {
    const response = await this.client.get(`/projects/${projectId}/pipelines/${pipelineId}`);
    return response.data;
  }

  async getPipelineJobs(projectId: string | number, pipelineId: string | number): Promise<GitLabJob[]> {
    const response = await this.client.get(`/projects/${projectId}/pipelines/${pipelineId}/jobs`);
    return response.data;
  }

  async getJobLogs(projectId: string | number, jobId: string | number): Promise<string> {
    const response = await this.client.get(`/projects/${projectId}/jobs/${jobId}/trace`);
    return response.data;
  }

  // Webhooks
  async createWebhook(projectId: string | number, url: string, events: string[] = ['pipeline_events']): Promise<any> {
    const response = await this.client.post(`/projects/${projectId}/hooks`, {
      url,
      pipeline_events: events.includes('pipeline_events'),
      job_events: events.includes('job_events'),
      push_events: events.includes('push_events'),
      tag_push_events: events.includes('tag_push_events'),
      issues_events: events.includes('issues_events'),
      confidential_issues_events: events.includes('confidential_issues_events'),
      note_events: events.includes('note_events'),
      confidential_note_events: events.includes('confidential_note_events'),
      merge_request_events: events.includes('merge_request_events'),
      wiki_page_events: events.includes('wiki_page_events'),
      deployment_events: events.includes('deployment_events'),
      feature_flag_events: events.includes('feature_flag_events'),
      releases_events: events.includes('releases_events'),
    });
    return response.data;
  }

  async getWebhooks(projectId: string | number): Promise<any[]> {
    const response = await this.client.get(`/projects/${projectId}/hooks`);
    return response.data;
  }

  async deleteWebhook(projectId: string | number, hookId: string | number): Promise<void> {
    await this.client.delete(`/projects/${projectId}/hooks/${hookId}`);
  }
}

// Singleton instance
let gitlabClient: GitLabClient | null = null;

export function getGitLabClient(): GitLabClient {
  if (!gitlabClient) {
    const baseURL = process.env.GITLAB_HOST || 'https://gitlab.sonod.tech';
    const token = process.env.GITLAB_TOKEN;
    
    if (!token) {
      throw new Error('GITLAB_TOKEN environment variable is required');
    }
    
    gitlabClient = new GitLabClient(baseURL, token);
  }
  
  return gitlabClient;
}

export function createGitLabClient(baseURL: string, token: string): GitLabClient {
  return new GitLabClient(baseURL, token);
}
