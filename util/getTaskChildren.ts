import { Task } from "@prisma/client"
import getTextVariant from "./getTextVariant"

const getTaskChildren = ({ tasks, targetTask }) => {
  const { isHeading, isCategory } = getTextVariant(targetTask)

  let startIdx = tasks?.length
  tasks?.forEach((task, idx) => {
    if (task?.id === targetTask?.id) {
      startIdx = idx
    }
  })

  if (isCategory) {
    let isFindingChildren = true
    return tasks?.slice(startIdx + 1)?.filter((task: Task) => {
      const { isCategory: isChildCategory } = getTextVariant(task)
      if (isChildCategory) isFindingChildren = false
      return isFindingChildren
    })
  } else if (isHeading) {
    let isFindingChildren = true
    return tasks?.slice(startIdx + 1)?.filter((task: Task) => {
      const { isHeading: isChildHeading, isCategory: isChildCategory } =
        getTextVariant(task)
      if (isChildHeading || isChildCategory) isFindingChildren = false
      return isFindingChildren
    })
  } else {
    let isFindingChildren = true
    return tasks?.slice(startIdx + 1)?.filter((task: Task) => {
      if (task?.indent <= targetTask?.indent) isFindingChildren = false
      return isFindingChildren && task?.indent > targetTask?.indent
    })
  }
}

export default getTaskChildren
