import { Scopes } from '@/app/types/cowpoke/access'
import { EntityKinds, AccessLevels } from '@/app/types/cowpoke/common'

export const hasAccess = (
  entityKind: EntityKinds,
  reqLevel: AccessLevels,
  scopes?: Scopes
) => {
  if (!scopes) return false
  return scopes[entityKind] >= reqLevel
}
