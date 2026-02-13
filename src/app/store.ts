import { defineStore } from 'pinia';

import type { Account, AccountCreateForm } from '@/entities/account';

export const useAccountsStore = defineStore('accounts', {
  state: () => {
    return { items: [] as Account[] };
  },
  actions: {
    add(account: AccountCreateForm) {
      const newAccount: Account = {
        id: this.getNextId,
        ...account,
      };
      this.items.push(newAccount);
    },
    addNew() {
      this.add({
        login: `user${this.getNextId}`,
        password: null,
        tags: [],
        type: 'local',
      });
    },
    update(id: number, updatedAccount: Partial<Account>) {
      const item = this.items.find(account => account.id === id);
      if (item) {
        Object.assign(item, updatedAccount);
      } else {
        console.warn(`Account with id ${id} not found.`);
      }
    },
    delete(id: number) {
      const index = this.items.findIndex(account => account.id === id);
      if (index !== -1) {
        this.items.splice(index, 1);
      } else {
        console.warn(`Account with id ${id} not found.`);
      }
    },
  },
  getters: {
    getNextId(state): number {
      if (state.items.length === 0) {
        return 1;
      }
      const maxId = Math.max(...state.items.map(account => account.id));
      return maxId + 1;
    }
  },
  persist: true,
});