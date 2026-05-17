import { useContext } from "react";
import StaffAuthContext from "./StaffAuthCore";

export function useStaffAuth() {
  const context = useContext(StaffAuthContext);
  if (!context) {
    throw new Error("useStaffAuth must be used inside StaffAuthProvider");
  }
  return context;
}
