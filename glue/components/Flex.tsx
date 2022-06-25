import {
  CSSObject,
  Group,
  GroupProps,
  MantineTheme,
  useMantineTheme,
} from "@mantine/core"
import React from "react"

interface IFlexProps extends GroupProps {
  justify?: React.CSSProperties["alignItems"]
  sx?: (theme?: MantineTheme) => CSSObject
}

const Flex = ({ justify, grow, sx, ...rest }: IFlexProps) => {
  const theme = useMantineTheme()
  const sxObj = sx ? sx(theme) : {}

  return (
    <Group
      sx={(theme) => ({
        justifyContent: justify,
        flexGrow: grow ? 1 : 0,
        ...sxObj,
      })}
      {...rest}
    />
  )
}

export default Flex
