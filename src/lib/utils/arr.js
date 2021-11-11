export const groupBy = (field, arr, asTuple = false) => {
  const res = arr.reduce((acc, it) => {
    const g = it[field].trim()
    const a = acc[g] || []
    return { ...acc, [g]: a.concat(it) }
  }, {})

  return asTuple ? Object.entries(res) : res
}
