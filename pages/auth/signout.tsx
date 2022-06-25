import { signOut } from "next-auth/react"
import { useEffect } from "react"

const Signout = () => {
  // use the code below to sign out,
  // instead of redirecting to this page
  // signOut({ redirect: false })

  // this page exists as backup / reference

  useEffect(() => {
    signOut({
      callbackUrl: `${window.location.origin}`,
    })
  }, [])

  return null
}

export default Signout
