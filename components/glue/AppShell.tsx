import { Container, useMantineTheme } from "@mantine/core"
import useIsMobile from "hooks/isMobile"
import { useSession } from "next-auth/react"
import React, { useState } from "react"
import Header from "./Header"

interface IAppShellProps {
  children: React.ReactNode
}

const AppShell = ({ children }: IAppShellProps) => {
  const theme = useMantineTheme()
  const [opened, setOpened] = useState<boolean>(false)
  const { data: session } = useSession()
  const isMobile = useIsMobile()

  return (
    <Container
      sx={(theme) => ({
        overflow: "hidden",
        background: theme.colors.brand[0],
      })}
    >
      <Header />
      <Container
        sx={(theme) => ({
          background: theme.colors.brand[0],
          minHeight: "100vh",
        })}
      >
        {children}
      </Container>
    </Container>
  )
}

export default AppShell
