import DailyResizeWrapper from "components/daily-dashboard/DailyResizeWrapper"
import DndExample from "components/DndExample"
import Flex from "components/glue/Flex"
import PageContainer from "components/glue/PageContainer"
import WeeklyDashboard from "components/weekly-dashboard/WeeklyDashboard"
import useGlueLocalStorage from "hooks/glue/useGlueLocalStorage"
import useIsDevice from "hooks/glue/useIsDevice"
import React from "react"
import { DragDropContext } from "react-beautiful-dnd"

const Index = () => {
  const [mobileState] = useGlueLocalStorage({
    key: "mobile-state",
    defaultValue: "daily",
  })
  const { isMobile } = useIsDevice()

  const onDragEnd = (result) => {
    console.log("result", result)

    // dropped outside the list
    if (!result.destination) {
      return
    }

    // move from source swr context to destination swr context

    //   const result = Array.from(list)
    // const [removed] = result.splice(startIndex, 1)
    // result.splice(endIndex, 0, removed)

    //   this.setState({
    //     items,
    //   })
  }

  if (isMobile) {
    if (mobileState === "daily") {
      return <DailyResizeWrapper />
    }
    return <WeeklyDashboard />
  }

  return (
    <PageContainer variant="responsive" title="Dashboard" isPrivate={true}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Flex spacing="xs">
          <DailyResizeWrapper />
          <WeeklyDashboard />
        </Flex>
      </DragDropContext>
      <DndExample />
    </PageContainer>
  )
}

export default Index
