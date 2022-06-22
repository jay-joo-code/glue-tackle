import {
  ActionIcon,
  Box,
  Burger,
  Button,
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

const Header = () => {
  const [opened, setOpened] = useState<boolean>(true)
  const theme = useMantineTheme()
  const HEIGHT = 48

  const headerButtons = [
    {
      label: "Search",
      icon: <SearchOutlinedIcon />,
    },
    {
      label: "Settings",
      icon: <SettingsOutlinedIcon />,
    },
  ]

  return (
    <Box>
      {/* header */}
      <Box>
        <Flex
          justify="space-between"
          sx={(theme) => ({
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            background: theme.colors.brand[0],
            height: `${HEIGHT}px`,
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
                color={theme.colors.gray[6]}
              />
            </MediaQuery>

            <Link href="/">
              <Text size="md" weight={700} color={theme.colors.brand[5]}>
                Template
              </Text>
            </Link>
          </Flex>
          <Flex>
            <Button variant="light" color="dark" size="xs" compact>
              Sign in
            </Button>
            {headerButtons?.map(({ label, icon }) => (
              <Tooltip key={label} label="Search">
                <ActionIcon variant="hover">{icon}</ActionIcon>
              </Tooltip>
            ))}
          </Flex>
        </Flex>
        <Box
          sx={(theme) => ({
            height: `${HEIGHT}px`,
          })}
        />
      </Box>

      {/* mobile nav overlay */}
      {opened && (
        <Box
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
        >
          <NavList />
        </Box>
      )}
    </Box>
  )
}

export default Header
