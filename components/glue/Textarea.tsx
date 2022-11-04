import { Textarea as MantineTextarea, TextareaProps } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { PolymorphicComponentProps } from "@mantine/utils"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

interface ITextareaProps
  extends Omit<
    PolymorphicComponentProps<"textarea", TextareaProps>,
    "variant"
  > {
  glueKey?: string
  sourceOfTruth?: "url-query"
  onDebouncedChange?: (value: string) => void
  variant?: "unstyled" | "default" | "filled" | "subtle"
}

const Textarea = React.forwardRef<HTMLTextAreaElement, ITextareaProps>(
  (props, ref) => {
    const {
      glueKey,
      sourceOfTruth,
      variant: propVariant = "default",
      value: propValue,
      onChange: propOnChange,
      onDebouncedChange,
      ...rest
    } = props
    // TODO: fix this stupid bug that jumps the cursor to the end

    // sourceOfTruth = url-query
    const router = useRouter()
    const routerQueryValue = router?.query[glueKey]
    const [urlQueryValue, setUrlQueryValue] = useState<string>()
    const [debouncedUrlQueryValue] = useDebouncedValue(urlQueryValue, 300)
    const urlQueryOnChange = (event) => {
      setUrlQueryValue(event?.target?.value)
    }

    useEffect(() => {
      if (urlQueryValue === undefined && routerQueryValue !== undefined) {
        setUrlQueryValue(routerQueryValue as string)
      }
    }, [urlQueryValue, routerQueryValue])

    useEffect(() => {
      if (sourceOfTruth === "url-query" && router?.isReady) {
        router?.replace(
          {
            query: {
              ...router?.query,
              [glueKey]: debouncedUrlQueryValue,
            },
          },
          undefined,
          { shallow: true }
        )
      }
    }, [sourceOfTruth, debouncedUrlQueryValue])

    // dynamic value, onChange
    const value =
      (sourceOfTruth === "url-query" ? urlQueryValue : (propValue as string)) ||
      ""
    const onChange =
      sourceOfTruth === "url-query" ? urlQueryOnChange : propOnChange

    // onDebouncedChange
    const [debouncedPropValue] = useDebouncedValue(propValue, 300)

    useEffect(() => {
      if (onDebouncedChange && debouncedPropValue !== undefined) {
        onDebouncedChange(debouncedPropValue as string)
      }
    }, [debouncedPropValue])

    // TODO: track focus, debounced values, blur, etc
    // const handleTrackedClick = (event: React.MouseEvent<HTMLTextareaElement>) => {
    //   amplitude.track(`Textarea-click-${toKebabCase(children as string)}`)

    //   if (onClick) {
    //     onClick(event)
    //   }
    // }

    // dynamic styles
    const variant = propVariant === "subtle" ? "unstyled" : propVariant
    const commonWrapperStyles = {
      padding: ".6rem .6rem",
    }
    const dynamicStyles =
      propVariant === "subtle"
        ? (theme) => ({
            wrapper: {
              ...commonWrapperStyles,
              background: value?.length === 0 && theme.colors.gray[0],
              borderRadius: theme.radius.md,

              "&:hover": {
                background: theme.colors.gray[0],
              },

              "&:focus": {
                background: theme.colors.gray[0],
              },
            },
            input: {
              paddingTop: "0 !important",
              paddingBottom: "0 !important",
              transition: "background 200ms ease-in-out",
              height: "unset",
              lineHeight: 1.5,
              borderRadius: theme.radius.md,
            },
          })
        : {
            wrapper: {
              ...commonWrapperStyles,
            },
          }

    return (
      <MantineTextarea
        ref={ref}
        value={value}
        onChange={onChange}
        variant={variant}
        styles={dynamicStyles}
        {...rest}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export default Textarea
