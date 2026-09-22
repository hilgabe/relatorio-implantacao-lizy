import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCopy,
  Download,
  ExternalLink,
  FileClock,
  FilePlus2,
  Filter,
  KeyRound,
  Lock,
  MessagesSquare,
  PackageCheck,
  Paperclip,
  Printer,
  Radio,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  ShoppingCart,
  Warehouse,
  X,
} from 'lucide-react'
import { HISTORY_TOTAL, PRIORITIES, STATUSES, tasks as initialTasks } from './data/tasks'
import { mapCustomTask, upsertCustomTask } from './lib/requests'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import { mergeTaskTracking, trackingMap } from './lib/statuses'
import { buildReportText, filterTasks, formatDueDate, getDeadlineInfo, sortTasks } from './utils/tasks'

const STORAGE_KEY = 'eletrica-visao-lizy-tracking-v2'
const LEGACY_STORAGE_KEY = 'eletrica-visao-lizy-status-v1'

function loadTracking() {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    if (Object.keys(current).length) return current
    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || '{}')
    return Object.fromEntries(Object.entries(legacy).map(([id, status]) => [id, { status }]))
  } catch {
    return {}
  }
}

function priorityType(priority) {
  return `priority-${priority.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`
}

function statusType(status) {
  return status === 'Resolvida' ? 'resolved' : 'pending'
}

function noteTemplates(task) {
  if (task.status === 'Resolvida') {
    return [
      'Ajuste realizado e funcionamento validado.',
      'Orientação repassada e procedimento confirmado com o solicitante.',
      'Configuração corrigida; funcionamento testado e normalizado.',
      'Não foi necessário alterar o sistema; o procedimento correto foi orientado e validado.',
    ]
  }
  if (task.status === 'Aguardando Lizy') {
    return [
      'Aguardando retorno da equipe Lizy sobre a análise e o próximo passo.',
      'Solicitação encaminhada à equipe Lizy; aguardando previsão para o ajuste.',
      'Aguardando validação da regra pela equipe Lizy antes de prosseguir.',
    ]
  }
  if (task.status === 'Em análise') {
    return [
      'Situação em análise para identificar a causa e definir a solução.',
      'Aguardando informações complementares para concluir a análise.',
      'Teste controlado pendente para reproduzir o comportamento informado.',
      'Reunião necessária para alinhar a regra antes de solicitar a alteração.',
    ]
  }
  return [
    'Solicitação registrada e aguardando triagem.',
    'Aguardando retorno com as informações necessárias para iniciar o atendimento.',
    'Aguardando definição da data de atendimento.',
  ]
}

function Badge({ type, children }) {
  return <span className={`badge badge--${type}`}>{children}</span>
}

function SummaryCard({ icon: Icon, label, value, detail, tone = 'blue' }) {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <div className="summary-card__icon"><Icon size={20} aria-hidden="true" /></div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  )
}

function DeadlineBadge({ task }) {
  const deadline = getDeadlineInfo(task)
  return (
    <span className={`deadline deadline--${deadline.tone}`}>
      <CalendarDays size={14} aria-hidden="true" />
      <span><strong>{deadline.label}</strong><small>{deadline.detail}</small></span>
    </span>
  )
}

function DetailPanel({ task, canEdit, onClose, onTrackingChange }) {
  const [noteDraft, setNoteDraft] = useState(task?.trackingNote || '')

  if (!task) return null
  const templates = noteTemplates(task)
  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div className="drawer__header">
          <div>
            <span className="eyebrow">Detalhe da solicitação</span>
            <div className="drawer__id">{task.id}</div>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar detalhes"><X size={20} /></button>
        </div>
        <div className="drawer__body">
          <div className="detail-badges">
            <Badge type={priorityType(task.priority)}>{task.priority}</Badge>
            <Badge type={statusType(task.status)}>{task.status === 'Resolvida' ? 'Resolvida' : 'Pendente'}</Badge>
            <Badge type="sector">{task.sector}</Badge>
          </div>
          <h2 id="detail-title">{task.title}</h2>
          <p className="detail-description">{task.description}</p>

          <div className="tracking-editor">
            <label>
              <span className="field-label">Estado compartilhado</span>
              <span className={`select-wrap drawer-status status-control status-control--${statusType(task.status)}`}>
                <select disabled={!canEdit} value={task.status} onChange={(event) => onTrackingChange(task.id, { status: event.target.value })}>
                  {STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden="true" />
              </span>
            </label>
            <label>
              <span className="field-label">Prioridade</span>
              <span className="select-wrap drawer-status">
                <select disabled={!canEdit} value={task.priority} onChange={(event) => onTrackingChange(task.id, { priority: event.target.value })}>
                  {PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden="true" />
              </span>
            </label>
            <label className="deadline-editor">
              <span className="field-label">Data de prazo</span>
              <input disabled={!canEdit} type="date" value={task.dueDate || ''} onChange={(event) => onTrackingChange(task.id, { dueDate: event.target.value || null })} />
              <DeadlineBadge task={task} />
            </label>
          </div>

          <section className={`tracking-note tracking-note--${statusType(task.status)}`} aria-labelledby="tracking-note-title">
            <div className="tracking-note__heading">
              <div><span className="field-label">Registro do acompanhamento</span><h3 id="tracking-note-title">{task.status === 'Resolvida' ? 'O que foi solucionado?' : 'Por que ainda está pendente?'}</h3></div>
              {task.status === 'Resolvida' ? <CheckCircle2 size={20} /> : <FileClock size={20} />}
            </div>
            <label className="tracking-note__template">
              <span className="sr-only">Usar texto pronto</span>
              <select disabled={!canEdit} defaultValue="" onChange={(event) => { if (event.target.value) setNoteDraft(event.target.value); event.target.value = '' }}>
                <option value="">Escolher um texto pronto…</option>
                {templates.map((template) => <option key={template} value={template}>{template}</option>)}
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </label>
            <textarea disabled={!canEdit} maxLength="1500" rows="4" value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder={task.status === 'Resolvida' ? 'Descreva a solução aplicada, o que foi corrigido e como foi validado.' : 'Registre o que foi conversado, de quem depende e qual é o próximo passo.'} />
            <div className="tracking-note__footer"><span>{noteDraft.length}/1500</span><button type="button" disabled={!canEdit || noteDraft === (task.trackingNote || '')} onClick={() => onTrackingChange(task.id, { trackingNote: noteDraft.trim() })}><Save size={15} /> Salvar registro</button></div>
          </section>

          <dl className="detail-list">
            <div><dt>Origem</dt><dd>{task.origin}</dd></div>
            <div><dt>Evidência / referência</dt><dd>{task.evidence}</dd></div>
            <div><dt>Impacto</dt><dd>{task.impact}</dd></div>
            <div className="detail-list__next"><dt>Próximo passo sugerido</dt><dd>{task.nextStep}</dd></div>
          </dl>
          {task.attachments?.length > 0 && (
            <section className="attachments" aria-labelledby="attachments-title">
              <div className="attachments__heading"><Paperclip size={17} /><h3 id="attachments-title">Anexos de referência</h3></div>
              <div className="attachments__grid">
                {task.attachments.map((attachment) => (
                  <a key={attachment.src} href={attachment.src} target="_blank" rel="noreferrer" className="attachment-card">
                    {attachment.preview === false
                      ? <span className="attachment-card__link"><ExternalLink size={18} /> Abrir arquivo ou link de referência</span>
                      : <img src={attachment.src} alt={attachment.alt} />}
                    <span>{attachment.caption}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
          {task.scope === 'history' && (
            <div className="warning-box"><AlertTriangle size={18} /><p>Item histórico. Requer revalidação antes de ser tratado como comportamento atual do Lizy.</p></div>
          )}
        </div>
      </aside>
    </div>
  )
}

function RequestForm({ busy, onSubmit, onView, success }) {
  return (
    <section className="request-form-wrap" aria-labelledby="request-form-title">
      <div className="request-intro">
        <div className="request-intro__icon"><FilePlus2 size={24} /></div>
        <div>
          <h3 id="request-form-title">Abrir uma nova solicitação</h3>
          <p>Descreva a necessidade com informações suficientes para a equipe entender, reproduzir e validar o pedido.</p>
        </div>
      </div>

      <div className="public-warning"><AlertTriangle size={18} /><p><strong>Conteúdo compartilhado:</strong> a solicitação aparecerá no painel público. Não informe senhas, dados pessoais, valores sigilosos ou documentos confidenciais.</p></div>

      {success && (
        <div className="request-success" role="status">
          <Check size={20} />
          <div><strong>{success.id} criada com sucesso</strong><span>A demanda já está disponível para acompanhamento.</span></div>
          <button type="button" onClick={onView}>Ver solicitação <ArrowRight size={15} /></button>
        </div>
      )}

      <form className="request-form" onSubmit={onSubmit}>
        <div className="form-grid">
          <label className="form-field form-field--wide"><span>Título da solicitação *</span><input name="title" required minLength="5" maxLength="120" placeholder="Ex.: Ajustar informações da proposta comercial" /></label>
          <label className="form-field"><span>Seu nome *</span><input name="requester" required minLength="2" maxLength="100" placeholder="Quem está solicitando" /></label>
          <label className="form-field"><span>Setor ou módulo *</span><input name="sector" required minLength="2" maxLength="80" list="sector-options" placeholder="Ex.: Comercial" /><datalist id="sector-options"><option value="Almoxarifado" /><option value="Aquisição" /><option value="Comercial" /><option value="Faturamento" /><option value="Financeiro" /><option value="Peritagem" /><option value="PCP" /><option value="Produção" /></datalist></label>
          <label className="form-field"><span>Prioridade sugerida *</span><select name="priority" required defaultValue="Média">{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="form-field"><span>Prazo desejado</span><input name="dueDate" type="date" /><small>Opcional. Pode ser definido ou alterado depois.</small></label>
          <label className="form-field form-field--full"><span>Descrição e contexto *</span><textarea name="description" required minLength="10" maxLength="2000" rows="5" placeholder="Explique onde acontece, como funciona hoje e o que precisa ser alterado." /></label>
          <label className="form-field form-field--full"><span>Impacto do problema *</span><textarea name="impact" required minLength="5" maxLength="1000" rows="3" placeholder="Explique o que essa situação dificulta ou impede na operação." /></label>
          <label className="form-field form-field--full"><span>Resultado esperado *</span><textarea name="expectedResult" required minLength="5" maxLength="1500" rows="3" placeholder="Descreva como deve ficar e, se houver, o que não deve ser alterado." /></label>
          <label className="form-field"><span>Referência</span><input name="reference" maxLength="500" placeholder="OS, RE, tela, cliente ou outro exemplo" /></label>
          <label className="form-field"><span>Link de anexo</span><input name="attachmentUrl" type="url" maxLength="1000" placeholder="https://drive.google.com/..." /><small>Opcional: cole um link acessível para print ou documento.</small></label>
          <label className="form-field form-field--code"><span>Código de acesso *</span><input name="code" type="password" inputMode="numeric" autoComplete="off" required minLength="4" maxLength="4" pattern="[0-9]{4}" placeholder="••••" /><small>O mesmo código usado para editar os estados.</small></label>
        </div>
        <label className="public-ack"><input type="checkbox" required /> Confirmo que revisei o pedido e que ele não contém informações confidenciais.</label>
        <div className="request-form__actions"><button className="button button--submit" type="submit" disabled={busy}>{busy ? 'Enviando…' : 'Adicionar solicitação'} <ArrowRight size={16} /></button></div>
      </form>
    </section>
  )
}

function App() {
  const [scope, setScope] = useState('current')
  const [query, setQuery] = useState('')
  const [sector, setSector] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [resolution, setResolution] = useState('')
  const [deadline, setDeadline] = useState('')
  const [savedTracking, setSavedTracking] = useState(loadTracking)
  const [remoteTracking, setRemoteTracking] = useState({})
  const [customRows, setCustomRows] = useState([])
  const [connectionState, setConnectionState] = useState(isSupabaseConfigured ? 'connecting' : 'local')
  const [accessCode, setAccessCode] = useState('')
  const [isEditorUnlocked, setIsEditorUnlocked] = useState(false)
  const [showCodePrompt, setShowCodePrompt] = useState(false)
  const [codeBusy, setCodeBusy] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [notice, setNotice] = useState('')
  const [requestBusy, setRequestBusy] = useState(false)
  const [requestSuccess, setRequestSuccess] = useState(null)

  const customTasks = useMemo(() => customRows.map(mapCustomTask), [customRows])
  const tasks = useMemo(
    () => mergeTaskTracking([...initialTasks, ...customTasks], remoteTracking, savedTracking, isSupabaseConfigured),
    [customTasks, remoteTracking, savedTracking],
  )
  const sectors = useMemo(() => [...new Set(tasks.filter((task) => task.scope === scope).map((task) => task.sector))], [tasks, scope])
  const visibleTasks = useMemo(
    () => sortTasks(filterTasks(tasks, { scope, query, sector, status, priority, resolution, deadline })),
    [tasks, scope, query, sector, status, priority, resolution, deadline],
  )
  const selectedTask = tasks.find((task) => task.id === selectedId)
  const currentTasks = tasks.filter((task) => task.scope === 'current')
  const currentTotal = currentTasks.length
  const activeTotal = currentTotal
  const topPriorityCount = currentTasks.filter((task) => ['Altíssima', 'Crítica'].includes(task.priority) && task.status !== 'Resolvida').length
  const pendingCount = currentTasks.filter((task) => task.status !== 'Resolvida').length
  const resolvedCount = currentTasks.filter((task) => task.status === 'Resolvida').length
  const overdueCount = currentTasks.filter((task) => getDeadlineInfo(task).tone === 'overdue').length
  const noDeadlineCount = currentTasks.filter((task) => !task.dueDate && task.status !== 'Resolvida').length

  useEffect(() => {
    if (!supabase) return undefined

    let active = true
    const load = async () => {
      const [statusesResult, requestsResult] = await Promise.all([
        supabase.from('task_statuses').select('task_id,status,priority,due_date,tracking_note'),
        supabase.from('custom_tasks').select('*').order('created_at', { ascending: false }),
      ])
      if (!active) return
      if (statusesResult.error || requestsResult.error) {
        setConnectionState('error')
        return
      }
      setRemoteTracking(trackingMap(statusesResult.data))
      setCustomRows(requestsResult.data || [])
      setConnectionState('connected')
    }
    load()

    const channel = supabase
      .channel('task-statuses-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_statuses' }, (payload) => {
        const row = payload.new
        if (row?.task_id && row?.status) {
          setRemoteTracking((current) => ({ ...current, ...trackingMap([row]) }))
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'custom_tasks' }, (payload) => {
        if (payload.new?.id) setCustomRows((current) => upsertCustomTask(current, payload.new))
      })
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [])

  function flash(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  async function updateTracking(id, changes) {
    const task = tasks.find((item) => item.id === id)
    if (!task) return
    const nextTracking = {
      status: changes.status ?? task.status,
      priority: changes.priority ?? task.priority,
      dueDate: Object.prototype.hasOwnProperty.call(changes, 'dueDate') ? changes.dueDate : (task.dueDate || null),
      trackingNote: Object.prototype.hasOwnProperty.call(changes, 'trackingNote') ? changes.trackingNote : (task.trackingNote || ''),
    }

    if (supabase) {
      if (!isEditorUnlocked || !accessCode) {
        setShowCodePrompt(true)
        flash('Informe o código de acesso para editar o acompanhamento.')
        return
      }
      const { error } = await supabase.rpc('update_task_tracking', {
        p_task_id: id,
        p_status: nextTracking.status,
        p_priority: nextTracking.priority,
        p_due_date: nextTracking.dueDate || null,
        p_tracking_note: nextTracking.trackingNote || null,
        p_code: accessCode,
      })
      if (error) {
        setIsEditorUnlocked(false)
        setAccessCode('')
        setShowCodePrompt(true)
        flash('Não foi possível salvar a alteração compartilhada.')
        return
      }
      setRemoteTracking((current) => ({ ...current, [id]: nextTracking }))
      flash('Acompanhamento atualizado ao vivo.')
      return
    }
    const next = { ...savedTracking, [id]: nextTracking }
    setSavedTracking(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    flash('Alteração salva neste dispositivo.')
  }

  function resetLocalTracking() {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(LEGACY_STORAGE_KEY)
    setSavedTracking({})
    flash('Acompanhamento inicial restaurado.')
  }

  async function unlockEditing(event) {
    event.preventDefault()
    if (!supabase || accessCode.length !== 4) return
    setCodeBusy(true)
    const { data, error } = await supabase.rpc('verify_status_code', { p_code: accessCode })
    setCodeBusy(false)
    if (error || data !== true) {
      setAccessCode('')
      flash('Código incorreto. Tente novamente.')
      return
    }
    setIsEditorUnlocked(true)
    setShowCodePrompt(false)
    flash('Edição liberada neste dispositivo.')
  }

  function lockEditing() {
    setAccessCode('')
    setIsEditorUnlocked(false)
    setShowCodePrompt(false)
    flash('Edição bloqueada neste dispositivo.')
  }

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(buildReportText(visibleTasks))
      flash('Relatório copiado para a área de transferência.')
    } catch {
      flash('Não foi possível copiar automaticamente.')
    }
  }

  function exportCsv() {
    const headers = ['ID', 'Título', 'Classificação', 'Descrição', 'Setor', 'Prioridade proposta', 'Estado', 'Prazo', 'Atualização ou solução', 'Origem', 'Evidência', 'Impacto', 'Próximo passo', 'Anexos']
    const rows = visibleTasks.map((task) => [task.id, task.title, 'Demanda atual', task.description, task.sector, task.priority, task.status, formatDueDate(task.dueDate), task.trackingNote || 'Não informada', task.origin, task.evidence, task.impact, task.nextStep, task.attachments?.map((attachment) => attachment.caption).join(' | ') || 'Nenhum'])
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';')).join('\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `solicitacoes-lizy-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
    flash('Arquivo CSV exportado.')
  }

  function clearFilters() {
    setQuery('')
    setSector('')
    setStatus('')
    setPriority('')
    setResolution('')
    setDeadline('')
  }

  function openRequestForm() {
    setScope('create')
    clearFilters()
    window.requestAnimationFrame(() => document.getElementById('solicitacoes')?.scrollIntoView({ behavior: 'smooth' }))
  }

  async function createRequest(event) {
    event.preventDefault()
    if (!supabase) {
      flash('O cadastro compartilhado não está disponível neste ambiente.')
      return
    }

    const form = event.currentTarget
    const values = new FormData(form)
    setRequestBusy(true)
    const { data, error } = await supabase.rpc('create_task_request', {
      p_title: values.get('title'),
      p_description: values.get('description'),
      p_sector: values.get('sector'),
      p_requester: values.get('requester'),
      p_priority: values.get('priority'),
      p_reference: values.get('reference'),
      p_impact: values.get('impact'),
      p_expected_result: values.get('expectedResult'),
      p_attachment_url: values.get('attachmentUrl'),
      p_code: values.get('code'),
    })
    setRequestBusy(false)

    if (error || !data?.id) {
      const codeField = form.elements.namedItem('code')
      if (codeField) codeField.value = ''
      flash(error?.code === '28000' ? 'Código incorreto. Revise e tente novamente.' : 'Não foi possível adicionar a solicitação.')
      return
    }

    const dueDate = values.get('dueDate') || null
    let dueDateSaved = true
    if (dueDate) {
      const { error: trackingError } = await supabase.rpc('update_task_tracking', {
        p_task_id: data.id,
        p_status: data.status,
        p_priority: data.priority,
        p_due_date: dueDate,
        p_tracking_note: null,
        p_code: values.get('code'),
      })
      if (!trackingError) {
        setRemoteTracking((current) => ({
          ...current,
          [data.id]: { status: data.status, priority: data.priority, dueDate, trackingNote: '' },
        }))
      } else {
        dueDateSaved = false
      }
    }

    setCustomRows((current) => upsertCustomTask(current, data))
    setRequestSuccess({ ...mapCustomTask(data), dueDate })
    form.reset()
    flash(dueDateSaved ? `${data.id} adicionada ao painel.` : `${data.id} criada, mas o prazo precisa ser salvo novamente.`)
  }

  function viewCreatedRequest() {
    if (!requestSuccess) return
    setScope('current')
    setSelectedId(requestSuccess.id)
  }

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Ir para o início">
          <span className="brand__mark"><span>EV</span></span>
          <span className="brand__copy"><strong>Elétrica Visão</strong><small>Implantação ERP Lizy</small></span>
        </a>
        <div className="topbar__meta">
          {isSupabaseConfigured && connectionState === 'connected' && <span className="live-indicator"><Radio size={15} /> Ao vivo</span>}
          <span><ShieldCheck size={15} /> Relatório técnico</span>
          <span className="topbar__date">Base atualizada em 22/09/2026</span>
          {isSupabaseConfigured && (isEditorUnlocked ? (
            <button className="session-button" onClick={lockEditing}><Lock size={14} /> Bloquear edição</button>
          ) : (
            <button className="session-button" onClick={() => setShowCodePrompt((visible) => !visible)}><KeyRound size={14} /> Liberar edição</button>
          ))}
        </div>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow eyebrow--light">Elétrica Visão × Lizy</span>
            <h1>Painel de solicitações da implantação</h1>
            <p>Visão consolidada das demandas atuais de Almoxarifado, Aquisição, Comercial, PCP e Peritagem.</p>
            <div className="hero__actions">
              <button className="button button--light" onClick={openRequestForm}><FilePlus2 size={18} /> Abrir solicitação</button>
              <button className="button button--ghost" onClick={() => window.print()}><Printer size={17} /> Imprimir relatório</button>
              <button className="button button--ghost" onClick={copyReport}><ClipboardCopy size={17} /> Copiar resumo</button>
              <button className="button button--ghost" onClick={exportCsv}><Download size={17} /> Exportar CSV</button>
            </div>
          </div>
          <div className="hero__signal" aria-label={`${activeTotal} demandas em acompanhamento`}>
            <div className="signal-ring"><strong>{activeTotal}</strong><span>demandas em<br />acompanhamento</span></div>
            <p><span></span> Base pronta para acompanhamento</p>
          </div>
        </section>

        <section className="content" aria-label="Painel de acompanhamento">
          <div className="notice-card">
            {isSupabaseConfigured ? <Radio size={19} /> : <AlertTriangle size={19} />}
            <p>{isSupabaseConfigured
              ? <><strong>Acompanhamento compartilhado:</strong> estados, prioridades e prazos são atualizados ao vivo. Para alterar, libere a edição com o código compartilhado.</>
              : <><strong>Critério de leitura:</strong> prioridades são uma classificação proposta pela Elétrica Visão. Alterações de estado feitas aqui ficam somente neste dispositivo; o link público sempre inicia com a base consolidada.</>
            }</p>
          </div>

          {showCodePrompt && isSupabaseConfigured && !isEditorUnlocked && (
            <form className="login-panel" onSubmit={unlockEditing}>
              <div><strong>Liberar edição do acompanhamento</strong><span>Digite o código compartilhado de quatro números.</span></div>
              <label><span className="sr-only">Código de acesso</span><input type="password" inputMode="numeric" autoComplete="off" required minLength="4" maxLength="4" pattern="[0-9]{4}" value={accessCode} onChange={(event) => setAccessCode(event.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="••••" /></label>
              <button type="submit" disabled={codeBusy || accessCode.length !== 4}>{codeBusy ? 'Verificando…' : 'Liberar edição'}</button>
            </form>
          )}

          <div className="summary-grid">
            <SummaryCard icon={PackageCheck} label="Demandas operacionais" value={currentTotal} detail={`${customRows.length} abertas pelo painel`} />
            <SummaryCard icon={FileClock} label="Ainda pendentes" value={pendingCount} detail="Aguardam resolução" tone="gold" />
            <SummaryCard icon={AlertTriangle} label="Prioridade máxima" value={topPriorityCount} detail="Altíssima ou crítica" tone="orange" />
            <SummaryCard icon={CalendarDays} label="Prazos vencidos" value={overdueCount} detail={`${noDeadlineCount} sem prazo definido`} tone="red" />
            <SummaryCard icon={CheckCircle2} label="Resolvidas" value={resolvedCount} detail={`de ${currentTotal} demandas atuais`} tone="green" />
          </div>

          <div className="workspace" id="solicitacoes">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Relatório vivo</span>
                <h2>{scope === 'create' ? 'Formulário de solicitação' : 'Solicitações e pendências'}</h2>
              </div>
              {scope !== 'create' && <span className="result-count">{visibleTasks.length} {visibleTasks.length === 1 ? 'item exibido' : 'itens exibidos'}</span>}
            </div>

            <div className="tabs" role="tablist" aria-label="Tipo de solicitação">
              <button role="tab" aria-selected={scope === 'current'} className={scope === 'current' ? 'active' : ''} onClick={() => { setScope('current'); setSector('') }}>
                <BarChart3 size={17} /> Demandas atuais <span>{currentTotal}</span>
              </button>
              <button role="tab" aria-selected={scope === 'history'} className={scope === 'history' ? 'active' : ''} onClick={() => { setScope('history'); setSector('') }}>
                <FileClock size={17} /> Histórico · requer revalidação <span>{HISTORY_TOTAL}</span>
              </button>
              <button role="tab" aria-selected={scope === 'create'} className={scope === 'create' ? 'active' : ''} onClick={openRequestForm}>
                <FilePlus2 size={17} /> Abrir solicitação
              </button>
            </div>

            {scope === 'history' && (
              <div className="history-banner"><FileClock size={18} /><p><strong>Histórico — requer revalidação.</strong> Estes registros não fazem parte das {currentTotal} demandas atuais e não comprovam o comportamento atual do sistema.</p></div>
            )}

            {scope === 'create' ? (
              <RequestForm busy={requestBusy} onSubmit={createRequest} success={requestSuccess} onView={viewCreatedRequest} />
            ) : <>
            <div className="reading-guide" aria-label="Legenda de prioridade e situação">
              <strong>Leitura rápida</strong>
              <span className="reading-guide__priorities">{PRIORITIES.map((item) => <Badge key={item} type={priorityType(item)}>{item}</Badge>)}</span>
              <span className="reading-guide__status"><CheckCircle2 size={15} /> Verde indica item resolvido; os demais continuam pendentes.</span>
            </div>
            <div className="resolution-switch" aria-label="Filtrar por resolução">
              <button className={resolution === '' ? 'active' : ''} onClick={() => setResolution('')}>Todos <span>{scope === 'current' ? currentTotal : tasks.filter((task) => task.scope === scope).length}</span></button>
              <button className={resolution === 'pending' ? 'active pending' : 'pending'} onClick={() => setResolution('pending')}>Pendentes <span>{tasks.filter((task) => task.scope === scope && task.status !== 'Resolvida').length}</span></button>
              <button className={resolution === 'resolved' ? 'active resolved' : 'resolved'} onClick={() => setResolution('resolved')}>Resolvidos <span>{tasks.filter((task) => task.scope === scope && task.status === 'Resolvida').length}</span></button>
            </div>
            <div className="filters">
              <label className="search-box">
                <span className="sr-only">Pesquisar</span><Search size={18} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar por texto, OS, RE, CNPJ, código ou identificador..." />
                {query && <button onClick={() => setQuery('')} aria-label="Limpar pesquisa"><X size={16} /></button>}
              </label>
              <label className="select-wrap"><span className="sr-only">Filtrar setor</span><select value={sector} onChange={(event) => setSector(event.target.value)}><option value="">Todos os setores</option>{sectors.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></label>
              <label className="select-wrap"><span className="sr-only">Filtrar estado</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos os estados</option>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></label>
              <label className="select-wrap"><span className="sr-only">Filtrar prioridade</span><select value={priority} onChange={(event) => setPriority(event.target.value)}><option value="">Todas as prioridades</option>{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></label>
              <label className="select-wrap"><span className="sr-only">Filtrar prazo</span><select value={deadline} onChange={(event) => setDeadline(event.target.value)}><option value="">Todos os prazos</option><option value="overdue">Atrasados</option><option value="soon">Vencem em até 7 dias</option><option value="scheduled">Prazo definido</option><option value="none">Sem prazo</option></select><ChevronDown size={16} /></label>
              {(query || sector || status || priority || resolution || deadline) && <button className="clear-button" onClick={clearFilters}><RotateCcw size={15} /> Limpar</button>}
            </div>

            <div className="task-table" role="table" aria-label="Solicitações filtradas">
              <div className="task-table__head" role="row">
                <span role="columnheader">Solicitação</span><span role="columnheader">Setor</span><span role="columnheader">Prioridade</span><span role="columnheader">Prazo</span><span role="columnheader">Estado</span><span role="columnheader">Detalhes</span>
              </div>
              {visibleTasks.length ? visibleTasks.map((task) => (
                <article className={`task-row task-row--${statusType(task.status)} task-row--${priorityType(task.priority)}`} role="row" key={task.id}>
                  <div className="task-main" role="cell">
                    <div className="task-flags"><span className="task-id">{task.id}</span><Badge type={statusType(task.status)}>{task.status === 'Resolvida' ? 'Resolvida' : 'Pendente'}</Badge></div>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p className={`task-update${task.trackingNote ? '' : ' task-update--empty'}`}><MessagesSquare size={13} /> <strong>{task.status === 'Resolvida' ? 'Solução:' : 'Atualização:'}</strong> {task.trackingNote || 'ainda não registrada'}</p>
                    <small><ExternalLink size={13} /> {task.evidence}</small>
                  </div>
                  <div role="cell"><Badge type="sector">{task.sector}</Badge></div>
                  <div role="cell"><Badge type={priorityType(task.priority)}>{task.priority}</Badge></div>
                  <div role="cell"><DeadlineBadge task={task} /></div>
                  <div role="cell">
                    <label className={`select-wrap select-wrap--status status-control status-control--${statusType(task.status)}`}><span className="sr-only">Estado de {task.id}</span><select disabled={isSupabaseConfigured && !isEditorUnlocked} value={task.status} onChange={(event) => updateTracking(task.id, { status: event.target.value })}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></label>
                  </div>
                  <div role="cell"><button className="detail-button" onClick={() => setSelectedId(task.id)}>Ver item <ArrowRight size={15} /></button></div>
                </article>
              )) : (
                <div className="empty-state"><Filter size={24} /><h3>Nenhum item encontrado</h3><p>Ajuste os filtros ou limpe a pesquisa para visualizar outras solicitações.</p><button onClick={clearFilters}>Limpar filtros</button></div>
              )}
            </div>

            <footer className="workspace__footer">
              {isSupabaseConfigured ? <p><strong>Atualização em tempo real:</strong> visitantes veem estado, prioridade, prazo e registro do acompanhamento; a alteração exige o código de acesso.</p> : <p><strong>Persistência local:</strong> as alterações de acompanhamento não são compartilhadas com outros usuários.</p>}
              {!isSupabaseConfigured && <button onClick={resetLocalTracking}><RotateCcw size={14} /> Restaurar acompanhamento inicial</button>}
            </footer>
            </>}
          </div>

          <section className="source-strip" aria-label="Origem dos dados">
            <div><Warehouse size={20} /><span><strong>8 itens</strong>Almoxarifado</span></div>
            <div><ShoppingCart size={20} /><span><strong>5 itens</strong>Aquisição</span></div>
            <div><BarChart3 size={20} /><span><strong>8 itens</strong>Comercial</span></div>
            <div><MessagesSquare size={20} /><span><strong>9 itens</strong>PCP / Peritagem</span></div>
            <div><FilePlus2 size={20} /><span><strong>{customRows.length} itens</strong>Abertos pelo painel</span></div>
            <div><FileClock size={20} /><span><strong>{HISTORY_TOTAL} registros</strong>Histórico a revalidar</span></div>
            <p>Última consolidação<br /><strong>22 de setembro de 2026</strong></p>
          </section>
        </section>

        <section className="print-report" aria-hidden="true">
          <header><h1>Elétrica Visão × Lizy</h1><p>Relatório de solicitações · base de 22/09/2026</p></header>
          {visibleTasks.map((task) => <article key={task.id}><h2>{task.id} · {task.title}</h2><p><strong>{task.sector} · prioridade proposta {task.priority} · {task.status} · prazo {formatDueDate(task.dueDate)}</strong></p><p>{task.description}</p><dl><dt>{task.status === 'Resolvida' ? 'Solução registrada' : 'Atualização da pendência'}</dt><dd>{task.trackingNote || 'Não informada'}</dd><dt>Origem</dt><dd>{task.origin}</dd><dt>Evidência/referência</dt><dd>{task.evidence}</dd><dt>Impacto</dt><dd>{task.impact}</dd><dt>Próximo passo sugerido</dt><dd>{task.nextStep}</dd>{task.attachments?.length > 0 && <><dt>Anexos</dt><dd>{task.attachments.map((attachment) => attachment.caption).join(' | ')}</dd></>}</dl></article>)}
        </section>
      </main>

      {notice && <div className="toast" role="status"><Check size={16} /> {notice}</div>}
      <DetailPanel key={selectedTask ? `${selectedTask.id}:${selectedTask.trackingNote || ''}` : 'empty'} task={selectedTask} canEdit={!isSupabaseConfigured || isEditorUnlocked} onClose={() => setSelectedId(null)} onTrackingChange={updateTracking} />
    </>
  )
}

export default App
