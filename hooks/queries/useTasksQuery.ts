import { useSession } from "next-auth/react"
import { Task } from "@prisma/client"
import useGlueQuery from "hooks/glue/useGlueQuery"
import api from "lib/glue/api"
import insertAtIndex from "util/glue/insertAtIndex"

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

  const insertEmptyTask = ({
    id = undefined,
    variant,
    rank,
    sprintId,
    index = 0,
  }) => {
    mutate(
      async (tasks) => {
        const { data: newTask } = await api.post("/glue/task", {
          id,
          variant,
          rank,
          sprintId,
          providerData: undefined,
        })
        return index === undefined
          ? [...tasks, newTask]
          : insertAtIndex({
              array: [...tasks],
              index,
              newItem: newTask,
            })
      },
      { revalidate: true }
    )
  }

  return { ...rest, mutate, updateTask, saveTask, insertEmptyTask }
}

export default useTasksQuery
