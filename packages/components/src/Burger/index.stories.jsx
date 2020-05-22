import React from "react"
import { withKnobs, select, boolean } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Burger from "./index"

export default { title: "Burger", decorators: [withKnobs, withA11y] }

const makeProps = () => ({
  size: select("Size", ["compact", "normal", "loose"], "normal"),
  isActive: boolean("Is active"),
})

export const Primary = () => <Burger {...makeProps()} appearance="primary" />

export const Secondary = () => (
  <Burger {...makeProps()} appearance="secondary" />
)
