import { z } from 'zod'
import { ISaves, IGames } from './types'

import { processSave, processGame } from './bigquery'

// @ts-ignore
type IGames = z.infer<typeof IGames>
// @ts-ignore
type ISaves = z.infer<typeof ISaves>

enum EDocType {
  game = 'game',
  save = 'save'
}

enum EMimeType {
  JSON = 'application/json'
}

enum EHeaders {
  ContentType = 'Content-Type'
}

const verify = async (
  req: Request,
  T: IGames | ISave
): Promise<[boolean, any]> => {
  
  const contentType = req.headers.get(EHeaders.ContentType)
  if (contentType !== EMimeType.JSON) return [false, 'Not JSON']
  
  const body = await req.json()
  const { success, error } = T.safeParse(body)

  if (!success) return [false, error]

  return [true, body]
}

const process = async (
  data: IGames | ISave,
  docType: EDocType
): Promise<void> => {
  if (docType === EDocType.game) processGame(data)
  if (docType === EDocType.save) processSave(data)
} 

export async function POST ({ request, params }) {
  const { doc } = params

  console.log(request.headers)
  
  if (doc !== EDocType.game && doc !== EDocType.save)
  return new Response('No content', { status: 204 })

  let success: Boolean, data: IGames | ISaves
  if (doc === EDocType.game) [success, data] = await verify(request, IGames)
  if (doc === EDocType.save) [success, data] = await verify(request, ISaves)

  if (success) process(data, doc)
  else console.log(data)
  
  return new Response('Accepted', {
    status: 202
  })
  
}
