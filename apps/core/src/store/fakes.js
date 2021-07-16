import FakeEntities from "../fakes/entities";
import FakeStock from "../fakes/stock";
import FakeFutures from "../fakes/futures";
import { createStore, Cache, Interruption } from "./";

// TODO: will be moved to jest configuration
export function init() {
  const entities = new FakeEntities();
  const stock = new FakeStock();
  const futures = new FakeFutures();
  const interruption = new Interruption();

  const create = ({ futuresTTL } = {}) =>
    createStore(
      entities.contents(),
      stock.contents(),
      futures.contents(),
      futuresTTL && {
        futuresCache: new Cache(futuresTTL),
      }
    );

  return {
    fakes: {
      entities,
      stock,
      futures,
    },
    interruption,
    createStore: create,
  };
}
