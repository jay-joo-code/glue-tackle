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
}

const TaskItem = ({ task, sprintId }: ITaskItemProps) => {
  const { updateTask, saveTask } = useTasksQuery(sprintId)
  const [debouncedTask] = useDebouncedValue(task, 500)
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
    saveTask(debouncedTask)
  }, [debouncedTask])

  return (
    <OutsideClick onOutsideClick={disableEditing} onClick={enableEditing}>
      <Flex
        align="flex-start"
        spacing={0}
        sx={(theme) => ({
          borderRadius: theme.radius.sm,

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
                fontSize: "14px",
                minHeight: "unset",
                height: "unset",
                lineHeight: 1.3,
                color: theme.colors.text[3],
              },
            })}
          />
        ) : (
          <Text
            sx={(theme) => ({
              padding: ".3rem .4rem",
              fontSize: "14px",
              lineHeight: 1.3,
            })}
          >
            {task?.content}
          </Text>
        )}
      </Flex>
    </OutsideClick>
  )
}

export default TaskItem
