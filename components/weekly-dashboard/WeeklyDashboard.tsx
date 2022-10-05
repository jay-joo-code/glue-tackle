import { Container } from "@mantine/core"
import SprintList from "components/dashboard/SprintList"
import Flex from "components/glue/Flex"
import useGlueQuery from "hooks/glue/useGlueQuery"
import api from "lib/glue/api"
import { useSession } from "next-auth/react"
import React, { useEffect, useRef, useState } from "react"

const WeeklyDashboard = () => {
  const ref = useRef(null)
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    if (ref.current && ref.current.offsetWidth !== width) {
      setWidth(ref.current.offsetWidth)
    }
  }, [ref.current])

  const { data: sessionData } = useSession()
  const { data: sprints, optimisticUpdate } = useGlueQuery({
    url: "/glue/sprint",
    args: {
      where: {
        userId: sessionData?.user?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    },
  })

  const addEmptySprint = () => {
    optimisticUpdate({
      variant: "append-end",
      itemData: {
        name: "Untitled sprint",
        variant: "weekly",
      },
      asyncRequest: async () => {
        await api.post("/glue/sprint", {
          name: "Untitled sprint",
          variant: "weekly",
        })
      },
      refetchAfterRequest: true,
    })
  }

  return (
    <Container
      p="md"
      sx={(theme) => ({
        background: theme.colors.gray[0],
        height: "100vh",
        borderRadius: theme.radius.md,
        flexGrow: 2, // take up the remaining width
        width: `${width}px`,
        overflow: "auto",
      })}
    >
      <SprintList sprints={sprints} addEmptySprint={addEmptySprint} />
    </Container>
  )
}

export default WeeklyDashboard
