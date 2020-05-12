import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default function Breadcrumbs({ className, items, renderLink }) {
  const path = items.slice(0, -1)
  const current = items.slice(-1)[0]

  return (
    <div className={cx(styles.root, className)}>
      <span className={styles.path}>
        {path.map((item, i) => (
          <>
            {i !== 0 && " › "}
            <a className={styles.link} key={i} href="#">
              {item.name}
            </a>
          </>
        ))}
      </span>
      <span className={styles.current}>{current.name}</span>
    </div>
  )
}
