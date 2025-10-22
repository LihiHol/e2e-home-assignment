import React from "react";
import { useController, useFormContext } from "react-hook-form";
import TextFieldBase from "../ui/inputs/TextFieldBase";

/**
 * Adapter between RHF and TextFieldBase.
 */
export default function FormTextField({ name, label, rules, inputProps, type = "text" }) {
  const { control, formState: { errors } } = useFormContext();
  const { field } = useController({ name, control, rules });

  const err = errors?.[name];
  const helperText = err?.message;

  return (
    <TextFieldBase
      label={label}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={Boolean(err)}
      helperText={helperText}
      type={type}
      inputProps={inputProps}
    />
  );
}
