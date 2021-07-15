import stringify from "fast-json-stable-stringify";
import { path, isNil, map as mapCollection } from "ramda";
import { of, throwError, combineLatest, from } from "rxjs";
import { switchMap, map, shareReplay } from "rxjs/operators";
import { set } from "./utils";
import computeAttribute from "./computeAttribute";
import computeSetting from "./computeSetting";
import createMethod from "./createMethod";
import Counter from "./counter";

// TODO: some values should be labeled as "callback", so they can be computed only
// for the "callback" setting type, such as "method" or "effect"
/**
 * Computes requesting value.
 */
export default function computeValue(valueId, scope, dependencies) {
  const { registry } = dependencies;
  const value$ = registry.entities.values[valueId];

  if (isNil(value$)) {
    /**
     * Using "throwError" helper to explicitly return a failed observable instead
     * of crashing the current function.
     */
    return throwError(new Error("Can not find value in registry"));
  }

  return value$.pipe(
    switchMap((value) => {
      const selectPath = map(path(value.path || []));
      const compute = categories[value.category];

      if (isNil(compute)) {
        throw new Error("Unrecognized value category");
      }

      return compute(value, scope, dependencies).pipe(selectPath);
    })
  );
}

/**
 * Computes constant variable value.
 */
function computeConstantValue(value) {
  return of(value.payload.value);
}

/**
 * Computes attribute variable value.
 */
function computeAttributeValue(value, scope, dependencies) {
  const moduleId = value.references.modules.module;
  const { property } = value.payload;

  return computeAttribute(moduleId, property, scope, dependencies);
}

/**
 * Computes input variable value.
 */
function computeInputValue(_value, scope) {
  return of(scope.input);
}

/**
 * Computes stage variable value.
 */
function computeStageValue(value, scope) {
  const { name } = value.payload;

  return of(scope.stages[name]);
}

/**
 * Computes mount variable value.
 */
function computeMountValue(value, scope, dependencies) {
  const moduleId = value.references.modules.module;

  return computeSetting(moduleId, "@mount", scope, dependencies);
}

/**
 * Computes future function value.
 */
function computeFutureValue(value, scope, dependencies) {
  const { kind } = value.payload;
  const { futures, registry } = dependencies;
  const { execute, identify } = futures[kind];

  return computeFunctionArgs(value.args, scope, dependencies).pipe(
    switchMap((args) => {
      const id = identify(value.references);
      const argsStr = stringify(args);
      const existing$ = registry.futures[kind]?.[argsStr]?.[id];
      const counter$ = registry.counters[kind]?.[id] || new Counter();

      /**
       * Leveraging existing stream to not duplicate async future
       * requests.
       */
      if (!isNil(existing$)) {
        return existing$;
      }

      const future$ = counter$.pipe(
        switchMap(() =>
          from(
            execute(args, value.references).then((res) => {
              if (res.stale) {
                /**
                 * Invalidating stale futures.
                 */
                for (let id of res.stale) {
                  registry.counters[kind]?.[id]?.increment();
                }
              }

              return res.data;
            })
          )
        ),
        shareReplay(1)
      );

      /**
       * Adding stream to the registry so it's result can be cached.
       */
      set(registry, ["futures", kind, argsStr, id], future$);

      /**
       * Adding counter to the registry if it does not exist.
       */
      if (isNil(registry.counters[kind]?.[id])) {
        set(registry, ["counters", kind, id], counter$);
      }

      return future$;
    })
  );
}

/**
 * Computes method function value.
 */
function computeMethodValue(value, scope, dependencies) {
  const { property } = value.payload;
  const moduleId = value.references.modules.module;
  const method = createMethod(moduleId, property, scope, dependencies);

  return computeFunctionArgs(value.args, scope, dependencies).pipe(
    switchMap(method)
  );
}

/**
 * Computes function args object.
 */
// TODO: restrict function calls
function computeFunctionArgs(args, scope, dependencies) {
  const argToValue = (valueId) => computeValue(valueId, scope, dependencies);
  return args ? combineLatest(mapCollection(argToValue, args)) : of({});
}

const categories = {
  "variable/constant": computeConstantValue,
  "variable/attribute": computeAttributeValue,
  "variable/input": computeInputValue,
  "variable/stage": computeStageValue,
  "variable/mount": computeMountValue,
  "function/future": computeFutureValue,
  "function/method": computeMethodValue,
};
