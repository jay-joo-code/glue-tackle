import { Container } from "@mantine/core"
import React from "react"

const WeeklyDashboard = () => {
  return (
    <Container
      sx={(theme) => ({
        background: theme.colors.gray[0],
        height: "100vh",
        borderRadius: theme.radius.md,
        flexGrow: 2, // take up the remaining width
      })}
    >
      WeeklyDashboard
    </Container>
  )
}

export default WeeklyDashboard
