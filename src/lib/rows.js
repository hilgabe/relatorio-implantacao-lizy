// Converte documentos do Firestore no formato de linha que o painel já consome
// (mesmos nomes de campo usados antes no banco relacional).

function toIso(value) {
  if (value && typeof value.toDate === 'function') return value.toDate().toISOString()
  return value ?? null
}

export function trackingRow(id, data) {
  return {
    task_id: id,
    status: data.status,
    priority: data.priority ?? null,
    due_date: data.due_date ?? null,
    tracking_note: data.tracking_note ?? null,
    updated_at: toIso(data.updated_at),
  }
}

export function requestRow(id, data) {
  return { ...data, id, created_at: toIso(data.created_at) ?? new Date().toISOString() }
}

export function sortRequestsNewestFirst(rows) {
  return [...rows].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
}
