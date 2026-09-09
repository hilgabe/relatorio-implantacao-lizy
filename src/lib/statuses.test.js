import { describe, expect, it } from 'vitest'
import { mergeTaskStatuses, statusMap } from './statuses'

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
})
