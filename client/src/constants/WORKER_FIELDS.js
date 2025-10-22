import { JOBS_OPTIONS } from "./JOBS_OPTIONS";

/** @type {import("../types/forms").IFormField[]} */
export const WORKER_FIELDS = [
  {
    name: "workerId",
    type: "text",
    gridSize: 6,
    placeholder: "worker Id",
    registerOptions: { required: { value: true, message: "יש להזין מספר עובד" } },
  },
  {
    name: "name",
    type: "text",
    gridSize: 6,
    placeholder: "Name",
    registerOptions: { required: { value: true, message: "יש להזין שם לעובד" } },
    inputProps: { inputMode: "text" },
  },
  {
    name: "job",
    type: "select",
    gridSize: 6,
    placeholder: "Select job title",
    registerOptions: { required: { value: true, message: "יש לבחור תפקיד" } },
    options: JOBS_OPTIONS,
  },
  {
    name: "phone",
    type: "text",
    gridSize: 6,
    placeholder: "Phone number",
    registerOptions: { required: { value: false, message: "יש להזין מספר טלפון" } },
  },
  {
    name: "address",
    type: "text",
    gridSize: 12,
    placeholder: "Adress",
    registerOptions: { required: { value: true, message: "יש להזין כתובת" } },
  },
  {
    name: "password",
    type: "password",
    gridSize: 1,
    placeholder: "Password",
    registerOptions: { required: { value: true, message: "יש להזין סיסמת משתמש" } },
  },
];
