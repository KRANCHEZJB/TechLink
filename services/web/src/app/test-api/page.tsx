'use client'

import { useEffect, useState } from 'react'
import { testAPIConnection } from '@/lib/test-connection'

export default function TestAPI() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const testConnection = async () => {
      const result = await testAPIConnection()
      if (result) {
        setApiStatus('success')
        setData(result)
      } else {
        setApiStatus('error')
      }
    }
    
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
        
        {apiStatus === 'loading' && (
          <div className="text-blue-600">Testing connection to backend API...</div>
        )}
        
        {apiStatus === 'success' && (
          <div className="text-green-600">
            ✅ API Connection Successful!
            <pre className="mt-4 text-xs bg-gray-100 p-4 rounded">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
        
        {apiStatus === 'error' && (
          <div className="text-red-600">
            ❌ API Connection Failed
            <p className="text-sm mt-2">Make sure your backend is running on port 4000</p>
          </div>
        )}
      </div>
    </div>
  )
}
