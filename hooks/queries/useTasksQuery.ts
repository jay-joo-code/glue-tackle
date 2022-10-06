import { useSession } from "next-auth/react"
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
  const { mutate, ...rest } = useGlueQuery({
    ...tasksSwrKey(sprintId),
    autoRefetch: false,
  })

  const updateTask = (updatedTask: Partial<Task>) => {
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

  const saveTask = async (task: Partial<Task>) => {
    await api.put(`/glue/task/${task?.id}`, {
      ...task,
    })
  }

  const appendEmptyTask = ({ variant, rank, sprintId }) => {
    mutate(
      async (tasks) => {
        const { data: newTask } = await api.post("/glue/task", {
          variant,
          rank,
          sprintId,
          providerData: undefined,
        })
        return [...tasks, newTask]
      },
      { revalidate: true }
    )
  }

  return { ...rest, mutate, updateTask, saveTask, appendEmptyTask }
}

export default useTasksQuery
