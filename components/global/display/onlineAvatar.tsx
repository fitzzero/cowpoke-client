import { Avatar, AvatarProps, Badge, badgeClasses } from '@mui/joy'
import { UserBasic } from 'cowpoke-types/user'

interface OnlineAvatarProps extends AvatarProps {
  user?: UserBasic
  error?: boolean
}

export const OnlineAvatar = ({ error, user, ...props }: OnlineAvatarProps) => {
  const now = new Date().getTime()
  const onlineRecently = now - user?.updatedAt! < 900000 && !error
  let color: 'neutral' | 'success' | 'danger' = 'neutral'
  if (onlineRecently) color = 'success'
  else if (error) color = 'danger'

  return (
    <Badge
      size='sm'
      color={color}
      variant='solid'
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      sx={{
        [`& .${badgeClasses.badge}`]: {
          right: 3,
          bottom: 3,
          '&::after': onlineRecently
            ? {
                position: 'absolute',
                top: -1,
                left: -1,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'ripple 1.2s infinite ease-in-out',
                border: '1px solid',
                borderColor: 'success.500',
                content: '""',
              }
            : undefined,
        },
        '@keyframes ripple': {
          '0%': {
            transform: 'scale(1)',
            opacity: 1,
          },
          '100%': {
            transform: 'scale(2)',
            opacity: 0,
          },
        },
      }}>
      <Avatar
        color='neutral'
        variant='solid'
        size='sm'
        src={user?.image}
        {...props}
        sx={theme => ({
          border: `1px solid ${theme.palette.background.level1}`,
        })}
      />
    </Badge>
  )
}
