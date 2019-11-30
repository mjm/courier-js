import React from "react"
import Card, { CardHeader } from "./card"
import {
  createFragmentContainer,
  graphql,
  Environment,
  RelayProp,
} from "react-relay"
import { FeedRemoveCard_feed } from "../lib/__generated__/FeedRemoveCard_feed.graphql"
import { ErrorContainer } from "./ErrorContainer"
import { Button } from "./button"
import { faTrashAlt, faTimes } from "@fortawesome/free-solid-svg-icons"
import {
  AlertDialog,
  AlertDialogLabel,
  AlertDialogDescription,
} from "@reach/alert-dialog"
import { ErrorBox } from "./ErrorBox"
import Group from "./group"
import Router from "next/router"
import { deleteFeed } from "../lib/mutations/DeleteFeed"

interface Props {
  feed: FeedRemoveCard_feed
  relay: RelayProp
}

const FeedRemoveCard: React.FC<Props> = ({ feed, relay: { environment } }) => {
  return (
    <Card>
      <CardHeader>Remove This Feed</CardHeader>
      <div>
        If you remove this feed, Courier will stop seeing new posts from it.
        Tweets that have already been imported from this feed's posts will not
        be affected.
      </div>
      <RemoveButton environment={environment} id={feed.id} />
    </Card>
  )
}

export default createFragmentContainer(FeedRemoveCard, {
  feed: graphql`
    fragment FeedRemoveCard_feed on SubscribedFeed {
      id
    }
  `,
})

interface RemoveButtonProps {
  id: string
  environment: Environment
}

const RemoveButton: React.FC<RemoveButtonProps> = ({ id, environment }) => {
  const [showDialog, setShowDialog] = React.useState(false)
  const buttonRef = React.useRef(null)

  return (
    <ErrorContainer>
      {({ setError, clearErrors }) => {
        function closeDialog() {
          clearErrors()
          setShowDialog(false)
        }

        async function onDelete() {
          try {
            await deleteFeed(environment, id)
            closeDialog()
            Router.push("/feeds")
          } catch (err) {
            setError(err)
          }
        }

        return (
          <>
            <Button
              mt={3}
              color="red"
              invert
              icon={faTrashAlt}
              onClick={() => setShowDialog(true)}
            >
              Remove Feed
            </Button>

            {showDialog && (
              <AlertDialog
                leastDestructiveRef={buttonRef}
                onDismiss={closeDialog}
              >
                <ErrorBox mb={3} />

                <AlertDialogLabel>Are you sure?</AlertDialogLabel>

                <AlertDialogDescription>
                  Are you sure you want to delete this feed from your account?
                </AlertDialogDescription>

                <Group direction="row" spacing={2} mt={3}>
                  <Button color="red" icon={faTrashAlt} onClickAsync={onDelete}>
                    Remove Feed
                  </Button>
                  <Button ref={buttonRef} icon={faTimes} onClick={closeDialog}>
                    Don't Remove
                  </Button>
                </Group>
              </AlertDialog>
            )}
          </>
        )
      }}
    </ErrorContainer>
  )
}
