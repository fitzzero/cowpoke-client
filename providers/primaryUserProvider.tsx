'use client'
import { PropsWithChildren, createContext, useContext } from 'react'
import { Nullish, Status } from '@/app/types/cowpoke/_base'
import { UserProps } from '@/app/types/cowpoke/user'
import { useEntity } from '../hooks/useEntity'
import { ReadRequestClient } from '@/app/types/cowpoke/entity'
import { useSocket } from './socketProvider'
import { EntityKinds } from '@/app/types/cowpoke/common'

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
    entity: EntityKinds.User,
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
