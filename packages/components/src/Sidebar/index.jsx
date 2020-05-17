import React from "react"
import cx from "classnames"
import styles from "./index.css"

// TODO: implement light appearance
export default function Sidebar({ children, className }) {
  return <div className={cx(styles.root, className)}>{children}</div>
}

// TODO: add iconBefore prop
Sidebar.Title = function Title({ children, className }) {
  return <span className={cx(styles.title, className)}>{children}</span>
}

// TODO: have title here and remove GroupTitle?
Sidebar.Group = function Group({ children, className }) {
  return <div className={cx(styles.group, className)}>{children}</div>
}

Sidebar.GroupTitle = function GroupTitle({ children, className }) {
  return <span className={cx(styles.groupTitle, className)}>{children}</span>
}

// TODO: rename to Link
Sidebar.GroupLink = function GroupLink({
  children,
  className,
  iconBefore,
  isSelected,
  component: Component = "a",
  ...props
}) {
  return (
    <Component
      {...props}
      className={cx(styles.groupLink, isSelected && styles.selected, className)}
    >
      {iconBefore && <iconBefore.type className={styles.groupIcon} />}
      {children}
    </Component>
  )
}

Sidebar.Back = function Back() {}

Sidebar.Nested = function Nested() {}
