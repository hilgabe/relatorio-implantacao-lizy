import { describe, expect, it } from 'vitest'
import { mapCustomTask, upsertCustomTask } from './requests'

const row = {
  id: 'SOL-0001',
  title: 'Ajustar relatório',
  description: 'Descrição completa da solicitação.',
  sector: 'Comercial',
  requester: 'Gabriel',
  owner: 'Alice',
  priority: 'Alta',
  status: 'Nova',
  reference: 'OS 123',
  impact: 'Impede a conferência.',
  expected_result: 'Disponibilizar o campo no relatório.',
  attachment_url: 'https://example.com/anexo.pdf',
  created_at: '2026-09-10T12:00:00.000Z',
}

describe('solicitações abertas pelo painel', () => {
  it('converte a linha compartilhada para o formato do painel', () => {
    const task = mapCustomTask(row)
    expect(task.id).toBe('SOL-0001')
    expect(task.origin).toContain('Gabriel')
    expect(task.attachments[0]).toMatchObject({ src: row.attachment_url, preview: false })
    expect(task.scope).toBe('current')
  })

  it('insere ou atualiza sem duplicar e mantém as mais novas primeiro', () => {
    const older = { ...row, id: 'SOL-0002', created_at: '2026-09-09T12:00:00.000Z' }
    const result = upsertCustomTask([older, row], { ...row, title: 'Título atualizado' })
    expect(result).toHaveLength(2)
    expect(result[0].title).toBe('Título atualizado')
  })
})
