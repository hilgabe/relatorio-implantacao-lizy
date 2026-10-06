import { describe, expect, it } from 'vitest'
import { requestRow, sortRequestsNewestFirst, trackingRow } from './rows'

const timestamp = (iso) => ({ toDate: () => new Date(iso) })

describe('linhas do Firestore', () => {
  it('converte o acompanhamento usando o id do documento e datas ISO', () => {
    expect(trackingRow('PCP-001', {
      status: 'Resolvida',
      priority: 'Alta',
      due_date: '2026-09-25',
      tracking_note: 'Ok',
      updated_at: timestamp('2026-09-22T12:00:00.000Z'),
    })).toEqual({
      task_id: 'PCP-001',
      status: 'Resolvida',
      priority: 'Alta',
      due_date: '2026-09-25',
      tracking_note: 'Ok',
      updated_at: '2026-09-22T12:00:00.000Z',
    })
  })

  it('preenche campos opcionais ausentes com null', () => {
    const row = trackingRow('COM-001', { status: 'Em análise' })
    expect(row).toMatchObject({ priority: null, due_date: null, tracking_note: null, updated_at: null })
  })

  it('converte solicitações mantendo os campos e o id do documento', () => {
    const row = requestRow('SOL-0001', { title: 'Ajustar relatório', created_at: timestamp('2026-09-17T12:47:04.964Z') })
    expect(row).toEqual({ id: 'SOL-0001', title: 'Ajustar relatório', created_at: '2026-09-17T12:47:04.964Z' })
  })

  it('ordena solicitações da mais nova para a mais antiga', () => {
    const rows = [
      { id: 'SOL-0001', created_at: '2026-09-17T12:00:00.000Z' },
      { id: 'SOL-0002', created_at: '2026-09-18T12:00:00.000Z' },
    ]
    expect(sortRequestsNewestFirst(rows).map((row) => row.id)).toEqual(['SOL-0002', 'SOL-0001'])
  })
})
