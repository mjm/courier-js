import styled from "@emotion/styled"
import { Field, Formik, Form, ErrorMessage, FormikActions } from "formik"
import * as yup from "yup"
import { Environment } from "react-relay"
import { ErrorContainer } from "./ErrorContainer"
import { ErrorBox } from "./ErrorBox"
import { Button } from "./Button"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { addFeed } from "../lib/mutations/AddFeed"
import { FieldError } from "./FieldError"

interface Props {
  environment: Environment
}

const AddFeedForm: React.FC<Props> = ({ environment }) => {
  return (
    <ErrorContainer>
      {({ setError }) => {
        const onSubmit = async (
          input: { url: string },
          actions: FormikActions<{ url: string }>
        ) => {
          try {
            await addFeed(environment, input.url)
            actions.resetForm()
          } catch (error) {
            setError(error)
          } finally {
            actions.setSubmitting(false)
          }
        }

        return (
          <Formik
            initialValues={initialNewFeed}
            validationSchema={newFeedSchema}
            onSubmit={onSubmit}
            render={({ isSubmitting }) => (
              <Form>
                <ErrorBox mb={3} />
                <FormContainer>
                  <FormField>
                    <URLField type="text" name="url" placeholder="https://" />
                    <ErrorMessage name="url" component={FieldError} />
                  </FormField>
                  <Button
                    size="large"
                    type="submit"
                    icon={faPlusCircle}
                    spin={isSubmitting}
                  >
                    Add Feed
                  </Button>
                </FormContainer>
              </Form>
            )}
          />
        )
      }}
    </ErrorContainer>
  )
}

export default AddFeedForm

const newFeedSchema = yup.object().shape({
  url: yup.string().url("This must be a valid URL."),
})
const initialNewFeed = { url: "" }

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 500px) {
    flex-wrap: nowrap;
    margin-right: -0.5rem;
  }
`

const FormField = styled.div(({ theme }: any) => ({
  flexGrow: 1,
  width: "100%",
  marginBottom: theme.spacing(2),
  "@media (min-width: 500px)": {
    paddingRight: theme.spacing(3),
    marginBottom: 0,
  },
}))

const URLField = styled(Field)(({ theme }: any) => ({
  width: "100%",
  fontSize: "1.5rem",
  padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
  backgroundColor: theme.colors.gray[100],
  border: 0,
  borderBottom: `3px solid ${theme.colors.primary[500]}`,
  color: theme.colors.primary[700],
  boxShadow: theme.shadow.sm,

  ":focus": {
    outline: "none",
  },

  "::placeholder": {
    color: theme.colors.gray[400],
  },
}))
