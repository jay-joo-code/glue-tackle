import TaskItemPublic from "components/tasks/TaskItemPublic"
import React from "react"
import useSWR from "swr"

const Tasks = () => {
  const { data: tasks } = useSWR("/tasks")

  return (
    <div>
      {tasks?.map((task) => (
        <TaskItemPublic key={task?.id} task={task} />
      ))}
    </div>
  )
}

export default Tasks
