import { Badge, Radio, Space, Textarea, useMantineTheme } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { Task } from "@prisma/client"
import Flex from "components/glue/Flex"
import OutsideClick from "components/glue/OutsideClick"
import Text from "components/glue/Text"
import useGlueLocalStorage from "hooks/glue/useGlueLocalStorage"
import useTasksQuery from "hooks/queries/useTasksQuery"
import { useEffect } from "react"
import { computeNewRank } from "util/computeNewRank"
import getTextVariant from "util/getTextVariant"

interface ITaskItemProps {
  task: Task
  sprintId: number
  prevRank: number
  nextRank: number
  prevId: number
  nextId: number
  index: number
  childrenCount: number
  isDragging?: boolean
  isParentDragging?: boolean
}

const TaskItem = ({
  task,
  sprintId,
  prevRank,
  nextRank,
  prevId,
  nextId,
  index,
  childrenCount,
  isDragging = false,
  isParentDragging = false,
}: ITaskItemProps) => {
  const { updateTask, saveTask, insertEmptyTask, deleteEmptyTask } =
    useTasksQuery(sprintId)
  const [debouncedContent] = useDebouncedValue(task?.content, 200)
  const [focusedTaskId, setFocusedTaskId] = useGlueLocalStorage({
    key: "focused-task-id",
    defaultValue: null,
  })
  const [_, setFocusedTaskRank] = useGlueLocalStorage({
    key: "focused-task-rank",
    defaultValue: null,
  })
  useEffect(() => {
    if (focusedTaskId === task?.id) {
      setFocusedTaskRank(task?.rank)
    }
  }, [focusedTaskId])
  const isEditing = focusedTaskId === task?.id
  // if (isEditing) console.log("task?.id", isEditing)
  const enableEditing = () => {
    setFocusedTaskId(task?.id)
  }
  const disableEditing = () => {
    if (isEditing) setFocusedTaskId(null)
  }
  const handleFocus = (event) => {
    const val = event.target.value
    event.target.value = ""
    event.target.value = val
  }
  const handleChange = (event) => {
    if (event?.target?.value?.charAt(0) === " " && task?.variant === "text") {
      updateTask({
        id: task?.id,
        variant: "task",
      })
      saveTask({
        id: task?.id,
        variant: "task",
      })
    } else if (event?.target?.value?.slice(-2) === "  ") {
      // increment indent if two spaces at the end of task content
      updateTask({
        id: task?.id,
        content: event?.target?.value?.slice(
          0,
          event?.target?.value?.length - 2
        ),
        indent: task?.indent + 1,
      })
      saveTask({
        id: task?.id,
        content: event?.target?.value?.slice(
          0,
          event?.target?.value?.length - 2
        ),
        indent: task?.indent + 1,
      })
    } else {
      updateTask({
        id: task?.id,
        content: event?.target?.value,
      })
    }
  }
  const handleKeyDown = (event) => {
    if (event?.target?.selectionEnd === 0 && event.key === "Backspace") {
      if (task?.indent > 0) {
        updateTask({
          id: task?.id,
          indent: Math.max(task?.indent - 1, 0),
        })
        saveTask({
          id: task?.id,
          indent: Math.max(task?.indent - 1, 0),
        })
      } else if (task?.variant === "task") {
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
        indent: task?.indent,
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
    } else if (event?.key === "Escape") {
      setFocusedTaskId(null)
    }
  }
  const toggleComplete = (event) => {
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
    if (isEditing) {
      saveTask({
        id: task?.id,
        content: task?.content,
      })
    }
  }, [debouncedContent, isEditing])

  // text variant: format text by sub-variants: category, heading
  const { isCategory, isHeading } = getTextVariant(task)
  let displayContent = task?.content
  if (isCategory || isHeading) {
    const contentArr = task?.content?.split(" ")
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
    color: task?.isComplete ? theme.colors.text[2] : theme.colors.text[3],
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
      sx={(theme) => ({
        paddingTop: taskPaddingTop,
      })}
    >
      <Flex
        justify="space-between"
        align="center"
        spacing={0}
        noWrap={true}
        sx={(theme) => ({
          borderRadius: theme.radius.sm,
          background: isParentDragging
            ? theme.colors.gray[3]
            : isDragging
            ? theme.colors.brand[1]
            : task?.content?.trim()?.length === 0
            ? theme?.colors?.gray[0]
            : "#FFFFFF",

          "&:hover": {
            background: theme.colors.gray[0],
          },
        })}
      >
        <Flex
          align="flex-start"
          spacing={0}
          noWrap={true}
          sx={(theme) => ({
            width: "100%",
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
              onClick={enableEditing}
              sx={(theme) => ({
                ...commonStyles,
                wordBreak: "break-word",
                flexGrow: 2,
              })}
            >
              {displayContent}
            </Text>
          )}
        </Flex>
        {isDragging && childrenCount !== 0 && (
          <Badge
            color="brand"
            variant="filled"
            mr=".5rem"
            sx={(theme) => ({
              flexShrink: 0,
            })}
          >
            {childrenCount + 1}
          </Badge>
        )}
      </Flex>
    </OutsideClick>
  )
}

export default TaskItem
