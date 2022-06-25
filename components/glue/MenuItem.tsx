import { Menu, MenuItemProps } from "@mantine/core"
import { NextLink } from "@mantine/next"
import React from "react"

interface IMenuItemProps extends MenuItemProps<"a"> {}

const MenuItem = ({ children, href, ...rest }: IMenuItemProps) => {
  if (href) {
    return (
      <Menu.Item component={NextLink} href={href} py="sm" {...rest}>
        {children}
      </Menu.Item>
    )
  }
  return (
    <Menu.Item py="sm" {...rest}>
      {children}
    </Menu.Item>
  )
}

export default MenuItem
