import { parse } from "graphql"
import { values } from "ramda"

export default (result, { moduleId }, cache) => {
  const module = cache.readFragment(moduleFragment, { id: moduleId })
  const { relations } = result.createAction

  const pages = values(relations.pages).map((pageId) =>
    cache.readFragment(pageFragment, { id: pageId })
  )
  const commands = values(relations.commands).map((commandId) =>
    cache.readFragment(commandFragment, { id: commandId })
  )

  cache.writeFragment(moduleFragment, {
    ...module,
    actions: [
      ...module.actions,
      {
        ...result.createAction,
        pages,
        commands,
      },
    ],
  })
}

const moduleFragment = parse(`
  fragment _ on Module {
    id
    actions {
      id
      pages {
        id
      }
      commands {
        id
        stale {
          id
        }
      }
    }
  }
`)

const pageFragment = parse(`
  fragment _ on Page {
    id
    title
  }
`)

const commandFragment = parse(`
  fragment _ on Command {
    id
    name
    stale {
      id
    }
  }
`)
