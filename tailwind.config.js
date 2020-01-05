const fonts = ["IBM Plex Sans", "sans-serif"]

module.exports = {
  theme: {
    fontFamily: {
      display: fonts,
      body: fonts,
    },
    extend: {
      colors: {
        primary: {
          "10": "#0C008C",
          "9": "#1D0EBE",
          "8": "#3525E6",
          "7": "#4D3DF7",
          "6": "#5D55FA",
          "5": "#7069FA",
          "4": "#8888FC",
          "3": "#A2A5FC",
          "2": "#C4C6FF",
          "1": "#E6E6FF",
        },
        secondary: {
          "10": "#014D40",
          "9": "#0C6B58",
          "8": "#147D64",
          "7": "#199473",
          "6": "#27AB83",
          "5": "#3EBD93",
          "4": "#65D6AD",
          "3": "#8EEDC7",
          "2": "#C6F7E2",
          "1": "#EFFCF6",
        },
        neutral: {
          "10": "#102A43",
          "9": "#243B53",
          "8": "#334E68",
          "7": "#486581",
          "6": "#627D98",
          "5": "#829AB1",
          "4": "#9FB3C8",
          "3": "#BCCCDC",
          "2": "#D9E2EC",
          "1": "#F0F4F8",
        },
      },
    },
  },
  variants: {
    textColor: ["responsive", "hover", "focus", "disabled"],
    backgroundColor: ["responsive", "hover", "focus", "disabled"],
  },
  plugins: [],
}
