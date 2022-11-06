import { useViewportSize } from "@mantine/hooks"
import Container from "components/glue/Container"
import useGlueLocalStorage from "hooks/glue/useGlueLocalStorage"
import useIsDevice from "hooks/glue/useIsDevice"
import { useEffect } from "react"
import { Resizable } from "react-resizable"
import DailyDashboard from "./DailyDashboard"

const DailyResizeWrapper = () => {
  const [persistedWidth, setPersistedWidth] = useGlueLocalStorage({
    key: "daily-sprint-width",
    defaultValue: null,
  })
  const { isMobile } = useIsDevice()
  const { width: viewportWidth } = useViewportSize()

  useEffect(() => {
    if (!isMobile && persistedWidth > viewportWidth * 0.9) {
      const halfViewport = viewportWidth * 0.5
      setPersistedWidth(halfViewport)
    }
  }, [persistedWidth, viewportWidth])

  const handleResize = (_, { size }) => {
    setPersistedWidth(size.width)
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
        width={persistedWidth}
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
            width: `${persistedWidth}px`,
          })}
        >
          <DailyDashboard />
        </Container>
      </Resizable>
    </Container>
  )
}

export default DailyResizeWrapper
