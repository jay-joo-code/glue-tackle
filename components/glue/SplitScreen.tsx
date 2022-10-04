import { Container, Space, Text, Title } from "@mantine/core"
import React from "react"
import Flex from "./Flex"
import GlueResponsiveRender from "./GlueResponsiveRender"

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
    <Flex align="center" justify="center">
      <Container
        px="sm"
        sx={(theme) => ({
          maxWidth: "460px",
        })}
      >
        <Title
          mb="3rem"
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
        <Container mt="3.4rem">
          <GlueResponsiveRender renderIn="mobile">
            <Flex justify="center">{buttons}</Flex>
          </GlueResponsiveRender>
          <GlueResponsiveRender renderIn="desktop">
            <Flex justify="flex-start">{buttons}</Flex>
          </GlueResponsiveRender>
        </Container>
      </Container>
      <GlueResponsiveRender renderIn="desktop">
        <Container>{illust}</Container>
      </GlueResponsiveRender>
    </Flex>
  )
}

export default SplitScreen
