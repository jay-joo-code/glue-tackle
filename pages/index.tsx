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
import { assignNewRanks } from "util/computeNewRank"
import getTaskChildren from "util/getTaskChildren"
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
    let children: Task[] = []

    if (result?.source?.droppableId === result?.destination?.droppableId) {
      mutate(
        tasksSwrKey(Number(result?.source?.droppableId)),
        async (tasks) => {
          // remove target and children
          const startIdx = result?.source?.index
          targetTask = tasks[startIdx]
          children = getTaskChildren({
            tasks,
            targetTask,
          })

          const endIdx = startIdx + children?.length
          const filteredTasks = tasks
            ?.slice(0, startIdx)
            .concat(tasks?.slice(endIdx + 1))

          // insert target and children
          let destIdx = result?.destination?.index
          if (destIdx > startIdx) destIdx -= children?.length
          if (destIdx > 0) {
            prevRank = filteredTasks[destIdx - 1]?.rank
          }

          if (destIdx !== filteredTasks?.length) {
            nextRank = filteredTasks[destIdx]?.rank
          }

          const { rankedTargetTask, rankedChildren } = assignNewRanks({
            prevRank,
            nextRank,
            targetTask,
            children,
          })
          targetTask = rankedTargetTask
          children = rankedChildren

          let newTasks = insertAtIndex({
            array: filteredTasks,
            index: destIdx,
            newItem: rankedTargetTask,
          })

          rankedChildren?.forEach((childTask, idx) => {
            newTasks = insertAtIndex({
              array: newTasks,
              index: destIdx + 1 + idx,
              newItem: childTask,
            })
          })

          return newTasks
        },
        { revalidate: false }
      )
    } else {
      // remove target and children from source sprint
      mutate(
        tasksSwrKey(Number(result?.source?.droppableId)),
        (tasks: Task[]) => {
          const startIdx = result?.source?.index
          targetTask = tasks[startIdx]
          children = getTaskChildren({
            tasks,
            targetTask,
          })

          const endIdx = startIdx + children?.length
          const filteredTasks = tasks
            ?.slice(0, startIdx)
            .concat(tasks?.slice(endIdx + 1))
          return filteredTasks
        },
        { revalidate: false }
      )

      // add target and children to destination sprint
      mutate(
        tasksSwrKey(Number(result?.destination?.droppableId)),
        (tasks) => {
          const destIdx = result?.destination?.index
          if (destIdx > 0) {
            prevRank = tasks[destIdx - 1]?.rank
          }

          if (destIdx !== tasks?.length) {
            nextRank = tasks[destIdx]?.rank
          }

          const { rankedTargetTask, rankedChildren } = assignNewRanks({
            prevRank,
            nextRank,
            targetTask,
            children,
          })
          targetTask = rankedTargetTask
          children = rankedChildren

          let newTasks = insertAtIndex({
            array: tasks,
            index: destIdx,
            newItem: rankedTargetTask,
          })

          rankedChildren?.forEach((childTask, idx) => {
            newTasks = insertAtIndex({
              array: newTasks,
              index: destIdx + 1 + idx,
              newItem: childTask,
            })
          })

          return newTasks
        },
        { revalidate: false }
      )
    }

    api.put(`/glue/task/${targetTask?.id}`, {
      sprintId: Number(result?.destination?.droppableId),
      rank: targetTask?.rank,
    })
    children?.forEach((childTask) => {
      api.put(`/glue/task/${childTask?.id}`, {
        sprintId: Number(result?.destination?.droppableId),
        rank: childTask?.rank,
      })
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
