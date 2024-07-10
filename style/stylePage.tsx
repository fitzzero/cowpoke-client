'use client'
import { PropsWithChildren } from 'react'
import { ColorLens, FontDownload } from '@mui/icons-material'
import { StandardPage } from '@/app/cowpoke/components/global/standardPage'
import { MenuOption } from '@/app/cowpoke/components/global/sideMenu'

export const StylePage = ({ children }: PropsWithChildren) => {
  const sideMenu: MenuOption[] = [
    { label: 'Palette', path: '/', icon: <ColorLens /> },
    { label: 'Fonts', path: '/fonts', icon: <FontDownload /> },
  ]
  return (
    <StandardPage basePath='/style' sideMenu={sideMenu}>
      {children}
    </StandardPage>
  )
}
