import { sort } from "ramda"
import { asCsvValues } from "../postgres"
import { getField, getIndex } from "../utils/reference"

export const oneByPath = async (path, pg) =>
  matchPage(await pg.many(sql.manyByPath, [createRegExp(path)]))
export const trailByPageIds = (pageIds, pg) =>
  pg.manyOrNone(sql.trailByPageIds, [pageIds])
export const listByActionIds = (actionIds, pg) =>
  pg.manyOrNone(sql.listByActionIds, [actionIds])
export const listByReferenceIds = (refIds, pg) =>
  pg.manyOrNone(sql.listByReferenceIds, [asCsvValues(refIds)])
export const listByIds = (pageIds, pg) =>
  pg.manyOrNone(sql.listByIds, [pageIds])
export const list = (query, limit, offset, pg) =>
  pg.manyOrNone(sql.list, [query || "", limit, offset])

const sql = {
  manyByPath: `
    SELECT * FROM pages WHERE route ~ $1
  `,
  trailByPageIds: `
    SELECT t.*, p.id AS page_id FROM pages AS t
    LEFT JOIN pages AS p ON (p.route LIKE t.route || '%' AND t.id != p.id)
    WHERE p.id IN ($1:csv)
    ORDER BY length(regexp_replace(t.route, '(\/:?[a-z]+)', '.', 'g'));
    ;
  `,
  listByActionIds: `
    SELECT p.*, ap.action_id FROM pages AS p
    LEFT JOIN actions_pages AS ap ON (ap.page_id = p.id)
    WHERE ap.action_id IN ($1:csv)
  `,
  listByReferenceIds: `
    SELECT p.*, r.action_id, ${getField("r.field")} AS field
    FROM "references" AS r
    INNER JOIN pages AS p ON (p.id = r.page_id)
    WHERE (r.action_id, ${getField("r.field")}) IN ($1:raw)
    ORDER BY ${getIndex("r.field")} ASC
  `,
  listByIds: `
    SELECT * FROM pages WHERE id IN ($1:csv)
  `,
  list: `
    SELECT * FROM pages WHERE LOWER(title) LIKE LOWER('%$1:value%')
    LIMIT $2 OFFSET $3
  `,
}

// TODO: move to utils

/**
 * Transforming path to a regular expression used for finding matched page.
 */
const createRegExp = (path, creator) => {
  const pattern = split(path)
    .map((x) => `\\/(${x}|:[A-Za-z]+)`)
    .join("")

  return `^${pattern}$`
}

/**
 * Finds best matching page if multiple pages were returned.
 */
const matchPage = (pages) => sort(compare, pages)[0]

/**
 * Compares two pages. The one having param at greater index is having lower precedence.
 */
const compare = (left, right, shift = 0) => {
  const leftIndex = paramIndex(left, shift)
  const rightIndex = paramIndex(right, shift)

  if (leftIndex === -1 && rightIndex === -1) return 0
  if (leftIndex === -1) return -1
  if (rightIndex === -1) return 1

  if (leftIndex !== rightIndex) {
    return rightIndex - leftIndex
  }

  return compare(left, right, shift + 1)
}

/**
 * Finds earliest parameter index of the page
 */
const paramIndex = (page, shift) => {
  return (
    split(page.route)
      .slice(shift)
      .reduce(
        (result, item, i) => result || (item[0] !== ":" ? result : i),
        null
      ) ?? -1
  )
}

/**
 * Splits slash separated path or route string to a list.
 */
const split = (route) => route.split("/").filter(Boolean)
