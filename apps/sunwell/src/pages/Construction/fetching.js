import { useQuery } from "urql"
import { keys } from "ramda"
import { useContext } from "react"
import * as engine from "packages/engine"
import { context } from "./"

export function Value({ expression, expressions, constants, children }) {
  const [data, { fetching }] = useExpressionsQuery(
    expression || expressions,
    constants
  )

  if (!data) {
    return "Initial loading..."
  }

  return children({ data, fetching })
}

export function Template({ value, constants, children }) {
  const expressions = engine.parseTemplate(value)

  // TODO: fix, component should return the same amount of hooks on every render
  if (!expressions.length) return !children ? value : children({ data: value })

  const [data, { fetching }] = useExpressionsQuery(expressions, constants)

  if (!data) {
    return "Initial loading..."
  }

  const replaced = engine.replaceTemplate(value, i => data[i])

  return !children ? replaced || null : children({ data: replaced, fetching })
}

// export function Effect({ expression }) {}

const useExpressionsQuery = (input, constants) => {
  const { commands } = useContext(context)
  const requests = evaluateMany(input, createScope(commands, constants))

  const [result] = useQuery({
    query: createQuery(requests),
  })

  return [
    result.data && transformResponse(result.data),
    { fetching: result.fetching },
  ]
}

const createScope = (commands, constants) => ({
  funcs: {
    commands: commands.reduce(
      (acc, command) => ({ ...acc, [command.id]: args => [command.id, args] }),
      {}
    ),
  },
  constants,
})

const evaluateMany = (input, scope) =>
  input instanceof Array
    ? input.map(expression => engine.evaluate(expression, scope))
    : [engine.evaluate(input, scope)]

const createQuery = requests => {
  const body = requests.reduce(
    (acc, [commandId, args], i) =>
      acc +
      `res${i}: readCommand(commandId: "${commandId}"${
        args ? `, args: ${stringifyArgs(args)}` : ""
      })`,
    ""
  )

  return `
    query {
      ${body}
    }
  `
}

const stringifyArgs = args => JSON.stringify(args).replace(/"([^"]+)":/g, "$1:")

const transformResponse = data => {
  const result = []

  for (let key of keys(data)) {
    const regex = /^res/
    if (!regex.test(key)) continue

    const i = key.replace(regex, "")
    result[i] = data[key]
  }

  return result
}
