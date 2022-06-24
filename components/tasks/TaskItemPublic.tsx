import { Paper, Text } from "@mantine/core"
import { Task } from "@prisma/client"

interface ITaskItemPublicProps {
  task: Task
}

const TaskItemPublic = ({ task }: ITaskItemPublicProps) => {
  return (
    <Paper my="md">
      <Text>{task?.name}</Text>
      {/* <Text>{task?.user?.}</Text> */}
    </Paper>
  )
}

export default TaskItemPublic
