import { executePost } from "../ServiceMethods";

export const DashboardApi = async (data) => {
  try {
    const dashboardData = await executePost("/vms/endUserDashboard", data);
    const DashboardData = dashboardData.data ? dashboardData.data : {};
    return DashboardData;
  } catch (error) {
    console.error(error);
    return error;
  }
};