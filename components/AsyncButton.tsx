import React from "react"

type OnClickAsync = (
  event: React.MouseEvent<HTMLButtonElement>
) => Promise<void>

type Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  onClick: OnClickAsync
}

const AsyncButton: React.FC<Props> = ({ onClick, disabled, ...props }) => {
  const [isRunning, setRunning] = React.useState(false)

  async function realOnClick(event: React.MouseEvent<HTMLButtonElement>) {
    setRunning(true)
    try {
      await onClick(event)
    } finally {
      setRunning(false)
    }
  }

  return (
    <button onClick={realOnClick} disabled={disabled || isRunning} {...props} />
  )
}

export default AsyncButton
