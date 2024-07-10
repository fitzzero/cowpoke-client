import { AccessLevels, Scopes } from 'cowpoke-types/access'
import { EntityKinds } from 'cowpoke-types/entity'

export const hasAccess = (
  entityKind: EntityKinds,
  reqLevel: AccessLevels,
  scopes?: Scopes
) => {
  if (!scopes) return false
  return scopes[entityKind] >= reqLevel
}
