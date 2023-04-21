import { BigQuery } from '@google-cloud/bigquery'

import { z  } from 'zod'
import { IGames, ISaves, ITeams, IFights } from './types'
import { isEmpty, nonnull } from '$utils/obj'

// @ts-ignore
type IGames = z.infer<typeof IGames>
// @ts-ignore
type ISaves = z.infer<typeof ISaves>
// @ts-ignore
type ITeams = z.infer<typeof ITeams>
// @ts-ignore
type IFights = z.infer<typeof IFights>

    
const {
  VITE_BQ_PROJECT_ID,
  VITE_BQ_SAVES_DATASET_ID,
  VITE_BQ_SAVES_TABLE_ID,
  VITE_BQ_GAMES_DATASET_ID,
  VITE_BQ_GAMES_TABLE_ID,
  VITE_BQ_TEAMS_DATASET_ID,
  VITE_BQ_TEAMS_TABLE_ID,
  VITE_BQ_BOSS_TABLE_ID,
  VITE_BQ_BOSS_DATASET_ID,
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

export const processTeam = async({ data, user_id, game_id }: ITeams) => {
    try {
        const rows = data.map(({ location, ...r }) => ({
            ...r,
            user_id,
            game_id,
            location_name: location,
            uploaded_at: +new Date() / 1000,
        }))

        await bq
            .dataset(VITE_BQ_TEAMS_DATASET_ID)
            .table(VITE_BQ_TEAMS_TABLE_ID)
            .insert(rows)
        
        console.log(`Added ${data.length} rows of team data`)
    } catch (e) {
        if (!e.errors) console.error(e)
        console.error(JSON.stringify(e.errors, null, 2))
    }
}

export const processBoss = async({ data, user_id, game_id }: IFights) => {
    try {
        const rows = (data.map(({ team, ...r }) => {
            return team.map(({ location, ...t}) => ({
                ...r,
                ...t, 
                user_id,
                game_id,
                location_name: location,
                uploaded_at: +new Date() / 1000,
            }))}) as any[][]).flat()

        await bq
            .dataset(VITE_BQ_BOSS_DATASET_ID)
            .table(VITE_BQ_BOSS_TABLE_ID)
            .insert(rows)
        
        console.log(`Added ${data.length} rows of bossfight data`)
    } catch (e) {
        if (!e.errors) console.error(e)
        console.error(JSON.stringify(e.errors, null, 2))
    }
}

export const processSave = async ({ data, user_id, game_id }: ISaves) => {
    try {
      const rows = data.map(({ id, hidden, location, death, ...d }) => ({
        ...d,
        user_id,
        game_id,
        location_name: location,
        location_id: id,
        uploaded_at: +new Date() / 1000,
        ...(d.status === 5 && !isEmpty(death) ? nonnull({
            death_type: death.type,
            death_time: death.time / 1000,
            death_epitaph: death.epitaph,
            death_epitaph_custom: death?.custom,
            death_epitaph_category: death?.category,
            death_lvl_start: death?.lvl?.from,
            death_lvl_end: death?.lvl?.to,
            death_location_name: death?.location?.name,
            death_pokemon_name: death?.opponent?.name,
            death_pokemon_id: death?.opponent?.id,
            death_trainer_name: death?.trainer?.name,
            death_trainer_id: death?.trainer?.id,
            death_trainer_type: death?.trainer?.type,
            death_trainer_speciality: death?.trainer?.speciality,
            death_attack_name: death?.attack?.name,
            death_attack_type: death?.attack?.type,
        }): {})
      }))
        
    await bq
      .dataset(VITE_BQ_SAVES_DATASET_ID)
      .table(VITE_BQ_SAVES_TABLE_ID)
      .insert(rows)
    
    console.log(`Added ${data.length} rows of save data`)
  } catch (e) {
    if (!e.errors) console.error(e)
    console.error(JSON.stringify(e.errors, null, 2))
  }
}
