import type { MODAL_ROUTES, ROUTES } from "./router";
import type {
  ASSIGNMENT_TYPE,
  COURSE_STATUS,
  PROJECT_STATUS,
  PROJECT_TYPE,
  RATE_TYPE,
  ROLE,
  TIME_INTERVAL,
  TIME_OFF_TYPE,
} from "./shared.constants";

type ObjectValue<T> = T[keyof T];

type Flatten<T> = T extends (infer U)[] ? U : T;

type Path<T> = T extends string
  ? T
  : {
      [K in keyof T]: T[K] extends string
        ? T[K]
        : T[K] extends object
        ? `${Path<T[K]>}`
        : never;
    }[keyof T];

export type AssignmentType = ObjectValue<typeof ASSIGNMENT_TYPE>;
export type CourseStatus = ObjectValue<typeof COURSE_STATUS>;
export type ModalRoute = Flatten<Path<typeof MODAL_ROUTES>>;
export type ProjectStatus = ObjectValue<typeof PROJECT_STATUS>;
export type ProjectType = ObjectValue<typeof PROJECT_TYPE>;
export type RateType = ObjectValue<typeof RATE_TYPE>;
export type Role = ObjectValue<typeof ROLE>;
export type Route = Flatten<Path<typeof ROUTES>>;
export type TimeInterval = ObjectValue<typeof TIME_INTERVAL>;
export type TimeOffType = ObjectValue<typeof TIME_OFF_TYPE>;

export interface BaseEmployee {
  id: number;
  name: string;
  avatarUrl: string;
  email: string;
}
export interface Employee extends BaseEmployee {
  availableHours: number;
  hireDate: string;
  hours: number;
  isAssignable: boolean;
  jobTitle: string;
}
export interface Team {
  id: number;
  name: string;
  leaderId: number;
  createdAt: Date;
}

export interface Client {
  id: number;
  name: string;
  thumbnail: string;
  address: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  color: string;
  type: ProjectType;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  notes?: string;
  deletedAt?: string;
}

export interface Topic {
  id: string;
  name: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  status: string;
  assignmentsCount: number;
  createdAt: string;
  topics: Topic[];
  urls: { name: string; url: string }[];
  deletedAt?: string;
}

export interface TimeOff {
  id: number;
  employeeId: number;
  bambooId: number;
  type: TimeOffType;
  startDate: string;
  endDate: string;
  createdAt: string;
  deletedAt?: string;
}

export type Assignable = Project | Course | TimeOff;

export interface Assignment {
  id: number;
  employeeId: number;
  assignableId: number;
  hourlyRate: string;
  hours: number;
  role: Role;
  fromDate: string;
  toDate: string;
  rateType: RateType;
  createdAt: string;
  updatedAt: string;
  isNotified: boolean;
  assignedById?: number;
  notes?: string;
  type: AssignmentType;
}

export type AssignmentWithAssignable = Assignment &
  (
    | {
        type: typeof ASSIGNMENT_TYPE.PROJECT;
        assignable: Project;
      }
    | {
        type: typeof ASSIGNMENT_TYPE.COURSE;
        assignable: Course;
      }
    | {
        type: typeof ASSIGNMENT_TYPE.TIME_OFF;
        assignable: TimeOff;
      }
  );
