import { Container, Text } from "@mantine/core"
import appConfig from "constants/appConfig"
import React from "react"
import Flex from "./Flex"

const Footer = () => {
  return (
    <Flex
      justify="center"
      pt="md"
      pb="xl"
      px="md"
      sx={(theme) => ({
        width: "100%",
        borderTop: `1px solid ${theme.colors.gray[1]}`,
      })}
    >
      <Flex
        align="center"
        justify="space-between"
        sx={(theme) => ({
          width: "100%",
          maxWidth: theme.breakpoints.md,
        })}
      >
        <Text
          size="md"
          weight={600}
          color="dimmed"
          sx={(theme) => ({
            cursor: "pointer",
          })}
        >
          {appConfig.name}
        </Text>
        <Text color="dimmed" size="sm">
          jj534@cornell.edu
        </Text>
      </Flex>
    </Flex>
  )
}

export default Footer
