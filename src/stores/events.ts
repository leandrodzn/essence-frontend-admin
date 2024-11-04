import { defineStore } from 'pinia'

import axios from '@axios'

const route = '/admin/events'

export interface Event {
  id: number
  name: string
  description: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}

export interface EventCreate {
  name: string
  description: string
}

export interface EventUpdate {
  id: number
  name: string
  description: string
}

export const useEventsStore = defineStore('events', () => {
  const getEvents = async (): Promise<Event[]> => {
    const response = await axios.get(route)

    return response.data
  }

  const createEvent = async (event: EventCreate): Promise<Event> => {
    const response = await axios.post(route, event)

    return response.data
  }

  const updateEvent = async (event: EventUpdate): Promise<Event> => {
    const response = await axios.put(`${route}/${event.id}`, event, false)

    return response.data
  }

  const deleteEvent = async (id: number): Promise<void> => {
    await axios.delete(`${route}/${id}`)
  }

  return {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
  }
})
