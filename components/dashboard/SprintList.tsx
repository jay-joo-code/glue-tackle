import { Container } from "@mantine/core"
import Button from "components/glue/Button"
import Flex from "components/glue/Flex"
import useGlueQuery from "hooks/glue/useGlueQuery"
import useOnScreen from "hooks/glue/useOnScreen"
import api from "lib/glue/api"
import { useSession } from "next-auth/react"
import { useEffect, useMemo, useRef } from "react"
import SprintRenderWrapper from "./SprintRenderWrapper"

interface ISprintListProps {
  variant: "weekly" | "daily"
}

const SprintList = ({ variant }: ISprintListProps) => {
  const { data: sessionData } = useSession()
  const fiveDaysAgo = useMemo(
    () => new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 5),
    [] // prevents infinite loop
  )
  const variantToArgs = {
    weekly: {
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
    },
    daily: {
      url: "/glue/sprint",
      args: {
        where: {
          userId: sessionData?.user?.id,
          variant,
          date: {
            gte: fiveDaysAgo,
          },
        },
        orderBy: {
          date: "asc",
        },
      },
    },
  }
  const {
    data: sprints,
    optimisticUpdate,
    isLoading,
  } = useGlueQuery(variantToArgs[variant])

  const addEmptySprint = () => {
    const newSprintId = Math.floor(Math.random() * 100000)
    const newDate =
      variant === "daily" &&
      new Date(
        new Date(sprints[sprints?.length - 1]?.date).getTime() +
          1000 * 60 * 60 * 24
      )
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
      refetchAfterRequest: true,
    })
  }

  const infiniteScrollObserverRef = useRef(null)
  const isOnEndScreen = useOnScreen(infiniteScrollObserverRef)

  useEffect(() => {
    if (isOnEndScreen && !isLoading) {
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
