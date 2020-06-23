export const up = () =>
  global.pg.tx(async t => {
    await t.none(`
      CREATE TABLE sources(
        id text UNIQUE NOT NULL,
        created_at timestamp NOT NULL DEFAULT NOW(),
        type text NOT NULL CHECK (
          type = 'postgres'
        ),
        config json NOT NULL
      )
    `)
    await t.none(`
      CREATE TABLE queries(
        id text UNIQUE NOT NULL,
        created_at timestamp NOT NULL DEFAULT NOW(),
        source_id text NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
        config json NOT NULL
      )
    `)
  })

export const down = () =>
  global.pg.tx(async t => {
    await t.none(`
      DROP TABLE queries
    `)
    await t.none(`
      DROP TABLE sources
    `)
  })
