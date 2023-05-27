// deno run --allow-read validate.ts

import { bgYellow, black } from 'https://deno.land/std@0.151.0/fmt/colors.ts'
import { z } from 'https://deno.land/x/zod/mod.ts'

const __dirname = new URL('.', import.meta.url).pathname.replace('%20', ' ')
const types = [
  'normal',
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'fairy',
  'steel',
  'dragon',
  'dark',
  'ghost',
  'rock',
  'psychic',
  'bug',
  '???'
]

const Type = z.enum(types)
const NumString = z.number().or(z.string().regex(/[0-9]+/))

const Move = z.object({
  name: z.string(),
  type: Type,
  damage_class: z.enum(['status', 'physical', 'special']),
  power: z.optional(NumString),
  effect: z.optional(z.string()),
  priority: z.optional(z.number())
})

const Ability = z.object({
  name: z.string(),
  effect: z.optional(z.string())
})

const Stats = z.object({
  hp: z.number(),
  atk: z.number(),
  def: z.number(),
  spa: z.number(),
  spd: z.number(),
  spe: z.number()
})

const Held = z.object({
  sprite: z.string(),
  name: z.string(),
  effect: z.string()
})

const BasePokemon = z.object({
  name: z.string(),
  level: z.string(),
  types: z.array(Type).min(1).max(2),
  starter: z.optional(z.enum(['fire', 'water', 'grass'])),
  moves: z.array(Move).min(1).max(4),
  held: z.optional(Held),
  ability: z.optional(Ability),
  abilities: z.optional(z.array(Ability)),
  stats: Stats
})

const CustomPokemon = BasePokemon.extend({
  imgUrl: z.optional(z.string())
})

const CorePokemon = BasePokemon.extend({
  sprite: z.string()
})

const Pokemon = z.union([CustomPokemon, CorePokemon])

const Image = z.object({
  src: z.string(),
  author: z.string(),
  link: z.string()
})

const Leader = z.object({
  name: z.string(),
  speciality: z.optional(z.enum(types.concat(''))),
  img: z.optional(z.string().or(Image)),
  pokemon: z.array(Pokemon).min(1)
})

const League = z.record(z.string(), Leader)

for await (const f of Deno.readDir(__dirname)) {
  if (!f.name.endsWith('json')) continue
  const data = await Deno.readTextFile(__dirname + f.name)

  const { success, error } = League.safeParse(JSON.parse(data))
  if (!success) {
    console.log(bgYellow(`  ${black(f.name)}  `))
    console.log(JSON.stringify(error.format(), null, 2))
  }
}
