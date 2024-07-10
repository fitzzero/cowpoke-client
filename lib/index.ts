import { Id, Nullish } from 'cowpoke-types/_base'
import { findIndex } from 'lodash'

export const updateOne = <T>(
  value: (T & Id) | null,
  valueArray: (T & Id)[] | Nullish
) => {
  if (!valueArray && value) return [value]
  if (!valueArray) return undefined
  if (!value) return valueArray
  //@ts-ignore
  const idx = findIndex(valueArray, { _id: value._id })
  if (idx == -1) {
    valueArray.push(value)
    return valueArray.slice()
  }
  const newValue = { ...valueArray[idx], ...value }
  valueArray.splice(idx, 1, newValue)
  return valueArray.slice()
}

export const removeOne = <T>({ _id }: Id, valueArray: (T & Id)[] | Nullish) => {
  if (!valueArray) return valueArray
  //@ts-ignore
  const idx = findIndex(valueArray, { _id })
  if (idx == -1) return valueArray
  valueArray.splice(idx, 1)
  return valueArray.slice()
}

export const updateIdx = (idx: number, value: any, valueArray?: any[]) => {
  if (!valueArray) return
  valueArray.splice(idx, 1, value)
  return valueArray.slice()
}

export const removeIdx = (idx: number, valueArray?: any) => {
  if (!valueArray) return
  valueArray.splice(idx, 1)
  return valueArray.slice()
}
