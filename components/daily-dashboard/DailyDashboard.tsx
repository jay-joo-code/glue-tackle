import { Container } from "@mantine/core"
import SprintList from "components/dashboard/SprintList"
import React from "react"

interface IDailyDashboardProps {}

const DailyDashboard = ({}: IDailyDashboardProps) => {
  return (
    <Container
      p="md"
      sx={(theme) => ({
        background: theme.colors.gray[0],
        height: `100vh`,
        borderRadius: theme.radius.md,
        overflow: "auto",
        width: "100%", // fill the width allocated by the resizer
      })}
    >
      <SprintList variant="daily" />
    </Container>
  )
}

export default DailyDashboard
