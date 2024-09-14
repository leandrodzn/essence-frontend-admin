import { defineStore } from 'pinia'

import 'vue-toast-notification/dist/theme-sugar.css'
import axios from '@axios'

const routeBackend = '/admin'

export interface Administrator {
  id: number
  name: string
  surname: string
  email: string
  created_at: Date
}

export const useAdministratorsStore = defineStore('administrators', () => {
  const getAdministratorMe = async (): Promise<Administrator> => {
    const response = await axios.get(`${routeBackend}/me`)

    return response.data
  }

  return {
    getAdministratorMe
  }
})
