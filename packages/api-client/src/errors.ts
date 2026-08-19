import axios from "axios";

export function getAxiosErrorDetail(error: unknown): unknown {
  if (axios.isAxiosError(error)) {
    return error.response?.data ?? error.message;
  }
  return undefined;
}
