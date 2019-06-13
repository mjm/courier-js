import React from "react"
import styled from "styled-components"
import {
  AllTweetsFieldsFragment,
  PostTweetComponent,
  EditTweetComponent,
} from "../../lib/generated/graphql-components"
import { Formik, Form, Field, FieldArray } from "formik"
import { ErrorBox } from "../error"
import { Button } from "../button"
import {
  faPlus,
  faTrashAlt,
  faBan,
  faCheck,
  faShare,
} from "@fortawesome/free-solid-svg-icons"
import { spacing, colors } from "../../utils/theme"
import Group from "../group"

const TweetTextArea = styled(Field).attrs({ component: "textarea" })`
  width: 100%;
  height: ${spacing(25)};
  padding: ${spacing(2)};
  color: ${colors.primary[900]};
  background-color: ${colors.primary[100]};
  border-radius: 0.5rem;
  border: 2px solid ${colors.primary[500]};
  outline: none;
`

const MediaURLField = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing(1)} 0;

  & > input {
    flex-grow: 1;
    margin-right: ${spacing(2)};
    padding: ${spacing(2)};
    color: ${colors.primary[900]};
    background-color: ${colors.primary[100]};
    border: 0;
    border-bottom: 2px solid ${colors.primary[500]};
    outline: none;
  }

  & > button {
    flex-shrink: 0;
  }
`

const AddMediaButton = styled(Button)`
  margin-top: ${spacing(1)};
`

interface EditTweetProps {
  tweet: AllTweetsFieldsFragment
  onStopEditing: () => void
}

type FormValues = Pick<AllTweetsFieldsFragment, "body" | "mediaURLs"> & {
  action: "save" | "post"
}

const EditTweet = ({ tweet, onStopEditing }: EditTweetProps) => {
  const initialValues: FormValues = {
    body: tweet.body,
    mediaURLs: tweet.mediaURLs,
    action: "save",
  }
  return (
    <PostTweetComponent>
      {postTweet => (
        <EditTweetComponent>
          {editTweet => (
            <Formik
              initialValues={initialValues}
              initialStatus={{ error: null }}
              isInitialValid
              onSubmit={async ({ action, ...values }, actions) => {
                const input = { id: tweet.id, ...values }
                try {
                  if (action === "save") {
                    await editTweet({ variables: { input } })
                  } else {
                    await postTweet({ variables: { input } })
                  }
                  onStopEditing()
                } catch (err) {
                  actions.setStatus({ error: err })
                } finally {
                  actions.setSubmitting(false)
                }
              }}
            >
              {({
                isSubmitting,
                setFieldValue,
                submitForm,
                status,
                values,
              }) => {
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
                      <TweetTextArea name="body" autoFocus />
                      <FieldArray name="mediaURLs">
                        {({ insert, remove, push }) => (
                          <>
                            {values.mediaURLs.map((_url, index) => (
                              <MediaURLField key={index}>
                                <Field
                                  name={`mediaURLs.${index}`}
                                  placeholder="https://example.org/photo.jpg"
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
                              </MediaURLField>
                            ))}
                            <AddMediaButton
                              onClick={() => push("")}
                              disabled={!canAddMedia()}
                              icon={faPlus}
                            >
                              Add Media
                            </AddMediaButton>
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
          )}
        </EditTweetComponent>
      )}
    </PostTweetComponent>
  )
}

export default EditTweet
