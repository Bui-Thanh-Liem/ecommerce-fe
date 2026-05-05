export function generateQueryParams(
  params: Record<
    string,
    string | number | boolean | (string | number | boolean)[] | undefined
  >
): string {
  const queryParams = new URLSearchParams()

  for (const key in params) {
    const value = params[key]
    if (value === undefined) continue

    if (Array.isArray(value)) {
      value.forEach((item) => queryParams.append(key, String(item)))
    } else {
      queryParams.append(key, String(value))
    }
  }

  return queryParams.toString()
}
