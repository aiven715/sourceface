import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default ({ children, color }) => (
  <span className={cx(styles.root, colors[color])}>{children}</span>
)

const colors = {
  blue: styles.blue,
  gray: styles.gray,
}
