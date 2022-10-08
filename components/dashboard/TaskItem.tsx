import { Radio, Space, Text, Textarea, useMantineTheme } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { Task } from "@prisma/client"
import Flex from "components/glue/Flex"
import OutsideClick from "components/glue/OutsideClick"
import useGlueLocalStorage from "hooks/glue/useGlueLocalStorage"
import useTasksQuery from "hooks/queries/useTasksQuery"
import { useEffect } from "react"
import computeNewRank from "util/computeNewRank"

interface ITaskItemProps {
  task: Task
  sprintId: number
  prevRank: number
  nextRank: number
  prevId: number
  nextId: number
  index: number
  isDragging?: boolean
}

const TaskItem = ({
  task,
  sprintId,
  prevRank,
  nextRank,
  prevId,
  nextId,
  index,
  isDragging = false,
}: ITaskItemProps) => {
  const { updateTask, saveTask, insertEmptyTask, deleteEmptyTask } =
    useTasksQuery(sprintId)
  const [debouncedContent] = useDebouncedValue(task?.content, 300)
  const [focusedTaskId, setFocusedTaskId] = useGlueLocalStorage({
    key: "focused-task-id",
    defaultValue: null,
  })
  const isEditing = focusedTaskId === task?.id
  const enableEditing = () => setFocusedTaskId(task?.id)
  const disableEditing = () => {
    if (isEditing) setFocusedTaskId(null)
  }
  const handleFocus = (event) => {
    const val = event.target.value
    event.target.value = ""
    event.target.value = val
  }
  const handleChange = (event) => {
    if (event?.target?.value?.charAt(0) === " ") {
      updateTask({
        id: task?.id,
        variant: "task",
      })
      saveTask({
        id: task?.id,
        variant: "task",
      })
    } else {
      updateTask({
        id: task?.id,
        content: event?.target?.value,
      })
    }
  }
  const handleKeyDown = (event) => {
    if (
      event?.target?.selectionEnd === 0 &&
      (event.key === "Delete" || event.key === "Backspace")
    ) {
      if (task?.variant === "task") {
        updateTask({
          id: task?.id,
          variant: "text",
        })
        saveTask({
          id: task?.id,
          variant: "text",
        })
      } else if (task?.variant === "text") {
        event?.preventDefault() // prevents backspace press from deleting the last char of newly focused task
        deleteEmptyTask({ taskId: task?.id })
        const newFocusTaskId = prevId !== -1 ? prevId : nextId
        setFocusedTaskId(newFocusTaskId)
      }
    } else if (event?.key === "Enter") {
      event?.preventDefault()
      const newId = Math.floor(Math.random() * 1000000)
      const newRank = computeNewRank({ prevRank: task?.rank, nextRank })
      insertEmptyTask({
        id: newId,
        variant: task?.variant,
        rank: newRank,
        sprintId,
        index: index + 1,
      })
      setFocusedTaskId(newId)
    } else if (event?.key === "ArrowDown") {
      if (nextId !== -1) setFocusedTaskId(nextId)
    } else if (event?.key === "ArrowUp") {
      if (prevId !== -1) setFocusedTaskId(prevId)
    } else if (event?.key === "Tab" && event?.shiftKey) {
      event?.preventDefault()
      updateTask({
        id: task?.id,
        indent: Math.max(task?.indent - 1, 0),
      })
      saveTask({
        id: task?.id,
        indent: Math.max(task?.indent - 1, 0),
      })
    } else if (event?.key === "Tab") {
      event?.preventDefault()
      updateTask({
        id: task?.id,
        indent: task?.indent + 1,
      })
      saveTask({
        id: task?.id,
        indent: task?.indent + 1,
      })
    }
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
      content: task?.content,
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

  const theme = useMantineTheme()
  const commonStyles = {
    padding: isHeading ? ".2rem .7rem" : ".3rem .4rem",
    fontSize: isHeading ? "12px" : isCategory ? "22px" : "14px",
    fontWeight: isCategory || isHeading ? 600 : 400,
    background: isHeading && theme.colors.brand[1],
    lineHeight: 1.3,
    minHeight: isHeading ? "22px" : "28px",
    borderRadius: isHeading && theme.radius.md,
  }

  let taskPaddingTop: number | string = 0
  if (prevRank !== -1) {
    if (isCategory) taskPaddingTop = "1.5rem"
    if (isHeading) taskPaddingTop = ".5rem"
  }

  return (
    <OutsideClick
      mb=".2rem"
      onOutsideClick={disableEditing}
      onClick={enableEditing}
      sx={(theme) => ({
        paddingTop: taskPaddingTop,
      })}
    >
      <Flex
        align="flex-start"
        spacing={0}
        noWrap={true}
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
        {/* indent space */}
        <Space pr={task?.indent * 19} />

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
            onKeyDown={handleKeyDown}
            sx={(theme) => ({
              width: "100%",

              textarea: {
                ...commonStyles,
                height: "unset",
                color: theme.colors.text[3],
              },
            })}
          />
        ) : (
          <Text
            sx={(theme) => ({
              ...commonStyles,
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
