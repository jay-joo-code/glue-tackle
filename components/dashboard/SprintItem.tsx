import { Container, Input, Space } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { Sprint } from "@prisma/client"
import useTasksQuery from "hooks/queries/useTasksQuery"
import api from "lib/glue/api"
import { useEffect, useState } from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
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

  // automatically add an empty task to end of sprint
  useEffect(() => {
    if (
      tasks &&
      (tasks?.length === 0 || tasks[tasks?.length - 1]?.content?.length !== 0)
    ) {
      insertEmptyTask({
        variant: "text",
        rank: tasks?.length === 0 ? 100 : tasks[tasks?.length - 1]?.rank + 100,
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
        height: "95vh",
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
                      index={index}
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
