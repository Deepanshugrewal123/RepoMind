export function formatStatement(prefix: string, value: string) {
  return prefix + " WHERE name = '" + value + "'"
}
