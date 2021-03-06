import React from "react";
import { useRecoilState } from "recoil";
import Skeleton from "react-loading-skeleton";
import cx from "classnames";
import { isNil } from "ramda";
import { stateFamily, selectedId } from "../store";
import { either } from "../utils";
import { useModule, useSettings, useLocalVariables } from "./consumers";

const empty = [];

/**
 * Module component responsible for rendering specific module based on it's id, handling the
 * loading state(when pipeline execution happens) and passing down it's local state
 * information, required setting and variables that module depends on.
 */
export default function Module() {
  const [selection, setSelection] = useRecoilState(selectedId);
  const { module, blueprint } = useModule();
  const [state, changeState] = useRecoilState(stateFamily(module.id));

  const { Root } = blueprint;

  const settings = useSettings(Root.settings || empty);
  const variables = useLocalVariables(Root.variables || empty);

  const isPristine = either("isPristine", settings, variables);
  const isLoading = either("isLoading", settings, variables);
  const error = either("error", settings, variables);

  if (isPristine) {
    return <Skeleton width={200} height={80} className="mb-3" />;
  }

  if (error) {
    console.log(error);
    return JSON.stringify(error);
  }

  const root = (
    <Root
      state={state}
      onStateChange={changeState}
      settings={settings.data}
      variables={variables.data}
    />
  );

  // Temporary solution unless layout grid will be used
  if (isNil(module.position)) {
    return root;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setSelection(module.id);
      }}
      className={cx(
        "rounded-md border-2 border-dashed p-4 bg-white mb-3",
        isLoading && "opacity-75",
        selection === module.id ? "border-blue-500" : "border-green-300"
      )}
    >
      {root}
    </div>
  );
}
