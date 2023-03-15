import { z } from 'zod'
import { ISave, IGames } from './types'

// @ts-ignore
type IGames = z.infer<typeof IGames>
// @ts-ignore
type ISave = z.infer<typeof ISave>

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
  if (docType === EDocType.game) console.log('processing game')
  if (docType === EDocType.save) console.log('processing save')
} 

export async function PUT ({ request, params }) {
  const { doc } = params
  
  if (doc !== EDocType.game && doc !== EDocType.save)
  return new Response('', { status: 404 })

  let success: Boolean, data: IGames | ISave
  if (doc === EDocType.game) [success, data] = await verify(request, IGames)
  if (doc === EDocType.save) [success, data] = await verify(request, ISave)

  if (success) process(data, doc)
  
  return new Response('Accepted', {
    status: 202
  })
  
}
