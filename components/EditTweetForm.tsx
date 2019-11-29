import React from "react"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { Formik, FieldArray, Field, Form } from "formik"
import Group from "./group"
import { Button } from "./button"
import {
  faPlus,
  faTrashAlt,
  faShare,
  faCheck,
  faBan,
} from "@fortawesome/free-solid-svg-icons"
import { Flex } from "@rebass/emotion"
import { ErrorBox } from "./error"
import { EditTweetForm_tweet } from "../lib/__generated__/EditTweetForm_tweet.graphql"
import { editTweet } from "../lib/mutations/EditTweet"
import { postTweet } from "../lib/mutations/PostTweet"

interface Props {
  tweet: EditTweetForm_tweet
  onStopEditing: () => void
  relay: RelayProp
}

type FormValues = Pick<EditTweetForm_tweet, "body" | "mediaURLs"> & {
  action: "save" | "post"
}

const EditTweetForm = ({ tweet, onStopEditing, relay }: Props) => {
  const initialValues: FormValues = {
    body: tweet.body,
    mediaURLs: tweet.mediaURLs,
    action: "save",
  }

  return (
    <Formik
      initialValues={initialValues}
      initialStatus={{ error: null }}
      isInitialValid
      onSubmit={async ({ action, ...values }, actions) => {
        const input = { id: tweet.id, ...values }
        try {
          if (action === "save") {
            editTweet(relay.environment, input)
          } else {
            await postTweet(relay.environment, input)
          }
          onStopEditing()
        } catch (err) {
          actions.setStatus({ error: err })
        } finally {
          actions.setSubmitting(false)
        }
      }}
    >
      {({ isSubmitting, setFieldValue, submitForm, status, values }) => {
        function submit(action: FormValues["action"]) {
          setFieldValue("action", action)
          // allow the previous line to rerender the component before doing this
          setTimeout(() => submitForm(), 0)
        }

        function submitting(action: FormValues["action"]) {
          return isSubmitting && action === values.action
        }

        function canAddMedia() {
          return values.mediaURLs.length < 4
        }

        return (
          <Form>
            <Group direction="column" spacing={2}>
              <ErrorBox error={status.error} />
              <Field
                component="textarea"
                name="body"
                autoFocus
                css={(theme: any) => [
                  {
                    width: "100%",
                    height: theme.space[6],
                    border: `2px solid ${theme.colors.primary[500]}`,
                    borderRadius: "0.5rem",
                  },
                  inputStyles(theme),
                ]}
              />
              <FieldArray name="mediaURLs">
                {({ insert, remove, push }) => (
                  <>
                    {values.mediaURLs.map((_url, index) => (
                      <Flex key={index} alignItems="center" py={1}>
                        <Field
                          name={`mediaURLs.${index}`}
                          placeholder="https://example.org/photo.jpg"
                          css={(theme: any) => [
                            {
                              flexGrow: 1,
                              marginRight: theme.space[2],
                              border: 0,
                              borderBottom: `2px solid ${theme.colors.primary[500]}`,
                            },
                            inputStyles(theme),
                          ]}
                        />
                        <Button
                          onClick={() => insert(index, "")}
                          disabled={!canAddMedia()}
                          icon={faPlus}
                        >
                          Add Above
                        </Button>
                        <Button
                          onClick={() => remove(index)}
                          color="red"
                          icon={faTrashAlt}
                        >
                          Remove
                        </Button>
                      </Flex>
                    ))}
                    <Button
                      onClick={() => push("")}
                      disabled={!canAddMedia()}
                      icon={faPlus}
                    >
                      Add Media
                    </Button>
                  </>
                )}
              </FieldArray>
              <Group direction="row" spacing={2} wrap>
                <Button
                  disabled={isSubmitting}
                  icon={faBan}
                  color="red"
                  invert
                  onClick={onStopEditing}
                >
                  Discard Changes
                </Button>
                <Button
                  disabled={isSubmitting}
                  icon={faCheck}
                  spin={submitting("save")}
                  invert
                  onClick={() => submit("save")}
                >
                  Save Draft
                </Button>
                <Button
                  disabled={isSubmitting}
                  icon={faShare}
                  spin={submitting("post")}
                  color="blue"
                  invert
                  onClick={() => submit("post")}
                >
                  Post Now
                </Button>
              </Group>
            </Group>
          </Form>
        )
      }}
    </Formik>
  )
}

export default createFragmentContainer(EditTweetForm, {
  tweet: graphql`
    fragment EditTweetForm_tweet on Tweet {
      id
      body
      mediaURLs
    }
  `,
})

const inputStyles = (theme: any) => ({
  padding: theme.space[2],
  color: theme.colors.primary[900],
  backgroundColor: theme.colors.primary[100],
  outline: "none",
})
