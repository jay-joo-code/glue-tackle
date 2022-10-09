import { Task } from "@prisma/client"

const getTextVariant = (task: Task) => {
  const contentArr = task?.content?.split(" ")
  const isCategory =
    task?.variant === "text" &&
    contentArr?.length > 0 &&
    contentArr[0]?.toLowerCase() === "cc"
  const isHeading =
    task?.variant === "text" &&
    contentArr?.length > 0 &&
    contentArr[0]?.toLowerCase() === "hh"

  return { isCategory, isHeading }
}

export default getTextVariant
