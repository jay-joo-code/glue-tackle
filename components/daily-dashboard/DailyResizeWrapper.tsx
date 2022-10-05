import { Container } from "@mantine/core"
import useIsDevice from "hooks/glue/useIsDevice"
import React, { useState } from "react"
import { Resizable } from "react-resizable"
import DailyDashboard from "./DailyDashboard"

const DailyResizeWrapper = () => {
  const [width, setWidth] = useState<number>(600)
  const { isMobile } = useIsDevice()

  const handleResize = (_, { size }) => {
    setWidth(size.width)
  }

  if (isMobile) {
    return <DailyDashboard />
  }

  return (
    <Container
      sx={(theme) => ({
        position: "relative",
      })}
    >
      <Resizable
        height={400}
        width={width}
        onResize={handleResize}
        axis="x"
        handle={
          <Container
            sx={(theme) => ({
              height: "30px",
              width: "12px",
              background: theme.colors.brand[2],
              position: "absolute",
              right: -10,
              top: 80,
              cursor: "pointer",
              borderRadius: "4px",

              "&:hover": {
                background: theme.colors.brand[3],
              },
            })}
          />
        }
      >
        <Container
          sx={(theme) => ({
            width: `${width}px`,
          })}
        >
          <DailyDashboard />
        </Container>
      </Resizable>
    </Container>
  )
}

export default DailyResizeWrapper
