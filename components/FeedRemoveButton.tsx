import React from "react"
import { graphql } from "react-relay"
import { useFragment, useRelayEnvironment } from "react-relay/hooks"

import Router from "next/router"

import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from "@reach/alert-dialog"

import {
  FeedRemoveButton_feed,
  FeedRemoveButton_feed$key,
} from "@generated/FeedRemoveButton_feed.graphql"
import { deleteFeed } from "@mutations/DeleteFeed"
import AsyncButton from "components/AsyncButton"
import { ErrorBox } from "components/ErrorBox"
import { ErrorContainer, useErrors } from "components/ErrorContainer"

const FeedRemoveButton: React.FC<{
  feed: FeedRemoveButton_feed$key
}> = props => {
  const [showDialog, setShowDialog] = React.useState(false)
  const feed = useFragment(
    graphql`
      fragment FeedRemoveButton_feed on Feed {
        id
      }
    `,
    props.feed
  )

  return (
    <ErrorContainer>
      <button
        type="button"
        className="btn btn-third btn-third-neutral w-full font-medium mt-2"
        onClick={() => setShowDialog(true)}
      >
        Stop watching
      </button>
      <RemoveDialog
        feed={feed}
        visible={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </ErrorContainer>
  )
}

export default FeedRemoveButton

const RemoveDialog: React.FC<{
  feed: FeedRemoveButton_feed
  visible: boolean
  onClose: () => void
}> = ({ feed, visible, onClose }) => {
  const environment = useRelayEnvironment()
  const { setError, clearErrors } = useErrors()
  const buttonRef = React.useRef(null)

  if (!visible) {
    return null
  }

  function closeDialog(): void {
    clearErrors()
    onClose()
  }

  async function onDelete(): Promise<void> {
    try {
      await deleteFeed(environment, feed.id)
      closeDialog()
      await Router.push("/feeds")
    } catch (err) {
      setError(err)
    }
  }

  return (
    <AlertDialog leastDestructiveRef={buttonRef} onDismiss={closeDialog}>
      <AlertDialogLabel>Stop Watching Feed</AlertDialogLabel>

      <ErrorBox className="m-4" />

      <AlertDialogDescription>
        Are you sure you want to stop watching this feed?
      </AlertDialogDescription>

      <div className="flex flex-row-reverse p-4 bg-neutral-1 rounded-b-lg">
        <AsyncButton
          className="btn btn-first btn-first-red ml-3"
          onClick={onDelete}
        >
          Stop watching
        </AsyncButton>
        <button
          className="btn btn-third btn-third-neutral focus:outline-none"
          ref={buttonRef}
          onClick={closeDialog}
        >
          Keep watching
        </button>
      </div>
    </AlertDialog>
  )
}
