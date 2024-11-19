import { defineStore } from 'pinia'
import { type Event } from '@/stores/events'

import axios from '@axios'

const route = '/admin/web-templates'

export interface Image {
  id: number
  web_template: number
  is_thumbnail: boolean
  link: string
}

export interface WebTemplateEvent {
  id: number
  web_template: number
  event: number
  Event: Event
}

export interface WebTemplate {
  id: number
  name: string
  description: string
  price: number
  link: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  ThumbnailImage: Image
  Images: Image[]
  WebTemplateEvents: WebTemplateEvent[]
}

export interface WebTemplateCreate {
  name: string
  description: string
  events: number[]
  price: number
  link: string
  mainImage: File
  additionalImages: File[]
}

export interface WebTemplateUpdate {
  id: number
  name: string
  description: string
  events: number[]
  price: number
  link: string
  mainImage?: File
  additionalImages?: File[]
}

export const useWebTemplatesStore = defineStore('web-templates', () => {
  const getWebTemplates = async (): Promise<WebTemplate[]> => {
    const response = await axios.get(route)

    return response.data
  }

  const getOneWebTemplate = async (id: number): Promise<WebTemplate> => {
    const response = await axios.get(`${route}/${id}`)

    return response.data
  }

  const createWebTemplate = async (webTemplate: WebTemplateCreate): Promise<WebTemplate> => {
    const response = await axios.post(route, webTemplate, true)

    return response.data
  }

  const updateWebTemplate = async (webTemplate: WebTemplateUpdate): Promise<WebTemplate> => {
    const response = await axios.put(`${route}/${webTemplate.id}`, webTemplate, true)

    return response.data
  }

  const deleteWebTemplate = async (id: number): Promise<void> => {
    await axios.delete(`${route}/${id}`)
  }

  return {
    getWebTemplates,
    getOneWebTemplate,
    createWebTemplate,
    updateWebTemplate,
    deleteWebTemplate
  }
})
