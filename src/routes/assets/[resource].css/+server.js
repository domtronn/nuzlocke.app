import Clean from 'clean-css';

import pokemon from 'pokemon-assets/assets/css/pokemon.css';

const clean = new Clean();
const resourceMap = { pokemon };

export async function GET({ params }) {
  const { resource } = params;
  if (!resourceMap[resource]) return;

  return new Response(clean.minify(resourceMap[resource]).styles, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Content-Type': 'text/css'
    }
  });
}
