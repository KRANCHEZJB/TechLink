import { eventsAPI } from './api'

export async function testAPIConnection() {
  try {
    console.log('Testing API connection...')
    const response = await eventsAPI.getAll()
    console.log('✅ API Connection successful!', response.data)
    return response.data
  } catch (error) {
    console.error('❌ API Connection failed:', error)
    return null
  }
}
