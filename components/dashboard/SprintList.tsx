import Button from "components/glue/Button"
import Flex from "components/glue/Flex"
import useGlueQuery from "hooks/glue/useGlueQuery"
import api from "lib/glue/api"
import { useSession } from "next-auth/react"
import SprintRenderWrapper from "./SprintRenderWrapper"

interface ISprintListProps {
  variant: "weekly" | "daily"
}

const SprintList = ({ variant }: ISprintListProps) => {
  const { data: sessionData } = useSession()
  const { data: sprints, optimisticUpdate } = useGlueQuery({
    url: "/glue/sprint",
    args: {
      where: {
        userId: sessionData?.user?.id,
        variant,
      },
      orderBy: {
        createdAt: "asc",
      },
    },
  })

  const addEmptySprint = () => {
    const newSprintId = Math.floor(Math.random() * 100000)
    optimisticUpdate({
      variant: "append-end",
      itemData: {
        id: newSprintId,
        name: "Untitled sprint",
        variant,
      },
      asyncRequest: async () => {
        await api.post("/glue/sprint", {
          id: newSprintId,
          name: "Untitled sprint",
          variant,
        })
      },
      refetchAfterRequest: true,
    })
  }

  return (
    <Flex noWrap={true} align="flex-start">
      {sprints?.map((sprint) => (
        <SprintRenderWrapper key={sprint?.id} sprint={sprint} />
      ))}
      <Button onClick={() => addEmptySprint()}>Add sprint</Button>
    </Flex>
  )
}

export default SprintList
