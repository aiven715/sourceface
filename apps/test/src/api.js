export function listModules() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(modules);
    }, Math.random() * 1000);
  });
}

// setting = "config entry || action"
export const modules = [
  {
    id: 1,
    type: "table",
    config: {
      limit: 10,
    },
    actions: [
      {
        order: 0,
        type: "operation",
        field: "data",
        variables: {
          name: { category: "constant", payload: { value: "ordersList" } },
          limit: {
            category: "scope",
            payload: { moduleId: 1, property: "limit" },
          },
          offset: {
            category: "scope",
            payload: { moduleId: 1, property: "offset" },
          },
        },
      },
      {
        order: 0,
        type: "value",
        field: "page",
        variables: {
          input: {
            category: "scope",
            payload: { moduleId: 3, property: "value" },
          },
        },
      },
    ],
  },
  {
    id: 2,
    type: "text",
    actions: [
      {
        order: 0,
        field: "content",
        type: "value",
        variables: {
          input: {
            category: "scope",
            payload: { moduleId: 1, property: "offset" },
          },
        },
      },
    ],
  },
  {
    id: 3,
    type: "counter",
  },
  {
    id: 4,
    type: "button",
    actions: [
      {
        order: 0,
        type: "operation",
        field: "event",
        variables: {
          name: { category: "constant", payload: { value: "ordersList" } },
          limit: { category: "constant", payload: { value: 10 } },
          offset: { category: "constant", payload: { value: 0 } },
        },
      },
    ],
  },
];
