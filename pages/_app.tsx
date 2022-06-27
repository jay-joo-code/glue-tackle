import { ModalsProvider } from "@mantine/modals"
import { NotificationsProvider } from "@mantine/notifications"
import AppDefaultHead from "components/glue/AppDefaultHead"
import AppShell from "components/glue/AppShell"
import MantineConfigProvider from "components/glue/MantineConfigProvider"
import SWRProvider from "components/glue/SWRProvider"
import { SessionProvider } from "next-auth/react"
import { AppProps } from "next/app"
import { useEffect, useState } from "react"
import "react-loading-skeleton/dist/skeleton.css"
import "styles/glue/reset.css"

const App = ({ Component, pageProps }: AppProps) => {
  // TODO: find a better fix
  // this wouldn't allow for SSR at all in the entire app
  // const [isMounted, setIsMounted] = useState<boolean>(false)

  // useEffect(() => {
  //   setIsMounted(true)
  // }, [])

  // if (!isMounted) return null

  return (
    <SessionProvider session={pageProps.session}>
      <MantineConfigProvider>
        <NotificationsProvider>
          <ModalsProvider>
            <SWRProvider>
              <AppShell>
                <AppDefaultHead />
                <Component {...pageProps} />
              </AppShell>
            </SWRProvider>
          </ModalsProvider>
        </NotificationsProvider>
      </MantineConfigProvider>
    </SessionProvider>
  )
}

export default App
