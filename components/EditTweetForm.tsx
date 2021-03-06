import React from "react"
import { graphql } from "react-relay"
import { useFragment, useRelayEnvironment } from "react-relay/hooks"

import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Field, FieldArray, Form, Formik, useFormikContext } from "formik"

import {
  EditTweetForm_tweet,
  EditTweetForm_tweet$key,
} from "@generated/EditTweetForm_tweet.graphql"
import { editTweet } from "@mutations/EditTweet"
import { postTweet } from "@mutations/PostTweet"
import { ErrorBox } from "components/ErrorBox"
import TweetCardActions from "components/TweetCardActions"

interface FormValues {
  action: "save" | "post"
  tweets: EditTweetForm_tweet["tweets"]
}

const EditTweetForm: React.FC<{
  tweet: EditTweetForm_tweet$key
  onStopEditing: () => void
}> = ({ tweet, onStopEditing }) => {
  const environment = useRelayEnvironment()
  const { id, tweets } = useFragment(
    graphql`
      fragment EditTweetForm_tweet on TweetGroup {
        id
        tweets {
          body
          mediaURLs
        }
      }
    `,
    tweet
  )
  const initialValues: FormValues = {
    tweets: tweets.map(t => ({ ...t })),
    action: "save",
  }

  return (
    <Formik
      initialValues={initialValues}
      initialStatus={{ error: null }}
      onSubmit={async ({ action, tweets }, actions) => {
        const input = {
          id,
          tweets: tweets.map(({ mediaURLs, ...t }) => ({
            mediaURLs: mediaURLs.filter(url => url !== ""),
            ...t,
          })),
        }

        try {
          if (action === "save") {
            editTweet(environment, input)
          } else {
            await postTweet(environment, input)
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
        function submit(action: FormValues["action"]): void {
          setFieldValue("action", action)
          // allow the previous line to rerender the component before doing this
          setTimeout(() => {
            submitForm()
          }, 0)
        }

        return (
          <Form>
            <ErrorBox error={status.error} />
            {values.tweets.map((t, i) => (
              <>
                <div className="px-4 pt-5 pb-3">
                  <Field
                    component="textarea"
                    name={`tweets.${i}.body`}
                    autoFocus
                    className="bg-neutral-1 border border-neutral-2 rounded w-full h-32 p-3 focus:outline-none"
                  />
                </div>
                <MediaURLFields
                  name={`tweets.${i}.mediaURLs`}
                  urls={t.mediaURLs}
                />
              </>
            ))}
            <TweetCardActions
              left={
                <>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="btn btn-first btn-first-primary mr-2"
                    onClick={() => submit("post")}
                  >
                    Post now
                  </button>
                  <button
                    type="button"
                    className="btn btn-second btn-second-neutral"
                    disabled={isSubmitting}
                    onClick={() => submit("save")}
                  >
                    Save draft
                  </button>
                </>
              }
              right={
                <button
                  type="button"
                  className="btn btn-third btn-third-neutral"
                  disabled={isSubmitting}
                  onClick={onStopEditing}
                >
                  Discard changes
                </button>
              }
            />
          </Form>
        )
      }}
    </Formik>
  )
}

export default EditTweetForm

interface MediaURLFieldsProps {
  name: string
  urls: readonly string[]
}
const MediaURLFields: React.FC<MediaURLFieldsProps> = ({ name, urls }) => {
  const { setFieldValue } = useFormikContext()
  const canAddMedia = urls.length < 4 || (urls.length === 4 && urls[3] === "")

  const lastURL = urls.length ? urls[urls.length - 1] : null
  React.useEffect(() => {
    if (urls.length === 4) {
      return
    }

    if (lastURL !== "") {
      setFieldValue(name, [...urls, ""])
    }
  }, [urls, urls.length, lastURL])

  return (
    <FieldArray name={name}>
      {({ insert, remove, pop }) => {
        function realInsert(index: number): void {
          insert(index, "")
          if (urls.length === 4 && urls[3] === "") {
            pop()
          }
        }

        return (
          <div className="pb-4 px-4">
            <h4 className="text-xs font-bold text-neutral-6 uppercase">
              Image URLs
            </h4>
            <div className="border border-neutral-2 bg-neutral-1 rounded">
              {urls.map((url, index) => (
                <div
                  key={index}
                  className={`flex items-center border-neutral-2 ${
                    index + 1 === urls.length ? "" : "border-b"
                  }`}
                >
                  <Field
                    name={`${name}.${index}`}
                    placeholder="https://example.org/photo.jpg"
                    className="appearance-none bg-transparent border-none w-full p-3 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    className="flex-shrink-0 border-transparent outline-none px-2 py-1 text-neutral-6 disabled:text-neutral-4 text-lg"
                    onClick={() => realInsert(index)}
                    disabled={!canAddMedia || url === ""}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                  <button
                    type="button"
                    className="flex-shrink-0 border-transparent outline-none pl-2 pr-3 py-1 text-neutral-6 disabled:text-neutral-4 text-lg"
                    onClick={() => remove(index)}
                    disabled={url === "" && index === urls.length - 1}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      }}
    </FieldArray>
  )
}
