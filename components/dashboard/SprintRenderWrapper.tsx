import { Container } from "@mantine/core"
import { Sprint } from "@prisma/client"
import useIsDevice from "hooks/glue/useIsDevice"
import useOnScreen from "hooks/glue/useOnScreen"
import React, { useEffect, useRef } from "react"
import SprintItem from "./SprintItem"

interface ISprintRenderWrapperProps {
  sprint: Sprint
}

const SprintRenderWrapper = ({ sprint }: ISprintRenderWrapperProps) => {
  const containerRef = useRef(null)
  const isOnScreen = useOnScreen(containerRef)

  // auto-scroll to today's sprint on mobile
  const { isMobile } = useIsDevice()
  useEffect(() => {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    if (
      isMobile &&
      new Date(sprint?.date)?.toISOString() === today?.toISOString()
    ) {
      containerRef?.current?.scrollIntoView()
    }
  }, [sprint, containerRef, isMobile])

  return (
    <Container
      ref={containerRef}
      sx={(theme) => ({
        width: "340px",
        flexShrink: 0,
        height: "75vh",

        [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
          height: "85vh",
        },
      })}
    >
      {isOnScreen !== undefined && isOnScreen && <SprintItem sprint={sprint} />}
    </Container>
  )
}

export default SprintRenderWrapper
