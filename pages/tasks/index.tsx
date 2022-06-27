import TaskItemPublic from "components/tasks/TaskItemPublic"
import useSWR from "swr"

const Tasks = () => {
  const { data: tasks } = useSWR("/tasks")

  return (
    <div>
      {/* TODO: */}
      {/* {!tasks && <Skeleton width={300} height={50} />} */}
      {tasks?.map((task) => (
        <TaskItemPublic key={task?.id} task={task} />
      ))}
    </div>
  )
}

export default Tasks
