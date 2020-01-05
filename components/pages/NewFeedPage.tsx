import React from "react"

import withSecurePage from "hocs/withSecurePage"

const NewFeedPage: React.FC = () => {
  return (
    <main className="mx-auto max-w-lg">
      <div className="pt-8 pb-4 text-neutral-10">
        Enter the URL of a web site or feed to watch for new tweets:
      </div>
      <div className="bg-neutral-1 w-full flex shadow-md">
        <input
          type="text"
          placeholder="https://example.org"
          className="bg-transparent text-xl text-neutral-10 w-full p-3 focus:outline-none"
        />
        <button className="btn btn-first btn-first-primary flex-shrink-0 m-2">
          Preview
        </button>
      </div>
    </main>
  )
}

export default withSecurePage(NewFeedPage)
