'use client'
import { Box, Sheet, Stack, Typography } from '@mui/joy'
import { AppName, LogoSmall } from './branding'
import { SignInButton } from './signInButton'
import { DisplayTime } from './display/displayTime'
import { CurrentTime } from './display/currenttime'

export const TopMenu = () => {
  const height = 48
  return (
    <Box height={height}>
      {/* Menu Content */}
      <Stack
        direction='row'
        flexWrap='nowrap'
        justifyContent='space-between'
        alignItems='stretch'
        position='relative'
        height='100%'
        zIndex={2}>
        {/* Left */}
        <Stack direction='row' spacing={2} alignItems='center'>
          {/* Logo */}
          <LogoSmall />
          <Typography level='title-lg'>
            <AppName />
          </Typography>
          <CurrentTime />
        </Stack>
        {/* Right */}
        <Stack direction='row' spacing={2} alignItems='center'>
          <SignInButton />
        </Stack>
      </Stack>
      {/* Menu Background */}
      <Sheet
        color='primary'
        variant='solid'
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: height,
          zIndex: 1,
        }}
      />
    </Box>
  )
}
