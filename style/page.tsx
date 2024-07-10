'use client'
import { Sheet, Stack, Typography } from '@mui/joy'
import { StylePage } from './stylePage'

const StylePalette = () => {
  const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

  return (
    <StylePage>
      <Typography level='h3'>Primary Palette</Typography>
      <Stack direction='row' spacing={2}>
        {weights.map(weight => (
          <Sheet
            key={weight}
            sx={{
              backgroundColor: `primary.${weight}`,
              color: 'text.primary',
              width: 50,
              height: 50,
            }}>
            {weight}
          </Sheet>
        ))}
      </Stack>
    </StylePage>
  )
}

export default StylePalette
