import React from "react"
import { Formik, Form, Field } from "formik"
import AsyncButton from "components/AsyncButton"

interface Props {
  url: string
  onChange: (url: string) => void
  onWatch: () => Promise<void>
}
const PreviewFeedForm: React.FC<Props> = ({ url, onChange, onWatch }) => {
  return (
    <Formik
      initialValues={{ url }}
      onSubmit={(values, helpers) => {
        onChange(values.url)
        helpers.setSubmitting(false)
      }}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <div className="pt-8 pb-4 text-neutral-10">
            Enter the URL of a web site or feed to watch for new tweets:
          </div>
          <div className="bg-neutral-1 w-full flex shadow-md">
            <Field
              type="text"
              name="url"
              placeholder="https://example.org"
              className="bg-transparent text-xl text-neutral-10 w-full p-3 focus:outline-none"
            />
            {values.url !== "" && url === values.url ? (
              <AsyncButton
                type="button"
                className="btn btn-first btn-first-secondary flex-shrink-0 m-2 outline-none"
                onClick={async () => await onWatch()}
              >
                Watch
              </AsyncButton>
            ) : (
              <button
                type="submit"
                disabled={values.url === "" || isSubmitting}
                className="btn btn-first btn-first-primary flex-shrink-0 m-2 outline-none"
              >
                Preview
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default PreviewFeedForm
