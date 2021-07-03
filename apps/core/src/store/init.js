import { keys } from "ramda";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
  populateSettings,
  populateAtoms,
  populateDependencies,
  populateAttributes,
  populateConfigs,
} from "./utils";
import * as slices from "./slices";
import { createRootReducer } from "./reducers";

// TODO: How to avoid duplicating cached data in operations and computations?
// implement linking and global data caching

// TODO: use worker threads to compute non critical computation code or state update in the background.
// Compute in a separate thread sync dependencies(dependenciesReducer - after atom update) and async dependencies(hooks - after populate update).
// Moreover, inside of dependenciesReducer spawn new threads for independent computation parts.
// Implement in form of middleware? Which listens for atom update, data cache populate actions, and spawns
// new threads to perform all computation as independently as possible in the background.
//
// First, make test with a huge slowdown.
// 1. With current thread blocking setup(make counter really laggy, simulate current module computation fast, and dependent modules computation slower)
// 2. With multi-thread setup

// TODO: implement Input component
// TODO: implement module methods. What should we do when we need to compute async stuff before calling method?
// TODO: implement Container component
// TODO: implement @mount field
// TODO: implement wildcard values. form_*.reveal(), form_*.value
// TODO: implement caching operations, invalidating their cache
//
// TODO: integrate grid
// TODO: implement editor, implement separation of settings and computations
//
// TODO: learn more about Suspense and how to handle suspending in
// useSettings hook
// TODO: implement displaying subsequent loading state
// TODO: have index of module ids groupped by parent id
// TODO: google for "data structures" in js to get inspiration on how to better structure
// state
//
// TODO: measure performance
// TODO: use ts
// TODO: have complete test coverage
//
// TODO: rename computations to evaluations?
//
// TODO: we might need to replace upfront settings/attributes population by on-demand computation
// inside of a component. In that case we'll be not computating all settings/attributes upfront
// which are not going to be used right away.
// TODO: keep in mind that we also need to populate computed settings data when we first time
// compute setting within an attribute

export default function init(entities, stock) {
  const middleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: true,
    thunk: false,
  });

  const reducer = createRootReducer(stock, {
    entities: slices.entities.reducer,
    // TODO: replace by groupped by parent module index
    ids: slices.ids.reducer,
    atoms: slices.atoms.reducer,
    attributes: slices.attributes.reducer,
    settings: slices.settings.reducer,
    stale: slices.stale.reducer,
    dependencies: slices.dependencies.reducer,
  });

  const moduleIds = keys(entities.modules);
  let preloadedState = reducer({ entities, ids: moduleIds }, {});

  preloadedState.entities.modules = populateConfigs(stock, preloadedState);
  preloadedState.atoms = populateAtoms(stock, preloadedState);
  preloadedState.settings = populateSettings(stock, preloadedState);
  preloadedState.dependencies = populateDependencies(stock, preloadedState);
  preloadedState.attributes = populateAttributes(stock, preloadedState);

  return configureStore({
    reducer,
    preloadedState,
    middleware,
    devTools: true,
  });
}
