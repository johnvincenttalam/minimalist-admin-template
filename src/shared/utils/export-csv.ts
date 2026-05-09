export function exportToCSV<T extends object>(
  data: T[],
  filename: string,
  columns?: { key: keyof T & string; label: string }[]
) {
  if (data.length === 0) return

  const keys = (columns?.map(c => c.key) ?? Object.keys(data[0])) as (keyof T & string)[]
  const headers = columns?.map(c => c.label) ?? keys

  const csvRows = [
    headers.join(','),
    ...data.map(row => {
      const r = row as Record<string, unknown>
      return keys.map(key => {
        const val = r[key]
        const str = val === null || val === undefined ? '' : String(val)
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str
      }).join(',')
    }),
  ]

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
