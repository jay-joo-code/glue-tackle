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
  const leftAnchorRef = useRef(null)
  const rightAnchorRef = useRef(null)
  const isLeftAnchorOnScreen = useOnScreen(leftAnchorRef)
  const isRightAnchorOnScreen = useOnScreen(rightAnchorRef)
  const { isMobile } = useIsDevice()
  const isRender =
    isMobile ||
    (sprint?.variant === "weekly" && isLeftAnchorOnScreen) ||
    (sprint?.variant === "daily" && isRightAnchorOnScreen)

  // auto-scroll to today's sprint on mobile
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
        position: "relative",

        [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
          height: "85vh",
        },
      })}
    >
      <Container
        ref={leftAnchorRef}
        sx={(theme) => ({
          position: "absolute",
          top: 0,
          left: 10,
          width: "20px",
          height: "20px",
        })}
      />
      <Container
        ref={rightAnchorRef}
        sx={(theme) => ({
          position: "absolute",
          top: 0,
          right: 10,
          width: "20px",
          height: "20px",
        })}
      />
      {isRender && <SprintItem sprint={sprint} />}
    </Container>
  )
}

export default SprintRenderWrapper
