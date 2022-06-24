import { Task } from "@prisma/client"
import TaskForm from "components/tasks/TaskForm"
import api from "lib/api"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const TasksEditId = () => {
  const router = useRouter()
  const [initialValues, setinitialValues] = useState<Task>(null)
  const id = router?.query?.id

  const fetchInitialData = async () => {
    const { data } = await api.get(`/tasks/${id}`)
    setinitialValues(data)
  }

  useEffect(() => {
    if (id) {
      fetchInitialData()
    }
  }, [id])

  return (
    <div>{initialValues && <TaskForm initialValues={initialValues} />}</div>
  )
}

export default TasksEditId
