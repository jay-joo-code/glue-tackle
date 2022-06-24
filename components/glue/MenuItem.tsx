import { Menu, MenuItemProps } from "@mantine/core"
import { NextLink } from "@mantine/next"
import React from "react"

interface IMenuItemProps extends MenuItemProps<"a"> {}

const MenuItem = ({ children, ...rest }: IMenuItemProps) => {
  return (
    <Menu.Item component={NextLink} py="sm" {...rest}>
      {children}
    </Menu.Item>
  )
}

export default MenuItem
