import React, { useState, useEffect } from "react"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import Icon from "./icon"

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
      <Icon
        style={{ display: "block" }}
        my={4}
        mx="auto"
        fontSize={7}
        color="primary.700"
        icon={faSpinner}
        spin
      />
    </div>
  )
}

export default Loading
