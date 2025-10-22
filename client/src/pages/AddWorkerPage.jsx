import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import CreateEntityForm from "../components/form/CreateEntityForm";
import { WORKER_FIELDS } from "../constants/WORKER_FIELDS";
import { workerService } from "../services/workerService";
import { toast } from "../components/ui/toast/toast";

export default function AddWorkerPage() {
    const handleCloseDialog = () => {
    };

    const handleCreate = async (formData) => {
        try {
            await workerService.create(formData);
            toast.success("העובד נוצר בהצלחה");
        } catch (err) {
            console.error(err);
            toast.error("אירעה שגיאה בעת יצירת העובד");
        }
    };

    return (
        <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 ,paddingTop: '75px', padding: '1rem' }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Add a new worker
            </Typography>

            <Card sx={{borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                    <CreateEntityForm
                        handleCloseDialog={handleCloseDialog}
                        fields={WORKER_FIELDS}
                        apiService={handleCreate}
                        successMessage=""
                        entityTypeLabel="SAVE"
                    />
                </CardContent>
            </Card>
        </Box>
    );
}
