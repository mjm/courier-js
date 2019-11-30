import "@reach/dialog/styles.css"
import { InterpolationWithTheme, Global } from "@emotion/core"

const styles: InterpolationWithTheme<any> = theme => ({
  "[data-reach-dialog-content]": {
    width: "500px",
    maxWidth: "100%",
    backgroundColor: "white",
    boxShadow: theme.shadow.lg,
    padding: theme.space[3],
    borderTop: `3px solid ${theme.colors.primary[600]}`,
    borderBottomLeftRadius: "0.25rem",
    borderBottomRightRadius: "0.25rem",
  },
  "[data-reach-alert-dialog-label]": {
    fontFamily: theme.font.display,
    fontSize: "1.2rem",
    fontWeight: 500,
    marginBottom: theme.space[2],
    color: theme.colors.primary[800],
  },
  "[data-reach-alert-dialog-description]": {
    lineHeight: theme.lineHeights.normal,
  },
})

export const DialogStyles = () => <Global styles={styles} />
