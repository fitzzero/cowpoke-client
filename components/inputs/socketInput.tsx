import { Check, ErrorOutline, InfoOutlined } from '@mui/icons-material'
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputProps,
  Typography,
} from '@mui/joy'
import { ChangeEvent, useEffect, useState } from 'react'

export interface SocketInputProps extends InputProps {
  name?: string
  labelTop?: boolean
  labelDecorator?: boolean
  state?: string
  setState?: (state: string) => void
  issue?: string
}

export const SocketInput = ({
  name,
  labelTop,
  labelDecorator,
  state,
  setState,
  issue,
  color,
  ...props
}: SocketInputProps) => {
  const [inputValue, setInputValue] = useState<string>(state || '')
  const [loading, setLoading] = useState<boolean>(false)
  const [sync, setSync] = useState<'loading' | 'error' | 'check'>('loading')
  const isError = sync === 'error'

  // State change
  useEffect(() => {
    setInputValue(state || '')
    setLoading(false)
  }, [state])

  // Check sync state
  useEffect(() => {
    if (issue) {
      setSync('error')
    } else {
      if (loading && inputValue != state) {
        setSync('loading')
      }
      if (!loading && inputValue === state) {
        setSync('check')
      }
    }
  }, [inputValue, state, issue, loading])

  const onChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const onBlur = () => {
    if (!setState) return
    if (inputValue === state) return
    setState(inputValue)
    setLoading(true)
  }

  return (
    <FormControl error={isError}>
      {labelTop ? <FormLabel>{name}</FormLabel> : null}
      <Input
        color={isError ? 'danger' : color}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={name}
        value={inputValue}
        variant='soft'
        startDecorator={
          labelDecorator ? (
            <Typography
              level='body-xs'
              variant='solid'
              color={isError ? 'danger' : color}>
              {name}
            </Typography>
          ) : undefined
        }
        endDecorator={
          sync === 'loading' ? (
            <CircularProgress size='sm' variant='plain' color={color} />
          ) : sync === 'error' ? (
            <ErrorOutline color='error' fontSize='small' />
          ) : (
            <Check color='success' fontSize='small' />
          )
        }
        {...props}
      />
      {issue ? (
        <FormHelperText>
          <InfoOutlined fontSize='small' />
          <Typography
            level='body-xs'
            sx={{
              color: 'inherit',
            }}>
            issue
          </Typography>
        </FormHelperText>
      ) : null}
    </FormControl>
  )
}
