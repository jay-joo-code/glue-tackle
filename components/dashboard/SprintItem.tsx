import { Container, Input, Space } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { Sprint } from "@prisma/client"
import appConfig from "constants/appConfig"
import useTasksQuery from "hooks/queries/useTasksQuery"
import api from "lib/glue/api"
import { useEffect, useState } from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import getTaskChildren from "util/getTaskChildren"
import TaskItem from "./TaskItem"

interface ISprintItemProps {
  sprint: Sprint
}

const SprintItem = ({ sprint }: ISprintItemProps) => {
  const { data: tasks, insertEmptyTask } = useTasksQuery(sprint?.id)
  const [name, setName] = useState<string>(sprint?.name)
  const [debouncedName] = useDebouncedValue(name, 500)

  const handleNameChange = (event) => {
    setName(event?.target?.value)
  }

  const updateName = async () => {
    api.put(`/glue/sprint/${sprint?.id}`, {
      name: debouncedName,
    })
  }

  useEffect(() => {
    updateName()
  }, [debouncedName])

  // automatically insert an empty task if sprint is empty
  useEffect(() => {
    if (tasks && tasks?.length === 0) {
      insertEmptyTask({
        variant: "text",
        rank: appConfig?.rankIncrement,
        sprintId: sprint?.id,
      })
    }
  }, [tasks])

  return (
    <Container
      px="xs"
      py="xs"
      sx={(theme) => ({
        background: "#FFFFFF",
        height: "85vh",
        overflow: "auto",
        borderRadius: theme.radius.md,
        width: "340px",
        flexShrink: 0,
      })}
    >
      <Input
        variant="unstyled"
        placeholder="Sprint name"
        value={name}
        onChange={handleNameChange}
        pl="xs"
        sx={(theme) => ({
          input: {
            fontWeight: 500,
            color: theme.colors.text[2],
            fontSize: "1rem",
          },
        })}
      />
      <Space mb="xs" />
      <Droppable droppableId={String(sprint?.id)}>
        {(provided, snapshot) => (
          <Container
            {...provided.droppableProps}
            ref={provided.innerRef}
            pb="10rem"
            sx={(theme) => ({
              minHeight: "85vh",
              borderRadius: theme.radius.md,
            })}
            // style={getListStyle(snapshot.isDraggingOver)}
          >
            {tasks?.map((task, index) => (
              <Draggable
                key={`${task.id}`}
                draggableId={`${task.id}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <Container
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskItem
                      task={task}
                      sprintId={sprint?.id}
                      isDragging={snapshot.isDragging}
                      prevRank={index === 0 ? -1 : tasks[index - 1]?.rank}
                      nextRank={
                        index === tasks?.length - 1
                          ? -1
                          : tasks[index + 1]?.rank
                      }
                      prevId={index === 0 ? -1 : tasks[index - 1]?.id}
                      nextId={
                        index === tasks?.length - 1 ? -1 : tasks[index + 1]?.id
                      }
                      index={index}
                      childrenCount={
                        getTaskChildren({ tasks, targetTask: task })?.length
                      }
                    />
                  </Container>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </Container>
  )
}

export default SprintItem
