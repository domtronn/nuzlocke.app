import Games from '$lib/data/games.json';

export async function GET({ params }) {
  const { logo, ext } = params;

  if (!['png', 'webp'].includes(ext)) return new Response('', { stauts: 404 })


  const [id, res] = logo.split('@')
  const logoPath = Games[id].logo;
  if (!logoPath) return new Response('', { status: 404 });

  const location = res
        ? `${logoPath}@${res}.${ext}`
        : `${logoPath}.${ext}`

  return new Response('', {
    status: 301,
    headers: {
      Location: 'https://img.nuzlocke.app' + location
    }
  });
}
