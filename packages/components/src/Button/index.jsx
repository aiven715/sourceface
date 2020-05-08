import React from "react"
import cx from "classnames"
import Spinner from "../Spinner"
import styles from "./index.css"

export default function Button({
  children,
  appearance = "primary",
  size = "normal",
  type = "button",
  shouldFitContainer = false,
  isDisabled,
  isLoading,
  className,
  // iconAfter,
  // iconBefore,
}) {
  return (
    <button
      className={cx(
        className,
        styles.root,
        styles[appearance],
        styles[size],
        shouldFitContainer && styles.full,
        isDisabled && styles.disabled
      )}
      disabled={isDisabled || isLoading}
      type={type}
    >
      {isLoading && (
        <Spinner
          appearance={getSpinnerAppearance(appearance)}
          className={styles.spinner}
        />
      )}
      {children}
    </button>
  )
}

const spinners = {
  light: ["primary"],
  dark: ["secondary", "link"],
}

const getSpinnerAppearance = btn =>
  Object.keys(spinners).reduce((acc, key) =>
    spinners[key].includes(btn) ? key : acc
  )
