import { Task } from "@prisma/client"
import useGlueQuery from "hooks/glue/useGlueQuery"
import api from "lib/glue/api"

export const tasksSwrKey = (sprintId: number) => ({
  url: "/glue/task",
  args: {
    where: {
      sprintId,
    },
    orderBy: {
      rank: "asc",
    },
  },
})

const useTasksQuery = (sprintId: number) => {
  const { mutate, ...rest } = useGlueQuery(tasksSwrKey(sprintId))

  const updateTask = (updatedTask: Task) => {
    mutate(
      (tasks) => {
        return tasks?.map((task) => {
          if (updatedTask?.id === task?.id) {
            return {
              ...task,
              ...updatedTask,
            }
          }
          return task
        })
      },
      { revalidate: false }
    )
  }

  const saveTask = async (task: Task) => {
    await api.put(`/glue/task/${task?.id}`, {
      ...task,
    })
  }

  return { ...rest, mutate, updateTask, saveTask }
}

export default useTasksQuery
