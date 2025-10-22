import SimpleDialog from "../ui/dialog/simpleDialog";
import CreateEntityForm from "../form/CreateEntityForm";
import { WORKER_FIELDS } from "../../constants/WORKER_FIELDS";
import { workerService } from "../../services/workerService";
import { toast } from "../ui/toast/toast";

export default function CreateWorkerDialog({ open, onClose }) {
  return (
    <SimpleDialog open={open} onClose={onClose} title="הוספת עובד">
      <CreateEntityForm
        handleCloseDialog={onClose}
        fields={WORKER_FIELDS}
        apiService={async (data) => {
          await workerService.create(data);
          toast.success("עובד נוצר בהצלחה");
        }}
        successMessage=""
        entityTypeLabel="שמור"
      />
    </SimpleDialog>
  );
}

