import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  ClipboardCopy,
  Download,
  ExternalLink,
  FileClock,
  Filter,
  KeyRound,
  Lock,
  PackageCheck,
  Printer,
  Radio,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Warehouse,
  X,
} from 'lucide-react'
import { CURRENT_TOTAL, PRIORITIES, STATUSES, tasks as initialTasks } from './data/tasks'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import { mergeTaskStatuses, statusMap } from './lib/statuses'
import { buildReportText, filterTasks } from './utils/tasks'

const STORAGE_KEY = 'eletrica-visao-lizy-status-v1'

function loadStatuses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
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

function DetailPanel({ task, canEdit, onClose, onStatusChange }) {
  if (!task) return null
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
            <Badge type={`priority-${task.priority.toLowerCase().replace('í', 'i')}`}>{task.priority}</Badge>
            <Badge type="sector">{task.sector}</Badge>
          </div>
          <h2 id="detail-title">{task.title}</h2>
          <p className="detail-description">{task.description}</p>

          <label className="field-label" htmlFor="drawer-status">Estado compartilhado</label>
          <div className="select-wrap drawer-status">
            <select id="drawer-status" disabled={!canEdit} value={task.status} onChange={(event) => onStatusChange(task.id, event.target.value)}>
              {STATUSES.map((status) => <option key={status}>{status}</option>)}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </div>

          <dl className="detail-list">
            <div><dt>Origem</dt><dd>{task.origin}</dd></div>
            <div><dt>Evidência / referência</dt><dd>{task.evidence}</dd></div>
            <div><dt>Impacto</dt><dd>{task.impact}</dd></div>
            <div className="detail-list__next"><dt>Próximo passo sugerido</dt><dd>{task.nextStep}</dd></div>
          </dl>
          {task.scope === 'history' && (
            <div className="warning-box"><AlertTriangle size={18} /><p>Item histórico. Requer revalidação antes de ser tratado como comportamento atual do Lizy.</p></div>
          )}
        </div>
      </aside>
    </div>
  )
}

function App() {
  const [scope, setScope] = useState('current')
  const [query, setQuery] = useState('')
  const [sector, setSector] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [savedStatuses, setSavedStatuses] = useState(loadStatuses)
  const [remoteStatuses, setRemoteStatuses] = useState({})
  const [connectionState, setConnectionState] = useState(isSupabaseConfigured ? 'connecting' : 'local')
  const [accessCode, setAccessCode] = useState('')
  const [isEditorUnlocked, setIsEditorUnlocked] = useState(false)
  const [showCodePrompt, setShowCodePrompt] = useState(false)
  const [codeBusy, setCodeBusy] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [notice, setNotice] = useState('')

  const tasks = useMemo(
    () => mergeTaskStatuses(initialTasks, remoteStatuses, savedStatuses, isSupabaseConfigured),
    [remoteStatuses, savedStatuses],
  )
  const sectors = useMemo(() => [...new Set(tasks.filter((task) => task.scope === scope).map((task) => task.sector))], [tasks, scope])
  const visibleTasks = useMemo(
    () => filterTasks(tasks, { scope, query, sector, status, priority }),
    [tasks, scope, query, sector, status, priority],
  )
  const selectedTask = tasks.find((task) => task.id === selectedId)
  const currentTasks = tasks.filter((task) => task.scope === 'current')
  const criticalCount = currentTasks.filter((task) => task.priority === 'Crítica').length
  const awaitingCount = currentTasks.filter((task) => task.status === 'Aguardando Lizy').length
  const resolvedCount = currentTasks.filter((task) => task.status === 'Resolvida').length

  useEffect(() => {
    if (!supabase) return undefined

    let active = true
    const load = async () => {
      const { data, error } = await supabase.from('task_statuses').select('task_id,status')
      if (!active) return
      if (error) {
        setConnectionState('error')
        return
      }
      setRemoteStatuses(statusMap(data))
      setConnectionState('connected')
    }
    load()

    const channel = supabase
      .channel('task-statuses-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_statuses' }, (payload) => {
        const row = payload.new
        if (row?.task_id && row?.status) {
          setRemoteStatuses((current) => ({ ...current, [row.task_id]: row.status }))
        }
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

  async function updateStatus(id, value) {
    if (supabase) {
      if (!isEditorUnlocked || !accessCode) {
        setShowCodePrompt(true)
        flash('Informe o código de acesso para alterar os estados.')
        return
      }
      const { error } = await supabase.rpc('update_task_status', {
        p_task_id: id,
        p_status: value,
        p_code: accessCode,
      })
      if (error) {
        setIsEditorUnlocked(false)
        setAccessCode('')
        setShowCodePrompt(true)
        flash('Não foi possível salvar o estado compartilhado.')
        return
      }
      setRemoteStatuses((current) => ({ ...current, [id]: value }))
      flash('Estado compartilhado e atualizado ao vivo.')
      return
    }
    const next = { ...savedStatuses, [id]: value }
    setSavedStatuses(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    flash('Estado salvo neste dispositivo.')
  }

  function resetLocalStatuses() {
    localStorage.removeItem(STORAGE_KEY)
    setSavedStatuses({})
    flash('Estados iniciais restaurados.')
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
    const headers = ['ID', 'Título', 'Descrição', 'Setor', 'Prioridade proposta', 'Estado', 'Origem', 'Evidência', 'Impacto', 'Próximo passo']
    const rows = visibleTasks.map((task) => [task.id, task.title, task.description, task.sector, task.priority, task.status, task.origin, task.evidence, task.impact, task.nextStep])
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
          <span className="topbar__date">Base confirmada em 25/08/2026</span>
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
            <p>Visão consolidada das pendências enviadas pelo Almoxarifado e pela Aquisição, com histórico técnico separado para revalidação.</p>
            <div className="hero__actions">
              <button className="button button--light" onClick={() => window.print()}><Printer size={17} /> Imprimir relatório</button>
              <button className="button button--ghost" onClick={copyReport}><ClipboardCopy size={17} /> Copiar resumo</button>
              <button className="button button--ghost" onClick={exportCsv}><Download size={17} /> Exportar CSV</button>
            </div>
          </div>
          <div className="hero__signal" aria-label={`${CURRENT_TOTAL} demandas atuais`}>
            <div className="signal-ring"><strong>{CURRENT_TOTAL}</strong><span>demandas<br />atuais</span></div>
            <p><span></span> Base pronta para acompanhamento</p>
          </div>
        </section>

        <section className="content" aria-label="Painel de acompanhamento">
          <div className="notice-card">
            {isSupabaseConfigured ? <Radio size={19} /> : <AlertTriangle size={19} />}
            <p>{isSupabaseConfigured
              ? <><strong>Status compartilhado:</strong> a visualização é atualizada ao vivo. Para alterar, libere a edição com o código compartilhado.</>
              : <><strong>Critério de leitura:</strong> prioridades são uma classificação proposta pela Elétrica Visão. Alterações de estado feitas aqui ficam somente neste dispositivo; o link público sempre inicia com a base consolidada.</>
            }</p>
          </div>

          {showCodePrompt && isSupabaseConfigured && !isEditorUnlocked && (
            <form className="login-panel" onSubmit={unlockEditing}>
              <div><strong>Liberar alteração de estados</strong><span>Digite o código compartilhado de quatro números.</span></div>
              <label><span className="sr-only">Código de acesso</span><input type="password" inputMode="numeric" autoComplete="off" required minLength="4" maxLength="4" pattern="[0-9]{4}" value={accessCode} onChange={(event) => setAccessCode(event.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="••••" /></label>
              <button type="submit" disabled={codeBusy || accessCode.length !== 4}>{codeBusy ? 'Verificando…' : 'Liberar edição'}</button>
            </form>
          )}

          <div className="summary-grid">
            <SummaryCard icon={PackageCheck} label="Demandas atuais" value={CURRENT_TOTAL} detail="8 Almoxarifado · 5 Aquisição" />
            <SummaryCard icon={AlertTriangle} label="Prioridade crítica" value={criticalCount} detail="Classificação proposta" tone="orange" />
            <SummaryCard icon={FileClock} label="Aguardando Lizy" value={awaitingCount} detail={isSupabaseConfigured ? 'Estado compartilhado' : 'Estado local atual'} tone="gold" />
            <SummaryCard icon={Check} label="Resolvidas" value={resolvedCount} detail={`de ${CURRENT_TOTAL} demandas atuais`} tone="green" />
          </div>

          <div className="workspace">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Relatório vivo</span>
                <h2>Solicitações e pendências</h2>
              </div>
              <span className="result-count">{visibleTasks.length} {visibleTasks.length === 1 ? 'item exibido' : 'itens exibidos'}</span>
            </div>

            <div className="tabs" role="tablist" aria-label="Tipo de solicitação">
              <button role="tab" aria-selected={scope === 'current'} className={scope === 'current' ? 'active' : ''} onClick={() => { setScope('current'); setSector('') }}>
                <BarChart3 size={17} /> Demandas atuais <span>{CURRENT_TOTAL}</span>
              </button>
              <button role="tab" aria-selected={scope === 'history'} className={scope === 'history' ? 'active' : ''} onClick={() => { setScope('history'); setSector('') }}>
                <FileClock size={17} /> Histórico · requer revalidação <span>3</span>
              </button>
            </div>

            {scope === 'history' && (
              <div className="history-banner"><FileClock size={18} /><p><strong>Histórico — requer revalidação.</strong> Estes registros não fazem parte das 13 demandas atuais e não comprovam o comportamento atual do sistema.</p></div>
            )}

            <div className="filters">
              <label className="search-box">
                <span className="sr-only">Pesquisar</span><Search size={18} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar por texto, OS, RE ou identificador..." />
                {query && <button onClick={() => setQuery('')} aria-label="Limpar pesquisa"><X size={16} /></button>}
              </label>
              <label className="select-wrap"><span className="sr-only">Filtrar setor</span><select value={sector} onChange={(event) => setSector(event.target.value)}><option value="">Todos os setores</option>{sectors.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></label>
              <label className="select-wrap"><span className="sr-only">Filtrar estado</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos os estados</option>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></label>
              <label className="select-wrap"><span className="sr-only">Filtrar prioridade</span><select value={priority} onChange={(event) => setPriority(event.target.value)}><option value="">Todas as prioridades</option>{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></label>
              {(query || sector || status || priority) && <button className="clear-button" onClick={clearFilters}><RotateCcw size={15} /> Limpar</button>}
            </div>

            <div className="task-table" role="table" aria-label="Solicitações filtradas">
              <div className="task-table__head" role="row">
                <span role="columnheader">Solicitação</span><span role="columnheader">Setor</span><span role="columnheader">Prioridade</span><span role="columnheader">Estado</span><span role="columnheader">Detalhes</span>
              </div>
              {visibleTasks.length ? visibleTasks.map((task) => (
                <article className="task-row" role="row" key={task.id}>
                  <div className="task-main" role="cell">
                    <span className="task-id">{task.id}</span>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <small><ExternalLink size={13} /> {task.evidence}</small>
                  </div>
                  <div role="cell"><Badge type="sector">{task.sector}</Badge></div>
                  <div role="cell"><Badge type={`priority-${task.priority.toLowerCase().replace('í', 'i')}`}>{task.priority}</Badge></div>
                  <div role="cell">
                    <label className="select-wrap select-wrap--status"><span className="sr-only">Estado de {task.id}</span><select disabled={isSupabaseConfigured && !isEditorUnlocked} value={task.status} onChange={(event) => updateStatus(task.id, event.target.value)}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></label>
                  </div>
                  <div role="cell"><button className="detail-button" onClick={() => setSelectedId(task.id)}>Ver item <ArrowRight size={15} /></button></div>
                </article>
              )) : (
                <div className="empty-state"><Filter size={24} /><h3>Nenhum item encontrado</h3><p>Ajuste os filtros ou limpe a pesquisa para visualizar outras solicitações.</p><button onClick={clearFilters}>Limpar filtros</button></div>
              )}
            </div>

            <footer className="workspace__footer">
              {isSupabaseConfigured ? <p><strong>Atualização em tempo real:</strong> visitantes veem os estados compartilhados; a alteração exige o código de acesso.</p> : <p><strong>Persistência local:</strong> os estados alterados não são compartilhados com outros usuários.</p>}
              {!isSupabaseConfigured && <button onClick={resetLocalStatuses}><RotateCcw size={14} /> Restaurar estados iniciais</button>}
            </footer>
          </div>

          <section className="source-strip" aria-label="Origem dos dados">
            <div><Warehouse size={20} /><span><strong>8 itens</strong>Almoxarifado</span></div>
            <div><ShoppingCart size={20} /><span><strong>5 itens</strong>Aquisição</span></div>
            <div><FileClock size={20} /><span><strong>3 registros</strong>Histórico a revalidar</span></div>
            <p>Última consolidação<br /><strong>25 de agosto de 2026</strong></p>
          </section>
        </section>

        <section className="print-report" aria-hidden="true">
          <header><h1>Elétrica Visão × Lizy</h1><p>Relatório de solicitações · base de 25/08/2026</p></header>
          {visibleTasks.map((task) => <article key={task.id}><h2>{task.id} · {task.title}</h2><p><strong>{task.sector} · prioridade proposta {task.priority} · {task.status}</strong></p><p>{task.description}</p><dl><dt>Origem</dt><dd>{task.origin}</dd><dt>Evidência/referência</dt><dd>{task.evidence}</dd><dt>Impacto</dt><dd>{task.impact}</dd><dt>Próximo passo sugerido</dt><dd>{task.nextStep}</dd></dl></article>)}
        </section>
      </main>

      {notice && <div className="toast" role="status"><Check size={16} /> {notice}</div>}
      <DetailPanel task={selectedTask} canEdit={!isSupabaseConfigured || isEditorUnlocked} onClose={() => setSelectedId(null)} onStatusChange={updateStatus} />
    </>
  )
}

export default App
