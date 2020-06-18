import express from "express"
import graphqlHTTP from "express-graphql"
import path from "path"
import playground from "graphql-playground-middleware-express"
// import session from "express-session"
// import connectPgSimple from "connect-pg-simple"
import postgres from "./postgres"
import schema from "./schema"
import connectDrivers from "./drivers"

const NODE_ENV = process.env.NODE_ENV
const GRAPHQL_ENDPOINT = "/graphql"

const app = express()
const pg = postgres()
const connections = connectDrivers(pg)
// const PgSession = connectPgSimple(session)

// app
//   .use
// session({
//   store: new PgSession({
//     pgPromise: pg,
//     tableName: "sessions",
//   }),
//   secret: process.env.SECRET,
//   cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
//   resave: false,
//   saveUninitialized: false,
// })
// ()

app.post(
  GRAPHQL_ENDPOINT,
  graphqlHTTP(req => ({
    schema,
    context: Object.assign(req, {
      pg,
      connections,
      // TODO: generate loaders in the same place as sources instead of at request time?
      // loaders: loaders(pg)
    }),
  }))
)

if (NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "public")))
} else {
  app.get(
    GRAPHQL_ENDPOINT,
    playground({
      endpoint: GRAPHQL_ENDPOINT,
      settings: {
        "request.credentials": "include",
        "schema.polling.enable": false,
      },
    })
  )
}

app.pg = pg

export default app

// TODO: all configuration is writen in es5 JS. src, migrations, tests - in esnext
// TODO: remove invitations. Invitation is a user in a corresponding state?
// TODO: have groups instead of roles.
// TODO: Remove permissions. Permission is ability to execute specific query attached to group.
