import { Container, Input, Menu, Space } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined"
import { Sprint } from "@prisma/client"
import Flex from "components/glue/Flex"
import IconButton from "components/glue/IconButton"
import appConfig from "constants/appConfig"
import useGlueLocalStorage from "hooks/glue/useGlueLocalStorage"
import useTasksQuery from "hooks/queries/useTasksQuery"
import api from "lib/glue/api"
import { useEffect, useState } from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import getTaskChildren from "util/getTaskChildren"
import TaskItem from "./TaskItem"

interface ISprintItemProps {
  sprint: Sprint
  isDropDisabled: boolean
}

const SprintItem = ({ sprint, isDropDisabled }: ISprintItemProps) => {
  const { data: tasks, insertEmptyTask } = useTasksQuery(sprint?.id)
  const [name, setName] = useState<string>(sprint?.name)
  const [debouncedName] = useDebouncedValue(name, 500)
  const [draggingTaskId, setDraggingTaskId] = useGlueLocalStorage({
    key: "dragging-task-id",
    defaultValue: null,
  })

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

  const handleArchive = () => {}

  return (
    <Container
      py="xs"
      sx={(theme) => ({
        background: "#FFFFFF",
        overflow: "auto",
        borderRadius: theme.radius.md,
        width: "340px",
        flexShrink: 0,
        height: "75vh",

        [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
          height: "85vh",
        },
      })}
    >
      <Flex align="center" justify="space-between" px="xs">
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
        {sprint?.variant === "weekly" && (
          <Container
            sx={(theme) => ({
              position: "relative",
            })}
          >
            <Menu position="bottom-end" width={140}>
              <Menu.Target>
                <Container>
                  <IconButton color="button-gray">
                    <MoreHorizOutlinedIcon />
                  </IconButton>
                </Container>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item color="red" onClick={handleArchive}>
                  Archive
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Container>
        )}
      </Flex>
      <Space mb="xs" />
      <Droppable
        droppableId={String(sprint?.id)}
        isDropDisabled={isDropDisabled}
      >
        {(provided, snapshot) => {
          // update dragging task id
          const newDraggingTaskId = Number(snapshot?.draggingOverWith)
          if (newDraggingTaskId && !draggingTaskId) {
            setDraggingTaskId(newDraggingTaskId)
          }

          // set children ids
          let childrenIds = []
          if (draggingTaskId) {
            const draggingTask = tasks?.find(
              (task) => draggingTaskId === task?.id
            )
            childrenIds = getTaskChildren({
              tasks,
              targetTask: draggingTask,
            })?.map((task) => task?.id)
          }
          return (
            <Container
              {...provided.droppableProps}
              ref={provided.innerRef}
              p="xs"
              pb="10rem"
              sx={(theme) => ({
                minHeight: "75vh",
                borderRadius: theme.radius.md,
                // background: snapshot.isDraggingOver && theme.colors.brand[0],

                [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                  minHeight: "85vh",
                },
              })}
            >
              {tasks?.map((task, index) => {
                const isParentDragging =
                  childrenIds?.filter((id) => id === task?.id)?.length > 0
                return (
                  <Draggable
                    key={`${task.id}`}
                    draggableId={`${task.id}`}
                    index={index}
                    isDragDisabled={isDropDisabled} // also disable drag if sprint drop disabled
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
                          isParentDragging={isParentDragging}
                          prevRank={index === 0 ? -1 : tasks[index - 1]?.rank}
                          nextRank={
                            index === tasks?.length - 1
                              ? -1
                              : tasks[index + 1]?.rank
                          }
                          prevId={index === 0 ? -1 : tasks[index - 1]?.id}
                          nextId={
                            index === tasks?.length - 1
                              ? -1
                              : tasks[index + 1]?.id
                          }
                          index={index}
                          childrenCount={
                            getTaskChildren({ tasks, targetTask: task })?.length
                          }
                        />
                      </Container>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </Container>
          )
        }}
      </Droppable>
    </Container>
  )
}

export default SprintItem
