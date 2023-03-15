import z from "zod"

const EGame = z.enum(['vi', 'sc', 'sw', 'sh', 'usun', 'umoon', 'sun', 'moon', 'x', 'y', 'blazevolt2', 'blazevolt2_c', 'bl2', 'wh2', 'bl2c', 'wh2c', 'bl', 'wh', 'bd', 'sp', 'radred', 'renplat', 'pt', 'd', 'p', 'or', 'as', 'em', 'incem', 'ruby', 'saph', 'stormsilv', 'sacredgold', 'hg', 'ss', 'gold', 'silv', 'crys', 'fr', 'lg', 'yel', 'red', 'blue'])

const IGame = z.object({
  game: EGame,
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string(),
  settings: z.string().regex(/[01]{6}/),
  created_at: z.coerce.number(),
  updated_at: z.optional(z.coerce.number()),

})

const ILocation = z.object({
    id: z.coerce.number(),
    pokemon: z.string(),
    nickname: z.optional(z.string()),
    status: z.enum(['1', '2', '3', '4', '5', '6', '7'])
})

export const IGames = z.array(IGame)
export const ISave = z.object({
  id: z.string().uuid(),
  data: z.record(z.string(), ILocation)
})
