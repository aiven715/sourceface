import bcrypt from "bcryptjs"

export const hashPassword = (password) => bcrypt.hash(password, 10)

export const validatePassword = (password, hash) =>
  bcrypt.compare(password, hash)
