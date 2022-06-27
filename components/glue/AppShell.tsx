import { Container } from "@mantine/core"
import React from "react"
import Header from "./Header"

interface IAppShellProps {
  children: React.ReactNode
}

const AppShell = ({ children }: IAppShellProps) => {
  return (
    <Container
      sx={(theme) => ({
        overflow: "hidden",
        [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
          maxWidth: "85vw",
        },
      })}
    >
      <Header />
      <Container
        sx={(theme) => ({
          minHeight: "100vh",
        })}
      >
        {children}
      </Container>
    </Container>
  )
}

export default AppShell
