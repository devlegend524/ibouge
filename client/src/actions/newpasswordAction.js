import { NEW_PASSWORD_LOADING } from "./action_types/restorepassword";

export const newPassword = (payload) => ({
  type: NEW_PASSWORD_LOADING,
  payload,
});
