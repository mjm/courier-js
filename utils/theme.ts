export const breakpoints = ["640px", "768px", "1024px", "1280px"]

export const font = {
  display: "Rubik, Helvetica, sans-serif",
  body: '"IBM Plex Sans", Helvetica, sans-serif',
}

export const fonts = font

export const fontSizes = [
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

export const fontWeights = {
  normal: "400",
  medium: "500",
  bold: "700",
}

export const letterSpacings = {
  tight: "-0.025em",
  normal: "0",
}

export const colors = {
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
  primary100: "#F0FFF4",
  primary200: "#B2F5EA",
  primary300: "#81E6D9",
  primary400: "#4FD1C5",
  primary500: "#38B2AC",
  primary600: "#319795",
  primary700: "#2C7A7B",
  primary800: "#285E61",
  primary900: "#234E52",
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
  gray100: "#F7FAFC",
  gray200: "#EDF2F7",
  gray300: "#E2E8F0",
  gray400: "#CBD5E0",
  gray500: "#A0AEC0",
  gray600: "#718096",
  gray700: "#4A5568",
  gray800: "#2D3748",
  gray900: "#1A202C",
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
  red100: "#FFF5F5",
  red200: "#FED7D7",
  red300: "#FEB2B2",
  red400: "#FC8181",
  red500: "#F56565",
  red600: "#E53E3E",
  red700: "#C53030",
  red800: "#9B2C2C",
  red900: "#742A2A",
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
  blue100: "#EBF8FF",
  blue200: "#BEE3F8",
  blue300: "#90CDF4",
  blue400: "#63B3ED",
  blue500: "#4299E1",
  blue600: "#3182CE",
  blue700: "#2B6CB0",
  blue800: "#2C5282",
  blue900: "#2A4365",
}

export const shadow = {
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
}

export const shadows = shadow

export function spacing(multiplier: number): string {
  return `${multiplier * 0.25}rem`
}

export const space = ["0"].concat([1, 2, 4, 8, 16, 32, 64, 128].map(spacing))

export const Heading = {
  fontFamily: fonts.display,
}
