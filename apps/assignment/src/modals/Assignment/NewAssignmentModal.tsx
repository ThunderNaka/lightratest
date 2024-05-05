import { SideModal } from "@lightit/ui";

import { NewAssignmentForm } from "./NewAssignmentForm";

interface NewAssignmentModalProps {
  onClose: () => void;
  show: boolean;
}

export const NewAssignmentModal = ({
  onClose,
  show,
}: NewAssignmentModalProps) => {
  return (
    <SideModal show={show} onClose={onClose} className="w-[31.25rem]">
      <NewAssignmentForm onSuccess={onClose} onCancel={onClose} />
    </SideModal>
  );
};
