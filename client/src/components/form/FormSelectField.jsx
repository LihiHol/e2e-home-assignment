import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import SelectBase from "../ui/inputs/SelectBase";

/**
 * @param {{ name:string, label:string, rules?:object, options:Array<{value:any,label:string}>, defaultValue?:any, sx?:object }} props
 */
export default function FormSelectField({ name, label, rules, options = [], defaultValue = "", sx, ...rest }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}          
      rules={rules}
      render={({ field, fieldState }) => (
        <SelectBase
          label={label}
          value={field.value ?? ""}       
          onChange={(e) => field.onChange(e.target.value)} 
          onBlur={field.onBlur}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          options={options}
          sx={sx}
          {...rest}
        />
      )}
    />
  );
}
