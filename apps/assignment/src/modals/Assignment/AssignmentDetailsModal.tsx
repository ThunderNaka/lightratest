import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { SideModal } from "@lightit/ui";

import { getAssignmentDetailsQuery } from "~/api/assignments";
import { errorToast } from "~/utils";
import { AssignmentDetails } from "./AssignmentDetails";
import { AssignmentDetailsSkeleton } from "./AssignmentDetailsSkeleton";

interface AssignmentDetailsModalProps {
  onClose: () => void;
  show: boolean;
}

export const AssignmentDetailsModal = ({
  onClose,
  show,
}: AssignmentDetailsModalProps) => {
  const params = useParams<{
    assignmentId?: string;
  }>();

  const assignmentId = params.assignmentId
    ? parseInt(params.assignmentId)
    : null;

  const { data, isLoading } = useQuery({
    ...getAssignmentDetailsQuery(assignmentId),
    onError: errorToast,
  });

  return (
    <SideModal show={show} onClose={onClose} className="w-[31.25rem]">
      {isLoading ? (
        <AssignmentDetailsSkeleton />
      ) : (
        data && (
          <AssignmentDetails
            assignment={data}
            onDelete={onClose}
            onCancel={onClose}
          />
        )
      )}
    </SideModal>
  );
};
