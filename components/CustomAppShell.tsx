import {
  AppShell,
  Box,
  Burger,
  Group,
  MediaQuery,
  Navbar,
  Space,
  Text,
  useMantineTheme,
} from "@mantine/core"
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined"
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined"
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined"
import LibraryAddCheckOutlinedIcon from "@mui/icons-material/LibraryAddCheckOutlined"
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined"
import useIsMobile from "hooks/isMobile"
import { getSession, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import React, { useState } from "react"
import Header from "./Header"
import NavItem from "./NavItem"

interface ICustomAppShellProps {
  children: React.ReactNode
}

const CustomAppShell = ({ children }: ICustomAppShellProps) => {
  const theme = useMantineTheme()
  const [opened, setOpened] = useState<boolean>(false)
  const { data: session } = useSession()
  const isMobile = useIsMobile()

  return (
    <Box
      sx={(theme) => ({
        overflow: "hidden",
      })}
    >
      <Header />
      <Box
        sx={(theme) => ({
          background: theme.colors.brand[0],
          minHeight: "100vh",
        })}
      >
        {children}
      </Box>
    </Box>
  )

  // return (
  //   <AppShell
  //     styles={{
  //       main: {
  //         background: theme.colors.brand[0],
  //       },
  //     }}
  //     navbarOffsetBreakpoint="xs"
  //     asideOffsetBreakpoint="xs"
  //     fixed
  //     navbar={
  //       <MediaQuery largerThan="xs" styles={{ display: "none" }}>
  //         <Navbar
  //           p="md"
  //           hiddenBreakpoint="xs"
  //           hidden={!opened}
  //           width={{ sm: 240 }}
  //           fixed
  //         >
  //           <Navbar.Section grow mt="md">
  //             <NavItem
  //               href="/reddit-opinions"
  //               icon={<ChatBubbleOutlineOutlinedIcon />}
  //               label="Reddit opinions"
  //               onClick={() => setOpened(false)}
  //             />
  //             <NavItem
  //               href="/todos"
  //               icon={<LibraryAddCheckOutlinedIcon />}
  //               label="Todos"
  //               onClick={() => setOpened(false)}
  //             />
  //             {session ? (
  //               <>
  //                 <NavItem
  //                   href="/drafts"
  //                   icon={<ModeEditOutlinedIcon />}
  //                   label="Drafts"
  //                   onClick={() => setOpened(false)}
  //                 />
  //                 <NavItem
  //                   href="/create"
  //                   icon={<AddCircleOutlineOutlinedIcon />}
  //                   label="Add post"
  //                   onClick={() => setOpened(false)}
  //                 />
  //                 <NavItem
  //                   href="/"
  //                   icon={<ExitToAppOutlinedIcon />}
  //                   label="Sign out"
  //                   onClick={() => signOut()}
  //                 />
  //               </>
  //             ) : (
  //               <NavItem
  //                 href="/api/auth/signin"
  //                 icon={<ExitToAppOutlinedIcon />}
  //                 label="Login"
  //               />
  //             )}
  //           </Navbar.Section>
  //         </Navbar>
  //       </MediaQuery>
  //     }
  //   >
  //     {children}
  //   </AppShell>
  // )
}

export default CustomAppShell
