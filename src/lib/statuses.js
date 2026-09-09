export function statusMap(rows = []) {
  return rows.reduce((result, row) => ({ ...result, [row.task_id]: row.status }), {})
}

export function mergeTaskStatuses(tasks, remoteStatuses, localStatuses, useRemote) {
  return tasks.map((task) => ({
    ...task,
    status: useRemote
      ? (remoteStatuses[task.id] || task.status)
      : (localStatuses[task.id] || task.status),
  }))
}
