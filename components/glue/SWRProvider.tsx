import { showNotification } from "@mantine/notifications"
import React from "react"
import { SWRConfig } from "swr"

interface ISWRProviderProps {
  children: React.ReactNode
}

const SWRProvider = ({ children }: ISWRProviderProps) => {
  return (
    <SWRConfig
      value={{
        fetcher: async (url) => {
          const BASE_URL = "/api"
          const res = await fetch(`${BASE_URL}${url}`)

          if (!res.ok) {
            const errorInfo = await res.json()

            showNotification({
              title: "Error",
              message: errorInfo.message,
              color: "red",
            })

            return
          }

          return res.json()
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}

export default SWRProvider
