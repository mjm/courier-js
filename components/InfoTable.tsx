import styled from "@emotion/styled"

const InfoTable = styled.table(({ theme }: any) => ({
  tableLayout: "fixed",
  width: "100%",
  marginTop: theme.space[2],
  whiteSpace: "nowrap",
  marginLeft: `-${theme.space[1]}`,
  marginRight: `-${theme.space[1]}`,
  td: {
    lineHeight: theme.lineHeights.loose,
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: `0 ${theme.space[1]}`,
  },
}))

export default InfoTable
