// order creation will be in a modal

import React from "react"
import { DndProvider } from "react-dnd"
import { TouchBackend } from "react-dnd-touch-backend"
import { useQuery } from "urql"
import { useBooleanState } from "hooks/index"
import { Frame, Editor, Modules } from "components/index"
import * as expression from "lib/expression"
import * as queries from "./queries"
import { createLayout } from "./utils"

// TODO: think about real use case

/* <div className={styles.panel}> */
/*   <span className={styles.title}>Orders</span> */
/*   <Button className={styles.newOrder}>New order</Button> */
/* </div> */

const path = [
  { title: "Administration", link: "#" },
  { title: "Users", link: "#" },
]

// TODO: handle error on back-end requests
export default () => {
  const [result] = useQuery({
    query: queries.constructionPage,
    variables: { pageId: 1 },
  })
  const [isEditing, editOn, editOff] = useBooleanState(false)
  const page = result.data?.page
  const layout =
    page && createLayout(page.layout.id, page.modules, page.layout.positions)

  const children = !layout ? "Loading..." : <Modules layout={layout} />

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <expression.CommandsProvider commands={result.data?.commands}>
        {isEditing ? (
          <Editor modules={page?.modules} onClose={editOff}>
            {children}
          </Editor>
        ) : (
          <Frame path={path} actions={<button onClick={editOn}>Edit</button>}>
            {children}
          </Frame>
        )}
      </expression.CommandsProvider>
    </DndProvider>
  )
}
