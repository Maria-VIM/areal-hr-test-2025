import { defineStore } from 'pinia';
import { jobApi } from '@/modules/job/api';
import type { Job } from '@/modules/job/types/Job.ts';
import type { JobForm } from '@/modules/job/types/JobForm.ts';
export const useJobStore = defineStore('job', {
  state: () => ({
    loading: false,
    jobs: [] as Job[],
    job: null as Job | null,
    version: 0,
  }),
  actions: {
    incrementVersion() {
      this.version++;
    },
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
    async deleteJob(id: number): Promise<void> {
      if (!confirm('Are you sure you want to delete this job?')) return;
      try {
        this.loading = true;
        await jobApi.delete(id);
        this.incrementVersion();
      } catch (error) {
        console.error(error);
        alert('Cannot delete job');
      } finally {
        this.loading = false;
      }
    },
    async restoreJob(id: number): Promise<void> {
      if (!confirm('Are you sure you want to restore this job?')) return;
      try {
        this.loading = true;
        await jobApi.restore(id);
      } catch (error) {
        console.error(error);
        alert('Cannot restore job');
      } finally {
        this.loading = false;
      }
    },
    async updateJob(id: number, body: JobForm): Promise<void> {
      if (!confirm('Are you sure you want to update this job?')) return;
      try {
        this.loading = true;
        await jobApi.update(id, body);
        this.incrementVersion();
      } catch (error) {
        console.error(error);
        alert('Cannot update job');
      } finally {
        this.loading = false;
      }
    },
    async createJob(body: JobForm): Promise<void> {
      try {
        this.loading = true;
        await jobApi.create(body);
        this.incrementVersion();
      } catch (error) {
        console.error(error);
        alert('Cannot create job');
      } finally {
        this.loading = false;
      }
    },
  },
});
