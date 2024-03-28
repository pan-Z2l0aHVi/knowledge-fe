import { confirm } from './confirm'
import { Dialog as _Dialog } from './Dialog'
export type { DialogProps } from './Dialog'

interface DialogCommand {
  confirm: typeof confirm
}
export const Dialog = _Dialog as typeof _Dialog & DialogCommand
Dialog.confirm = confirm
