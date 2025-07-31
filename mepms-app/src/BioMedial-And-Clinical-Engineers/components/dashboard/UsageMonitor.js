import React, { useEffect } from "react";
import axios from "axios";
import { STAFF } from "../../api/biomedicalEndpoints";
import dayjs from "dayjs";

export default function UsageMonitor({ requests, onUpdate }) {
  useEffect(() => {
    if (!requests.length) return;

    const interval = setInterval(() => {
      const now = dayjs();
      requests.forEach(async req => {
        if (["In Use", "Active"].includes(req.status) && dayjs(req.usageEnd).isBefore(now)) {
          try {
            await axios.put(STAFF.UPDATE_MAINTENANCE_REQUEST(req.id || req._id), { ...req, status: "Released" });
            onUpdate();
          } catch {}
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [requests, onUpdate]);

  return null;
}
