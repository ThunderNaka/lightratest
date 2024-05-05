import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";

import { PERMISSIONS, usePermissions } from "~/hooks";
import { Layout } from "~/layout";
import {
  ClientDashboard,
  CoursesList,
  Dashboard,
  EmployeeOverview,
  EmployeesDashboard,
  EmployeesView,
  HistoryView,
  Login,
  NewAssignment,
  NewCourse,
  NotFound,
  PermissionDashboard,
  ProjectDashboard,
  ProjectHoursDashboard,
  ProjectOverview,
  TeamDashboard,
} from "~/screens";
import { CourseDetails } from "~/screens/CourseDetails";
import { EditCourse } from "~/screens/EditCourse";
import EditProject from "~/screens/EditProject/EditProject";
import NewProject from "~/screens/NewProject/NewProject";
import { ProjectDashboardNew } from "~/screens/ProjectDashboard/ProjectDashboardNew";
import ProjectDetails from "~/screens/ProjectDetails/ProjectDetails";
import { useUserStore } from "~/stores";
import { ModalRouter } from "./ModalRouter";
import { ROUTES } from "./routes";

export const Router = () => {
  const location = useLocation();
  const { previousLocation } = (location.state ?? {}) as {
    previousLocation?: Location;
  };
  const userState = useUserStore((state) =>
    state.token ? "loggedIn" : "loggedOut",
  );
  const { hasPermission } = usePermissions();

  return (
    <div>
      <Routes location={previousLocation ?? location}>
        {/* PUBLIC ONLY ROUTES */}
        {userState === "loggedOut" && (
          <>
            <Route element={<Navigate to={ROUTES.login} />} path="*" />
            <Route element={<Login />} path={ROUTES.login} />
          </>
        )}

        {userState === "loggedIn" && (
          <>
            {/* PRIVATE ONLY ROUTES */}
            <Route element={<Layout />}>
              <Route
                element={<Navigate to={ROUTES.dashboard} />}
                path={ROUTES.base}
              />
              <Route
                element={<Navigate to={ROUTES.base} />}
                path={ROUTES.login}
              />

              <Route element={<Dashboard />} path={ROUTES.dashboard} />

              {hasPermission(PERMISSIONS.viewEmployee) && (
                <>
                  <Route
                    element={<EmployeesDashboard />}
                    path={ROUTES.employees}
                  />
                  <Route
                    element={<EmployeeOverview />}
                    path={`${ROUTES.employees}/:employeeId`}
                  />
                  <Route
                    element={<EmployeesView />}
                    path={`${ROUTES.assignments.employeesView}`}
                  />
                </>
              )}

              {hasPermission(PERMISSIONS.viewPermission) && (
                <Route
                  element={<PermissionDashboard />}
                  path={ROUTES.platformRoles}
                />
              )}

              {hasPermission(PERMISSIONS.viewProjects) && (
                <>
                  <Route
                    element={<ProjectDashboard />}
                    path={ROUTES.projects.base}
                  />
                  <Route
                    element={<ProjectDashboardNew />}
                    path={ROUTES.projectsNew}
                  />
                  <Route
                    element={<ProjectOverview />}
                    path={`${ROUTES.projects.base}/:projectId`}
                  />
                  <Route
                    element={<ProjectHoursDashboard />}
                    path={`${ROUTES.assignments.projectView}`}
                  />
                  <Route
                    element={<ProjectDetails />}
                    path={`${ROUTES.projectsNew}/:projectId`}
                  />
                </>
              )}

              {hasPermission(PERMISSIONS.createClientProject) &&
                hasPermission(PERMISSIONS.createInternalProject) && (
                  <Route
                    element={<NewProject />}
                    path={ROUTES.projects.newProject}
                  />
                )}

              {hasPermission(PERMISSIONS.updateProject) && (
                <Route
                  element={<EditProject />}
                  path={ROUTES.projects.editProject}
                />
              )}

              {hasPermission(PERMISSIONS.viewClient) && (
                <Route element={<ClientDashboard />} path={ROUTES.clients} />
              )}

              {hasPermission(PERMISSIONS.viewTeamAssignment) && (
                <Route
                  element={<HistoryView />}
                  path={`${ROUTES.assignments.historyView}`}
                />
              )}

              {hasPermission(PERMISSIONS.createTeamAssignment) && (
                <Route
                  element={<NewAssignment />}
                  path={`${ROUTES.assignments.newAssignment}`}
                />
              )}

              {hasPermission(PERMISSIONS.viewTeam) && (
                <Route element={<TeamDashboard />} path={ROUTES.teams} />
              )}

              {hasPermission(PERMISSIONS.viewCourses) && (
                <>
                  <Route
                    element={<CoursesList />}
                    path={ROUTES.learningCenter.coursesList}
                  />
                  <Route
                    element={<CourseDetails />}
                    path={`${ROUTES.learningCenter.coursesList}/:courseId`}
                  />
                </>
              )}

              {hasPermission(PERMISSIONS.createCourse) && (
                <Route
                  element={<NewCourse />}
                  path={`${ROUTES.learningCenter.newCourse}`}
                />
              )}

              {hasPermission(PERMISSIONS.createCourse) && (
                <Route
                  element={<EditCourse />}
                  path={`${ROUTES.learningCenter.editCourse}/:courseId/edit`}
                />
              )}

              <Route path="*" element={<NotFound />} />
            </Route>
          </>
        )}
      </Routes>
      <Routes>
        <Route
          path="*"
          element={<ModalRouter showModal={!!previousLocation} />}
        />
      </Routes>
    </div>
  );
};
