import {
  IconAlertCircle,
  IconCircleDashedCheck,
  IconFolder,
  IconHourglassHigh,
  IconUserScan,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useStateContext } from "../context";

export const useMetricsData = () => {
  const navigate = useNavigate();
  const { user } = usePrivy();
  const { fetchUserRecords, records, fetchUserByEmail } = useStateContext();
  const [metrics, setMetrics] = useState({
    totalFolders: 0,
    aiPersonalizedTreatment: 0,
    totalScreenings: 0,
    completedScreenings: 0,
    pendingScreenings: 0,
    overdueScreenings: 0,
  });

  useEffect(() => {
    if (user) {
      fetchUserByEmail(user?.email?.address!)
        .then(() => {
          // console.log(records);
          const totalFolders = records.length;
          let aiPersonalizedTreatment = 0;
          let totalScreenings = 0;
          let completedScreenings = 0;
          let pendingScreenings = 0;
          let overdueScreenings = 0;

          records.forEach((record) => {
            if (record.kanbanRecords) {
              try {
                const kanban = JSON.parse(record.kanbanRecords);
                aiPersonalizedTreatment += kanban.columns.some(
                  (column: any) => column.title === "AI Personalized Treatment"
                )
                  ? 1
                  : 0;
                totalScreenings += kanban.tasks.length;
                completedScreenings += kanban.tasks.filter(
                  (task: any) => task.columnId === "done"
                ).length;
                pendingScreenings += kanban.tasks.filter(
                  (task: any) => task.columnId === "doing"
                ).length;
                overdueScreenings += kanban.tasks.filter(
                  (task: any) => task.columnId === "overdue"
                ).length;
              } catch (error) {
                console.error("Failed to parse kanbanRecords:", error);
              }
            }
          });

          setMetrics({
            totalFolders,
            aiPersonalizedTreatment,
            totalScreenings,
            completedScreenings,
            pendingScreenings,
            overdueScreenings,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [user, fetchUserRecords, records]);

  const metricsData = [
    {
      title: "Specialist Appointments Pending",
      subtitle: "View",
      value: metrics.pendingScreenings,
      icon: IconHourglassHigh,
      onClick: () => navigate("/appointments/pending"),
    },
    {
      title: "Treatment Progress Update",
      subtitle: "View",
      value: `${metrics.completedScreenings} of ${metrics.totalScreenings}`,
      icon: IconCircleDashedCheck,

      onClick: () => navigate("/treatment/progress"),
    },
    {
      title: "Total Folders",
      subtitle: "View",
      value: metrics.totalFolders,
      icon: IconFolder,
      onClick: () => navigate("/folders"),
    },
    {
      title: "Total Screenings",
      subtitle: "View",
      value: metrics.totalScreenings,
      icon: IconUserScan,
      onClick: () => navigate("/screenings"),
    },
    {
      title: "Completed Screenings",
      subtitle: "View",
      value: metrics.completedScreenings,
      icon: IconCircleDashedCheck,
      onClick: () => navigate("/screenings/completed"),
    },
    {
      title: "Pending Screenings",
      subtitle: "View",
      value: metrics.pendingScreenings,
      icon: IconHourglassHigh,
      onClick: () => navigate("/screenings/pending"),
    },
    {
      title: "Overdue Screenings",
      subtitle: "View",
      value: metrics.overdueScreenings,
      icon: IconAlertCircle,
      onClick: () => navigate("/screenings/overdue"),
    },
  ];

  return metricsData;
};
