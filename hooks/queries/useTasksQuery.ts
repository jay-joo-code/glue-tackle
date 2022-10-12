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
    indent = 0,
  }) => {
    mutate(
      async (tasks) => {
        const newTaskData = {
          id,
          variant,
          rank,
          sprintId,
          indent,
          providerData: undefined,
        }
        const { data: newTask } = await api.post("/glue/task", newTaskData)
        return index === undefined
          ? [...tasks, newTask]
          : insertAtIndex({
              array: [...tasks],
              index,
              newItem: newTask,
            })
      },
      { revalidate: false }
    )
  }

  const deleteEmptyTask = ({ taskId = undefined }) => {
    mutate(
      async (tasks) => {
        api.delete(`/glue/task/${taskId}`)
        return tasks?.filter((task) => task?.id !== taskId)
      },
      { revalidate: false }
    )
  }

  return {
    ...rest,
    mutate,
    updateTask,
    saveTask,
    insertEmptyTask,
    deleteEmptyTask,
  }
}

export default useTasksQuery
