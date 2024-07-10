import {
  IndexCollection,
  Nullish,
  Status,
  _BaseProps,
} from 'cowpoke-types/_base'
import {
  DeleteRequestClient,
  IndexRequestClient,
  ReadRequestClient,
  UpdateRequestClient,
} from 'cowpoke-types/entity'
import { PropsWithChildren } from 'react'

export interface collectionState<T> {
  index?: IndexCollection<T>
  indexRequest?: IndexRequestClient<T>
  page?: number
  setPage?: (page: number) => void
  total?: number
  updateIndex?: UpdateRequestClient<T>
}

export interface entityState<T> {
  c?: UpdateRequestClient<T>
  d?: DeleteRequestClient
  r?: ReadRequestClient<T>
  s?: Status
  setId?: (id: string) => void
  setValues?: (v: T) => void
  u?: (v: Partial<T>) => void
  v?: T | Nullish
}

export interface EntityProviderProps<T> extends PropsWithChildren {
  _id?: string
  search?: Partial<T & _BaseProps>
  initialValues?: T | Nullish
  key?: string | number
  updateIndex?: UpdateRequestClient<any>
}

export type EntityProvider<T> = (props: EntityProviderProps<T>) => JSX.Element

export interface EntityComposeProps extends EntityProviderProps<any> {
  provider?: EntityProvider<any>
}

export const EntityCompose = ({ provider, ...props }: EntityComposeProps) => {
  if (!provider) return <>{props.children}</>
  return provider(props)
}
