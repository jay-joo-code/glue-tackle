import { Task } from "@prisma/client"
import DailyResizeWrapper from "components/daily-dashboard/DailyResizeWrapper"
import { tasksQuery } from "components/dashboard/SprintItem"
import Flex from "components/glue/Flex"
import PageContainer from "components/glue/PageContainer"
import WeeklyDashboard from "components/weekly-dashboard/WeeklyDashboard"
import useGlueLocalStorage from "hooks/glue/useGlueLocalStorage"
import useIsDevice from "hooks/glue/useIsDevice"
import api from "lib/glue/api"
import { DragDropContext } from "react-beautiful-dnd"
import { useSWRConfig } from "swr"

const Index = () => {
  const [mobileState] = useGlueLocalStorage({
    key: "mobile-state",
    defaultValue: "daily",
  })
  const { isMobile } = useIsDevice()
  const { mutate } = useSWRConfig()

  const insert = (arr, index, newItem) => [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...arr.slice(index),
  ]

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
        tasksQuery(Number(result?.source?.droppableId)),
        async (tasks) => {
          targetTask = tasks[result?.source?.index]
          const destIdx = result?.destination?.index
          const filteredTasks = tasks?.filter(
            (_, idx) => idx !== result?.source?.index
          )
          const newTasks = insert(filteredTasks, destIdx, targetTask)

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
        tasksQuery(Number(result?.source?.droppableId)),
        async (tasks) => {
          targetTask = tasks[result?.source?.index]
          return tasks?.filter((_, idx) => idx !== result?.source?.index)
        },
        { revalidate: false }
      )

      // add to destination sprint
      mutate(
        tasksQuery(Number(result?.destination?.droppableId)),
        async (tasks) => {
          const destIdx = result?.destination?.index
          const newTasks = insert(tasks, destIdx, targetTask)

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

    if (prevRank === -1 && nextRank === -1) {
      // first task in sprint
      newRank = 100
    } else if (prevRank === -1) {
      // append start
      newRank = Math.floor(nextRank / 2)
    } else if (nextRank === -1) {
      // append end
      newRank = prevRank + 100
    } else {
      // insert between tasks
      newRank = Math.floor(prevRank + (nextRank - prevRank) / 2)
    }

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
