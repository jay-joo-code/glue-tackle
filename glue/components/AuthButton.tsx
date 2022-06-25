import { Avatar, Button, Menu } from "@mantine/core"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import MenuDivider from "./MenuDivider"
import MenuItem from "./MenuItem"

const AuthButton = () => {
  const { status, data } = useSession()
  const router = useRouter()

  if (status !== "authenticated") {
    return (
      <Link href="/api/auth/signin">
        <Button variant="light" color="dark" size="xs">
          Sign in
        </Button>
      </Link>
    )
  }

  return (
    <Menu
      styles={(theme) => ({
        root: {
          padding: "0 !important",
        },
      })}
      control={
        <Avatar
          src={data?.user?.image}
          radius="xl"
          alt="User profile image"
          size="sm"
          sx={(theme) => ({
            cursor: "pointer",
          })}
        />
      }
    >
      <MenuItem href="/tasks/my-tasks">My tasks</MenuItem>

      <MenuDivider />

      <MenuItem onClick={() => signOut({ redirect: false })} color="red">
        Sign out
      </MenuItem>
    </Menu>
  )
}

export default AuthButton
