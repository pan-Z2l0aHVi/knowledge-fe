import { Checkbox as _Checkbox } from './Checkbox'
import { CheckboxGroup } from './CheckboxGroup'

export const Checkbox = _Checkbox as typeof _Checkbox & {
  Group: typeof CheckboxGroup
}
Checkbox.Group = CheckboxGroup
