'use client'
import { PropsWithChildren, createContext, useContext } from 'react'
import { Nullish, Status } from 'cowpoke-types/_base'
import { UserProps } from 'cowpoke-types/user'
import { useEntity } from '../hooks/useEntity'
import { EntityKinds, ReadRequestClient } from 'cowpoke-types/entity'
import { useSocket } from './socketProvider'

interface state<T = UserProps> {
  user?: T | Nullish
  userRead?: ReadRequestClient<T>
  userStatus?: Status
  userUpdate?: (values: Partial<T>) => void
}

export const SocketContext = createContext<state>({})
export const usePrimaryUser = () => useContext(SocketContext)

export const UserPrimaryProvider = (props: PropsWithChildren) => {
  const { userId } = useSocket()
  const {
    readRequest: userRead,
    status: userStatus,
    updateRequest: userUpdate,
    values: user,
  } = useEntity<UserProps>({
    entity: 'user',
    _id: userId,
  })

  return (
    <SocketContext.Provider
      value={{
        user,
        userRead,
        userStatus,
        userUpdate,
      }}
      {...props}
    />
  )
}
