import DailyDashboard from "components/daily-dashboard/DailyDashboard"
import Flex from "components/glue/Flex"
import PageContainer from "components/glue/PageContainer"
import WeeklyDashboard from "components/weekly-dashboard/WeeklyDashboard"
import useGlueLocalStorage from "hooks/glue/useGlueLocalStorage"
import useIsDevice from "hooks/glue/useIsDevice"
import React from "react"

const Index = () => {
  const [mobileState] = useGlueLocalStorage({
    key: "mobile-state",
    defaultValue: "daily",
  })
  const { isMobile } = useIsDevice()

  if (isMobile) {
    if (mobileState === "daily") {
      return <DailyDashboard />
    }
    return <WeeklyDashboard />
  }

  return (
    <PageContainer variant="responsive" title="Dashboard">
      <Flex>
        <DailyDashboard />
        <WeeklyDashboard />
      </Flex>
    </PageContainer>
  )
}

export default Index
