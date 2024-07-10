import { Avatar, Stack, Typography } from '@mui/joy'

export interface EntityAvatarProps {
  image?: string
  line1: string
  line2?: string
}

export const EntityAvatar = ({ image, line1, line2 }: EntityAvatarProps) => {
  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      <Avatar src={image}>{line1}</Avatar>
      <Stack direction='column'>
        <Typography level='title-md' lineHeight='1.3rem'>
          {line1}
        </Typography>
        <Typography level='body-md' lineHeight='1.3rem'>
          {line2}
        </Typography>
      </Stack>
    </Stack>
  )
}
