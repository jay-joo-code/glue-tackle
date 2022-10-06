import { Container, Input, Radio, Text, Textarea } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { Task } from "@prisma/client"
import Flex from "components/glue/Flex"
import OutsideClick from "components/glue/OutsideClick"
import useTasksQuery from "hooks/queries/useTasksQuery"
import { useEffect, useRef, useState } from "react"

interface ITaskItemProps {
  task: Task
  sprintId: number
  isDragging?: boolean
}

const TaskItem = ({ task, sprintId, isDragging = false }: ITaskItemProps) => {
  const { updateTask, saveTask } = useTasksQuery(sprintId)
  const [debouncedContent] = useDebouncedValue(task?.content, 500)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const enableEditing = () => setIsEditing(true)
  const disableEditing = () => setIsEditing(false)
  const handleFocus = (event) => {
    const val = event.target.value
    event.target.value = ""
    event.target.value = val
  }
  const handleChange = (event) => {
    updateTask({
      id: task?.id,
      content: event?.target?.value,
    })
  }
  const toggleComplete = () => {
    updateTask({
      id: task?.id,
      isComplete: !task?.isComplete,
    })
    saveTask({
      id: task?.id,
      isComplete: !task?.isComplete,
    })
  }
  useEffect(() => {
    saveTask({
      id: task?.id,
      content: debouncedContent,
    })
  }, [debouncedContent])

  // text variant: format text by sub-variants: category, heading
  const contentArr = task?.content?.split(" ")
  const isCategory =
    task?.variant === "text" &&
    contentArr?.length > 0 &&
    contentArr[0]?.toLowerCase() === "cc"
  const isHeading =
    task?.variant === "text" &&
    contentArr?.length > 0 &&
    contentArr[0]?.toLowerCase() === "hh"
  let displayContent = task?.content
  if (isCategory || isHeading) {
    displayContent = contentArr?.slice(1, contentArr?.length)?.join(" ")
  }

  return (
    <OutsideClick
      mb=".2rem"
      onOutsideClick={disableEditing}
      onClick={enableEditing}
    >
      <Flex
        align="flex-start"
        spacing={0}
        sx={(theme) => ({
          borderRadius: theme.radius.sm,
          background: isDragging
            ? theme.colors.brand[1]
            : task?.content?.trim()?.length === 0
            ? theme?.colors?.gray[0]
            : "unset",

          "&:hover": {
            background: theme.colors.gray[0],
          },
        })}
      >
        {task?.variant === "task" && (
          <Radio
            size="xs"
            value={`is-complete-${task?.id}`}
            checked={task?.isComplete}
            onClick={toggleComplete}
            onChange={() => {}}
            sx={(theme) => ({
              marginTop: ".4rem",
              marginLeft: ".2rem",
              cursor: "pointer", // doesn't work for some reason
            })}
          />
        )}
        {isEditing ? (
          <Textarea
            autoFocus={true}
            variant="unstyled"
            autosize={true}
            minRows={1}
            value={task?.content}
            onChange={handleChange}
            onFocus={handleFocus}
            sx={(theme) => ({
              textarea: {
                padding: ".3rem .4rem",
                fontSize: isCategory ? "20px" : "14px",
                fontWeight: isCategory ? 500 : 400,
                lineHeight: 1.3,
                minHeight: "unset",
                height: "unset",
                color: theme.colors.text[3],
              },
            })}
          />
        ) : (
          <Text
            sx={(theme) => ({
              padding: ".3rem .4rem",
              fontSize: isCategory ? "20px" : "14px",
              fontWeight: isCategory || isHeading ? 600 : 400,
              background: isHeading && theme.colors.brand[0],
              borderRadius: theme.radius.md,
              lineHeight: 1.3,
              minHeight: "28px",
            })}
          >
            {displayContent}
          </Text>
        )}
      </Flex>
    </OutsideClick>
  )
}

export default TaskItem
