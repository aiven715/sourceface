import { SchemaDirectiveVisitor } from "graphql-tools"
import * as userRepo from "repos/user"

export default class extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve } = field

    field.resolve = async (...args) => {
      const [, , context] = args

      const isAllowed = await userRepo.hasUsers(context.pg)

      if (isAllowed) {
        throw new Error(
          "Application should not contain users in order to perform that action"
        )
      }

      return await resolve.apply(this, args)
    }
  }
}
