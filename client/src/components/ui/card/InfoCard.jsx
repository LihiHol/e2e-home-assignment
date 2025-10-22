import React from "react";
import { Card, CardContent, CardHeader, CardActions, Avatar, Typography, Stack, Box } from "@mui/material";

export default function InfoCard({ title, subtitle, avatar, items = [], actions, children }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      {(title || subtitle || avatar) && (
        <CardHeader
          avatar={avatar ? <Avatar src={avatar.src}>{avatar.fallback}</Avatar> : null}
          title={title}
          subheader={subtitle}
        />
      )}
      <CardContent>
        {children ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>{children}</Box>
        ) : (
          <Stack spacing={1.25}>
            {items.map((it) => (
              <Box key={it.label} sx={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 1, minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary">{it.label}</Typography>
                <Typography variant="body1">{it.value ?? "—"}</Typography>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
      {actions && <CardActions sx={{ px: 2, pb: 2 }}>{actions}</CardActions>}
    </Card>
  );
}
