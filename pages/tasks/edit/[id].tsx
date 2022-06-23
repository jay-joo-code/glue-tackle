import { useForm } from "@mantine/form"
import TaskForm from "components/tasks/TaskForm"
import { useRouter } from "next/router"
import React from "react"
import useSWR from "swr"

const TasksEditId = () => {
  const router = useRouter()
  const { data: task } = useSWR(`/tasks/${router?.query?.id}`)

  return <div>{task && <TaskForm initialValues={task} />}</div>
}

export default TasksEditId
