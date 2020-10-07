import { evaluate } from "../../"

test("evaluates function call from the scope", () => {
  expect(evaluate("do exec", { exec: () => 8 })).toBe(8)
})

test("evaluates function call with arguments", () => {
  expect(evaluate("do exec x: 8, y: 2", { exec: ({ x, y }) => x + y })).toBe(10)
})

test("evaluates function call with variable arguments", () => {
  expect(
    evaluate("do exec x: a, y: b", { exec: ({ x, y }) => x + y, a: 8, b: 2 })
  ).toBe(10)
})

test("evaluates nested object properies function call", () => {
  expect(evaluate("do foo.bar.baz", { foo: { bar: { baz: () => 4 } } })).toBe(4)
})

test("evaluates function call with nested variable arguments", () => {
  expect(
    evaluate("do exec x: foo.x, y: bar.y", {
      exec: ({ x, y }) => x + y,
      foo: { x: 8 },
      bar: { y: 2 },
    })
  ).toBe(10)
})

test("evaluates successfully function call with extra leading spaces in the first argument", () => {
  expect(evaluate("do exec      x: 8", { exec: ({ x }) => x })).toBe(8)
})

test("evaluates successfully function call with arguments with extra spaces in between", () => {
  expect(
    evaluate("do exec x:   8,    y  : 2", { exec: ({ x, y }) => x + y })
  ).toBe(10)
})

test("fails when variable not exist during function call", () => {
  expect(() => evaluate("do x")).toThrow("Variable is not defined")
})

test("fails when variable not exist while accessing nested object prop during function call", () => {
  expect(() => evaluate("do x.y.z")).toThrow("Variable is not defined")
})

test("fails to call a function when variable has wrong type", () => {
  expect(() => evaluate("do foo bar: 4", { foo: 2 })).toThrow(
    "Can not call non function type"
  )
})

test("fails to accept function call as argument", () => {
  expect(() =>
    evaluate("do exec x: do bar", { exec: () => 8, bar: () => 4 })
  ).toThrow("Syntax error")
})
