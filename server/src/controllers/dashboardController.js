import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import dashboardService from "../services/dasboardService.js";

const getDashboard = asyncHandler(async (req, res) => {
  let data;

  if (req.user.role === "ADMIN") {
    data = await dashboardService.getAdminDashboard();
  } else if (req.user.role === "STORE_OWNER") {
    data = await dashboardService.getStoreOwnerDashboard(req.user.id);
  } else {
    throw ApiError.forbidden("This role does not have a dashboard");
  }

  return new ApiResponse(200, "Dashboard data fetched successfully", data).send(
    res,
  );
});

export default { getDashboard };
