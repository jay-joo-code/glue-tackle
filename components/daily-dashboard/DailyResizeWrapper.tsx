import { Container } from "@mantine/core"
import useGlueLocalStorage from "hooks/glue/useGlueLocalStorage"
import useIsDevice from "hooks/glue/useIsDevice"
import { useEffect, useState } from "react"
import { Resizable } from "react-resizable"
import DailyDashboard from "./DailyDashboard"

const DailyResizeWrapper = () => {
  const [persistedWidth, setPersistedWidth] = useGlueLocalStorage({
    key: "daily-sprint-width",
    defaultValue: null,
  })
  const [width, setWidth] = useState<number>(0)
  const { isMobile } = useIsDevice()

  useEffect(() => {
    if (persistedWidth !== undefined && width === 0) {
      setWidth(persistedWidth)
    }
  }, [persistedWidth])

  useEffect(() => {
    if (width !== 0) {
      setPersistedWidth(width)
    }
  }, [width])

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
              height: "50px",
              width: "22px",
              background: theme.colors.brand[2],
              position: "absolute",
              right: -15,
              top: 80,
              cursor: "pointer",
              borderRadius: "8px",
              border: `2px solid white`,

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
