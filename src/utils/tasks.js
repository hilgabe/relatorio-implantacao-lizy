export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function filterTasks(tasks, filters) {
  const query = normalizeText(filters.query).trim()
  return tasks.filter((task) => {
    if (filters.scope && task.scope !== filters.scope) return false
    if (filters.sector && task.sector !== filters.sector) return false
    if (filters.status && task.status !== filters.status) return false
    if (filters.priority && task.priority !== filters.priority) return false
    if (!query) return true
    const haystack = normalizeText(Object.values(task).join(' '))
    return query.split(/\s+/).every((term) => haystack.includes(term))
  })
}

export function buildReportText(tasks, generatedAt = new Date()) {
  const lines = [
    'ELÉTRICA VISÃO × LIZY — RELATÓRIO DE SOLICITAÇÕES',
    `Gerado em ${generatedAt.toLocaleString('pt-BR')}`,
    `Itens exibidos: ${tasks.length}`,
    '',
  ]
  tasks.forEach((task) => {
    lines.push(
      `${task.id} — ${task.title}`,
      `Setor: ${task.sector} | Prioridade proposta: ${task.priority} | Estado: ${task.status}`,
      `Solicitação: ${task.description}`,
      `Origem: ${task.origin}`,
      `Evidência/referência: ${task.evidence}`,
      `Impacto observado/proposto: ${task.impact}`,
      `Próximo passo sugerido: ${task.nextStep}`,
      '',
    )
  })
  return lines.join('\n')
}
