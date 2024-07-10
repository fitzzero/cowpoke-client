import { useMemo, useState } from 'react'
import { DisplayTime } from './displayTime'
import moment from 'moment'

export const CurrentTime = () => {
  const [time, setTime] = useState(0)
  useMemo(() => {
    const interval = setInterval(() => setTime(moment().valueOf()), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])
  return <DisplayTime dateMs={time} prefix='Current Time' />
}
