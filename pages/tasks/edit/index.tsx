import api from "lib/glue/api"
import { useRouter } from "next/router"
import React, { useEffect } from "react"

const TasksEdit = () => {
  const router = useRouter()

  const createTasks = async () => {
    const { data: task } = await api.post("/tasks")
    router.push(`/tasks/edit/${task?.id}`)
  }

  useEffect(() => {
    createTasks()
  }, [])

  return null
}

export default TasksEdit
