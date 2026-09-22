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
    if (filters.resolution === 'pending' && task.status === 'Resolvida') return false
    if (filters.resolution === 'resolved' && task.status !== 'Resolvida') return false
    const deadline = getDeadlineInfo(task)
    if (filters.deadline && deadline.tone !== filters.deadline) return false
    if (!query) return true
    const haystack = normalizeText(Object.values(task).join(' '))
    return query.split(/\s+/).every((term) => haystack.includes(term))
  })
}

const priorityOrder = { 'Altíssima': 0, 'Crítica': 1, 'Alta': 2, 'Média': 3, 'Baixa': 4 }

function parseDate(date) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const [year, month, day] = date.split('-').map(Number)
  const parsed = new Date(year, month - 1, day)
  return Number.isNaN(parsed.valueOf()) ? null : parsed
}

export function formatDueDate(dueDate) {
  const date = parseDate(dueDate)
  return date ? date.toLocaleDateString('pt-BR') : 'Sem prazo definido'
}

export function getDeadlineInfo(task, referenceDate = new Date()) {
  const due = parseDate(task.dueDate)
  if (!due) return { tone: 'none', label: 'Sem prazo', detail: 'Defina uma data' }

  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate())
  const days = Math.round((due - today) / 86400000)
  const label = formatDueDate(task.dueDate)
  if (task.status === 'Resolvida') return { tone: 'resolved', label, detail: 'Item resolvido' }
  if (days < 0) return { tone: 'overdue', label, detail: `Atrasado há ${Math.abs(days)} ${Math.abs(days) === 1 ? 'dia' : 'dias'}` }
  if (days === 0) return { tone: 'soon', label, detail: 'Vence hoje' }
  if (days <= 7) return { tone: 'soon', label, detail: `Vence em ${days} ${days === 1 ? 'dia' : 'dias'}` }
  return { tone: 'scheduled', label, detail: 'Prazo definido' }
}

export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const resolved = Number(a.status === 'Resolvida') - Number(b.status === 'Resolvida')
    if (resolved) return resolved
    const priority = (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99)
    if (priority) return priority
    if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate)
    if (a.dueDate && !b.dueDate) return -1
    if (!a.dueDate && b.dueDate) return 1
    return a.id.localeCompare(b.id)
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
      `Setor: ${task.sector} | Prioridade proposta: ${task.priority} | Estado: ${task.status} | Prazo: ${formatDueDate(task.dueDate)}`,
      `Solicitação: ${task.description}`,
      `Origem: ${task.origin}`,
      `Evidência/referência: ${task.evidence}`,
      `Impacto observado/proposto: ${task.impact}`,
      `Próximo passo sugerido: ${task.nextStep}`,
      `${task.status === 'Resolvida' ? 'Solução registrada' : 'Atualização da pendência'}: ${task.trackingNote || 'Não informada'}`,
      task.attachments?.length ? `Anexos: ${task.attachments.map((attachment) => attachment.caption).join(' | ')}` : 'Anexos: nenhum',
      '',
    )
  })
  return lines.filter((line) => line !== null).join('\n')
}
