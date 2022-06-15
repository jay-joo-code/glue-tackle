import {
  AppShell,
  Aside,
  Burger,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React, { useState } from "react";
import NavItem from "./NavItem";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import Link from "next/link";

interface ICustomAppShellProps {
  children: React.ReactNode;
}

const CustomAppShell = ({ children }: ICustomAppShellProps) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 260 }}
        >
          <Navbar.Section grow mt="md">
            <NavItem
              href="/api/auth/signin"
              icon={<ExitToAppOutlinedIcon />}
              label="Login"
            />
            {/* <NavItem
              href="/api/auth/signin"
              icon={<ExitToAppOutlinedIcon />}
              label="Login"
            /> */}
          </Navbar.Section>
        </Navbar>
      }
      aside={
        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
          <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
            <Text>Application sidebar</Text>
          </Aside>
        </MediaQuery>
      }
      // footer={
      //   <Footer height={60} p="md">
      //     Application footer
      //   </Footer>
      // }
      header={
        <Header
          height={54}
          px="lg"
          py="sm"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Group spacing="sm">
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
              />
            </MediaQuery>

            <Link href="/">
              <Text size="xl" weight={700} color={theme.colors.blue[5]}>
                Todolist
              </Text>
            </Link>
          </Group>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

export default CustomAppShell;
