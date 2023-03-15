import z from "zod"

const EGame = z.enum(['vi', 'sc', 'sw', 'sh', 'usun', 'umoon', 'sun', 'moon', 'x', 'y', 'blazevolt2', 'blazevolt2_c', 'bl2', 'wh2', 'bl2c', 'wh2c', 'bl', 'wh', 'bd', 'sp', 'radred', 'renplat', 'pt', 'd', 'p', 'or', 'as', 'em', 'incem', 'ruby', 'saph', 'stormsilv', 'sacredgold', 'hg', 'ss', 'gold', 'silv', 'crys', 'fr', 'lg', 'yel', 'red', 'blue'])

const IGame = z.object({
  game: EGame,
  id: z.string().uuid(),
  name: z.string(),
  settings: z.string().regex(/[01]{6}/),
  created_at: z.coerce.number(),
  updated_at: z.optional(z.coerce.number()),

})

const ILocation = z.object({
  id: z.coerce.number(),
  location: z.string(),
  pokemon: z.string(),
  nature: z.optional(z.string().nullish()),
  nickname: z.optional(z.string().nullish()),
  status: z.optional(z.number().min(1).max(7)),
  hidden: z.optional(z.boolean())
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
