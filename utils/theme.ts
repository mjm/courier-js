export const font = {
  display: "Rubik, Helvetica, sans-serif",
  body: '"IBM Plex Sans", Helvetica, sans-serif',
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
  gray: {
    100: "#F7FAFC",
    200: "#EDF2F7",
    400: "#CBD5E0",
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
}

export const shadow = {
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
}

export function spacing(multiplier: number): string {
  return `${multiplier * 0.25}rem`
}
