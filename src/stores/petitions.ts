import { defineStore } from 'pinia'

import axios from '@axios'

const route = '/admin/template-contact'

export interface WebTemplate {
  id: number
  price: number
  name: string
  description?: string
  ThumbnailImage?: {
    link: string
  }
}

export interface Customer {
  name: string
  surname: string
  email?: string
  phone?: string
}

export interface Petition {
  id: number
  price_day: number
  web_template: number
  readed: boolean
  show_customer: boolean
  subject?: string
  description?: string
  created_at: Date
  WebTemplate: WebTemplate
  Customer: Customer
}

export interface PetitionsGet {
  count: number
  rows: Petition[]
}

export interface PetitionUpdate {
  readed: boolean
}

export const usePetitionsStore = defineStore('petitions', () => {
  const getPetitions = async (): Promise<PetitionsGet> => {
    const response = await axios.get(route)

    return response.data
  }

  const updatePetition = async (id: number, data: PetitionUpdate): Promise<void> => {
    const response = await axios.put(`${route}/${id}`, data)

    return response.data
  }

  const getOnePetition = async (id: number): Promise<Petition> => {
    const response = await axios.get(`${route}/${id}`)

    return response.data
  }

  const deletePetition = async (id: number): Promise<void> => {
    await axios.delete(`${route}/${id}`)
  }

  return {
    getPetitions,
    getOnePetition,
    updatePetition,
    deletePetition
  }
})
