import { useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useEffect, useState } from "react"

const useIsMobile = () => {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)

  // prevents hydration error
  // all UI that uses this hook will first be rendered as desktop during SSR
  // since isMounted defaults to false
  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted && isMobile
}

export default useIsMobile
