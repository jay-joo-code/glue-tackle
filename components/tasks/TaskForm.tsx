import { Button, Paper, Stack, TextInput, Title } from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form"
import { useDebouncedValue } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { Task } from "@prisma/client"
import Flex from "components/glue/Flex"
import api from "lib/api"
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

    // eslint-disable-next-line
  }, [debouncedFormValues])

  const handleSave = async (values: Task) => {
    await api.put(`/tasks/${router?.query?.id}`, values)
    mutate("/tasks/my-tasks")
  }

  const handleSubmit = (values) => {
    handleSave(values)
    router.push("/tasks/my-tasks")
  }

  return (
    <Paper>
      <Title></Title>
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
