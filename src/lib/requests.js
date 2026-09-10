export function mapCustomTask(row) {
  const createdAt = row.created_at ? new Date(row.created_at) : null
  const dateLabel = createdAt && !Number.isNaN(createdAt.valueOf())
    ? createdAt.toLocaleDateString('pt-BR')
    : 'data não informada'

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    sector: row.sector,
    owner: row.owner,
    priority: row.priority,
    status: row.status,
    origin: `Solicitação aberta no painel por ${row.requester} em ${dateLabel}`,
    evidence: row.reference || 'Nenhuma referência adicional informada.',
    impact: row.impact,
    nextStep: row.expected_result,
    attachments: row.attachment_url
      ? [{
          src: row.attachment_url,
          alt: `Abrir anexo da solicitação ${row.id}`,
          caption: 'Link de anexo informado na solicitação',
          preview: false,
        }]
      : [],
    scope: 'current',
    createdAt: row.created_at,
  }
}

export function upsertCustomTask(rows, incoming) {
  const next = rows.filter((row) => row.id !== incoming.id)
  return [incoming, ...next].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
}
