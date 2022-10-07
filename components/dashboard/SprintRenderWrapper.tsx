import { Container } from "@mantine/core"
import { Sprint } from "@prisma/client"
import useOnScreen from "hooks/glue/useOnScreen"
import React, { useRef } from "react"
import SprintItem from "./SprintItem"

interface ISprintRenderWrapperProps {
  sprint: Sprint
}

const SprintRenderWrapper = ({ sprint }: ISprintRenderWrapperProps) => {
  const containerRef = useRef(null)
  const isOnScreen = useOnScreen(containerRef)

  return (
    <Container
      ref={containerRef}
      sx={(theme) => ({
        height: "95vh",
        width: "340px",
        flexShrink: 0,
      })}
    >
      {isOnScreen !== undefined && isOnScreen && <SprintItem sprint={sprint} />}
    </Container>
  )
}

export default SprintRenderWrapper
