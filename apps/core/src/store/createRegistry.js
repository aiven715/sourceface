import { map, keys, isNil } from "ramda";
import { of, BehaviorSubject } from "rxjs";
import { createCacheBucket } from "./utils";
import Bucket from "./bucket";
import Channel from "./channel";

/**
 * Creates registry of the streams used during the computation
 * process.
 */
export default function createRegistry(entities, stock, config = {}) {
  const { futuresCache = createCacheBucket(3 * 60 * 1_000) } = config;

  return {
    entities: {
      modules: populateEntity(entities.modules),
      stages: populateEntity(entities.stages),
      values: populateEntity(entities.values),
    },
    ids: populateIds(entities.modules),
    atoms: populateAtoms(entities.modules, stock),
    channels: new Bucket(Channel),
    futures: futuresCache,
    settings: {},
    attributes: {},
  };
}

/**
 * Creates atoms streams based on initial configuration from stock.
 */
function populateAtoms(modules, stock) {
  const moduleIds = keys(modules);

  return moduleIds.reduce((acc, moduleId) => {
    const module = modules[moduleId];
    const { initialAtoms } = stock[module.type];

    if (isNil(initialAtoms)) {
      return acc;
    }

    return {
      ...acc,
      [moduleId]: map(
        (initialValue) => new BehaviorSubject(initialValue),
        initialAtoms
      ),
    };
  }, {});
}

/**
 * Transforms raw entity data to the same shape object of streams.
 */
function populateEntity(items) {
  return map(of, items);
}

/**
 * Creates stream of module ids from modules data.
 */
function populateIds(modules) {
  const group = keys(modules).reduce((acc, moduleId) => {
    const module = modules[moduleId];
    /**
     * Keeping top level modules without parent id under "_" key.
     */
    const parentId = module.parentId || "_";
    const prev = acc[parentId] || [];

    return {
      ...acc,
      [parentId]: [...prev, moduleId],
    };
  }, {});

  return map(of, group);
}
