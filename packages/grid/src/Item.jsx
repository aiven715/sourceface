import React, { useRef } from "react";
import useDraggable from "./useDraggable";
import useResizable from "./useResizable";

export default function Item({
  style,
  containerRef,
  minWidth,
  minHeight,
  children,
  onCustomizeStart,
  onCustomizeEnd
}) {
  const elementRef = useRef();
  const handleRef = useRef();
  const nwRef = useRef();
  const swRef = useRef();
  const neRef = useRef();
  const seRef = useRef();

  const isCustom = typeof children === "function";

  useDraggable({
    containerRef,
    elementRef,
    handleRef: !isCustom ? elementRef : handleRef,
    onDragStart: onCustomizeStart,
    onDragEnd: onCustomizeEnd
  });
  useResizable({
    elementRef,
    nwRef,
    swRef,
    neRef,
    seRef,
    minWidth,
    minHeight,
    onResizeStart: onCustomizeStart,
    onResizeEnd: onCustomizeEnd
  });

  return (
    <div
      ref={elementRef}
      style={{
        position: "absolute",
        userSelect: "none",
        zIndex: 2,
        ...style
      }}
    >
      {!isCustom
        ? children
        : children({
            handleRef,
            resizable: {
              nwRef,
              swRef,
              neRef,
              seRef
            }
          })}
    </div>
  );
}
