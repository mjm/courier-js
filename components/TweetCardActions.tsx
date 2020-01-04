import React from "react"
import Group from "components/Group"

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
        <div className="mx-auto flex flex-col items-center">
          <div className="bg-primary-1 text-primary-10 rounded-full uppercase text-xs font-bold shadow-sm inline-block py-1 px-4">
            {banner}
          </div>
        </div>
      )}
      <div className="flex">
        {left && (
          <Group direction="row" spacing={2}>
            {left}
          </Group>
        )}
        {right && <div className="ml-auto">{right}</div>}
      </div>
    </div>
  )
}

export default TweetCardActions
