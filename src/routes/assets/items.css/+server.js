import items from '../items/_data.js';

const extract = (id, str) => {
  try {
    const re = new RegExp(`\\.pk(item|m)-${id}{.*?}`);
    const res = re.exec(str);
    return res[0];
  } catch (e) {
    return null;
  }
};

export async function GET({ url }) {
  if (!url.searchParams.get('i'))
    return {
      status: 200,
      body: items,
      headers: {
        'Cache-Control': 'public, max-age=31536000',
        'Content-Type': 'text/css'
      }
    };

  const ilist = url.searchParams.get('i').split(',');
  const criticalCss = ilist.reduce((acc, it) => acc + extract(it, items), '');

  return new Response(criticalCss, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Content-Type': 'text/css'
    }
  });
}
