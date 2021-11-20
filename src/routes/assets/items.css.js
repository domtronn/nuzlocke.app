import items from './items'

const extract = (id, str) => {
  try {
    const re = new RegExp(`\\.pk(item|m)-${id}{.*?}`)
    const res = re.exec(str)
    return res[0]
  } catch (e) {
    return null
  }
}

export async function get ({ query }) {
  if (!query.get('i')) return {
    status: 200,
    body: items,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Content-Type': 'text/css'
    }
  }

  const ilist = query.get('i').split(',')
  const criticalCss = ilist.reduce((acc, it) => acc + extract(it, items), '')

  return {
    status: 200,
    body: criticalCss,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Content-Type': 'text/css'
    }
  }
}
