import { Container, Input } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { Sprint } from "@prisma/client"
import api from "lib/glue/api"
import React, { useEffect, useState } from "react"

interface ISprintItemProps {
  sprint: Sprint
}

const SprintItem = ({ sprint }: ISprintItemProps) => {
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
    </Container>
  )
}

export default SprintItem
