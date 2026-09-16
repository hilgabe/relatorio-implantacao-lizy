import { describe, expect, it } from 'vitest'
import { mergeTaskStatuses, mergeTaskTracking, statusMap, trackingMap } from './statuses'

describe('status compartilhado', () => {
  it('transforma linhas remotas em um mapa por identificador', () => {
    expect(statusMap([{ task_id: 'ALM-001', status: 'Resolvida' }])).toEqual({ 'ALM-001': 'Resolvida' })
  })

  it('prioriza o estado remoto quando a base está conectada', () => {
    const tasks = [{ id: 'ALM-001', status: 'Aguardando Lizy' }]
    expect(mergeTaskStatuses(tasks, { 'ALM-001': 'Resolvida' }, {}, true)[0].status).toBe('Resolvida')
  })

  it('mantém o fallback local enquanto não existe conexão', () => {
    const tasks = [{ id: 'ALM-001', status: 'Aguardando Lizy' }]
    expect(mergeTaskStatuses(tasks, {}, { 'ALM-001': 'Em análise' }, false)[0].status).toBe('Em análise')
  })

  it('combina estado, prioridade e prazo compartilhados', () => {
    const rows = [{ task_id: 'ALM-001', status: 'Resolvida', priority: 'Altíssima', due_date: '2026-09-20', tracking_note: 'Ajuste aplicado e validado.' }]
    const mapped = trackingMap(rows)
    expect(mapped['ALM-001']).toEqual({ status: 'Resolvida', priority: 'Altíssima', dueDate: '2026-09-20', trackingNote: 'Ajuste aplicado e validado.' })
    expect(mergeTaskTracking([{ id: 'ALM-001', status: 'Em análise', priority: 'Média' }], mapped, {}, true)[0]).toMatchObject({
      status: 'Resolvida', priority: 'Altíssima', dueDate: '2026-09-20', trackingNote: 'Ajuste aplicado e validado.',
    })
  })
})
