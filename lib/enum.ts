export const getEnumKeys = (enumObj: Record<string, string | number>) => {
  let options: string[] = []
  Object.keys(enumObj).forEach(key => {
    if (isNaN(Number(key))) {
      options.push(key)
    }
  })
  return options
}

export const getEnumValues = (enumObj: Record<string, string | number>) => {
  return Object.values(enumObj).map(value => value)
}
