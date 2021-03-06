import React from "react"
import { useParams } from "hooks/index"
import {
  useStore,
  useEditor,
  useAction,
  useConfiguration,
  useContainer,
  renderVariable,
  identifyVariable,
  defineVariable,
  createDefinitions,
} from "packages/factory"
import Static from "../Static"

// TODO: remove icons, have only colors for variable types/literals. Display icons in dropdown instead.
export default function Value({
  value,
  multiple,
  removable = true,
  literalAllowed = true,
  creationTitle = "Add value",
  ...props
}) {
  const { modules, actions } = useEditor()

  const editionTitle =
    value?.type === "literal"
      ? value.data
      : multiple
      ? multipleSnippet(value, modules, actions)
      : value && renderVariable(value, { modules, actions })
  const snippetColor = value?.type === "literal" ? "beige" : value && "blue"

  return (
    <Static
      {...props}
      removable={removable}
      multiple={multiple}
      creationTitle={creationTitle}
      editionTitle={editionTitle}
      value={
        value &&
        (multiple ? value.map(identifyVariable) : identifyVariable(value))
      }
      snippetColor={snippetColor}
      custom={literalAllowed}
    >
      <Value.Autocomplete />
    </Static>
  )
}

Value.Autocomplete = function ValueAutocomplete({
  onChange,
  multiple,
  ...props
}) {
  const { selectors, modules, actions } = useEditor()
  const { stock } = useContainer()
  const { module } = useConfiguration()
  const { scope } = useStore()
  const { action } = useAction()
  const params = useParams()

  const definitions = createDefinitions(
    stock,
    module,
    action,
    scope,
    selectors.modules(),
    selectors.actions(module.id, action.field),
    params
  )

  const map = (definition) => ({
    value: identifyVariable(definition),
    title: renderVariable(definition, { modules, actions }),
    definition,
  })

  /**
   * Not displaying self "mount" variable when defining the mount itself
   */
  const filter = ({ definition }) =>
    definition.type !== "mount" || definition.moduleId !== module.id

  const change = (value) => {
    onChange(
      value && (multiple ? value.map(defineVariable) : defineVariable(value))
    )
  }

  return (
    <Static.Autocomplete
      {...props}
      items={definitions}
      multiple={multiple}
      filter={filter}
      map={map}
      customSuggestion={(input) => `Use "${input}" as literal`}
      onChange={change}
    />
  )
}

const multipleSnippet = (value, modules, actions) =>
  value?.length === 1
    ? renderVariable(value[0], { modules, actions })
    : `${value?.length || 0} items`
