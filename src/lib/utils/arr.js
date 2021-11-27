export const groupBy = (field, arr, asTuple = false) => {
  const res = arr.reduce((acc, it) => {
    const g = it[field].trim()
    const a = acc[g] || []
    return { ...acc, [g]: a.concat(it) }
  }, {})

  return asTuple ? Object.entries(res) : res
}

export const random = (arr) => arr[Math.floor(Math.random() * arr.length)]

export const mapObj = (o, f) => Object.entries(o).map(([k, v]) => [k, f(v)]).reduce((acc, [k, v]) => ({ ...acc, [k]: v}), {})
export const filterObj = (o, f) => Object.entries(o).filter(([, v]) => f(v)).reduce((acc, [k, v]) => ({ ...acc, [k]: v}), {})

export const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
