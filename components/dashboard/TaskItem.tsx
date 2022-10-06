import { Container, Input, Text, Textarea } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { Task } from "@prisma/client"
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
      ...task,
      content: event?.target?.value,
    })
  }
  useEffect(() => {
    saveTask(debouncedTask)
  }, [debouncedTask])

  return (
    <OutsideClick onOutsideClick={disableEditing} onClick={enableEditing}>
      <Container
        sx={(theme) => ({
          borderRadius: theme.radius.sm,

          "&:hover": {
            background: theme.colors.gray[0],
          },
        })}
      >
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
                padding: ".3rem .5rem",
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
              padding: ".3rem .5rem",
              fontSize: "14px",
              lineHeight: 1.3,
            })}
          >
            {task?.content}
          </Text>
        )}
      </Container>
    </OutsideClick>
  )
}

export default TaskItem
