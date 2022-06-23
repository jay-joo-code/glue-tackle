import { Container } from "@mantine/core"
import React from "react"
import Flex from "./Flex"
import NavItem from "./NavItem"
import AlignHorizontalLeftOutlinedIcon from "@mui/icons-material/AlignHorizontalLeftOutlined"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined"

export interface INavListProps {
  closeNavOverlay: () => void
}

const NavList = ({ closeNavOverlay }: INavListProps) => {
  const NAV_ELEMENTS = [
    {
      label: "All tasks",
      href: "/tasks",
      icon: <AlignHorizontalLeftOutlinedIcon />,
    },
    {
      label: "New task",
      href: "/tasks/edit",
      icon: <AddOutlinedIcon />,
    },
    {
      label: "My tasks",
      href: "/tasks/my-tasks",
      icon: <InsertEmoticonOutlinedIcon />,
    },
  ]

  return (
    <Flex direction="column" spacing="sm">
      {NAV_ELEMENTS?.map(({ label, href, icon }) => (
        <NavItem
          key={label}
          label={label}
          href={href}
          icon={icon}
          onClick={() => closeNavOverlay()}
        />
      ))}
    </Flex>
  )
}

export default NavList
