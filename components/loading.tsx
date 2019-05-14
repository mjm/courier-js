import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { colors } from "../utils/theme"

interface Props {
  delay?: number
}

const Loading = ({ delay = 1000 }: Props) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (!show) {
    return null
  }

  return (
    <div>
      <FontAwesomeIcon icon={faSpinner} spin />
      <style jsx>{`
        div > :global(svg) {
          display: block;
          margin: 2rem auto;
          font-size: 2.5rem;
          color: ${colors.primary[700]};
        }
      `}</style>
    </div>
  )
}

export default Loading
