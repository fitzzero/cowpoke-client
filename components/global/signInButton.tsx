'use client'

import { Button, CircularProgress } from '@mui/joy'
import { signIn, useSession } from 'next-auth/react'
import { UserAvatarMenu } from '../inputs/userMenu'
import { usePrimaryUser } from '@/app/cowpoke/providers/primaryUserProvider'

export const SignInButton = () => {
  const { status } = useSession()
  const { user } = usePrimaryUser()

  if (status === 'unauthenticated')
    return (
      <Button color='primary' onClick={() => signIn('discord')}>
        Sign in
      </Button>
    )

  if (status === 'authenticated' || user) return <UserAvatarMenu />

  return <CircularProgress size='sm' variant='solid' />
}
