export const root = `
  query {
    modules {
      id
      type
      config
      position {
        x
        y
        w
        h
      }
    }
    commands {
      id
    }
  }
`

export const addModule = `
  mutation ($type: ModuleType!, $config: JSONObject!, $position: ModulePositionInput!) {
    addModule(type: $type, config: $config, position: $position) {
      id
      type
      config
      position {
        x
        y
        w
        h
      }
    }
  }
`

export const updateModule = `
  mutation ($moduleId: Int!, $key: String!, $value: JSON!) {
    updateModule(moduleId: $moduleId, key: $key, value: $value) {
      id
      config
    }
  }
`

export const updateModulesPositions = `
  mutation ($positions: [SpecificModulePositionInput!]!) {
    updateModulesPositions(positions: $positions) {
      id
      position {
        x
        y
        w
        h
      }
    }
  }
`
