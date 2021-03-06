import React from "react"
import { Link } from "react-router-dom"
import { Breadcrumbs } from "@sourceface/components"
import styles from "./index.scss"

// dashboard frame component containing Header component and so on
export default function Shell({ children, path, actions }) {
  return (
    <div className={styles.root}>
      <div className={styles.pane}>
        <Breadcrumbs link={Link}>
          {path.map((item, i) => (
            <Breadcrumbs.Link key={i} to={item.to}>
              {item.title}
            </Breadcrumbs.Link>
          ))}
        </Breadcrumbs>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {children}
    </div>
  )
}
