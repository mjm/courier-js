import styled, { CSSObject } from "@emotion/styled"

const linkStyles: CSSObject = {
  overflowWrap: "break-word",
  wordWrap: "break-word",
  wordBreak: "break-word",
}

const URLText = styled.span(linkStyles)

export default URLText

export const URLContainer = styled.span({
  a: linkStyles,
})
