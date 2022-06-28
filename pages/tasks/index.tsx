import { Container } from "@mantine/core"
import InfiniteScrollList from "components/glue/InfiniteScrollList"
import TaskItemPublic from "components/tasks/TaskItemPublic"

const Tasks = () => {
  return (
    <Container p="md">
      <InfiniteScrollList
        itemComponentFn={(task) => (
          <TaskItemPublic key={task?.id} task={task} />
        )}
        limit={10}
        endpointPath={"/tasks"}
        skeletonHeight={70}
        skeletonMarginBottom={10}
      />
    </Container>
  )
}

export default Tasks
