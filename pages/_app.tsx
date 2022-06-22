import { ModalsProvider } from "@mantine/modals"
import { NotificationsProvider } from "@mantine/notifications"
import AppDefaultHead from "components/AppDefaultHead"
import CustomAppShell from "components/CustomAppShell"
import MantineConfigProvider from "components/MantineConfigProvider"
import SWRProvider from "components/SWRProvider"
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
              <CustomAppShell>
                <AppDefaultHead />
                <Component {...pageProps} />
              </CustomAppShell>
            </SWRProvider>
          </ModalsProvider>
        </NotificationsProvider>
      </MantineConfigProvider>
    </SessionProvider>
  )
}

export default App
