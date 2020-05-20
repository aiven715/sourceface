import React, { useContext, createContext, useRef, useEffect } from "react"
import cx from "classnames"
import styles from "./index.scss"

// side view is not a table feature. it should be implemented somewhere else, but it's a feature of table module

// table should not have so much features, complex tables should be implemented by a components composition instead. for example compose to a table side view, collapse or pagination, filters and so on
// table should have checkboxes and sorting at max probably. also implement heading groups

// TODO: implement multiple sizes

const Context = createContext("table")

export default function Table({ children, className, size }) {
  const cells = useRef()

  useEffect(() => {
    function onResize() {
      console.log(cells.current)
    }

    window.addEventListener("resize", onResize)

    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <Context.Provider value={{ size, cells }}>
      <div className={cx(styles.root, className)}>{children}</div>
    </Context.Provider>
  )
}

Table.Head = function Head({ children, className }) {
  return <div className={cx(styles.head, className)}>{children}</div>
}

Table.Heading = function Heading({ children, className, align = "left" }) {
  return (
    <div
      className={cx(styles.heading, styles[alignClassNames[align]], className)}
    >
      {children}
    </div>
  )
}

Table.Row = function Row({
  children,
  className,
  // onClick,
  // isSelectable,
  // isSelected,
}) {
  return <div className={cx(styles.row, className)}>{children}</div>
}

Table.Cell = function Cell({ children, className, align = "left" }) {
  const { cells } = useContext(Context)

  return (
    <div
      ref={el => console.log([...el.parentElement.children].indexOf(el))}
      className={cx(styles.cell, styles[alignClassNames[align]], className)}
    >
      {children}
    </div>
  )
}

const alignClassNames = {
  left: "alignLeft",
  center: "alignCenter",
  right: "alignRight",
}
