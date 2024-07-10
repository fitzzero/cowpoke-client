'use client'
import { IndexCollection, Status, _BaseProps } from 'cowpoke-types/_base'
import { useEffect, useMemo, useState } from 'react'
import { useSocket } from '../providers/socketProvider'
import { logEnd, logStart, logStatus } from '../lib/logger'
import {
  EntityKinds,
  IndexOptions,
  IndexRequestCallback,
  IndexRequestClient,
  IndexRequestProps,
  UpdateRequestClient,
} from 'cowpoke-types/entity'
import { updateOne } from '../lib'

interface UseIndexProps<T> extends IndexOptions {
  entity: EntityKinds
}

export const useCollection = <T>({ entity, sort }: UseIndexProps<T>) => {
  const { socket, userId } = useSocket()
  const [status, setStatus] = useState<Status | undefined>(undefined)
  const [index, setIndex] = useState<IndexCollection<T>>(undefined)
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const roomId = `${entity}:index`

  // Index data
  const indexRequest: IndexRequestClient<T> = filter => {
    if (!userId || !socket) return
    logStart('', `${entity}.index`)
    const request: IndexRequestProps<T> = {
      values: filter || {},
      index: {
        page,
        sort,
      },
    }
    socket.emit(`${entity}.index`, request, indexCallback)
  }
  const indexCallback: IndexRequestCallback<T> = ({
    status,
    values,
    total,
  }) => {
    setStatus(status)
    logStatus(status, `${entity}.index`)
    if (status.code === 200) {
      setIndex(values)
      setTotal(total)
    }
  }
  const updateIndex: UpdateRequestClient<T> = values => {
    setIndex(index => updateOne(values, index))
  }

  // Subscribe to room
  useEffect(() => {
    if (!socket || !userId) return
    logStart('collection', `${entity}.subscribe`)
    // Join room
    socket.emit('sub', roomId)
    // Set data on room update
    socket.on(roomId, () => {
      // TODO: Re-request data and maybe debounce it
    })
    return () => {
      logEnd('collection', `${entity}.subscribe`)
      socket.emit('unsub', roomId)
      socket.off(roomId)
    }
  }, [socket, userId])

  // Read data if it's missing
  useMemo(() => {
    if (!userId || index) return
    if (userId && !index) {
      indexRequest()
    }
  }, [userId])

  return {
    index,
    indexRequest,
    page,
    setPage,
    status,
    total,
    updateIndex,
  }
}
