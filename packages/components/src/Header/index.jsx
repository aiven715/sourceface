import React from "react"
import cx from "classnames"
import styles from "./index.scss"

// TODO: implement compact size
// TODO: implement dark appearance
export default function Header({ children, className }) {
  return <div className={cx(styles.root, className)}>{children}</div>
}
