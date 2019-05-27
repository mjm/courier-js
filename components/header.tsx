import styled from "styled-components"
import { colors, font } from "../utils/theme"

export const PageHeader = styled.h1`
  font-family: ${font.display};
  font-weight: 700;
  font-size: 2.7rem;
  text-align: center;
  letter-spacing: -0.025em;
  color: ${colors.primary[900]};
  margin-bottom: 0;
`

export const PageDescription = styled.p`
  color: ${colors.primary[900]};
  text-align: center;
  margin-bottom: 2em;
`

export const SectionHeader = styled.h2`
  font-family: ${font.display};
  color: ${colors.primary[800]};
  letter-spacing: -0.025em;
`
