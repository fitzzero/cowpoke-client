'use client'
import {
  Box,
  IconButton,
  Stack,
  Tab,
  TabList,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/joy'
import { useRouter, usePathname } from 'next/navigation'
import { findIndex } from 'lodash'
import { minContentHeight } from '@/app/cowpoke/style/theme'
import { useIsMobile } from '@/app/cowpoke/hooks/useBreakpoints'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { Menu } from '@material-ui/icons'
import { ClickAwayListener } from '@mui/material'
import { useLocalStorage } from '../../hooks/useLocal'

export interface MenuOption {
  action?: () => void
  icon?: React.ReactNode
  label: string
  path?: string
}

interface SideMenuProps {
  basePath?: string
  children?: React.ReactNode
  options?: MenuOption[]
}

export const SideMenu = ({ basePath, children, options }: SideMenuProps) => {
  const router = useRouter()
  const route = usePathname()
    ?.replace(basePath || '', '')
    .split('/')[1]
  const isMobile = useIsMobile()
  const path = `/${route || ''}`

  const [locked, setLocked] = useLocalStorage('sideMenu-locked', false)

  const mobileOpen = isMobile && locked
  const desktopOpen = !isMobile && locked

  const idx = findIndex(options, option => option.path?.toLowerCase() === path)
  const value = idx > -1 ? idx : 0

  // On <Tabs> Change
  const handleChange = (idx: number) => {
    // Get the menu option changed to
    const option = options?.[idx]
    if (!option) return
    // If the option has an action, call it
    const { path, action } = option
    if (action) {
      action()
    } else if (path) {
      router.push(`${basePath}/${path}`)
    }
    handleClickAway()
  }

  // On <TabsList> Clickaway
  const handleClickAway = () => {
    if (mobileOpen) setLocked(false)
  }

  return (
    <Tabs
      aria-label='Vertical tabs'
      orientation='vertical'
      onChange={(e, value) => handleChange(value as number)}
      value={value}
      sx={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        minHeight: minContentHeight,
        height: '100%',
        width: '100%',
        borderRadius: 'lg',
      }}>
      <Stack
        alignItems='stretch'
        direction='row'
        sx={{
          minHeight: minContentHeight,
          width: '100%',
        }}>
        <Box
          sx={{
            backgroundColor: 'background.level1',
            width: locked ? 200 : 60,
            position: mobileOpen ? 'absolute' : 'relative',
            transition: locked ? 'width .2s ease-out' : undefined,
            zIndex: 2,
            height: mobileOpen ? '100%' : 'auto',
          }}>
          <ClickAwayListener onClickAway={handleClickAway}>
            <TabList
              sx={{
                width: '100%',
                height: '100%',
                maxWidth: '100%',
              }}>
              <Stack
                direction='row'
                justifyContent={desktopOpen ? 'flex-end' : 'space-between'}
                m={1}
                ml={1.6}>
                <IconButton
                  variant='plain'
                  size='sm'
                  onClick={() => setLocked(!locked)}>
                  {mobileOpen ? (
                    <Menu />
                  ) : desktopOpen ? (
                    locked ? (
                      <ArrowBack />
                    ) : (
                      <ArrowForward />
                    )
                  ) : (
                    <Menu />
                  )}
                </IconButton>
                {mobileOpen ? (
                  <IconButton
                    variant='plain'
                    size='sm'
                    onClick={() => setLocked(!locked)}>
                    <ArrowBack />
                  </IconButton>
                ) : null}
              </Stack>
              {options?.map((option, index) => (
                <Tab key={index} sx={{ width: locked ? '100%' : 'inherit' }}>
                  <Stack
                    direction='row'
                    flexWrap='nowrap'
                    alignItems='center'
                    spacing={2}
                    height='100%'>
                    <Tooltip
                      arrow
                      color='primary'
                      disableFocusListener={locked}
                      disableHoverListener={locked}
                      placement='left'
                      variant='solid'
                      title={option.label}
                      modifiers={[
                        {
                          name: 'offset',
                          options: {
                            offset: [0, 25],
                          },
                        },
                      ]}>
                      <Box display='flex' justifyContent='center'>
                        {option.icon}
                      </Box>
                    </Tooltip>
                    {locked ? (
                      <Typography sx={{ color: 'inherit', lineHeight: 0 }}>
                        {option.label}
                      </Typography>
                    ) : null}
                  </Stack>
                </Tab>
              ))}
            </TabList>
          </ClickAwayListener>
        </Box>
        <Box
          sx={{
            p: 2,
            flexGrow: 1,
            position: 'relative',
            zIndex: 1,
            ml: mobileOpen ? '60px' : undefined,
            overflowX: 'hidden',
          }}>
          {children}
        </Box>
      </Stack>
    </Tabs>
  )
}
