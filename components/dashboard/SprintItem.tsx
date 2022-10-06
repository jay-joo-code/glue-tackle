import { Container, Input } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { Sprint } from "@prisma/client"
import useGlueQuery from "hooks/glue/useGlueQuery"
import api from "lib/glue/api"
import { useEffect, useState } from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"

interface ISprintItemProps {
  sprint: Sprint
}

export const tasksQuery = (sprintId: number) => ({
  url: "/glue/task",
  args: {
    where: {
      sprintId,
    },
    orderBy: {
      rank: "asc",
    },
  },
})

const SprintItem = ({ sprint }: ISprintItemProps) => {
  const { data: tasks } = useGlueQuery(tasksQuery(sprint?.id))
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

  return (
    <Container
      px="sm"
      py="xs"
      sx={(theme) => ({
        background: "#FFFFFF",
        height: "95vh",
        overflow: "auto",
        borderRadius: theme.radius.md,
        width: "240px",
        flexShrink: 0,
      })}
    >
      <Input
        variant="unstyled"
        placeholder="Sprint name"
        value={name}
        onChange={handleNameChange}
        sx={(theme) => ({
          input: {
            fontWeight: 500,
            color: theme.colors.text[2],
            fontSize: "1rem",
          },
        })}
      />
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
                    // style={gettaskStyle(
                    //   snapshot.isDragging,
                    //   provided.draggableProps.style
                    // )}
                  >
                    {task.content}
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
