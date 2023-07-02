import { toast } from "react-toastify";
import { Root } from "../shared/types";

export const onAPISuccess = (res: Root<unknown>) => {
  toast.success(res.message);
};
