import { Container } from "@mantine/core"
import Button from "components/glue/Button"
import Flex from "components/glue/Flex"
import useOnScreen from "hooks/glue/useOnScreen"
import useSprints from "hooks/queries/useSprints"
import api from "lib/glue/api"
import { useSession } from "next-auth/react"
import { useEffect, useMemo, useRef } from "react"
import SprintRenderWrapper from "./SprintRenderWrapper"

interface ISprintListProps {
  variant: "weekly" | "daily"
}

const SprintList = ({ variant }: ISprintListProps) => {
  const { data: sessionData } = useSession()
  const fourDaysAgo = useMemo(
    () => new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 4),
    []
  )
  const {
    data: sprints,
    optimisticUpdate,
    isLoading,
  } = useSprints({
    variant,
    sessionData,
    fetchSince: fourDaysAgo,
  })

  const addEmptySprint = () => {
    const newSprintId = Math.floor(Math.random() * 100000)
    const newDate =
      variant === "daily"
        ? new Date(
            new Date(sprints[sprints?.length - 1]?.date).getTime() +
              1000 * 60 * 60 * 24
          )
        : undefined
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const newName =
      variant === "daily" && newDate
        ? `${newDate?.getMonth() + 1}/${newDate?.getUTCDate()} ${
            days[newDate?.getUTCDay()]
          }`
        : "Untitled sprint"
    const newSprintData = {
      id: newSprintId,
      name: newName,
      variant,
      date: newDate,
    }
    optimisticUpdate({
      variant: "append-end",
      itemData: newSprintData,
      asyncRequest: async () => {
        await api.post("/glue/sprint", newSprintData)
      },
      refetchAfterRequest: false, // to prevent the entire sprint list from rendering + jumping to today's sprint
    })
  }

  const infiniteScrollObserverRef = useRef(null)
  const isOnEndScreen = useOnScreen(infiniteScrollObserverRef)

  useEffect(() => {
    if (isOnEndScreen && !isLoading && sprints) {
      addEmptySprint()
    }
  }, [isOnEndScreen])

  return (
    <Flex
      noWrap={true}
      align="flex-start"
      sx={(theme) => ({
        overflow: "auto",
      })}
    >
      {sprints?.map((sprint) => (
        <SprintRenderWrapper key={sprint?.id} sprint={sprint} />
      ))}
      {variant === "weekly" && (
        <Button onClick={() => addEmptySprint()}>Add sprint</Button>
      )}
      {variant === "daily" && (
        <Container
          ref={infiniteScrollObserverRef}
          sx={(theme) => ({
            width: "400px",
          })}
        />
      )}
    </Flex>
  )
}

export default SprintList
