import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import CustomAppShell from "components/CustomAppShell";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import "./../styles/reset.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
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
        }}
      >
        <NotificationsProvider>
          <ModalsProvider>
            <CustomAppShell>
              <Component {...pageProps} />
            </CustomAppShell>
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </SessionProvider>
  );
};

export default App;
