import { Container } from "@mantine/core"
import React from "react"

interface IDailyDashboardProps {}

const DailyDashboard = ({}: IDailyDashboardProps) => {
  return (
    <Container
      sx={(theme) => ({
        background: theme.colors.gray[0],
        height: `100vh`,
        borderRadius: theme.radius.md,
        width: "100%", // fill the width allocated by the resizer
      })}
    >
      DailyDashboard
    </Container>
  )
}

export default DailyDashboard
