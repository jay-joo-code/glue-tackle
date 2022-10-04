import { Container, Space, Text, Title } from "@mantine/core"
import React from "react"
import Flex from "./Flex"

interface ISplitScreenProps {
  title: string
  paragraphs?: string[]
  buttons?: React.ReactNode
  illust?: React.ReactNode
}

const SplitScreen = ({
  title,
  paragraphs,
  buttons,
  illust,
}: ISplitScreenProps) => {
  return (
    <Container px="sm">
      <Title
        my="2rem"
        sx={(theme) => ({
          lineHeight: 1.1,
          fontSize: "4rem",
        })}
      >
        {title}
      </Title>
      {paragraphs?.map((paragraph) => (
        <Text
          key={paragraph}
          mb="lg"
          weight={400}
          sx={(theme) => ({
            color: theme.colors.text[2],
            fontSize: "1.2rem",
            lineHeight: 1.4,
          })}
        >
          {paragraph}
        </Text>
      ))}
      <Flex justify="center" mt="2.5rem">
        {buttons}
      </Flex>
    </Container>
  )
}

export default SplitScreen
