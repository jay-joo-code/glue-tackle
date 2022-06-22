import { MantineProvider } from "@mantine/core"
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
          gray: [
            "#FFFFFF",
            "#F8F9FA",
            "#F1F3F5",
            "#E9ECEF",
            "#CED4DA",
            "#ADB5BD",
            "#868E96",
            "#495057",
            "#343A40",
            "#212529",
          ],
        },
        spacing: {
          xs: 4,
          sm: 8,
          md: 12,
          lg: 16,
          xl: 20,
        },
      }}
      defaultProps={{
        Text: { component: "p" },
        Paper: {
          p: "xl",
          m: "xl",
          radius: "md",
        },
        ActionIcon: {
          variant: "light",
          color: "dark",
        },
        Tooltip: {
          transition: "fade",
        },
      }}
    >
      {children}
    </MantineProvider>
  )
}

export default MantineConfigProvider
