import { defineStore } from 'pinia';
import { OrganizationApi } from '../api';

export const useOrganizationStore = defineStore('organization', {
  state: () => ({
    organizations: [] as any[],
    organization: null as any,
    loading: false,
  }),

  actions: {
    async fetchOrganizations(): Promise<void> {
      try {
        this.loading = true;
        const response = await OrganizationApi.getAll();
        this.organizations = response.data.sort((a: any, b: any) => a.id - b.id);
      } catch (error) {
        console.error(error);
        alert('Failed to load organizations');
      } finally {
        this.loading = false;
      }
    },

    async getOrganizationById(id: number): Promise<void> {
      try {
        this.loading = true;
        const response = await OrganizationApi.getById(id);
        this.organization = response.data;
        return response.data;
      } catch (error) {
        console.error('Fetch failed:', error);
        alert('Failed to get info about organization');
      } finally {
        this.loading = false;
      }
    },

    async createOrganization(body: any): Promise<void> {
      try {
        this.loading = true;
        await OrganizationApi.create(body);
        await this.fetchOrganizations();
      } catch (error) {
        console.error('Create failed:', error);
        alert('Failed to create organization');
      } finally {
        this.loading = false;
      }
    },

    async updateOrganization(id: number, body: any): Promise<void> {
      try {
        this.loading = true;
        await OrganizationApi.update(id, body);
        await this.fetchOrganizations();
      } catch (error) {
        console.error('Update failed:', error);
        alert('Failed to update organization');
      } finally {
        this.loading = false;
      }
    },

    async deleteOrganization(id: number): Promise<void> {
      if (!confirm('Are you sure you want to delete this organization?')) return;

      try {
        this.loading = true;
        await OrganizationApi.delete(id);
        await this.fetchOrganizations();
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
        await this.fetchOrganizations();
      } catch (error) {
        console.error('Restore failed:', error);
        alert('Failed to restore organization');
      } finally {
        this.loading = false;
      }
    },
  },
});
