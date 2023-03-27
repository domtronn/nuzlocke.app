import z from "zod"

const EGame = z.enum(['vi', 'sc', 'sw', 'sh', 'usun', 'umoon', 'sun', 'moon', 'x', 'y', 'blazevolt2', 'blazevolt2_c', 'bl2', 'wh2', 'bl2c', 'wh2c', 'bl', 'wh', 'bd', 'sp', 'radred', 'renplat', 'pt', 'd', 'p', 'or', 'as', 'em', 'incem', 'ruby', 'saph', 'stormsilv', 'sacredgold', 'hg', 'ss', 'gold', 'silv', 'crys', 'fr', 'lg', 'yel', 'red', 'blue'])
const EDeath = z.enum(['boss', 'encounter', 'trainer'])

const IGame = z.object({
  game: EGame,
  id: z.string().uuid(),
  name: z.string(),
  settings: z.string().regex(/[01]{6}/),
  created_at: z.coerce.number(),
  updated_at: z.optional(z.coerce.number()),

})

const IDeath = z.object({
    type: EDeath,
    time: z.optional(z.number()),
    custom: z.optional(z.boolean()),
    epitaph: z.string(),
    lvl: z.optional(z.object({
        from: z.optional(z.number().min(1).max(100)),
        to: z.optional(z.number().min(1).max(100))
    })),
    location: z.optional(z.object({
        name: z.optional(z.string())
    })),
    opponent: z.optional(z.object({
        name: z.optional(z.string()),
        id: z.optional(z.string()),
        types: z.optional(z.array(z.string()).min(1).max(2)),
    })),
    trainer: z.optional(z.object({
        id: z.optional(z.string()),
        name: z.optional(z.string()),
        type: z.optional(z.string()),
        speciality: z.optional(z.string()),
    })),
    attack: z.optional(z.object({
        name: z.optional(z.string()),
        type: z.string()
    }))
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
