import { BigQuery } from '@google-cloud/bigquery'

import { z  } from 'zod'
import { IGames, ISave } from './types'

// @ts-ignore
type IGames = z.infer<typeof IGames>
// @ts-ignore
type ISave = z.infer<typeof ISave>

const {
  VITE_BQ_PROJECT_ID,
  VITE_BQ_SAVES_DATASET_ID,
  VITE_BQ_SAVES_TABLE_ID,
  VITE_BQ_GAMES_DATASET_ID,
  VITE_BQ_GAMES_TABLE_ID,
  VITE_BQ_PRIVATE_KEY_ID,
  VITE_BQ_PRIVATE_KEY,
  VITE_BQ_CLIENT_ID,
  VITE_BQ_CLIENT_EMAIL,
} = import.meta.env

const bq = new BigQuery({
  projectId: VITE_BQ_PROJECT_ID,
  credentials: {
    "private_key_id": VITE_BQ_PRIVATE_KEY_ID,
    "private_key": VITE_BQ_PRIVATE_KEY,
    "client_email": VITE_BQ_CLIENT_EMAIL,
    "client_id": VITE_BQ_CLIENT_ID,
    "project_id": VITE_BQ_PROJECT_ID,
    "type": "service_account",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/nuzlocke-data-syncer%40nuzlocke-tracker-data.iam.gserviceaccount.com"
  }
})

export const processGame = async ({ data, user_id }: IGames) => {
  try {
    await bq
      .dataset(VITE_BQ_GAMES_DATASET_ID)
      .table(VITE_BQ_GAMES_TABLE_ID)
      .insert(data.map(({ created_at, updated_at, ...d }) => ({
        ...d,
        user_id,
        uploaded_at: +new Date() / 1000,
        created_at: created_at / 1000,
        ...(updated_at ? { updated_at: updated_at / 1000 } : {}),
      })))

    console.log(`Added ${data.length} rows of game data`)
  } catch (e) {
    if (!e.errors) console.error(e)
    console.error(JSON.stringify(e.errors, null, 2))
  }
}

export const processSave = async ({ data, user_id, game_id }: ISave) => {
  try {
    await bq
      .dataset(VITE_BQ_SAVES_DATASET_ID)
      .table(VITE_BQ_SAVES_TABLE_ID)
      .insert(data.map(({ id, hidden, location, ...d }) => ({
        ...d,
        user_id,
        game_id,
        location_name: location,
        location_id: id,
        uploaded_at: +new Date() / 1000,
      })))
    
    console.log(`Added ${data.length} rows of save data`)
  } catch (e) {
    if (!e.errors) console.error(e)
    console.error(JSON.stringify(e.errors, null, 2))
  }
}
