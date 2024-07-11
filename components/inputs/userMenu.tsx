import { Box, Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy'
import { signOut } from 'next-auth/react'
import { OnlineAvatar } from '../global/display/onlineAvatar'
import { usePrimaryUser } from '@/app/cowpoke/providers/primaryUserProvider'
import { useSocket } from '@/app/cowpoke/providers/socketProvider'
import { useRouter } from 'next/navigation'
import { AdminPaths } from '@/app/admin/adminPage'
import { UserPaths } from '@/app/user/userPage'
import { hasAccess } from '../../lib/access'
import { AccessLevels, EntityKinds } from '@/app/types/cowpoke/common'

export const UserAvatarMenu = () => {
  const { connected, scopes } = useSocket()
  const { user } = usePrimaryUser()
  const router = useRouter()
  return user ? (
    <Dropdown>
      <MenuButton
        component={Box}
        sx={{
          p: 0,
          border: 'none',
          '&:hover': {
            background: 'none',
          },
        }}>
        <OnlineAvatar user={user} error={!connected} />
      </MenuButton>
      <Menu>
        <MenuItem onClick={() => router.push(UserPaths.Base)}>Profile</MenuItem>
        {hasAccess(EntityKinds.User, AccessLevels.ModerateEntity, scopes) ? (
          <MenuItem onClick={() => router.push(AdminPaths.Base)}>
            Admin
          </MenuItem>
        ) : null}
        <MenuItem onClick={() => signOut()}>Logout</MenuItem>
      </Menu>
    </Dropdown>
  ) : null
}
