'use client'
import { useSocket } from '../providers/socketProvider'
import { logStart, logStatus } from '../lib/logger'
import {
  CustomRequestClient,
  EntityResponse,
  RequestProps,
} from '@/app/types/cowpoke/entity'
import { EntityKinds } from '@/app/types/cowpoke/common'

interface UseEntityMethodProps {
  entity: EntityKinds
  method: string
}

export const useEntityMethod = <T, R>({
  entity,
  method,
}: UseEntityMethodProps) => {
  const { socket } = useSocket()

  const callMethod: CustomRequestClient<T, R> = (values, callback) => {
    if (!socket) return
    logStart('Called', `${entity}.${method}`)
    const request: RequestProps<Partial<T>> = {
      values: values || {},
    }
    socket.emit(
      `${entity}.${method}`,
      request,
      (response: EntityResponse<R>) => {
        logStatus(response.status, `${entity}.${method}`)
        callback?.(response)
      }
    )
  }

  return callMethod
}
