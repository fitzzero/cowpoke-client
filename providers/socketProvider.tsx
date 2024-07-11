'use client'
import { useSession } from 'next-auth/react'
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Socket, io } from 'socket.io-client'
import { EntityResponse } from '@/app/types/cowpoke/entity'
import { AccessProps, Scopes } from '@/app/types/cowpoke/access'
import { Status } from '@/app/types/cowpoke/_base'
import { logAlert, logSuccess, logStart } from '../lib/logger'

interface state {
  connected?: boolean
  isDiscordActivity?: boolean
  scopes?: Scopes
  sessionStatus?: Status
  setIsDiscordActivity?: (value: boolean) => void
  setToken?: (value: string) => void
  setUri?: (value: string) => void
  socket?: Socket
  userId?: string
}

export const SocketContext = createContext<state>({})
export const useSocket = () => useContext(SocketContext)

export const SocketProvider = (props: PropsWithChildren) => {
  const [isDiscordActivity, setIsDiscordActivity] = useState(false)
  const [token, setToken] = useState<string | undefined>(undefined)
  const [uri, setUri] = useState<string | undefined>(undefined)
  const [socket, setSocket] = useState<Socket | undefined>(undefined)
  const [connected, setConnected] = useState(false)
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [scopes, setScopes] = useState<Scopes | undefined>(undefined)
  const [sessionStatus, setSessionStatus] = useState<Status | undefined>(
    undefined
  )
  const { status } = useSession()
  const [prevStatus, setPrevStatus] = useState(status)

  // Session Response
  const sessionResponse = (response: EntityResponse<AccessProps>) => {
    setSessionStatus(response.status)
    if (response.status.code !== 200) {
      logAlert('session', 'socket')
      return
    }
    if (response?.values) {
      logSuccess(`user: ${response.values?.userId} validated session`, 'socket')
      setUserId(response.values.userId)
      setScopes(response.values.scopes)
    }
  }

  // Log status changes
  useEffect(() => {
    if (status !== prevStatus) {
      setPrevStatus(status)
    }
  }, [status])

  // Get server connect info
  useMemo(async () => {
    if (status === 'authenticated' && prevStatus !== 'unauthenticated') {
      logStart('SocketProvider', 'Loading server data')
      const res = await fetch(`/api/io`).then(res => res.json())
      if (res?.sessionToken) setToken(res.sessionToken)
      if (res?.ioUri) setUri(res.ioUri)
    }
  }, [status])

  // Socket Events
  useMemo(async () => {
    if (!token || !uri || connected) return

    const sessionHandshake = isDiscordActivity ? 'discord' : 'session'

    // Disconnect from any old sockets
    socket?.disconnect()

    // Setup new socket
    logStart(`connecting to ${uri}...`, 'socket')

    const newSocket = io(uri, {
      transports: ['websocket'],
      autoConnect: false,
      withCredentials: false,
      path: isDiscordActivity ? '/server/socket.io' : undefined,
    })

    // Socket connects
    newSocket.on('connect', () => {
      // Initiate authenticated session
      newSocket.emit(sessionHandshake, { token }, sessionResponse)
      logSuccess('connected', 'socket')
      setConnected(true)
    })

    // Reconnect
    newSocket.on('reconnect', () => {
      console.log('RECONNECT')
    })

    // Socket Disconnects
    newSocket.on('disconnect', () => {
      logAlert('disconnected', 'socket')
      setConnected(false)
      setUserId(undefined)
    })

    // Connect
    newSocket.connect()

    setSocket(newSocket)
  }, [token, uri])

  // Close socket on sign out
  useMemo(() => {
    if (status === 'unauthenticated' && connected) {
      socket?.disconnect()
      setConnected(false)
    }
  }, [status])

  return (
    <SocketContext.Provider
      value={{
        connected,
        isDiscordActivity,
        scopes,
        sessionStatus,
        setIsDiscordActivity,
        setToken,
        setUri,
        socket,
        userId,
      }}
      {...props}
    />
  )
}
