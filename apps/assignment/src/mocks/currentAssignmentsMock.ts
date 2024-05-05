import type { RateType, Role } from "~/shared.types";

export interface MockProject {
  id: number;
  name: string;
  assignments: MockProjectAssignment[];
}

export interface MockProjectAssignment {
  id: number;
  name: string;
  hours: number;
  availableHours: number;
  role: Role;
  fromDate: string;
  toDate: string;
  rateType: RateType;
  avatarUrl: string;
}

export const MOCK_PROJECT_WITH_ASSIGNMENTS: MockProject = {
  id: 8,
  name: "Mavida Website",
  assignments: [
    {
      id: 1,
      name: "Martin Oppenheimer",
      hours: 2,
      avatarUrl: "https://via.placeholder.com/100x100.png/00ee77?text=ut",
      role: "developer",
      availableHours: 8,
      fromDate: "2024-04-05",
      toDate: "2024-04-09",
      rateType: "billable",
    },
    {
      id: 2,
      name: "Andrés Nakanishi",
      hours: 8,
      avatarUrl:
        "https://light-it-onboarding.sfo3.digitaloceanspaces.com/avatars/avatar-26.jpg",
      role: "developer",
      availableHours: 8,
      fromDate: "2024-04-05",
      toDate: "2024-04-09",
      rateType: "non-billable",
    },
  ],
};
