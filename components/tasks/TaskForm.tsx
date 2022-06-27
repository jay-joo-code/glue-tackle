import { Button, Paper, Stack, TextInput, Title } from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form"
import { useDebouncedValue, useLocalStorage } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { Task } from "@prisma/client"
import Flex from "components/glue/Flex"
import api from "lib/glue/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { useSWRConfig } from "swr"
import { z } from "zod"

interface ITaskFormProps {
  initialValues: Task
}

const schema = z.object({
  name: z.string().min(2, { message: "Name should have at least 2 letters" }),
})

const TaskForm = ({ initialValues }: ITaskFormProps) => {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [localStorageValue, setLocalStorageValue] = useLocalStorage({
    key: "auth-redirect-form-value-task",
    defaultValue: null,
  })
  const { status, data: sessionData } = useSession()

  useEffect(() => {
    if (localStorageValue) {
      form.setValues(localStorageValue)
      setLocalStorageValue(null)
    }
  }, [])

  const form = useForm({
    initialValues,
    schema: zodResolver(schema),
  })
  const formRef = useRef<HTMLFormElement>(null)

  const [debouncedFormValues] = useDebouncedValue(form.values, 500)

  useEffect(() => {
    // autosave only works for validated documents
    // because form validations run before saving
    // the whole form would be bright red with errors if
    // autosave worked with unvalidated documents
    if (initialValues?.isValidated) {
      const { hasErrors } = form.validate()

      if (!hasErrors) {
        handleSave(debouncedFormValues)
        showNotification({
          message: "Changes saved",
          color: "green",
        })
      }
    }
  }, [debouncedFormValues])

  const handleSave = async (values: Task) => {
    await api.put(`/tasks/${router?.query?.id}`, { ...values })
    mutate("/tasks/my-tasks")
  }

  const handleSubmit = (values) => {
    if (status === "unauthenticated") {
      setLocalStorageValue(values)
      // const path = `/api/auth/signin?redirectPath=/tasks/edit/${initialValues?.id}`

      router.push({
        pathname: "/auth/signin",
        query: { callbackUrl: `/tasks/edit/${initialValues?.id}` },
      })
    } else {
      handleSave(values)
      router.push("/tasks/my-tasks")
    }
  }

  return (
    <Paper>
      <form ref={formRef} onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput label="Name" {...form.getInputProps("name")} />
          <Flex justify="flex-end">
            <Button type="submit">Save</Button>
          </Flex>
        </Stack>
      </form>
    </Paper>
  )
}

export default TaskForm
