import React from "react"
import {
  faExclamationCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const variants = {
  error: {
    box: "bg-red-1 border-red-3 text-red-9",
    color: "red",
    icon: faExclamationCircle,
    iconStyle: "text-red-7",
  },
  warning: {
    box: "bg-yellow-1 border-yellow-3 text-yellow-9",
    color: "yellow",
    icon: faExclamationTriangle,
    iconStyle: "text-yellow-7",
  },
}

interface Props {
  variant?: keyof typeof variants
  onClose?: () => void
  title?: string
  children: React.ReactNode
  className?: string
}
const Notice = ({ variant = "warning", title, children, className }: Props) => {
  const { box, icon, iconStyle } = variants[variant]
  return (
    <div
      className={`p-4 rounded-lg shadow border-2 flex items-start ${box} ${className ||
        ""}`}
    >
      <div className="flex-shrink-0 text-lg">
        <FontAwesomeIcon icon={icon} className={`${iconStyle}`} />
      </div>
      {title ? (
        <div className="flex-grow ml-3">
          <h4 className="text-base font-bold">{title}</h4>
          <div>{children}</div>
        </div>
      ) : (
        <div className="flex-grow ml-3">{children}</div>
      )}
    </div>
  )
}

export default Notice
