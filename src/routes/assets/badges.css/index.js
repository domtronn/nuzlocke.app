import Clean from 'clean-css'
import badges from './_badges.css'

const clean = new Clean()
const minifiedBadges = clean.minify(badges).styles

export async function get () {
  return {
    status: 200,
    body: minifiedBadges,
    'Cache-Control': 'public, max-age=31536000',
    'Content-Type': 'text/css'
  }
}
