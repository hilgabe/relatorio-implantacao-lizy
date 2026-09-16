export function statusMap(rows = []) {
  return rows.reduce((result, row) => ({ ...result, [row.task_id]: row.status }), {})
}

export function trackingMap(rows = []) {
  return rows.reduce((result, row) => ({
    ...result,
    [row.task_id]: {
      status: row.status,
      priority: row.priority || null,
      dueDate: row.due_date || null,
      trackingNote: row.tracking_note || '',
    },
  }), {})
}

export function mergeTaskTracking(tasks, remoteTracking, localTracking, useRemote) {
  return tasks.map((task) => ({
    ...task,
    ...(() => {
      const override = useRemote ? remoteTracking[task.id] : localTracking[task.id]
      if (!override) return {}
      return {
        status: override.status || task.status,
        priority: override.priority || task.priority,
        dueDate: override.dueDate || null,
        trackingNote: override.trackingNote || '',
      }
    })(),
  }))
}

export function mergeTaskStatuses(tasks, remoteStatuses, localStatuses, useRemote) {
  const wrap = (statuses) => Object.fromEntries(
    Object.entries(statuses).map(([id, status]) => [id, { status }]),
  )
  return mergeTaskTracking(tasks, wrap(remoteStatuses), wrap(localStatuses), useRemote)
}
