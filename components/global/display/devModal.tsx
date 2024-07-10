'use client'

import { Box, IconButton } from '@mui/joy'
import { StandardModal } from './standardModal'
import { Construction } from '@mui/icons-material'
import { lazy, useState } from 'react'

export const DevModal = ({ dataDisplay }: { dataDisplay: any }) => {
  const [open, setOpen] = useState(false)
  const LazyReactJson = lazy(() => import('react-json-view'))
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 8,
        right: 8,
      }}>
      <IconButton onClick={() => setOpen(true)} variant='soft' color='warning'>
        <Construction />
      </IconButton>
      <StandardModal open={open} onClose={() => setOpen(false)}>
        {dataDisplay ? (
          <LazyReactJson collapsed src={dataDisplay} theme='harmonic' />
        ) : null}
      </StandardModal>
    </Box>
  )
}
