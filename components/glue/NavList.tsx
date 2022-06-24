import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import AlignHorizontalLeftOutlinedIcon from "@mui/icons-material/AlignHorizontalLeftOutlined"
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined"
import { signIn, useSession } from "next-auth/react"
import Flex from "./Flex"
import NavItem from "./NavItem"

export interface INavListProps {
  closeNavOverlay: () => void
}

const NavList = ({ closeNavOverlay }: INavListProps) => {
  const { status } = useSession()

  const PRIVATE_NAV = [
    {
      label: "My tasks",
      href: "/tasks/my-tasks",
      icon: <InsertEmoticonOutlinedIcon />,
    },
  ]

  const PUBLIC_NAV = [
    {
      label: "Sign in",
      href: "/api/auth/signin",
      icon: <InsertEmoticonOutlinedIcon />,
    },
  ]

  const DYNAMIC_NAV = status === "authenticated" ? PRIVATE_NAV : PUBLIC_NAV

  const NAV = [
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
    ...DYNAMIC_NAV,
  ]

  return (
    <Flex direction="column" spacing="sm">
      {NAV?.map(({ label, href, icon }) => (
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
