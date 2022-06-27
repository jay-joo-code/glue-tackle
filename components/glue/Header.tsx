import {
  ActionIcon,
  Box,
  Burger,
  Button,
  Container,
  MediaQuery,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core"
import Link from "next/link"
import React, { useState } from "react"
import Flex from "./Flex"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import NavList from "./NavList"
import AuthButton from "./AuthButton"
import IconButton from "./IconButton"
import useIsMobile from "hooks/glue/isMobile"

const Header = () => {
  const [opened, setOpened] = useState<boolean>(false)
  const theme = useMantineTheme()
  const HEIGHT = 48
  const isMobile = useIsMobile()

  return (
    <Container>
      {/* header */}
      <Container>
        <Flex
          justify="space-between"
          sx={(theme) => ({
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            height: `${HEIGHT}px`,
            background: "#FFFFFF",
          })}
          py="sm"
          px="md"
        >
          <Flex>
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
                Template
              </Text>
            </Link>
          </Flex>
          <Flex>
            <IconButton tooltipLabel="Search" variant="hover" color="gray">
              <SearchOutlinedIcon />
            </IconButton>
            {!isMobile && <NavList />}
            <AuthButton />
          </Flex>
        </Flex>
        <Container
          sx={(theme) => ({
            height: `${HEIGHT}px`,
          })}
        />
      </Container>

      {/* mobile nav overlay */}
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
