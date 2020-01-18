import React from "react"

interface Props {
  inline?: boolean
  left?: React.ReactNode
  right?: React.ReactNode
  banner?: React.ReactNode
}

const TweetCardActions: React.FC<Props> = ({
  inline = false,
  left,
  right,
  banner,
}) => {
  return (
    <div
      className={`p-4 rounded-b-lg ${banner ? "mt-3" : "mt-0"} ${
        inline ? "bg-transparent shadow-none pt-0" : "bg-neutral-1 shadow-inner"
      }`}
    >
      {banner && (
        <div className="mx-auto -mt-8 mb-3 flex flex-col items-center py-1">
          <div className="bg-primary-1 text-primary-10 rounded-full uppercase text-xs font-bold shadow inline-block py-1 px-4">
            {banner}
          </div>
        </div>
      )}
      <div className="flex">
        {left && <div>{left}</div>}
        {right && <div className="ml-auto">{right}</div>}
      </div>
    </div>
  )
}

export default TweetCardActions
