import { MantineProvider } from "@mantine/core"
import { NextLink } from "@mantine/next"
import React from "react"

interface IMantineConfigProviderProps {
  children: React.ReactNode
}

const MantineConfigProvider = ({ children }: IMantineConfigProviderProps) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        primaryColor: "brand",
        colors: {
          brand: [
            "#F7FCFF",
            "#F3FAFF",
            "#E7F5FF",
            "#74C0FC",
            "#4DABF7",
            "#339AF0",
            "#228BE6",
            "#1C7ED6",
            "#1971C2",
            "#1864AB",
          ],
          // dark: [
          //   "#EAEBEC",
          //   "#EAEBEC",
          //   "#D6D6D8",
          //   "#C1C2C5",
          //   "#A6A7AB",
          //   "#909296",
          //   "#5C5F66",
          //   "#373A40",
          //   "#2C2E33",
          //   "#25262B",
          // ],
          gray: [
            "#F8F9FA",
            "#F1F3F5",
            "#E9ECEF",
            "#CED4DA",
            "#868E96",
            "#686F77",
            "#495057",
            "#3F454C",
            "#343A40",
            "#212529",
          ],
        },
        spacing: {
          xs: 4,
          sm: 8,
          md: 12,
          lg: 20,
          xl: 28,
        },
      }}
      defaultProps={{
        Text: { component: "p" },
        Paper: {
          p: "md",
          radius: "md",
        },
        ActionIcon: {
          variant: "light",
          color: "dark",
        },
        Tooltip: {
          transition: "fade",
          position: "bottom",
          placement: "center",
        },
        Menu: {
          transition: "fade",
          p: "sm",
        },
      }}
    >
      {children}
    </MantineProvider>
  )
}

export default MantineConfigProvider
