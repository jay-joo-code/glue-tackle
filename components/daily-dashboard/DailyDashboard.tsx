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
        borderRadius: theme.radius.md,
        overflow: "auto",
        width: "100%", // fill the width allocated by the resizer
        border: `1px solid ${theme.colors.gray[2]}`,
        height: "80vh",

        [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
          height: "90vh",
        },
      })}
    >
      <SprintList variant="daily" />
    </Container>
  )
}

export default DailyDashboard
