import z from 'zod'

const EGame = z.enum([
    'blazingem',
    'glazed',
    'blaze', 'volt', 'rrss', 'emrunbun', 'unbound',
    'unbound_exp', 'radred_hard', 'emkaizo', 'vi', 'sc', 'sw', 'sh',
    'usun', 'umoon', 'sun', 'moon', 'x', 'y', 'blazevolt2',
    'blazevolt2_c', 'bl2', 'wh2', 'bl2c', 'wh2c', 'bl', 'wh', 'bd',
    'sp', 'radred', 'renplat', 'pt', 'd', 'p', 'or', 'as', 'em',
    'incem', 'ruby', 'saph', 'stormsilv', 'sacredgold', 'hg', 'ss',
    'gold', 'silv', 'crys', 'fr', 'lg', 'yel', 'red', 'blue'
])
const EDeath = z.enum(['boss', 'encounter', 'trainer'])
const ECategory = z.enum(['random', 'mistake', 'sacrifice', 'drama', 'luck'])
const EBossType = z.enum([
  'gym-leader',
  'elite-four',
  'evil-team',
  'rival',
  'mini-boss'
])

const IGame = z.object({
  game: EGame,
  id: z.string().uuid(),
  name: z.string(),
  settings: z.string().regex(/[01]+/),
  attempts: z.optional(z.coerce.number()),
  created_at: z.coerce.number(),
  updated_at: z.optional(z.coerce.number())
})

const ITeamMember = z.object({
  position: z.number().min(1).max(6),
  location: z.string(),
  pokemon: z.string()
})

export const ITeams = z.object({
  game_id: z.string().uuid(),
  user_id: z.string().uuid(),
  data: z.array(ITeamMember)
})

export const IFight = z.object({
  boss_id: z.string(),
  boss_name: z.string(),
  boss_speciality: z.optional(z.string()),
  boss_type: EBossType,
  team: z.array(ITeamMember)
})

export const IFights = z.object({
  game_id: z.string().uuid(),
  user_id: z.string().uuid(),
  data: z.array(IFight)
})

const IDeath = z.object({
  type: z.optional(EDeath),
  category: z.optional(ECategory),
  time: z.optional(z.number()),
  custom: z.optional(z.boolean()),
  epitaph: z.optional(z.string()),
  lvl: z.optional(
    z.object({
      from: z.optional(z.number().min(1).max(100)),
      to: z.optional(z.number().min(1).max(100))
    })
  ),
  location: z.optional(
    z.object({
      name: z.optional(z.string())
    })
  ),
  opponent: z.optional(
    z.object({
      name: z.optional(z.string()),
      id: z.optional(z.string()),
      types: z.optional(z.array(z.string()).min(1).max(2))
    })
  ),
  trainer: z.optional(
    z.object({
      id: z.optional(z.string()),
      name: z.optional(z.string()),
      type: z.optional(z.string()),
      speciality: z.optional(z.string())
    })
  ),
  attack: z.optional(
    z.object({
      name: z.optional(z.string()),
      type: z.string()
    })
  )
})

const ILocation = z.object({
  id: z.coerce.number(),
  location: z.string(),
  pokemon: z.string(),
  nature: z.optional(z.string().nullish()),
  nickname: z.optional(z.string().nullish()),
  status: z.optional(z.number().min(1).max(7)),
  hidden: z.optional(z.boolean()),
  death: z.optional(IDeath)
})

export const IGames = z.object({
  user_id: z.string().uuid(),
  data: z.array(IGame)
})

export const ISaves = z.object({
  game_id: z.string().uuid(),
  user_id: z.string().uuid(),
  data: z.array(ILocation)
})
