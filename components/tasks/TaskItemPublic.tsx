import { Paper, Text } from "@mantine/core"
import { Task, User } from "@prisma/client"

interface ITaskItemPublicProps {
  task?: Task & { user: User }
}

const TaskItemPublic = ({ task }: ITaskItemPublicProps) => {
  return (
    <Paper my="md" withBorder>
      <Text mb="sm">{task?.name}</Text>
      <Text size="sm" color="dimmed">
        {task?.user?.name}
      </Text>
    </Paper>
  )
}

export default TaskItemPublic
