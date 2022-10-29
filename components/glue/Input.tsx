import { Input as MantineInput, InputProps } from "@mantine/core"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { PolymorphicComponentProps } from "@mantine/utils"
import { useDebouncedValue } from "@mantine/hooks"

interface IInputProps
  extends Omit<PolymorphicComponentProps<"input", InputProps>, "variant"> {
  glueKey?: string
  sourceOfTruth?: "url-query"
  onDebouncedChange?: (value: string) => void
  variant?: "unstyled" | "default" | "filled" | "subtle"
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>((props, ref) => {
  const {
    glueKey,
    sourceOfTruth,
    onDebouncedChange,
    variant: propVariant = "default",
    value: propValue,
    onChange: propOnChange,
    ...rest
  } = props

  // source of truth: url query
  const router = useRouter()
  const [localValue, setLocalValue] = useState<string>(
    (propValue as string) || ""
  )
  const [debouncedLocalValue] = useDebouncedValue(localValue, 300)

  const localOnChange = (event) => {
    setLocalValue(event?.currentTarget?.value)
    if (propOnChange) propOnChange(event)
  }

  useEffect(() => {
    if (sourceOfTruth === "url-query" && localValue !== "") {
      router?.replace(
        {
          query: {
            ...router?.query,
            [glueKey]: debouncedLocalValue,
          },
        },
        undefined,
        { shallow: true }
      )
    }

    if (onDebouncedChange) {
      onDebouncedChange(debouncedLocalValue)
    }
  }, [debouncedLocalValue])

  useEffect(() => {
    if (sourceOfTruth === "url-query" && localValue === "") {
      setLocalValue(router?.query[glueKey] as string)
    }
  }, [router?.query])

  // TODO: track focus, debounced values, blur, etc
  // const handleTrackedClick = (event: React.MouseEvent<HTMLInputElement>) => {
  //   amplitude.track(`Input-click-${toKebabCase(children as string)}`)

  //   if (onClick) {
  //     onClick(event)
  //   }
  // }

  // variant: subtle
  const variant = propVariant === "subtle" ? "unstyled" : propVariant
  const styles =
    propVariant === "subtle"
      ? (theme) => ({
          input: {
            background: localValue?.length === 0 && theme.colors.gray[0],
            transition: "background 200ms ease-in-out",
            height: "unset",
            lineHeight: 1.2,

            "&:hover": {
              background: theme.colors.gray[0],
            },

            "&:focus": {
              background: theme.colors.gray[0],
            },
          },
        })
      : {}

  return (
    <MantineInput
      ref={ref}
      {...rest}
      value={sourceOfTruth === "url-query" ? localValue : propValue}
      onChange={localOnChange}
      variant={variant}
      styles={styles}
    />
  )
})

Input.displayName = "Input"

export default Input
