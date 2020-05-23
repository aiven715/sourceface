import React from "react"
import * as styles from "./index.styles"

export default function Header({
  children,
  variant = "light",
  size = "normal",
  ...props
}) {
  return (
    <div
      {...props}
      css={[styles.root, styles.variants[variant], styles.sizes[size]]}
    >
      {children}
    </div>
  )
}
