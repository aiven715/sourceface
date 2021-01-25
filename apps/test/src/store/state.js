import { __, curry, sort, keys, values, mergeRight } from "ramda";
import { atom, atomFamily, selector, selectorFamily, waitForAll } from "recoil";
import { normalize } from "normalizr";
import * as api from "../api";
import schema from "../schema";
import { stock as modulesStock } from "../modules";
import { evaluate as evaluateVariable } from "../pipeline/variable";
import * as loader from "../loader";
import * as wires from "../wires";
import { stock as stagesStock } from "../stages";

/**
 * Selected module state. Used in editor to represent currently
 * selected module.
 */
export const selectedId = atom({
  key: "selectedId",
  default: selector({
    key: "selectedId/default",
    get: ({ get }) => get(page).result[0],
  }),
});

/**
 * Modules settings state. Used for real time module configuration in
 * editor.
 */
export const moduleFamily = atomFamily({
  key: "module",
  default: selectorFamily({
    key: "module/default",
    get: (moduleId) => ({ get }) => {
      const module = get(page).entities.modules[moduleId];
      const { initialConfig } = modulesStock[module.type];

      return mergeRight({ config: initialConfig }, module);
    },
  }),
});

/**
 * Modules local state for holding dynamic module data and keeping
 * other modules in sync with each other when state changes.
 */
export const stateFamily = atomFamily({
  key: "state",
  default: selectorFamily({
    key: "state/default",
    get: (moduleId) => ({ get }) => {
      const module = get(moduleFamily(moduleId));

      return modulesStock[module.type].initialState || {};
    },
  }),
});

const stateFieldFamily = selectorFamily({
  key: `stateField`,
  get: ([moduleId, key]) => ({ get }) => {
    const state = get(stateFamily(moduleId));

    return state[key];
  },
});

const countersFamily = atomFamily({
  key: "counters",
  default: 0,
});

/**
 * Current page data including modules list and page information.
 */
export const page = selector({
  key: "page",
  get: async () => normalize(await api.listModules(), schema),
});

/**
 * Modules list filtered by a parent module id
 */
export const modulesFamily = selectorFamily({
  key: "modules",
  get: (parentId) => ({ get }) => {
    const { result, entities } = get(page);

    return result.filter(
      (moduleId) => entities.modules[moduleId].parentId === parentId
    );
  },
});

export const settingFamily = selectorFamily({
  key: "setting",
  get: (param) => (opts) => readSetting(param, opts),
  set: (param) => (opts, args) => readSetting(param, opts, { args }),
});

export const localVariableFamily = selectorFamily({
  key: "localVariable",
  get: ([moduleId, key]) => ({ get }) => {
    const module = get(moduleFamily(moduleId));
    const blueprint = modulesStock[module.type];
    const setup = blueprint.variables[key];

    return setup.selector(createDependencies(get, moduleId, setup));
  },
});

export const localFunctionFamily = selectorFamily({
  key: "localFunction",
  get: ([moduleId, key]) => ({ get }) => {
    const module = get(moduleFamily(moduleId));
    const blueprint = modulesStock[module.type];
    const setup = blueprint.variables[key];

    return (transition) => (args) =>
      setup.call(args, transition, createDependencies(get, moduleId, setup));
  },
});

export const functionResultFamily = selectorFamily({
  key: "functionResult",
  get: (valueId) => ({ get }) => {
    const { entities } = get(page);
    const { id, category, args, references } = transformValue(
      entities.values[valueId]
    );

    const { referenceType, select, execute, getStaleIds } = wires[category];

    const reference = select(references);
    const call = (args) => execute(reference, args);

    get(countersFamily([reference.id, referenceType]));

    const evaluatedArgs = evaluateArgs({ get }, args);

    return loader.load(id, call, evaluatedArgs);

    // TODO: when "set" is provided, then:
    // const staleIds = getStaleIds(reference)
    // for (let staleId of staleIds) {
    //   set(countersFamily([staleid, referenceType]), prev => prev + 1)
    // }
  },
});

const getMount = ({ get }, moduleId) => {
  return get(settingFamily([moduleId, "@mount"]));
};

const getLocal = ({ get }, moduleId, key) => {
  return get(localVariableFamily([moduleId, key]));
};

const evaluate = ({ get, set }, value, scope) => {
  const data = transformValue(value);

  if (data.type === "variable") {
    return evaluateVariable(
      data,
      scope,
      curry(getLocal)({ get, set }),
      curry(getMount)({ get, set })
    );
  }

  if (data.type === "function") {
    const { id, category, args, references, payload } = data;

    if (category === "module") {
      const transition = (valueOrFn) =>
        set?.(stateFamily(references.module.id), valueOrFn);

      const evaluatedArgs = evaluateArgs({ get, set }, args, scope);

      return get(localFunctionFamily([references.module.id, payload.property]))(
        transition
      )(evaluatedArgs);
    }

    // TODO: in case "set" is provided, might use "set(functionResultFamily)" instead so
    // we can invalidate cache
    return get(functionResultFamily(id));
  }
};

const evaluateArgs = ({ get, set }, valueIds, scope) => {
  const { entities } = get(page);

  return valueIds.reduce((acc, valueId) => {
    const value = entities.values[valueId];

    return {
      ...acc,
      [value.name]: evaluate({ get, set }, value, scope),
    };
  }, {});
};

const parseCategory = (category) => category.split("/");

const transformValue = (value) => {
  const [type, category] = parseCategory(value.category);

  return {
    ...value,
    type,
    category,
    references: value.references.reduce((acc, { name, ...reference }) => {
      const type = keys(reference)[0];

      return {
        ...acc,
        [name]: reference[type],
      };
    }, {}),
  };
};

const getStages = (field, sequenceName, stageIds, entities) => {
  const items = stageIds.reduce((acc, stageId) => {
    const stage = entities.stages[stageId];

    if (stage.group !== `${field}/${sequenceName}`) {
      return acc;
    }

    return [...acc, stage];
  }, []);

  return sort((a, b) => a.order - b.order, items);
};

const readSetting = ([moduleId, field], { get, set }, scope) => {
  const module = get(moduleFamily(moduleId));
  const { entities } = get(page);

  const stages = getStages(field, "default", module.stages, entities);

  if (stages.length) {
    try {
      return stages.reduce((acc, stage) => {
        const input = stage.values.reduce((acc, valueId) => {
          const value = entities.values[valueId];

          return { ...acc, [value.name]: value };
        }, {});

        const curriedEvaluate = curry(evaluate)({ get, set }, __, scope);

        return stagesStock[stage.type].execute(curriedEvaluate, input);
      }, null);
    } catch (err) {
      /**
       * When pipeline is interrupted - returning that interruption as a result so
       * it can be handled if needed.
       */
      if (err instanceof Break) {
        return err;
      }

      throw err;
    }
  }

  return module.config?.[field];
};

/**
 * Indicates interruption of sequence pipeline.
 */
export class Break {
  constructor(reason) {
    this.reason = reason;
  }
}

const createDependencies = (get, moduleId, setup) => {
  const settings = get(
    waitForAll(
      setup.settings?.map((field) => settingFamily([moduleId, field])) || []
    )
  );
  const variables = get(
    waitForAll(
      setup.variables?.map((key) => localVariableFamily([moduleId, key])) || []
    )
  );
  const state = get(
    waitForAll(
      setup.state?.map((key) => stateFieldFamily([moduleId, key])) || []
    )
  );

  return {
    settings,
    variables,
    state,
  };
};
