
export interface AttendanceRecord {
  _id: string;
  UserId: string;
  CompanyId: string;
  Date: Date;
  TypeAction: "check-in" | "check-out";
}
