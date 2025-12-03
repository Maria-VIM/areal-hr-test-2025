import { defineStore } from 'pinia';
import { OrganizationApi } from '../api';
import type { Organization } from '@/modules/organization/types/Organization.ts';
import type { OrganizationForm } from '@/modules/organization/types/OrganizationForm.ts';

export const useOrganizationStore = defineStore('organization', {
  state: () => ({
    organizations: [] as Organization[],
    organization: null as Organization | null,
    loading: false,
    version: 0,
  }),

  actions: {
    incrementVersion() {
      this.version++;
    },

    async fetchOrganizations(): Promise<void> {
      try {
        this.loading = true;
        const response = await OrganizationApi.getAll();
        this.organizations = response.data.sort((a: any, b: any) => a.id - b.id);
      } catch (error) {
        console.error(error);
        alert('Cannot load organizations');
      } finally {
        this.loading = false;
      }
    },

    async fetchActiveOrganizations(): Promise<void> {
      try {
        this.loading = true;
        const response = await OrganizationApi.getAllActive();
        this.organizations = response.data.sort((a: any, b: any) => a.id - b.id);
      } catch (error) {
        console.error(error);
        alert('Cannot load organizations');
      } finally {
        this.loading = false;
      }
    },

    async getOrganizationById(id: number): Promise<Organization | null> {
      try {
        this.loading = true;
        const response = await OrganizationApi.getById(id);
        this.organization = response.data;
        return response.data;
      } catch (error) {
        console.error(error);
        alert('Cannot get info about organization');
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createOrganization(body: OrganizationForm): Promise<void> {
      try {
        this.loading = true;
        await OrganizationApi.create(body);
        this.incrementVersion();
      } catch (error) {
        console.error(error);
        alert('Cannot create organization');
      } finally {
        this.loading = false;
      }
    },

    async updateOrganization(id: number, body: OrganizationForm): Promise<void> {
      try {
        this.loading = true;
        await OrganizationApi.update(id, body);
        this.incrementVersion();
      } catch (error) {
        console.error(error);
        alert('Cannot update organization');
      } finally {
        this.loading = false;
      }
    },

    async deleteOrganization(id: number): Promise<void> {
      if (!confirm('Are you sure you want to delete this organization?')) return;

      try {
        this.loading = true;
        await OrganizationApi.delete(id);
        this.incrementVersion();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete organization');
      } finally {
        this.loading = false;
      }
    },
    async restoreOrganization(id: number): Promise<void> {
      if (!confirm('Are you sure you want to restore this organization?')) return;

      try {
        this.loading = true;
        await OrganizationApi.restore(id);
        this.incrementVersion();
      } catch (error) {
        console.error('Restore failed:', error);
        alert('Cannot restore organization');
      } finally {
        this.loading = false;
      }
    },
  },
});
