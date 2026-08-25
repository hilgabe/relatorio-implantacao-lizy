import { describe, expect, it } from 'vitest'
import { tasks } from '../data/tasks'
import { buildReportText, filterTasks, normalizeText } from './tasks'

describe('base de solicitações', () => {
  it('mantém 13 demandas atuais e o histórico separado', () => {
    expect(tasks.filter((task) => task.scope === 'current')).toHaveLength(13)
    expect(tasks.filter((task) => task.scope === 'history')).toHaveLength(3)
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
  })
})
