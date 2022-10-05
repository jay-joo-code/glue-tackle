import { Sprint } from "@prisma/client"
import Button from "components/glue/Button"
import Flex from "components/glue/Flex"
import SprintItem from "./SprintItem"

interface ISprintListProps {
  sprints: Sprint[]
  addEmptySprint: () => void
}

const SprintList = ({ sprints, addEmptySprint }: ISprintListProps) => {
  return (
    <Flex noWrap={true} align="flex-start">
      {sprints?.map((sprint) => (
        <SprintItem key={sprint?.id} sprint={sprint} />
      ))}
      <Button onClick={() => addEmptySprint()}>Add sprint</Button>
    </Flex>
  )
}

export default SprintList
