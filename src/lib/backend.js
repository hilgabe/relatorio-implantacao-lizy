import { initializeApp } from 'firebase/app'
import {
  collection, doc, getFirestore, onSnapshot, runTransaction, serverTimestamp, setDoc,
} from 'firebase/firestore'
import { requestRow, sortRequestsNewestFirst, trackingRow } from './rows'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isBackendConfigured = Boolean(config.apiKey && config.projectId && config.appId)

const app = isBackendConfigured ? initializeApp(config) : null
const db = app ? getFirestore(app) : null

// Leitura ao vivo: cada snapshot traz a coleção inteira (poucas dezenas de documentos).
export function subscribeToData({ onTracking, onRequests, onReady, onError }) {
  const ready = { tracking: false, requests: false }
  const markReady = (key) => {
    ready[key] = true
    if (ready.tracking && ready.requests) onReady()
  }

  const stopTracking = onSnapshot(collection(db, 'task_statuses'), (snapshot) => {
    onTracking(snapshot.docs.map((docSnap) => trackingRow(docSnap.id, docSnap.data())))
    markReady('tracking')
  }, onError)

  const stopRequests = onSnapshot(collection(db, 'custom_tasks'), (snapshot) => {
    onRequests(sortRequestsNewestFirst(snapshot.docs.map((docSnap) => requestRow(docSnap.id, docSnap.data()))))
    markReady('requests')
  }, onError)

  return () => {
    stopTracking()
    stopRequests()
  }
}

// Painel sem autenticação: qualquer visitante pode gravar. O formato dos
// dados ainda é validado — pelas regras do Firestore (fonte da verdade) e,
// para uma mensagem de erro melhor antes de gastar uma viagem de rede, aqui.
const text = (value) => String(value ?? '').trim()
const orNull = (value) => text(value) || null

export async function saveTracking({ taskId, status, priority, dueDate, trackingNote }) {
  try {
    await setDoc(doc(db, 'task_statuses', taskId), {
      status,
      priority: priority ?? null,
      due_date: dueDate || null,
      tracking_note: orNull(trackingNote),
      updated_at: serverTimestamp(),
    })
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export async function createRequest(input) {
  const fields = {
    title: text(input.title),
    description: text(input.description),
    sector: text(input.sector),
    requester: text(input.requester),
    owner: 'A definir',
    priority: input.priority,
    reference: orNull(input.reference),
    impact: text(input.impact),
    expected_result: text(input.expectedResult),
    attachment_url: orNull(input.attachmentUrl),
  }

  try {
    const id = await runTransaction(db, async (tx) => {
      const counterRef = doc(db, '_meta', 'custom_task_counter')
      const counterSnap = await tx.get(counterRef)
      const next = (counterSnap.exists() ? counterSnap.data().value : 0) + 1
      const nextId = `SOL-${String(next).padStart(4, '0')}`

      tx.set(counterRef, { value: next })
      tx.set(doc(db, 'custom_tasks', nextId), { ...fields, status: 'Nova', created_at: serverTimestamp() })
      return nextId
    })
    return { data: { id, ...fields, status: 'Nova', created_at: new Date().toISOString() }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
