export const ROUTES = {
  base: "/",
  dashboard: "/dashboard",
  assignments: {
    historyView: "/assignments/history-view",
    newAssignment: "/assignments/new-assignment",
    projectView: "/assignments/project-view",
    employeesView: "/assignments/employees-view",
  },
  projects: {
    base: "/projects",
    newProject: "/projects/new-project",
    editProject: "/projects/edit-project",
  },
  projectsNew: "/projects-new",
  employees: "/employees",
  clients: "/clients",
  teams: "/teams",
  security: {
    toolsAndUsers: "/security/tools-and-users",
    historyLog: "/security/history-log",
    pendingPermissions: "/security/pending-permissions",
  },
  learningCenter: {
    coursesList: "/learning-center/courses",
    newCourse: "/learning-center/courses/new-course",
    courseAssignments: "/learning-center/courses/assignments",
    editCourse: "/learning-center/courses",
  },
  platformRoles: "/platform-roles",
  login: "/login",
} as const;

export const MODAL_ROUTES = {
  projectForm: "/projectForm",
  clientForm: "/clientForm",
  /**
   * @deprecated EmployeeModal has been replaced with the EmployeeOverview screen
   */
  employeeForm: "/employeeForm",
  assignedHoursForm: "/assignedHoursForm",
  newAssignmentForm: "/newAssignmentForm",
  assignmentDetails: "/assignmentDetails",
  teamForm: "/teamForm",
  exportAvailabilityForm: "/exportAvailabilityForm",
  currentAssignments: "/currentAssignments",
} as const;
