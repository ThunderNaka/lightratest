export const PROJECT_TYPE = {
  INTERNAL: "internal",
  CLIENT: "client",
} as const;

export const ASSIGNMENT_TYPE = {
  PROJECT: "project",
  COURSE: "course",
  TIME_OFF: "timeOff",
} as const;

export const RATE_TYPE = {
  BILLABLE: "billable",
  NON_BILLABLE: "non-billable",
  SUBSTITUTION: "substitution",
  OVER_SERVICING: "over-servicing",
} as const;

export const ROLE = {
  DEVELOPER: "developer",
  DESIGNER: "designer",
  PROJECT_MANAGER: "pm",
  QUALITY_ASSURANCE: "qa",
} as const;

export const PROJECT_STATUS = {
  ACTIVE: "active",
  PAUSED: "paused",
  ARCHIVED: "archived",
} as const;

export const TIME_OFF_TYPE = {
  VACATION: "vacation",
  SICK: "sick",
  UNPAID_VACATION: "unpaid-vacation",
  STUDY_DAYS: "study-days",
} as const;

export const COURSE_STATUS = {
  AVAILABLE: "available",
  DEPRECATED: "deprecated",
} as const;

export const TIME_INTERVAL = {
  QUARTER: "quarter",
  MONTH: "month",
  WEEK: "week",
} as const;

export const VIEW_MODE = {
  LIST: "list",
  GRID: "grid",
} as const;

export const PROJECT_TRAFFIC_STATUS = {
  OFF_TRACK: "off-track",
  ON_TRACK: "on-track",
  MODERATE_RISK: "moderate-risk",
} as const;

// ============================ OPTIONS ======================================

export const ASSIGNMENT_TYPE_OPTIONS = [
  { value: ASSIGNMENT_TYPE.PROJECT, label: "Project" },
  { value: ASSIGNMENT_TYPE.COURSE, label: "Course" },
] as const;

export const RATE_TYPE_OPTIONS = [
  { value: RATE_TYPE.BILLABLE, label: "Billable" },
  { value: RATE_TYPE.NON_BILLABLE, label: "Non-billable" },
  { value: RATE_TYPE.SUBSTITUTION, label: "Substitution" },
  { value: RATE_TYPE.OVER_SERVICING, label: "Over Servicing" },
] as const;

export const ROLE_OPTIONS = [
  { value: ROLE.DEVELOPER, label: "Developer" },
  { value: ROLE.DESIGNER, label: "UX/UI Designer" },
  { value: ROLE.PROJECT_MANAGER, label: "Project Manager" },
  { value: ROLE.QUALITY_ASSURANCE, label: "Quality Assurance" },
] as const;

export const PROJECT_TYPE_OPTIONS = [
  { value: PROJECT_TYPE.CLIENT, label: "Client" },
  { value: PROJECT_TYPE.INTERNAL, label: "Internal" },
] as const;

export const PROJECT_STATUS_OPTIONS = [
  { value: PROJECT_STATUS.ACTIVE, label: "Active" },
  { value: PROJECT_STATUS.PAUSED, label: "Paused" },
  { value: PROJECT_STATUS.ARCHIVED, label: "Archived" },
] as const;

export const COURSE_STATUS_OPTIONS = [
  { value: COURSE_STATUS.AVAILABLE, label: "Available" },
  { value: COURSE_STATUS.DEPRECATED, label: "Deprecated" },
] as const;

export const INTERVAL_VIEW_OPTIONS = [
  { value: TIME_INTERVAL.QUARTER, label: "Quarterly view" },
  { value: TIME_INTERVAL.MONTH, label: "Monthly view" },
  { value: TIME_INTERVAL.WEEK, label: "Weekly view" },
] as const;
