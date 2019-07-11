import { InterpolationWithTheme, Global } from "@emotion/core"

const styles: InterpolationWithTheme<any> = theme => ({
  html: {
    boxSizing: "border-box",
  },
  "*, *:before, *:after": {
    boxSizing: "inherit",
  },
  body: {
    fontFamily: theme.fonts.body,
    backgroundColor: "#f9ffff",
  },
})

export const BodyStyles = () => <Global styles={styles} />
