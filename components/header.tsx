import { colors, font } from "../utils/theme"

export const PageHeader = ({ children, ...props }: any) => {
  return (
    <h1 {...props}>
      {children}
      <style jsx>{`
        h1 {
          font-family: ${font.display};
          font-weight: 700;
          font-size: 2.7rem;
          text-align: center;
          letter-spacing: -0.025em;
          color: ${colors.primary[900]};
        }
      `}</style>
    </h1>
  )
}
