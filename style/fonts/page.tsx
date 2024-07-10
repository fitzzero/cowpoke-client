'use client'
import { Typography, TypographySystem } from '@mui/joy'
import { StylePage } from '../stylePage'

const StyleFonts = () => {
  const fonts: (keyof TypographySystem)[] = [
    'h1',
    'h2',
    'h3',
    'h4',
    'title-lg',
    'body-lg',
    'title-md',
    'body-md',
    'title-sm',
    'body-sm',
  ]
  return (
    <StylePage>
      <Typography level='h3'>Fonts</Typography>
      {fonts.map(font => (
        <Typography key={font} level={font}>
          {font} - The quick brown fox jumps over the lazy dog
        </Typography>
      ))}
    </StylePage>
  )
}

export default StyleFonts
