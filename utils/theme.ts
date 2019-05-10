export const font = {
  family:
    "-apple-system, BlinkMacSystemFont, Avenir Next, Avenir, Helvetica, sans-serif",
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
}

export function spacing(multiplier: number): string {
  return `${multiplier * 0.25}rem`
}
