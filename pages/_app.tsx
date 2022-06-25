import { ModalsProvider } from "@mantine/modals"
import { NotificationsProvider } from "@mantine/notifications"
import AppDefaultHead from "glue/components/AppDefaultHead"
import AppShell from "glue/components/AppShell"
import MantineConfigProvider from "glue/components/MantineConfigProvider"
import SWRProvider from "glue/components/SWRProvider"
import { SessionProvider } from "next-auth/react"
import { AppProps } from "next/app"
import "./../styles/reset.css"

const App = ({ Component, pageProps }: AppProps) => {
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
