import {
  Burger,
  Container,
  MediaQuery,
  Text,
  useMantineTheme,
} from "@mantine/core"
import appConfig from "constants/appConfig"
import useGlueLocalStorage from "hooks/glue/useGlueLocalStorage"
import useIsDevice from "hooks/glue/useIsDevice"
import Link from "next/link"
import { useState } from "react"
import AuthButton from "./AuthButton"
import Button from "./Button"
import Flex from "./Flex"
import NavList from "./NavList"

const Header = () => {
  const [opened, setOpened] = useState<boolean>(false)
  const theme = useMantineTheme()
  const HEIGHT = 48
  const { isMobile } = useIsDevice()
  const [mobileState, setMobileState] = useGlueLocalStorage({
    key: "mobile-state",
    defaultValue: "daily",
  })

  const handleSwitchView = () => {
    if (mobileState === "daily") setMobileState("weekly")
    else if (mobileState === "weekly") setMobileState("daily")
  }

  return (
    <Container>
      {/* header */}
      <Flex justify="center">
        <Flex
          justify="center"
          sx={(theme) => ({
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            marginLeft: "auto",
            marginRight: "auto",
            zIndex: 2,
            height: `${HEIGHT}px`,
            background: "rgba(255, 255, 255, 0.92)",
          })}
          px="md"
        >
          <Flex
            justify="space-between"
            sx={(theme) => ({
              width: "100%",
              maxWidth: theme.breakpoints.md,
            })}
          >
            <Flex spacing="xs">
              <MediaQuery largerThan="xs" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened(!opened)}
                  size="sm"
                  color={theme.colors.dark[9]}
                />
              </MediaQuery>

              <Link href="/">
                <Text
                  size="md"
                  weight={700}
                  color={theme.colors.brand[5]}
                  sx={(theme) => ({
                    cursor: "pointer",
                  })}
                >
                  {appConfig.name}
                </Text>
              </Link>
              {/* <Text size="sm" weight={600} color="dimmed">
                beta
              </Text> */}
            </Flex>
            <Flex spacing={8}>
              {isMobile && (
                <Button compact={true} onClick={handleSwitchView}>
                  Switch
                </Button>
              )}
              {!isMobile && <NavList />}
              <AuthButton />
            </Flex>
          </Flex>
        </Flex>
        <Container
          sx={(theme) => ({
            height: `${HEIGHT}px`,
          })}
        />
      </Flex>

      {/* mobile fullscreen nav */}
      {opened && (
        <Container
          sx={(theme) => ({
            position: "fixed",
            top: HEIGHT,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
            background: theme.colors.gray[0],
          })}
          p="md"
          pt="xl"
        >
          <NavList closeNavOverlay={() => setOpened(false)} />
        </Container>
      )}
    </Container>
  )
}

export default Header
