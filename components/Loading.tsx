import React, { useState, useEffect } from "react"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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

  return (
    <div className="text-4xl">
      <FontAwesomeIcon
        icon={faSpinner}
        spin
        className={`my-6 mx-auto text-primary-9 ${
          show ? "visible" : "invisible"
        }`}
        style={{ display: "block" }}
      />
    </div>
  )
}

export default Loading
