import React from "react"
import {
  AllTweetsFieldsFragment,
  PostTweetComponent,
  EditTweetComponent,
} from "../../lib/generated/graphql-components"
import { Formik, Form, Field, FieldArray } from "formik"
import { ErrorBox } from "../error"
import { PillButton } from "../button"
import {
  faPlus,
  faTrashAlt,
  faBan,
  faCheck,
  faShare,
} from "@fortawesome/free-solid-svg-icons"
import { BoxButtons } from "../box"
import { spacing, colors } from "../../utils/theme"

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
    <div>
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
                      <ErrorBox error={status.error} />
                      <Field name="body" component="textarea" autoFocus />
                      <FieldArray name="mediaURLs">
                        {({ insert, remove, push }) => (
                          <>
                            {values.mediaURLs.map((_url, index) => (
                              <div key={index} className="media-url">
                                <Field
                                  name={`mediaURLs.${index}`}
                                  placeholder="https://example.org/photo.jpg"
                                />
                                <PillButton
                                  onClick={() => insert(index, "")}
                                  disabled={!canAddMedia()}
                                  icon={faPlus}
                                >
                                  Add Above
                                </PillButton>
                                <PillButton
                                  onClick={() => remove(index)}
                                  color="red"
                                  icon={faTrashAlt}
                                >
                                  Remove
                                </PillButton>
                              </div>
                            ))}
                            <PillButton
                              onClick={() => push("")}
                              className="add"
                              disabled={!canAddMedia()}
                              icon={faPlus}
                            >
                              Add Media
                            </PillButton>
                          </>
                        )}
                      </FieldArray>
                      <BoxButtons>
                        <PillButton
                          disabled={isSubmitting}
                          icon={faBan}
                          color="red"
                          invert
                          onClick={onStopEditing}
                        >
                          Discard Changes
                        </PillButton>
                        <PillButton
                          disabled={isSubmitting}
                          icon={faCheck}
                          spin={submitting("save")}
                          invert
                          onClick={() => submit("save")}
                        >
                          Save Draft
                        </PillButton>
                        <PillButton
                          disabled={isSubmitting}
                          icon={faShare}
                          spin={submitting("post")}
                          color="blue"
                          invert
                          onClick={() => submit("post")}
                        >
                          Post Now
                        </PillButton>
                      </BoxButtons>
                    </Form>
                  )
                }}
              </Formik>
            )}
          </EditTweetComponent>
        )}
      </PostTweetComponent>
      <style jsx>{`
        div :global(textarea) {
          width: 100%;
          height: ${spacing(25)};
          padding: ${spacing(2)};
          color: ${colors.primary[900]};
          background-color: ${colors.primary[100]};
          border-radius: 0.5rem;
          border: 2px solid ${colors.primary[500]};
          line-height: 1.5em;
          outline: none;
        }
        .media-url {
          display: flex;
          align-items: center;
          padding: ${spacing(1)} 0;
        }
        .media-url > :global(input) {
          flex-grow: 1;
          margin-right: ${spacing(2)};
          padding: ${spacing(2)};
          color: ${colors.primary[900]};
          background-color: ${colors.primary[100]};
          border: 0;
          border-bottom: 2px solid ${colors.primary[500]};
          outline: none;
        }
        .media-url > :global(button) {
          flex-shrink: 0;
        }
        div :global(.add) {
          margin-top: ${spacing(1)};
        }
      `}</style>
    </div>
  )
}

export default EditTweet
