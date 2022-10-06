import { Container } from "@mantine/core"
import SprintList from "components/dashboard/SprintList"
import { useEffect, useRef, useState } from "react"

const WeeklyDashboard = () => {
  const ref = useRef(null)
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    if (ref.current && ref.current.offsetWidth !== width) {
      setWidth(ref.current.offsetWidth)
    }
  }, [ref.current])

  return (
    <Container
      p="md"
      sx={(theme) => ({
        background: theme.colors.gray[0],
        height: "100vh",
        borderRadius: theme.radius.md,
        width: `${width}px`,
        overflow: "auto",
        flexGrow: 2, // take up the remaining width
      })}
    >
      <SprintList variant="weekly" />
    </Container>
  )
}

export default WeeklyDashboard
