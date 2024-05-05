import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Switch } from "@lightit/ui";

import { editAssignmentIsNotified } from "~/api/assignments";
import type { Assignment } from "~/shared.types";
import { errorToast } from "~/utils";

export const NotificationSwitch = ({
  assignment,
}: {
  assignment: Assignment;
}) => {
  const [checked, setChecked] = useState(assignment.isNotified);

  const queryClient = useQueryClient();

  const { mutate: editAssignmentMutation, isLoading } = useMutation({
    mutationFn: editAssignmentIsNotified.mutation,
    onSuccess: (_, assignment) => {
      editAssignmentIsNotified.invalidates(queryClient, {
        id: +(assignment.id ?? -1),
        employeeId: assignment.employeeId,
      });
    },
    onError: (error) => {
      errorToast(error), setChecked(!!assignment.isNotified);
    },
  });

  return (
    <Switch
      disabled={isLoading}
      labels={["Yes", "No"]}
      checked={checked}
      onCheckedChange={(value) => {
        setChecked(value);
        editAssignmentMutation({
          ...assignment,
          isNotified: value,
        });
      }}
      className="border data-[state=checked]:border-complementary-green-200 data-[state=unchecked]:border-complementary-red-200 data-[state=checked]:bg-complementary-green-100 data-[state=unchecked]:bg-complementary-red-100 data-[state=checked]:text-complementary-green-600 data-[state=unchecked]:text-complementary-red-500"
    />
  );
};
