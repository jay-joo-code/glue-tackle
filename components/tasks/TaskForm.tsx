import {
  Button,
  Container,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form"
import { Task } from "@prisma/client"
import Flex from "components/glue/Flex"
import React from "react"
import { z } from "zod"

interface ITaskFormProps {
  initialValues: Task
}

const schema = z.object({
  name: z.string().min(2, { message: "Name should have at least 2 letters" }),
})

const TaskForm = ({ initialValues }: ITaskFormProps) => {
  // TODO: debounced autosave on change

  const form = useForm({
    initialValues,
    schema: zodResolver(schema),
  })

  const handleSubmit = (values: Task) => {
    console.log("values", values)
  }

  return (
    <Paper>
      <Title></Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
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
