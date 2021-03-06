import * as sourceRepo from "repos/source"
import * as postgres from "./postgres"

const drivers = { postgres }

export default async pg => {
  const sources = await sourceRepo.all(pg)

  let connections = sources.reduce(
    (acc, source) => ({
      ...acc,
      [source.id]: makeConnection(source),
    }),
    {}
  )

  connections.add = source => {
    connections[source.id] = makeConnection(source)
  }

  return connections
}

const makeConnection = source => {
  const { createState, execute } = drivers[source.type]
  const state = createState && createState(source.config)

  return {
    execute: (config, args) => execute(config, args, state),
  }
}
