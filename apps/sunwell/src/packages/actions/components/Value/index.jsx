// TODO: either have blue(variable + type icon) or beige(literal) color
import React from "react"
import { Snippet } from "../../components"

// TODO: use + [action] in combination with dropdown
// TODO: do not have switch for literal/variable, adding literal will be implemented by displaying
// "Use 'something' as literal" option at the first position of dropdown.
// TODO: Move "Snippet" code here. Accept "type" prop to understand if we should ask for static value or variable/literal.
// TODO: remove icons, have only colors for variable types/literals. Display icons in dropdown instead.
// TODO: use dropdown with similar appearance when adding a new action.
export default function Value({ autoFocus, value, onChange, onDestroy }) {
  switch (value.type) {
    case "literal":
      return (
        <Snippet
          color="beige"
          autoFocus={autoFocus}
          value={value.data}
          onChange={(data) => onChange && onChange({ ...value, data })}
          onDestroy={onDestroy}
        />
      )

    case "local":
      return (
        <Snippet
          color="blue"
          autoFocus={autoFocus}
          value={value.name}
          onChange={(name) => onChange && onChange({ ...value, name })}
          onDestroy={onDestroy}
        />
      )
  }
}
