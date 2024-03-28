import { Radio as _Radio } from './Radio'
import { RadioGroup } from './RadioGroup'

export const Radio = _Radio as typeof _Radio & {
  Group: typeof RadioGroup
}
Radio.Group = RadioGroup
