'use client'
import { useEffect, useState } from 'react'
import { logAlert } from '../lib/logger'

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [state, setState] = useState(initialValue)

  useEffect(() => {
    try {
      const value = localStorage.getItem(key)
      if (!value) localStorage.setItem(key, JSON.stringify(initialValue))
      else setState(value ? JSON.parse(value) : initialValue)
    } catch (error) {}
  }, [])

  const setValue = (value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      setState(value)
    } catch (error) {
      logAlert('issue saving to local storage', 'useLocalStorage')
    }
  }

  return [state, setValue] as const
}
