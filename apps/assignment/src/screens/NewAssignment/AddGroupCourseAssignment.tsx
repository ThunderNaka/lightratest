import React from "react";

import { Button, icons, Modal } from "@lightit/ui";

interface AddGroupCourseAssignmentProps {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const AddGroupCourseAssignment = ({
  open,
  onClose,
  onCancel,
  onConfirm,
}: AddGroupCourseAssignmentProps) => (
  <Modal isOpen={open} onClose={onClose}>
    <div className="flex flex-col gap-6 rounded-xl bg-white p-7">
      <div className="flex flex-col">
        <button onClick={onCancel} className="h-5 w-5 self-end text-gray-500">
          <icons.XMarkIcon />
        </button>
        <h1 className="text-xl font-bold">New group assignment</h1>
        <p>Choose the team(s) or project(s) for the assignment.</p>
      </div>

      {/* ... */}

      <div className="flex justify-center gap-5">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button onClick={onConfirm}>Save</Button>
      </div>
    </div>
  </Modal>
);
