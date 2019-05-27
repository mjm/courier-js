import React from "react"
import styled from "styled-components"
import { colors } from "../utils/theme"

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
