import { isNil } from "ramda";
import * as slices from "../../slices";
import {
  isSettingStale,
  getStageName,
  getSetting,
  getSettingDataId,
  getFieldStageIds,
} from "../../selectors";
import { reduceAsync, pipe } from "../common";
import { defaultOpts } from "./defaults";
import computeSingleStage from "./computeSingleStage";
import Data from "./data";

/**
 * Compute specific setting for given stage ids.
 */
export default function computeSetting(moduleId, field, { deps, opts, scope }) {
  opts = defaultOpts(opts);

  /**
   * Returning cached data if it exists and not stale unless "forceComputation"
   * is specified.
   */
  const cached = getSetting(deps.state, [moduleId, field]);
  const isStale = isSettingStale(deps.state, [moduleId, field]);

  if (!opts.forceComputation && !isNil(cached) && !isStale) {
    const id = getSettingDataId(deps.state, [moduleId, field]);
    return new Data(cached, undefined, { id, deps, opts });
  }

  const stageIds = getFieldStageIds(deps.state, [moduleId, field]);
  let stages = {};

  return pipe(
    reduceAsync(
      (_, stageId) => {
        const nextScope = { ...scope, stages };

        return pipe(
          computeSingleStage(stageId, { deps, opts, scope: nextScope }),
          (data) => {
            /**
             * Adding stage result to the scope object.
             */
            const stageName = getStageName(deps.state, stageId);
            stages[stageName] = data;

            return data;
          }
        );
      },
      null,
      stageIds
    ),
    (data) => {
      data?.save(slices.settings.actions.assoc, { moduleId, field });

      return data;
    }
  );
}
