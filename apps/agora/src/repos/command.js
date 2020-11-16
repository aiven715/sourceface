export const byId = (commandId, pg) => pg.one(sql.byId, [commandId])
export const list = (search, limit, offset, pg) =>
  pg.manyOrNone(sql.list, [search || "", limit, offset])
export const staleByCommandIds = (commandIds, pg) =>
  pg.manyOrNone(sql.staleByCommandIds, [commandIds])
export const listByActionIds = (actionIds, pg) =>
  pg.manyOrNone(sql.listByActionIds, [actionIds])
export const listByIds = (commandIds, pg) =>
  pg.manyOrNone(sql.listByIds, [commandIds])

const sql = {
  byId: `
    SELECT * FROM commands
    WHERE id = $1
  `,
  list: `
    SELECT * FROM commands
    WHERE LOWER(name) LIKE LOWER('%$1:value%')
    LIMIT $2 OFFSET $3
  `,
  staleByCommandIds: `
    SELECT c.*, sc.command_id FROM commands AS c
    LEFT JOIN stale_commands AS sc ON (sc.stale_id = c.id) 
    WHERE sc.command_id IN ($1:csv)
  `,
  listByActionIds: `
    SELECT c.*, ac.action_id FROM commands AS c
    LEFT JOIN actions_commands AS ac ON (ac.command_id = c.id)
    WHERE ac.action_id IN ($1:csv)
  `,
  listByIds: `
    SELECT * FROM commands WHERE id IN ($1:csv)
  `,
}
