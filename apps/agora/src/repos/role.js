import * as sql from "postgres/sql"

export const create = (name, isPrivileged, pg) =>
  pg.one(sql.roles.create, [name, isPrivileged])

export const list = (ids, pg) => pg.manyOrNone(sql.roles.list, [ids])

export const byUserId = async (userId, pg) =>
  await pg.one(sql.roles.byUserId, [userId])
