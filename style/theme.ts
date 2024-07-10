'use client'
import { extendTheme } from '@mui/joy/styles'
import Color from 'color'

export const minContentHeight = '75dvh'
const surface = '#16161a'
const primary = '#7f5af0'
const neutral = '#72757e'
const success = '#2cb67d'
const warning = '#FEE75C'
const danger = '#ED4245'
const text = {
  primary: '#fffffe',
  secondary: '#94a1b2',
}

const hexToPalette = (hex: string) => {
  const color = Color(hex)
  return {
    50: color.desaturate(0.9).hex(),
    100: color.desaturate(0.8).hex(),
    200: color.desaturate(0.6).hex(),
    300: color.desaturate(0.4).hex(),
    400: color.desaturate(0.2).hex(),
    500: color.hex(),
    600: color.saturate(0.1).hex(),
    700: color.saturate(0.2).hex(),
    800: color.saturate(0.3).hex(),
    900: color.saturate(0.4).hex(),
    // Active Backgrounds
    outlinedActiveBg: color.fade(0.9).rgb().string(),
    plainActiveBg: color.fade(0.9).rgb().string(),
    softActiveBg: color.fade(0.9).rgb().string(),
    solidActiveBg: color.fade(0.9).rgb().string(),
    // Active Colors
    outlinedActiveColor: text.primary,
    plainHoverColor: text.primary,
    softHoverColor: text.primary,
    solidHoverColor: text.primary,
    // Default Backgrounds
    softBg: color.fade(0.9).rgb().string(),
  }
}

const palette = {
  background: {
    surface,
    level1: Color(surface).lighten(0.2).hex(),
    level2: Color(surface).lighten(0.4).hex(),
    level3: Color(surface).lighten(0.6).hex(),
  },
  text,
  primary: hexToPalette(primary),
  neutral: hexToPalette(neutral),
  success: hexToPalette(success),
  warning: hexToPalette(warning),
  danger: hexToPalette(danger),
}

export const theme = extendTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 700,
      md: 900,
      lg: 1200,
      xl: 1600,
    },
  },
  colorSchemes: {
    dark: {
      palette,
    },
  },
  components: {
    JoyChip: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          '& .MuiChip-action': {
            '&:hover': {
              backgroundColor: palette[ownerState.color!].plainActiveBg,
              color: text.primary,
            },
          },
        }),
      },
    },
    JoyModalDialog: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          padding: 0,
        }),
      },
    },
    JoyDialogContent: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          maxWidth: 600,
        }),
      },
    },
    JoyIconButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.color === 'neutral' && {
            '&:hover': {
              color: text.primary,
            },
          }),
        }),
      },
    },
    JoyTabList: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: 0,
        }),
      },
    },
    JoyTypography: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          // Header Fonts
          ...(['h1', 'h2', 'h3', 'h4'].includes(ownerState.level || '') && {
            fontWeight: 700,
          }),
          // Body Fonts
          ...(['body-lg', 'body-md', 'body-sm'].includes(
            ownerState.level || ''
          ) && {}),
          // Title Fonts
          ...(['title-lg', 'title-md', 'title-sm'].includes(
            ownerState.level || ''
          ) && {
            letterSpacing: '1px',
          }),
        }),
      },
    },
    JoyTab: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          '&:hover .MuiSvgIcon-root,&:hover .MuiTypography-root': {
            color: text.primary,
          },
          ...(ownerState.selected && {
            color: text.primary,
            '&:after': {
              backgroundColor: primary,
            },
          }),
        }),
      },
    },
  },
  fontFamily: {
    body: 'Ubuntu, sans-serif',
  },
  fontSize: {
    xs: '0.85rem',
    sm: '1.0rem',
    md: '1.15rem',
    lg: '1.3rem',
    xl: '1.45rem',
    xl2: '1.6rem',
    xl3: '1.75rem',
    xl4: '1.9rem',
  },
  shadow: {
    xs: 'none',
    sm: 'none',
    md: 'none',
    lg: 'none',
    xl: 'none',
  },
})
