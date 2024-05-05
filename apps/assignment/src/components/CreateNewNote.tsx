import type { UseFormRegister } from "react-hook-form";

import { Button, icons, Modal, TextArea } from "@lightit/ui";

import type { CourseAssignmentFormValues } from "~/screens/NewAssignment/NewCourseAssignment";
import type { ProjectAssignmentFormValues } from "~/screens/NewAssignment/NewProjectAssignment";

interface CreateNewNoteProps {
  open: boolean;
  onClose: () => void;
  index: number;
  register:
    | UseFormRegister<ProjectAssignmentFormValues>
    | UseFormRegister<CourseAssignmentFormValues>;
  onCancel: () => void;
  onConfirm: () => void;
  defaultValue: string;
}

export function CreateNewNote({
  open,
  onClose,
  index,
  register,
  onCancel,
  onConfirm,
  defaultValue,
}: CreateNewNoteProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeRegister = register as UseFormRegister<any>;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="flex flex-col gap-6 rounded-xl bg-white p-7">
        <div className="flex flex-col">
          <button onClick={onCancel} className="h-5 w-5 self-end text-gray-500">
            <icons.XMarkIcon />
          </button>
          <h1 className="text-xl font-bold">New note</h1>
          <p>Add a custom note for the assignment.</p>
        </div>

        <TextArea
          placeholder="Type something"
          className="h-64"
          defaultValue={defaultValue}
          {...safeRegister(`assignments.${index}.notes`, {})}
        />

        <div className="flex justify-center gap-5">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button onClick={onConfirm}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}
