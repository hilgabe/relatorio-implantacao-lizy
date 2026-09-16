import { describe, expect, it } from 'vitest'
import { tasks } from '../data/tasks'
import { buildReportText, filterTasks, formatDueDate, getDeadlineInfo, normalizeText, sortTasks } from './tasks'

describe('base de solicitações', () => {
  it('mantém demandas operacionais, pauta da reunião e histórico separados', () => {
    expect(tasks.filter((task) => task.scope === 'current')).toHaveLength(16)
    expect(tasks.filter((task) => task.scope === 'meeting')).toHaveLength(9)
    expect(tasks.filter((task) => task.scope === 'history')).toHaveLength(2)
  })

  it('mantém identificadores únicos e todos os campos mínimos', () => {
    const required = ['id', 'title', 'description', 'sector', 'priority', 'status', 'origin', 'evidence', 'impact', 'nextStep']
    expect(new Set(tasks.map((task) => task.id)).size).toBe(tasks.length)
    tasks.forEach((task) => required.forEach((field) => expect(task[field], `${task.id}.${field}`).toBeTruthy()))
  })
})

describe('filtros e relatório', () => {
  it('pesquisa referências sem depender de acentos ou caixa', () => {
    expect(normalizeText('Aquisição')).toBe('aquisicao')
    expect(filterTasks(tasks, { scope: 'current', query: 're09', sector: '', status: '', priority: '' }).map((task) => task.id)).toContain('ALM-007')
    expect(filterTasks(tasks, { scope: 'current', query: 'OS 60027', sector: '', status: '', priority: '' }).map((task) => task.id)).toEqual(['AQU-003'])
  })

  it('combina filtros de escopo, setor, estado e prioridade', () => {
    const result = filterTasks(tasks, { scope: 'current', query: '', sector: 'Almoxarifado', status: 'Aguardando Lizy', priority: 'Crítica' })
    expect(result.map((task) => task.id)).toEqual(['ALM-002', 'ALM-007'])
  })

  it('gera texto compartilhável com origem e próximo passo', () => {
    const report = buildReportText([tasks[0]], new Date('2026-08-25T12:00:00'))
    expect(report).toContain('ALM-001')
    expect(report).toContain('Almoxarifado - arquivo recebido')
    expect(report).toContain('Próximo passo sugerido')
    expect(report).not.toContain('Responsável:')
  })

  it('identifica explicitamente os itens da pauta da reunião no relatório', () => {
    const meetingTask = tasks.find((task) => task.id === 'PCP-001')
    const report = buildReportText([meetingTask], new Date('2026-09-15T12:00:00'))
    expect(report).toContain('pauta da reunião com o suporte Lizy')
    expect(meetingTask.meeting).toBe(true)
  })

  it('distingue pendentes de resolvidas', () => {
    const sample = [
      { ...tasks[0], id: 'A', status: 'Resolvida' },
      { ...tasks[1], id: 'B', status: 'Em análise' },
    ]
    expect(filterTasks(sample, { resolution: 'pending' }).map((task) => task.id)).toEqual(['B'])
    expect(filterTasks(sample, { resolution: 'resolved' }).map((task) => task.id)).toEqual(['A'])
  })

  it('classifica prazo vencido, próximo e não definido', () => {
    const today = new Date(2026, 8, 16)
    expect(getDeadlineInfo({ dueDate: null, status: 'Em análise' }, today).tone).toBe('none')
    expect(getDeadlineInfo({ dueDate: '2026-09-15', status: 'Em análise' }, today).tone).toBe('overdue')
    expect(getDeadlineInfo({ dueDate: '2026-09-20', status: 'Em análise' }, today).tone).toBe('soon')
    expect(formatDueDate('2026-09-20')).toBe('20/09/2026')
  })

  it('ordena pendências por prioridade e deixa resolvidas ao final', () => {
    const ordered = sortTasks([
      { id: '3', priority: 'Alta', status: 'Resolvida' },
      { id: '2', priority: 'Média', status: 'Em análise' },
      { id: '1', priority: 'Altíssima', status: 'Em análise' },
    ])
    expect(ordered.map((task) => task.id)).toEqual(['1', '2', '3'])
  })
})
