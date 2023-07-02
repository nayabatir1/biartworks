import { toast } from "react-toastify";
import { ApiResponseError } from "./http";

export const onAPIError = (err: ApiResponseError) => {
  toast.error(err.message);
};
