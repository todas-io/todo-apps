// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    username: "",
  }),
  actions: {
    async updateUsername(username) {
      this.username = username;
    }
  }
})
