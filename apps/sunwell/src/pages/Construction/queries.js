export const root = `
  query($path: String!) {
    page(path: $path) {
      id
      title
      route
      trail {
        id
        route
        title
      }
      layout {
        id
        positions
      }
      modules {
        id
        name
        type
        config
        actions {
          id
          type
          name
          config
          relations
          pages {
            id
            title
          }
          commands {
            id
            name
            stale {
              id
            }
          }
        }
        layouts {
          id
          positions
        }
      }
    }
    commands {
      id
      name
      stale {
        id
      }
    }
  }
`
