export function getErrorMessage(error: any, fallback = "Ocurrió un error") {
  if (!error) return fallback;

  if (error.response?.data) {
    const data = error.response.data;
    if (typeof data === "string") return data;
    if (data.msg) return data.msg;
    if (data.error) return data.error;
  }

  if (error.message) return error.message;

  return fallback;
}
