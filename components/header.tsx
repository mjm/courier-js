import { colors } from "../utils/theme"
export const PageHeader = ({ children, ...props }: any) => {
  return (
    <h1 {...props}>
      {children}
      <style jsx>{`
        h1 {
          font-weight: 900;
          font-size: 2.5rem;
          text-align: center;
          color: ${colors.primary[900]};
        }
      `}</style>
    </h1>
  )
}
