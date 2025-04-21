import apiClient from './setup'

export const getEvents = async (queryParams = '') => {
  if (queryParams) {
    const response = await apiClient.get(`/events${queryParams}`)
    return response
  }

  const response = await apiClient.get('/events')
  return response
}

export const getEvent = async (id) => {
  const response = await apiClient.get(`/events/${id}`)
  return response
}

export const registerForEvent = async (id) => {
  const response = await apiClient.post(`/events/${id}/register`)
  return response
}

export const unregisterForEvent = async (id) => {
  const response = await apiClient.post(`/events/${id}/unregister`)
  return response
}

export const getMyUpcomingEvents = async () => {
  const response = await apiClient.get('/users/me/upcoming-events')
  return response
}
