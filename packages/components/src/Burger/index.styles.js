import { css } from "@emotion/core"
import { colors, values, shadows } from "@sourceface/style"
import { apply } from "../utils"

export const sizes = apply(
  {
    compact: {
      value: values[12],
      icon: values[6],
    },
    normal: {
      value: `calc(${values[10]} + ${values[4]})`,
      icon: values[8],
    },
    loose: {
      value: values[16],
      icon: values[10],
    },
  },
  ({ value, icon }) => css`
    width: ${value};
    height: ${value};
    ${icon} {
      width: ${icon};
      height: ${icon};
    }
  `
)

export const variants = apply(
  {
    primary: {
      bg: colors.primary.shades[9],
      fg: colors.primary.tints[3],
      activeColor: colors.primary.shades[10],
    },
    secondary: {
      bg: colors.light,
      fg: colors.primary.shades[7],
      activeColor: colors.primary.tints[9],
    },
  },
  ({ bg, fg, activeColor }) => css`
    background-color: ${bg};
    &${active} {
      backgrond-color: ${activeColor};
    }
    ${icon} {
      fill: ${fg};
    }
  `
)

export const root = css`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${shadows.base};
`

export const active = css``
export const icon = css``
