import Games from '$lib/data/games.json'

export async function get ({ params }) {
  const { logo } = params

  const logoPath = Games[logo].logo
  if (!logoPath) return { status: 404 }

  return {
    status: 301,
    headers: {
      Location: logoPath
    }
  }
}
