import { useDebouncedValue } from "@mantine/hooks"
import React, { memo, useEffect } from "react"

interface IFormAutosaveProps {
  onSave: () => void
  values: any
}

const FormAutosave = ({ onSave, values }: IFormAutosaveProps) => {
  const debouncedFormValues = useDebouncedValue(values, 500)

  // console.log("debouncedFormValues", values, debouncedFormValues)

  // useEffect(() => {
  //   console.log("debouncedFormValues", debouncedFormValues)
  // }, [])

  return null
}

export default memo(FormAutosave)
