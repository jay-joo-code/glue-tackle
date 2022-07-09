import { Container } from "@mantine/core"
import React from "react"
import Flex from "./Flex"
import Header from "./Header"

interface IAppShellProps {
  children: React.ReactNode
}

const AppShell = ({ children }: IAppShellProps) => {
  return (
    <Flex direction="column" align="center">
      <Header />
      <Container
        sx={(theme) => ({
          minHeight: "100vh",

          [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            width: "85vw",
            maxWidth: "unset",
          },
        })}
      >
        {children}
      </Container>
    </Flex>
  )
}

export default AppShell
