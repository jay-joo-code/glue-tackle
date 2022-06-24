import { ActionIcon, ActionIconProps, Tooltip } from "@mantine/core"
import React from "react"

interface IIconButtonProps extends ActionIconProps<"button"> {
  tooltipLabel?: string
}

const IconButton = ({ tooltipLabel, children, ...rest }: IIconButtonProps) => {
  if (tooltipLabel) {
    return (
      <Tooltip label={tooltipLabel}>
        <ActionIcon {...rest}>{children}</ActionIcon>
      </Tooltip>
    )
  }

  return <ActionIcon {...rest}>{children}</ActionIcon>
}

export default IconButton
