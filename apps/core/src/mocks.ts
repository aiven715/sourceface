import type { Module } from "./types";

export const modules: Module[] = [
  {
    id: 832,
    position: 0,
    type: "text",
    config: {
      content: "Hello world",
    },
    stages: [],
  },
  {
    id: 109,
    position: 1,
    type: "text",
    config: {},
    stages: [
      {
        id: 1935,
        order: 0,
        name: "stage_1",
        group: "content/default",
        type: "value",
        values: [
          {
            id: 402,
            name: "root",
            category: "variable/constant",
            payload: {
              value: "foo",
            },
            references: [],
          },
        ],
      },
    ],
  },
];

// TODO: should modules have name? default "module_{n}"
// TODO: names for stages. default "stage_{n}"
export const _modules = [
  {
    id: 49275,
    position: 0,
    parentId: null,
    type: "button",
    config: {
      text: "Create order",
    },
    stages: [
      {
        id: 2428,
        order: 0,
        name: "stage_1",
        group: "event/default",
        type: "value",
        values: [
          {
            id: 2358,
            name: "root",
            category: "function/module",
            payload: {
              property: "open",
            },
            args: [],
            references: [
              {
                name: "module",
                module: {
                  id: 823,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 1,
    position: 1,
    parentId: null,
    type: "table",
    config: {
      limit: 10,
    },
    stages: [
      {
        id: 2952,
        name: "stage_1",
        order: 0,
        group: "data/default",
        type: "value",
        values: [
          {
            id: 40284,
            name: "root",
            category: "variable/constant",
            payload: {
              value: "foo",
            },
            references: [],
          },
        ],
      },
      {
        id: 1,
        name: "stage_2",
        order: 1,
        group: "data/default",
        type: "value",
        values: [
          {
            id: 1,
            name: "root",
            category: "function/operation",
            args: [
              {
                id: 2,
                name: "limit",
                category: "variable/module",
                payload: { property: "limit" },
                references: [
                  {
                    name: "module",
                    module: {
                      id: 1,
                    },
                  },
                ],
              },
              {
                id: 3,
                name: "offset",
                category: "variable/module",
                payload: { property: "offset" },
                references: [
                  {
                    name: "module",
                    module: {
                      id: 1,
                    },
                  },
                ],
              },
            ],
            references: [
              {
                name: "root",
                operation: {
                  id: 1,
                  name: "ordersList",
                  stale: [],
                },
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "stage_1",
        order: 0,
        group: "page/default",
        type: "value",
        values: [
          {
            id: 4,
            name: "root",
            category: "variable/module",
            payload: {
              property: "value",
            },
            references: [
              {
                name: "module",
                module: {
                  id: 3,
                },
              },
            ],
          },
        ],
      },
      {
        id: 15,
        name: "stage_1",
        order: 0,
        group: "remove/default",
        type: "value",
        values: [
          {
            id: 5,
            name: "root",
            category: "function/operation",
            args: [
              {
                id: 6,
                name: "id",
                category: "variable/argument",
                payload: { property: "id" },
                references: [],
              },
            ],
            references: [
              {
                name: "root",
                operation: {
                  id: 3,
                  name: "removeOrder",
                  stale: [{ id: 1 }],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    parentId: null,
    position: 2,
    type: "text",
    stages: [
      {
        id: 3,
        name: "stage_1",
        order: 0,
        group: "content/default",
        type: "value",
        values: [
          {
            id: 7,
            name: "root",
            category: "variable/module",
            payload: {
              property: "value",
            },
            references: [
              {
                name: "module",
                module: {
                  id: 5,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    position: 3,
    parentId: null,
    type: "counter",
    stages: [],
  },
  {
    id: 5,
    position: 0,
    parentId: 7,
    type: "input",
    stages: [
      {
        id: 10,
        name: "stage_1",
        order: 0,
        group: "initial/default",
        type: "value",
        values: [
          {
            id: 8,
            name: "root",
            category: "variable/mount",
            path: ["customer_name"],
            references: [
              {
                name: "module",
                module: {
                  id: 7,
                },
              },
            ],
          },
        ],
      },
    ],
    config: {
      placeholder: "Enter customer name",
    },
  },
  {
    id: 6,
    position: 1,
    parentId: 7,
    type: "input",
    stages: [
      {
        id: 18,
        name: "stage_1",
        order: 0,
        group: "initial/default",
        type: "value",
        values: [
          {
            id: 9,
            name: "root",
            category: "variable/mount",
            path: ["address"],
            references: [
              {
                name: "module",
                module: {
                  id: 7,
                },
              },
            ],
          },
        ],
      },
    ],
    config: {
      placeholder: "Enter address",
    },
  },
  {
    id: 4,
    position: 2,
    parentId: 7,
    type: "button",
    config: {
      text: "Submit",
    },
    stages: [
      {
        id: 5,
        order: 0,
        name: "form_data",
        group: "event/default",
        type: "dictionary",
        values: [
          {
            id: 10,
            name: "customer_name",
            category: "function/module",
            payload: {
              property: "reveal",
            },
            args: [],
            references: [
              {
                name: "module",
                module: {
                  id: 5,
                },
              },
            ],
          },
          {
            id: 11,
            name: "address",
            category: "function/module",
            payload: {
              property: "reveal",
            },
            args: [],
            references: [
              {
                name: "module",
                module: {
                  id: 6,
                },
              },
            ],
          },
        ],
      },
      {
        id: 2242,
        order: 1,
        name: "stage_2",
        group: "event/default",
        type: "value",
        values: [
          {
            id: 4295,
            name: "root",
            category: "function/operation",
            dict_args: [],
            args: [
              {
                id: 9245,
                name: "id",
                category: "variable/module",
                payload: { property: "selected" },
                references: [
                  {
                    name: "module",
                    module: { id: 1 },
                  },
                ],
              },
              // TODO: implement passing "form_data" dictionary as spread so we don't need to specify the fields
              // separately
              {
                id: 5284,
                name: "customer_name",
                category: "variable/stage",
                payload: { name: "form_data" },
                path: ["customer_name"],
                references: [],
              },
              {
                id: 5823,
                name: "address",
                category: "variable/stage",
                payload: { name: "form_data" },
                path: ["address"],
                references: [],
              },
            ],
            references: [
              {
                name: "root",
                operation: {
                  id: 83,
                  name: "updateOrder",
                  stale: [{ id: 1 }],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 7,
    position: 4,
    parentId: null,
    type: "container",
    stages: [
      {
        id: 6,
        name: "stage_1",
        order: 0,
        group: "@mount/default",
        type: "value",
        values: [
          {
            id: 12,
            name: "root",
            category: "function/operation",
            args: [
              {
                id: 13,
                name: "id",
                category: "variable/module",
                payload: { property: "selected" },
                references: [
                  {
                    name: "module",
                    module: {
                      id: 1,
                    },
                  },
                ],
              },
            ],
            references: [
              {
                name: "root",
                operation: {
                  id: 2,
                  name: "order",
                  stale: [],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 823,
    position: null,
    parentId: null,
    type: "modal",
    config: { title: "Create order" },
    stages: [],
  },
  //
  {
    id: 8420,
    position: 0,
    parentId: 823,
    type: "input",
    stages: [],
    config: {
      placeholder: "Enter customer name",
    },
  },
  {
    id: 84024,
    position: 1,
    parentId: 823,
    type: "input",
    stages: [],
    config: {
      placeholder: "Enter address",
    },
  },
  {
    id: 24892,
    position: 2,
    parentId: 823,
    type: "button",
    config: {
      text: "Submit",
    },
    stages: [
      {
        id: 4928,
        order: 0,
        name: "form_data",
        group: "event/default",
        type: "dictionary",
        values: [
          {
            id: 194,
            name: "customer_name",
            category: "function/module",
            payload: {
              property: "reveal",
            },
            args: [],
            references: [
              {
                name: "module",
                module: {
                  id: 8420,
                },
              },
            ],
          },
          {
            id: 149,
            name: "address",
            category: "function/module",
            payload: {
              property: "reveal",
            },
            args: [],
            references: [
              {
                name: "module",
                module: {
                  id: 84024,
                },
              },
            ],
          },
        ],
      },
      {
        id: 7238,
        order: 1,
        name: "stage_2",
        group: "event/default",
        type: "value",
        values: [
          {
            id: 1042,
            name: "root",
            category: "function/operation",
            dict_args: [],
            args: [
              {
                id: 1035,
                name: "customer_name",
                category: "variable/stage",
                payload: { name: "form_data" },
                path: ["customer_name"],
                references: [],
              },
              {
                id: 75245,
                name: "address",
                category: "variable/stage",
                payload: { name: "form_data" },
                path: ["address"],
                references: [],
              },
            ],
            references: [
              {
                name: "root",
                operation: {
                  id: 95,
                  name: "createOrder",
                  stale: [{ id: 1 }],
                },
              },
            ],
          },
        ],
      },
      {
        id: 85402,
        order: 2,
        name: "stage_3",
        group: "event/default",
        type: "value",
        values: [
          {
            id: 45278,
            name: "root",
            category: "function/module",
            payload: {
              property: "close",
            },
            args: [],
            references: [
              {
                name: "module",
                module: {
                  id: 823,
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
