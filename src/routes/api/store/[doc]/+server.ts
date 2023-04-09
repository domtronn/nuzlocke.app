import { z } from 'zod'
import { ISaves, IGames, ITeams } from './types'

import { processSave, processGame, processTeam } from './bigquery'

// @ts-ignore
type IGames = z.infer<typeof IGames>
// @ts-ignore
type ISaves = z.infer<typeof ISaves>
// @ts-ignore
type ITeams = z.infer<typeof ITeams>

enum EDocType {
  game = 'game',
  save = 'save', 
  team = 'team', 
}

enum EMimeType {
  JSON = 'application/json'
}

enum EHeaders {
  ContentType = 'Content-Type'
}

const verify = async (
  req: Request,
  T: IGames | ISaves | ITeams
): Promise<[boolean, any]> => {
  
  const contentType = req.headers.get(EHeaders.ContentType)
  if (contentType !== EMimeType.JSON) return [false, 'Not JSON']
  
  const body = await req.json()
  const { success, error } = T.safeParse(body)

    if (!success) return [false, {error, body}]

  return [true, body]
}

const process = async (
  data: IGames | ISaves | ITeams,
  docType: EDocType
): Promise<void> => {
  if (docType === EDocType.game) await processGame(data)
  if (docType === EDocType.save) await processSave(data)
  if (docType === EDocType.team) await processTeam(data)
} 

export async function POST ({ request, params }) {
  const { doc } = params
  
  if (doc !== EDocType.game && doc !== EDocType.save && doc !== EDocType.team)
  return new Response('No content', { status: 204 })

  let success: Boolean, data: IGames | ISaves | ITeams
  if (doc === EDocType.game) [success, data] = await verify(request, IGames)
  if (doc === EDocType.save) [success, data] = await verify(request, ISaves)
  if (doc === EDocType.team) [success, data] = await verify(request, ITeams)

  if (success) process(data, doc)
  else console.log(JSON.stringify(data, null, 2))
  
  return new Response('Accepted', {
    status: 202
  })
  
}
