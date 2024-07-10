import { Modal, ModalDialog } from '@mui/joy'
import { PropsWithChildren } from 'react'

export interface StandardModalProps extends PropsWithChildren {
  open: boolean
  onClose: () => void
}

export const StandardModal = ({
  children,
  open,
  onClose,
}: StandardModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        padding: 0,
      }}>
      <ModalDialog
        sx={{
          width: 'min(100%, 600px)',
        }}>
        {children}
      </ModalDialog>
    </Modal>
  )
}
