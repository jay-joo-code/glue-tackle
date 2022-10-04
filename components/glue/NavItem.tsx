import { Button, Group, Text, ThemeIcon, useMantineTheme } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import IconButton from "./IconButton"

interface INavItemProps {
  icon: React.ReactNode
  label: string
  href: string
  onClick?: () => void
}

const NavItem = ({ icon, label, href, onClick }: INavItemProps) => {
  const theme = useMantineTheme()
  const router = useRouter()

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
          <IconButton color="brand" size="xl">
            {icon}
          </IconButton>
          <Text size="xl" color={theme.colors.text[3]}>
            {label}
          </Text>
        </Group>
      </Button>
    </Link>
  )
}

export default NavItem
