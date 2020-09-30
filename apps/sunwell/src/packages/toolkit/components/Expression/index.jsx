import React from "react"
import { insert, update } from "ramda"
import styles from "./index.scss"

// TODO: when created new item in a pipeline, have "acc/result/prev ->" as a placeholder
export default ({ error, value: pipes, onChange }) => {
  const create = index => {
    onChange(insert(index + 1, "prev -> 1", pipes))
  }

  const change = (index, value) => {
    onChange(update(index, value, pipes))
  }

  const remove = index => {
    onChange(pipes.filter((x, i) => i !== index))
  }

  // TODO: remove single Pipe rendering since value will be always an array
  return (
    <>
      {pipes instanceof Array ? (
        pipes.map((item, i) => (
          <Pipe
            key={i}
            value={item}
            displayRemove={!!pipes.length}
            onChange={value => change(i, value)}
            onAdd={() => create(i)}
            onRemove={() => remove(i)}
          />
        ))
      ) : (
        <Pipe value={pipes} onChange={onChange} />
      )}
      {error && <span className={styles.error}>{error}</span>}
    </>
  )
}

function Pipe({ value, displayRemove, onChange, onAdd, onRemove }) {
  return (
    <div className={styles.pipe}>
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <div className={styles.floating}>
        {displayRemove && (
          <span onClick={onRemove} className={styles.action}>
            -
          </span>
        )}
        <span onClick={onAdd} className={styles.action}>
          +
        </span>
      </div>
    </div>
  )
}
