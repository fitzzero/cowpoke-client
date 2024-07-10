import { TimeFormats } from '@/app/cowpoke/enums'
import { Tooltip, Typography, TypographyProps } from '@mui/joy'
import moment from 'moment'

export interface DisplayTimeProps extends TypographyProps {
  dateMs?: number
  prefix?: string
  relative?: boolean
}

export const DisplayTime = ({
  dateMs,
  prefix,
  relative,
  ...rest
}: DisplayTimeProps) => {
  if (!dateMs) return null
  const display = moment(dateMs)
  const fromNow = `${prefix ? prefix + ' ' : ''}${display.fromNow()}`
  const formatted = display.format(TimeFormats.HumanFull)
  return (
    <Tooltip title={relative ? formatted : fromNow} placement='top-start'>
      <Typography {...rest} sx={{ cursor: 'pointer' }}>
        {relative ? fromNow : formatted}
      </Typography>
    </Tooltip>
  )
}
