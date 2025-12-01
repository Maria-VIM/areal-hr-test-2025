import { defineStore } from 'pinia';
import { jobApi } from '@/modules/job/api';
import type { Job } from '@/modules/job/types/Job.ts';
export const useJobStore = defineStore('job', {
  state: () => ({
    loading: false,
    jobs: [] as any,
    job: null as any,
  }),
  actions: {
    async fetchJobs(): Promise<void> {
      try {
        this.loading = true;
        const response = await jobApi.getAllJobs();
        this.jobs = response.data;
      } catch (error) {
        console.error(error);
        alert('Cannot get job');
      } finally {
        this.loading = false;
      }
    },
    async getJobById(id: number): Promise<Job | null> {
      try {
        this.loading = true;
        const response = await jobApi.getById(id);
        this.job = response.data;
        return response.data;
      } catch (error) {
        console.error(error);
        alert('Cannot get job by id');
        return null;
      } finally {
        this.loading = false;
      }
    },
    async getJobByName(name: string): Promise<void> {
      try {
        this.loading = true;
        const response = await jobApi.getByName(name);
        this.jobs = response.data.sort((a: any, b: any) => a.id - b.id);
      } catch (error) {
        console.error(error);
        alert('Cannot get jobs by name');
      } finally {
        this.loading = false;
      }
    },
    async deleteJob(id: number, name: string): Promise<void> {
      if (!confirm('Are you sure you want to delete this job?')) return;
      try {
        this.loading = true;
        await jobApi.delete(id);
        await this.getJobByName(name);
      } catch (error) {
        console.error(error);
        alert('Cannot delete job');
      } finally {
        this.loading = false;
      }
    },
    async restoreJob(id: number, name: string): Promise<void> {
      if (!confirm('Are you sure you want to restore this job?')) return;
      try {
        this.loading = true;
        await jobApi.restore(id);
        await this.getJobByName(name);
      } catch (error) {
        console.error(error);
        alert('Cannot restore job');
      } finally {
        this.loading = false;
      }
    },
    async updateJob(id: number, name: string, body: any): Promise<void> {
      if (!confirm('Are you sure you want to update this job?')) return;
      try {
        this.loading = true;
        await jobApi.update(id, body);
        await this.getJobByName(name);
      } catch (error) {
        console.error(error);
        alert('Cannot update job');
      } finally {
        this.loading = false;
      }
    },
    async createJob(name: string, body: any): Promise<void> {
      try {
        this.loading = true;
        await jobApi.create(body);
        await this.getJobByName(name);
      } catch (error) {
        console.error(error);
        alert('Cannot create job');
      } finally {
        this.loading = false;
      }
    },
  },
});
