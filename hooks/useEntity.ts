'use client'
import { Id, Nullish, Status, _BaseProps } from '@/app/types/cowpoke/_base'
import { useEffect, useMemo, useState } from 'react'
import { useSocket } from '../providers/socketProvider'
import { logEnd, logStart, logStatus, logSuccess } from '../lib/logger'
import {
  Callback,
  CreateRequestCallback,
  CreateRequestClient,
  DeleteRequestCallback,
  DeleteRequestClient,
  DeleteRequestProps,
  DeleteResult,
  EntityResponse,
  ReadRequestCallback,
  ReadRequestClient,
  RequestProps,
  UpdateRequestCallback,
  UpdateRequestClient,
  UpdateRequestProps,
} from '@/app/types/cowpoke/entity'
import { EntityKinds } from '@/app/types/cowpoke/common'

interface UseEntityProps<T> {
  _id?: string
  entity: EntityKinds
  initialValues?: (T & _BaseProps) | Nullish
  logRoom?: boolean
  search?: Partial<T>
  updateIndex?: UpdateRequestClient<any>
}

export const useEntity = <T extends _BaseProps>({
  _id,
  entity,
  initialValues,
  logRoom = true,
  search,
  updateIndex,
}: UseEntityProps<T>) => {
  const { socket, userId } = useSocket()
  const [status, setStatus] = useState<Status | undefined>(undefined)
  const [values, setValues] = useState(initialValues)
  const [id, setId] = useState<string | undefined>(_id || search?._id)
  const roomId = `${entity}:${id}`

  // Create data
  const createRequest: CreateRequestClient<T> = (values, customCb) => {
    if (!socket) return
    logStart('', `${entity}.create`)
    socket.emit(
      `${entity}.create`,
      { values },
      (response: EntityResponse<T & _BaseProps>) => {
        customCb?.(response)
        createCallback(response)
      }
    )
  }
  const createCallback: CreateRequestCallback<T> = ({
    status,
    values: newValues,
  }) => {
    logStatus(status, `${entity}.create`)
    setStatus(status)
    if (status.code === 200 && newValues?._id) {
      setValues(newValues)
      setId(newValues._id)
    }
  }

  // Delete Data
  const deleteRequest: DeleteRequestClient = customCb => {
    if (!socket || !id) return
    logStart(id, `${entity}.delete`)
    const request: DeleteRequestProps = {
      values: {
        _id: id,
      },
    }
    socket.emit(
      `${entity}.delete`,
      request,
      (response: EntityResponse<Nullish | DeleteResult>) => {
        customCb?.(response)
        deleteCallback(response)
      }
    )
  }

  const deleteCallback: DeleteRequestCallback = ({ status }) => {
    setStatus(status)
    logStatus(status, `${entity}.delete`)
    if (status.code === 200) {
      setValues(undefined)
      setId(undefined)
    }
  }

  // Initial find request
  const findRequest = () => {
    if (!socket || !search) return
    logStart('', `${entity}.read (find)`)
    const request: RequestProps<Partial<T>> = {
      values: search,
    }
    socket.emit(
      `${entity}.read`,
      request,
      (response: EntityResponse<T & _BaseProps>) => {
        readCallback(response)
      }
    )
  }

  // Read data
  const readRequest: ReadRequestClient<T> = customCb => {
    if (!socket || !id) return
    logStart(id, `${entity}.read`)
    const request: RequestProps<Id> = {
      values: {
        _id: id,
      },
    }
    socket.emit(
      `${roomId}.read`,
      request,
      (response: EntityResponse<T & _BaseProps>) => {
        customCb?.(response)
        readCallback(response)
      }
    )
  }
  const readCallback: ReadRequestCallback<T & _BaseProps> = ({
    status,
    values: newValues,
  }) => {
    setStatus(status)
    logStatus(status, `${entity}.read`)
    if (status.code !== 200) {
      return
    }
    if (newValues?._id && newValues?.updatedAt != values?.updatedAt) {
      setValues(newValues)
      if (!id) setId(newValues._id)
      return
    }
  }

  // Update data
  const updateRequest = (
    values: Partial<T>,
    customCb?: UpdateRequestCallback<T>
  ) => {
    if (!socket || !id) return
    logStart(id, `${entity}.update`)
    const request: UpdateRequestProps<T> = {
      values: {
        ...values,
        _id: id,
      },
    }
    socket.emit(
      `${roomId}.update`,
      request,
      (response: EntityResponse<T & _BaseProps>) => {
        customCb?.(response)
        updateCallback(response)
      }
    )
    return
  }

  const updateCallback: UpdateRequestCallback<T> = ({ status }) => {
    setStatus(status)
    logStatus(status, `${entity}.update`)
  }

  // Set Id if search updates to include it
  useMemo(() => {
    if (search?._id && !id) setId(search?._id)
  }, [search])

  // Set Id if _id updates to include it
  useMemo(() => {
    if (_id && !id) setId(_id)
  }, [_id])

  // Search for entity if no _id provided
  useEffect(() => {
    if (!socket || !userId || !search) return
    if (!id) findRequest()
  }, [id, userId])

  // Subscribe to room if id provided
  useEffect(() => {
    if (!socket || !id || !userId) return
    logStart(id, `${entity}.subscribe`)
    // Join room
    socket.emit('sub', roomId, subCallback)
    // Set data on room update
    socket.on(roomId, (newValues: T & _BaseProps) => {
      // Ignore if already updated
      if (newValues && newValues?.updatedAt != values?.updatedAt) {
        setValues(newValues)
        if (logRoom) logSuccess(id, `${entity}.update(Room)`)
        updateIndex?.(newValues)
      }
    })
    return () => {
      logEnd(id, `${entity}.unsubscribe`)
      socket.emit('unsub', roomId, unsubCallback)
      socket.off(roomId)
    }
  }, [socket, id, userId])

  // Subscribe callback
  const subCallback: Callback<{}> = ({ status }) => {
    logStatus(status, `${entity}.subscribe`)
    if (status.code == 200 && !values) readRequest()
  }

  // Unsub callback
  const unsubCallback: Callback<{}> = ({ status }) => {
    logStatus(status, `${entity}.subscribe`)
    if (status.code == 200 && !values) readRequest()
  }

  return {
    createRequest,
    deleteRequest,
    readRequest,
    setId,
    setValues,
    status,
    updateRequest,
    values,
  }
}
