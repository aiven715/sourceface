import { useEffect, useContext } from "react";
import { context } from "./state";
import * as dom from "./dom";

export default (triggerRef, ...args) => {
  const [previewRef, type, callbacks = {}] =
    typeof args[0] !== "string" ? args : [triggerRef, ...args];

  const state = useContext(context);
  const { onStart, onMove, onEnd } = state.provide(callbacks);

  useEffect(() => {
    const mousedown = e => {
      if (e.which !== 1) return;

      let preview;
      let container = { dragged: false };

      const move = e => {
        if (!container.dragged) {
          container.dragged = true;
          container.startX = e.clientX;
          container.startY = e.clientY;
          container.bodyStyles = dom.getStyles(trigger, ["user-select"]);

          document.body.style["user-select"] = "none";

          state.dragStart(type);
          onStart && onStart();

          return;
        }

        preview = previewRef.current;

        if (!preview) return;

        if (!container.previewStyles && !container.matrix) {
          const { transform } = window.getComputedStyle(preview);

          container.matrix = dom.toMatrix(transform);
          container.previewStyles = dom.getStyles(preview, [
            "transform",
            "pointer-events"
          ]);

          preview.style["pointer-events"] = "none";
        }

        const deltaX = e.clientX - container.startX;
        const deltaY = e.clientY - container.startY;

        preview.style.transform = dom.addTranslate(
          container.matrix,
          deltaX,
          deltaY
        );

        onMove && onMove();
      };

      const end = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", end);

        if (container.dragged) {
          dom.setStyles(document.body, container.bodyStyles);
          dom.setStyles(preview, container.previewStyles);

          state.dragEnd();
          onEnd && onEnd();
        }
      };

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", end);
    };

    const trigger = triggerRef.current;

    if (!trigger) return;

    trigger.addEventListener("mousedown", mousedown);

    return () => {
      trigger.removeEventListener("mousedown", mousedown);
    };
  }, [triggerRef, previewRef, state, type, onStart, onMove, onEnd]);
};
