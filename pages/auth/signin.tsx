import { Button, Center, Container, Stack, Text, Title } from "@mantine/core"
import Flex from "components/glue/Flex"
import { GetServerSideProps } from "next"
import { Provider } from "next-auth/providers"
import { getProviders, getSession, signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import { showNotification } from "@mantine/notifications"
import GithubLogo from "assets/logos/github-logo.svg"
import GoogleLogo from "assets/logos/google-logo.svg"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req })

  if (session) {
    return {
      redirect: { destination: "/" },
      props: {},
    }
  }

  const providers = await getProviders()

  return {
    props: { providers },
  }
}

export interface ISigninProps {
  providers?: Provider
}

const Signin = ({ providers }: ISigninProps) => {
  // TODO: handle OAuthAccountNotLinked error
  // by auto linking accounts

  const ERROR_TO_MESSAGE = useMemo(
    () => ({
      Signin: "Try signing with a different account.",
      OAuthSignin: "Try signing with a different account.",
      OAuthCallback: "Try signing with a different account.",
      OAuthCreateAccount: "Try signing with a different account.",
      EmailCreateAccount: "Try signing with a different account.",
      Callback: "Try signing with a different account.",
      OAuthAccountNotLinked:
        "To confirm your identity, sign in with the same account you used originally.",
      EmailSignin: "Check your email address.",
      CredentialsSignin:
        "Sign in failed. Check the details you provided are correct.",
      default: "Unable to sign in.",
    }),
    []
  )

  const router = useRouter()

  useEffect(() => {
    if (router?.query?.error) {
      setTimeout(() => {
        showNotification({
          title: "Error",
          message: ERROR_TO_MESSAGE[router?.query?.error as string],
          color: "red",
        })
        // router.query.error = null
        router.push({
          query: {},
        })
      })
    }
  }, [router?.query?.error])

  // TODO: resize svg
  const PROVIDER_NAME_TO_LOGO = {
    Google: <GoogleLogo />,
    GitHub: <GithubLogo />,
  }

  return (
    <Flex
      align="center"
      justify="center"
      sx={(theme) => ({
        height: "90vh",
      })}
    >
      <Stack>
        <Title order={1}>Login</Title>
        <Text color="dimmed">Sign in to access your account</Text>
        <Stack mt="lg">
          {providers &&
            Object.values(providers)?.map((provider) => (
              <Button
                key={provider.name}
                color="dark"
                fullWidth
                onClick={() => signIn(provider.id)}
                variant="outline"
                radius="xl"
                leftIcon={
                  <Container
                    sx={(theme) => ({
                      "& svg": {
                        height: "12px",
                        width: "12px",
                      },
                    })}
                  >
                    {PROVIDER_NAME_TO_LOGO[provider?.name]}
                  </Container>
                }
              >
                Sign in with {provider.name}
              </Button>
            ))}
        </Stack>
      </Stack>
    </Flex>
  )
}

export default Signin
