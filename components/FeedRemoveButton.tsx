import React from "react"
import {
  RelayProp,
  createFragmentContainer,
  graphql,
  Environment,
} from "react-relay"
import { FeedRemoveButton_feed } from "@generated/FeedRemoveButton_feed.graphql"
import { ErrorContainer, useErrors } from "components/ErrorContainer"
import { ErrorBox } from "components/ErrorBox"
import {
  AlertDialog,
  AlertDialogLabel,
  AlertDialogDescription,
} from "@reach/alert-dialog"
import { deleteFeed } from "@mutations/DeleteFeed"
import Router from "next/router"
import AsyncButton from "components/AsyncButton"

const FeedRemoveButton: React.FC<{
  feed: FeedRemoveButton_feed
  relay: RelayProp
}> = ({ feed, relay: { environment } }) => {
  const [showDialog, setShowDialog] = React.useState(false)

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
        environment={environment}
        visible={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </ErrorContainer>
  )
}

export default createFragmentContainer(FeedRemoveButton, {
  feed: graphql`
    fragment FeedRemoveButton_feed on SubscribedFeed {
      id
      feed {
        title
      }
    }
  `,
})

const RemoveDialog: React.FC<{
  feed: FeedRemoveButton_feed
  environment: Environment
  visible: boolean
  onClose: () => void
}> = ({ feed, environment, visible, onClose }) => {
  const { setError, clearErrors } = useErrors()
  const buttonRef = React.useRef(null)

  if (!visible) {
    return null
  }

  function closeDialog() {
    clearErrors()
    onClose()
  }

  async function onDelete() {
    try {
      await deleteFeed(environment, feed.id)
      closeDialog()
      Router.push("/feeds")
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
