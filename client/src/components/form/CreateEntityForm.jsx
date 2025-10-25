import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Box } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import FormTextField from "./FormTextField";
import FormSelectField from "./FormSelectField";
import CustomPrimaryButton from "../ui/buttons/CustomPrimaryButton";
import { useWorkers } from "../../context/WorkerContext";

/**
 * @typedef {import("../../types/forms").IFormField} IFormField
 */

/**
 * @param {Object} props
 * @param {(open:boolean)=>void} props.handleCloseDialog
 * @param {IFormField[]} props.fields
 * @param {(data:any)=>Promise<any>} props.apiService
 * @param {string} props.successMessage
 * @param {string} props.entityTypeLabel
 * @param {object} [props.defaultValues]
 * @param {React.ReactNode} [props.toolbar]
 */
export default function CreateEntityForm({
  handleCloseDialog,
  fields,
  apiService,
  successMessage,
  entityTypeLabel,
  defaultValues,
  toolbar,
}) {

  const { createWorker } = useWorkers();
  const methods = useForm({ defaultValues });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (formData) => {
    try {
      // אם יש apiService – נשתמש בו, אחרת בקונטקסט
      if (apiService) {
        await apiService(formData);
      } else {
        await createWorker(formData); // ⬅️ קריאה דרך הקונטקסט
      }

      enqueueSnackbar(successMessage || "נשמר בהצלחה", { variant: "success" });
      reset();
      handleCloseDialog(false);
    } catch (error) {
      console.error("Error while creating entity:", error);
      enqueueSnackbar("אירעה שגיאה במהלך השמירה", { variant: "error" });
    }
  };
  // const onSubmit = async (formData) => {
  //   try {
  //     await apiService(formData);
  //     enqueueSnackbar(successMessage, { variant: "success" });
  //     reset();
  //     handleCloseDialog(false);
  //   } catch (error) {
  //     console.error("Error while creating entity:", error);
  //     enqueueSnackbar("אירעה שגיאה במהלך השמירה", { variant: "error" });
  //   }
  // };


  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
          maxWidth: 700,
          mx: "auto",
        }}
      >
        {toolbar}

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gridAutoRows: "auto",
            "@media (max-width:600px)": {
              gridTemplateColumns: "1fr",
            },
          }}
        >
          {fields.map((f) => (
            <Box key={f.name}>
              {f.type === "select" ? (
                <FormSelectField
                  name={f.name}
                  label={f.placeholder}
                  rules={f.registerOptions}
                  options={f.options}
                />
              ) : (
                <FormTextField
                  name={f.name}
                  label={f.placeholder}
                  rules={f.registerOptions}
                  type={
                    f.type === "password" ? "password" : f.type || "text"
                  }
                  inputProps={f.inputProps}
                />
              )}
            </Box>
          ))}
        </Box>

        <CustomPrimaryButton
          type="submit"
          fullWidth
          disabled={isSubmitting}
          aria-label={entityTypeLabel}
          sx={{
            mt: 2,
            alignSelf: "stretch",
          }}
        >
          {isSubmitting ? "שומרת…" : entityTypeLabel}
        </CustomPrimaryButton>
      </Box>
    </FormProvider>
  );
}
