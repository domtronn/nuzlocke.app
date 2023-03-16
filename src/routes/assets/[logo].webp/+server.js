import Games from '$lib/data/games.json';

export async function GET({ params }) {
  const { logo } = params;

  const logoPath = Games[logo].logo;
  if (!logoPath) return new Response({ status: 404 });

  return new Response('', {
    status: 301,
    headers: {
      Location: 'https://img.nuzlocke.app' + logoPath + '.webp'
    }
  });
}
