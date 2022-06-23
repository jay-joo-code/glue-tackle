import { Button, Group, Text, ThemeIcon, useMantineTheme } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

interface INavItemProps {
  icon: React.ReactNode
  label: string
  href: string
  onClick?: () => void
}

const NavItem = ({ icon, label, href, onClick }: INavItemProps) => {
  const theme = useMantineTheme()
  const router = useRouter()
  console.log("router.pathname", router.pathname)

  return (
    <Link href={href}>
      <Button
        variant={router.pathname === href ? "light" : "subtle"}
        fullWidth
        style={{ display: "flex", justifyContent: "flex-start" }}
        mb="xs"
        onClick={onClick}
      >
        <Group style={{ width: "100%" }}>
          <ThemeIcon color={theme.colors.blue[5]} variant="light">
            {icon}
          </ThemeIcon>
          <Text color={theme.colors.gray[8]}>{label}</Text>
        </Group>
      </Button>
    </Link>
  )
}

export default NavItem
