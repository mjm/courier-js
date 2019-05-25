import { colors, font } from "../utils/theme"

type PageHeaderProps = React.PropsWithoutRef<JSX.IntrinsicElements["h1"]>
export const PageHeader = ({ children, ...props }: PageHeaderProps) => {
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
          margin-bottom: 0;
        }
      `}</style>
    </h1>
  )
}

type PageDescriptionProps = React.PropsWithoutRef<JSX.IntrinsicElements["p"]>
export const PageDescription = ({
  children,
  ...props
}: PageDescriptionProps) => (
  <p {...props}>
    {children}
    <style jsx>{`
      p {
        color: ${colors.primary[900]};
        text-align: center;
        margin-bottom: 2em;
      }
    `}</style>
  </p>
)

type SectionHeaderProps = React.PropsWithoutRef<JSX.IntrinsicElements["h2"]>
export const SectionHeader = ({ children, ...props }: SectionHeaderProps) => (
  <h2 {...props}>
    {children}
    <style jsx>{`
      h2 {
        font-family: ${font.display};
        color: ${colors.primary[800]};
        letter-spacing: -0.025em;
      }
    `}</style>
  </h2>
)
