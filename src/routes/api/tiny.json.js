import tiny from 'tinyurl'

export async function post ({ body }) {
  const url = await tiny.shorten(body.url)

  return {
    status: 200,
    body: { url }
  }
}
