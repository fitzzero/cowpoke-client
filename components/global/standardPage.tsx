'use client'
import { TopMenu } from './topMenu'
import { MenuOption, SideMenu } from './sideMenu'
import { Box, Container, LinearProgress, Sheet, Stack } from '@mui/joy'
import { minContentHeight } from '@/app/cowpoke/style/theme'
import { useIsMobile } from '@/app/cowpoke/hooks/useBreakpoints'
import { useSession } from 'next-auth/react'
import { useSocket } from '@/app/cowpoke/providers/socketProvider'

interface PageProps {
  basePath?: string
  children?: React.ReactNode
  globalMenu?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  sideMenu?: MenuOption[]
}

export const StandardPage = ({
  basePath,
  children,
  globalMenu = true,
  maxWidth = 'md',
  sideMenu,
}: PageProps) => {
  const { status } = useSession()
  const { sessionStatus } = useSocket()
  const isMobile = useIsMobile()

  const pageLoading =
    status === 'loading' || (!sessionStatus && status === 'authenticated')

  return (
    <Container maxWidth={maxWidth} disableGutters={!isMobile}>
      <Stack direction='column' spacing={4}>
        {/* Menu */}
        {globalMenu ? <TopMenu /> : null}
        {/* Content */}
        <Sheet
          color='primary'
          variant='outlined'
          sx={{
            minHeight: minContentHeight,
            borderRadius: 'lg',
          }}>
          {sideMenu ? (
            <SideMenu basePath={basePath} options={sideMenu}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  opacity: pageLoading ? 1 : 0,
                  transition: 'opacity 1s ease',
                }}>
                <LinearProgress />
              </Box>
              <Box
                sx={{
                  opacity: pageLoading ? 0 : 1,
                  transition: 'opacity 1s ease',
                }}>
                {children}
              </Box>
            </SideMenu>
          ) : (
            <Box p={2}>{children}</Box>
          )}
        </Sheet>
        {/* Footer */}
      </Stack>
    </Container>
  )
}
