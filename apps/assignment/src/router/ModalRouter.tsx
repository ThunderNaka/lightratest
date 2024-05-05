import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Transition, TransitionGroup } from "react-transition-group";

import {
  AssignmentDetailsModal,
  ClientModal,
  EmployeeModal,
  EmployeesExportForm,
  NewAssignmentModal,
  ProjectModal,
  TeamModal,
} from "~/modals";
import { ProjectCurrentAssignmentsModal } from "~/modals/Project/ProjectCurrentAssignmentsModal";
import { MODAL_ROUTES } from "./routes";

export const ModalRouter = ({ showModal }: { showModal: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <TransitionGroup>
      <Transition key={location.pathname} timeout={600}>
        {(state) => {
          const show = state !== "exited" && state !== "exiting";

          if (!showModal) return null;

          const goBack = () => state !== "exiting" && navigate(-1);

          return (
            <Routes location={location}>
              <Route
                path={`${MODAL_ROUTES.projectForm}/:projectId?`}
                element={<ProjectModal show={show} onClose={goBack} />}
              />
              <Route
                path={`${MODAL_ROUTES.clientForm}/:clientId?`}
                element={<ClientModal show={show} onClose={goBack} />}
              />
              <Route
                path={`${MODAL_ROUTES.teamForm}/:teamId?`}
                element={<TeamModal show={show} onClose={goBack} />}
              />
              <Route
                path={`${MODAL_ROUTES.employeeForm}/:employeeId`}
                element={<EmployeeModal show={show} onClose={goBack} />}
              />
              <Route
                path={MODAL_ROUTES.newAssignmentForm}
                element={<NewAssignmentModal show={show} onClose={goBack} />}
              />
              <Route
                path={`${MODAL_ROUTES.assignmentDetails}/:assignmentId`}
                element={
                  <AssignmentDetailsModal show={show} onClose={goBack} />
                }
              />
              <Route
                path={`${MODAL_ROUTES.exportAvailabilityForm}`}
                element={<EmployeesExportForm show={show} onClose={goBack} />}
              />
              <Route
                path={`${MODAL_ROUTES.currentAssignments}/:projectId`}
                element={
                  <ProjectCurrentAssignmentsModal
                    show={show}
                    onClose={goBack}
                  />
                }
              />
            </Routes>
          );
        }}
      </Transition>
    </TransitionGroup>
  );
};
