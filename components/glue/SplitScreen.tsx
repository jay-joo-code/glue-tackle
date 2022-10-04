import { Container, Space, Text, Title } from "@mantine/core"
import Image from "next/image"
import React from "react"
import Flex from "./Flex"
import GlueResponsiveRender from "./GlueResponsiveRender"
import useIsDevice from "hooks/glue/useIsDevice"

interface ISplitScreenProps {
  title: string
  paragraphs?: string[]
  buttons?: React.ReactNode
  illustPath?: string
}

const SplitScreen = ({
  title,
  paragraphs,
  buttons,
  illustPath,
}: ISplitScreenProps) => {
  const { isTablet } = useIsDevice()

  return (
    <Flex justify="center">
      <Flex
        align="center"
        justify="space-between"
        sx={(theme) => ({
          width: "100%",
          maxWidth: theme.breakpoints.md,
        })}
      >
        <Container
          px="sm"
          sx={(theme) => ({
            width: "100%",

            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              width: "40vw",
              maxWidth: "460px",
            },
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
          <Container>
            <Image
              src={illustPath}
              alt="split screen illustration"
              height={isTablet ? 300 : 400}
              width={isTablet ? 300 : 400}
            />
          </Container>
        </GlueResponsiveRender>
      </Flex>
    </Flex>
  )
}

export default SplitScreen
