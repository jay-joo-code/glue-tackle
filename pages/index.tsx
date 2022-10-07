import { Task } from "@prisma/client"
import DailyResizeWrapper from "components/daily-dashboard/DailyResizeWrapper"
import Flex from "components/glue/Flex"
import PageContainer from "components/glue/PageContainer"
import WeeklyDashboard from "components/weekly-dashboard/WeeklyDashboard"
import useGlueLocalStorage from "hooks/glue/useGlueLocalStorage"
import useIsDevice from "hooks/glue/useIsDevice"
import { tasksSwrKey } from "hooks/queries/useTasksQuery"
import api from "lib/glue/api"
import { DragDropContext } from "react-beautiful-dnd"
import { useSWRConfig } from "swr"
import computeNewRank from "util/computeNewRank"
import insertAtIndex from "util/glue/insertAtIndex"

const Index = () => {
  const [mobileState] = useGlueLocalStorage({
    key: "mobile-state",
    defaultValue: "daily",
  })
  const { isMobile } = useIsDevice()
  const { mutate } = useSWRConfig()

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    let targetTask: Task
    let prevRank: number = -1
    let nextRank: number = -1
    let newRank: number

    if (result?.source?.droppableId === result?.destination?.droppableId) {
      // move task within sprint
      mutate(
        tasksSwrKey(Number(result?.source?.droppableId)),
        async (tasks) => {
          targetTask = tasks[result?.source?.index]
          const destIdx = result?.destination?.index
          const filteredTasks = tasks?.filter(
            (_, idx) => idx !== result?.source?.index
          )
          const newTasks = insertAtIndex({
            array: filteredTasks,
            index: destIdx,
            newItem: targetTask,
          })

          if (destIdx > 0) {
            prevRank = newTasks[destIdx - 1]?.rank
          }

          if (destIdx !== newTasks?.length - 1) {
            nextRank = newTasks[destIdx + 1]?.rank
          }

          return newTasks
        },
        { revalidate: false }
      )
    } else {
      // remove from source sprint
      mutate(
        tasksSwrKey(Number(result?.source?.droppableId)),
        (tasks) => {
          targetTask = tasks[result?.source?.index]
          return tasks?.filter((_, idx) => idx !== result?.source?.index)
        },
        { revalidate: false }
      )

      // add to destination sprint
      mutate(
        tasksSwrKey(Number(result?.destination?.droppableId)),
        (tasks) => {
          const destIdx = result?.destination?.index
          const newTasks = insertAtIndex({
            array: tasks,
            index: destIdx,
            newItem: targetTask,
          })

          if (destIdx > 0) {
            prevRank = newTasks[destIdx - 1]?.rank
          }

          if (destIdx !== newTasks?.length - 1) {
            nextRank = newTasks[destIdx + 1]?.rank
          }

          return newTasks
        },
        { revalidate: false }
      )
    }

    newRank = computeNewRank({ prevRank, nextRank })

    api.put(`/glue/task/${targetTask?.id}`, {
      sprintId: Number(result?.destination?.droppableId),
      rank: newRank,
    })
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
    </PageContainer>
  )
}

export default Index
