import styled from "styled-components"
import { spacing } from "../utils/theme"

const Container = styled.main`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0 ${spacing(5)} ${spacing(30)} ${spacing(5)};

  @media (min-width: 640px) {
    max-width: 640px;
  }

  @media (min-width: 768px) {
    max-width: 768px;
  }
`

export default Container
