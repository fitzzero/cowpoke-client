import { getEnumKeys } from '@/app/cowpoke/lib/enum'
import { Chip, Typography } from '@mui/joy'
import { Stack } from '@mui/material'
import { Status } from 'cowpoke-types/_base'
import { PropsWithChildren } from 'react'

export interface ChipEnumProps extends PropsWithChildren {
  en: Record<string, string | number>
  label?: string
  state?: string | number
  setState?: (state: string | number) => void
  status?: Status
}

export const ChipEnum = ({
  en,
  label,
  state,
  setState,
  status,
}: ChipEnumProps) => {
  const options = getEnumKeys(en)

  return (
    <>
      {label && <Typography level='title-sm'>{label}</Typography>}
      <Stack direction='row' spacing={2} alignItems='center'>
        {options.map(option => {
          const active = state === en[option]
          return (
            <Chip
              color={active ? 'primary' : 'neutral'}
              key={option}
              onClick={active ? undefined : () => setState?.(en[option])}
              size='sm'
              variant={active ? 'solid' : 'outlined'}>
              {option}
            </Chip>
          )
        })}
      </Stack>
    </>
  )
}
