import React from "react"
import { spacing } from "../utils/theme"

type Props = React.PropsWithoutRef<JSX.IntrinsicElements["main"]>
const Container = ({ children, ...props }: Props) => (
  <main {...props}>
    {children}
    <style jsx>{`
      main {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        padding: 0 ${spacing(5)} ${spacing(30)} ${spacing(5)};
      }

      @media (min-width: 640px) {
        main {
          max-width: 640px;
        }
      }

      @media (min-width: 768px) {
        main {
          max-width: 768px;
        }
      }
    `}</style>
  </main>
)

export default Container
