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
        positions {
          id
          x
          y
          w
          h
        }
      }
      modules {
        id
        type
        config
        positionId
        layouts {
          id
          positions {
            id
            x
            y
            w
            h
          }
        }
      }
    }
    commands {
      id
    }
  }
`
