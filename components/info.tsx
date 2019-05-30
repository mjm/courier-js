import React from "react"
import styled from "styled-components"
import { colors, spacing } from "../utils/theme"

const InfoLabel = styled.div`
  width: 180px;
  color: ${colors.primary[800]};
  font-weight: 500;
`

const InfoValue = styled.div`
  color: ${colors.gray[900]};
`

const StyledField = styled.div`
  display: flex;
  line-height: 1.8em;
`

type InfoFieldProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]> & {
  label: string
}
export const InfoField = ({ label, children, ...props }: InfoFieldProps) => (
  <StyledField {...props}>
    <InfoLabel>{label}</InfoLabel>
    <InfoValue>{children}</InfoValue>
  </StyledField>
)

export const InfoTable = styled.table`
  table-layout: fixed;
  width: 100%;
  margin-top: ${spacing(2)};
  white-space: nowrap;
  margin-left: -${spacing(1)};
  margin-right: -${spacing(1)};

  td {
    line-height: 2em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 ${spacing(1)};
  }
`
