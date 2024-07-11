import { PropsWithChildren, createContext, useContext } from 'react'
import { EntityProvider, collectionState, entityState } from './entityProvider'
import { useEntity } from '@/app/cowpoke/hooks/useEntity'
import { useCollection } from '@/app/cowpoke/hooks/useCollection'
import { UserProps } from '@/app/types/cowpoke/user'
import { EntityKinds } from '@/app/types/cowpoke/common'

export const CollectionContext = createContext<collectionState<UserProps>>({})
export const useUserCollection = () => useContext(CollectionContext)
export const UserCollectionProvider = (props: PropsWithChildren) => {
  const { index, indexRequest, total, updateIndex } = useCollection<UserProps>({
    entity: EntityKinds.User,
  })
  return (
    <CollectionContext.Provider
      value={{ index, indexRequest, total, updateIndex }}
      {...props}
    />
  )
}

export const EntityContext = createContext<entityState<UserProps>>({})
export const useUser = () => useContext(EntityContext)
export const UserProvider: EntityProvider<UserProps> = ({
  children,
  ...props
}) => {
  const {
    createRequest: c,
    deleteRequest: d,
    readRequest: r,
    status: s,
    updateRequest: u,
    values: v,
  } = useEntity<UserProps>({
    entity: EntityKinds.User,
    ...props,
  })
  return (
    <EntityContext.Provider value={{ c, d, r, s, u, v }}>
      {children}
    </EntityContext.Provider>
  )
}
