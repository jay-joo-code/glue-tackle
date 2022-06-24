import TaskItemPrivate from "components/tasks/TaskItemPrivate"
import React from "react"
import useSWR from "swr"

const TasksMyTasks = () => {
  const { data: tasks } = useSWR("/tasks/my-tasks")

  return (
    <div>
      {tasks?.map((task) => (
        <TaskItemPrivate key={task?.id} task={task} />
      ))}
    </div>
  )
}

export default TasksMyTasks
