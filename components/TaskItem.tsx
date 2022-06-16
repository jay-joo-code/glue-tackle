import { Task } from "@prisma/client"

interface ITaskItemProps {
  task: Task
}

const TaskItem = ({ task }: ITaskItemProps) => {
  return <div>{task?.name}</div>
}

export default TaskItem
