import computeSetting from "./computeSetting";
import computeAttribute from "./computeAttribute";
import createMethod from "./createMethod";
import createRegistry from "./createRegistry";
import updateAtom from "./updateAtom";
import updateAtoms from "./updateAtoms";
import { toPromise } from "./utils";

/**
 * Creates new store based on initial entities data and stock definition.
 */
export default function createStore(entities, stock, futures, config) {
  const registry = createRegistry(entities, stock, config);
  const dependencies = { registry, stock, futures };

  return {
    data: {
      setting(moduleId, field, scope) {
        return computeSetting(moduleId, field, scope, dependencies);
      },
      attribute(moduleId, key) {
        return computeAttribute(moduleId, key, undefined, dependencies);
      },
      atom(moduleId, key) {
        return registry.atoms[moduleId][key];
      },
      modules(parentId) {
        return registry.ids[parentId || "_"];
      },
      module(moduleId) {
        return registry.entities.modules[moduleId];
      },
    },
    // TODO: rename to something like "effects"
    actions: {
      // TODO: should method be a promise?
      method(moduleId, key) {
        return createMethod(moduleId, key, undefined, dependencies);
      },
      setting(moduleId, field, scope) {
        return toPromise(computeSetting(moduleId, field, scope, dependencies));
      },
      updateAtom(moduleId, key, nextValue) {
        return updateAtom(moduleId, key, nextValue, dependencies);
      },
      updateAtoms(moduleId, nextValues) {
        return updateAtoms(moduleId, nextValues, dependencies);
      },
    },
  };
}
