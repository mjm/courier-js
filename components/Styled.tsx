import styled, { CreateStyled } from "@emotion/styled"
import { CSSProperties } from "react"

const breakpoints = ["640px", "768px", "1024px", "1280px"]

const font = {
  display: "Rubik, Helvetica, sans-serif",
  body: '"IBM Plex Sans", Helvetica, sans-serif',
}

const fontSizes = [
  ".75rem",
  ".875rem",
  "1rem",
  "1.125rem",
  "1.25rem",
  "1.5rem",
  "1.875rem",
  "2.25rem",
  "3rem",
  "4rem",
]

const fontWeights: Record<string, CSSProperties["fontWeight"]> = {
  normal: 400,
  medium: 500,
  bold: 700,
}

const letterSpacings = {
  tight: "-0.025em",
  normal: "0",
}

const lineHeights = {
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
}

const colors = {
  white: "#FFFFFF",
  transparent: "transparent",

  primary10: "#0C008C",
  primary9: "#1D0EBE",
  primary8: "#3525E6",
  primary7: "#4D3DF7",
  primary6: "#5D55FA",
  primary5: "#7069FA",
  primary4: "#8888FC",
  primary3: "#A2A5FC",
  primary2: "#C4C6FF",
  primary1: "#E6E6FF",

  secondary10: "#014D40",
  secondary9: "#0C6B58",
  secondary8: "#147D64",
  secondary7: "#199473",
  secondary6: "#27AB83",
  secondary5: "#3EBD93",
  secondary4: "#65D6AD",
  secondary3: "#8EEDC7",
  secondary2: "#C6F7E2",
  secondary1: "#EFFCF6",

  neutral10: "#102A43",
  neutral9: "#243B53",
  neutral8: "#334E68",
  neutral7: "#486581",
  neutral6: "#627D98",
  neutral5: "#829AB1",
  neutral4: "#9FB3C8",
  neutral3: "#BCCCDC",
  neutral2: "#D9E2EC",
  neutral1: "#F0F4F8",

  // OLD COLORS
  // teal
  primary: {
    100: "#F0FFF4",
    200: "#B2F5EA",
    300: "#81E6D9",
    400: "#4FD1C5",
    500: "#38B2AC",
    600: "#319795",
    700: "#2C7A7B",
    800: "#285E61",
    900: "#234E52",
  },
  gray: {
    100: "#F7FAFC",
    200: "#EDF2F7",
    300: "#E2E8F0",
    400: "#CBD5E0",
    500: "#A0AEC0",
    600: "#718096",
    700: "#4A5568",
    800: "#2D3748",
    900: "#1A202C",
  },
  red: {
    100: "#FFF5F5",
    200: "#FED7D7",
    300: "#FEB2B2",
    400: "#FC8181",
    500: "#F56565",
    600: "#E53E3E",
    700: "#C53030",
    800: "#9B2C2C",
    900: "#742A2A",
  },
  blue: {
    100: "#EBF8FF",
    200: "#BEE3F8",
    300: "#90CDF4",
    400: "#63B3ED",
    500: "#4299E1",
    600: "#3182CE",
    700: "#2B6CB0",
    800: "#2C5282",
    900: "#2A4365",
  },
  yellow: {
    100: "#FFFFF0",
    200: "#FEFCBF",
    300: "#FAF089",
    400: "#F6E05E",
    500: "#ECC94B",
    600: "#D69E2E",
    700: "#B7791F",
    800: "#975A16",
    900: "#744210",
  },
}

const shadow = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.24), 0 1px 3px rgba(0, 0, 0, 0.12)",
  md: "0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)",
  lg: "0 3px 6px rgba(0, 0, 0, 0.1),  0 10px 20px rgba(0, 0, 0, 0.15)",
}

function spacing(multiplier: number): string {
  return `${multiplier * 0.25}rem`
}

const space = ["0"].concat([1, 2, 4, 8, 16, 32, 64, 128].map(spacing))

const Heading = {
  fontFamily: font.display,
}

const cards = {
  normal: {
    backgroundColor: "white",
    borderTop: `3px solid ${colors.primary[500]}`,
  },
  canceled: {
    color: colors.gray[700],
    backgroundColor: colors.gray[200],
    borderTop: `3px solid ${colors.gray[400]}`,
  },
}

export const theme = {
  breakpoints,
  font,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  colors,
  shadow,
  spacing,
  space,
  Heading,
  cards,

  fonts: font,
  shadows: shadow,
}

export type ThemeType = typeof theme
export default styled as CreateStyled<ThemeType>
