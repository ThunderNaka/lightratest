import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button,  icons, Input } from "@lightit/ui";

import type { ClientWithProjects } from "~/api/clients";
import { ModalHeader } from "~/components";

interface ClientFormProps {
  onCancel: () => void;
  onSubmit: (values: ClientFormValues) => void;
  client?: ClientWithProjects;
  hookForm: UseFormReturn<ClientFormValues>;
}

export const clientSchema = z.object({
  id: z.number().optional(), // unused by the form, but sent to BE
  name: z.string().min(1, { message: "Namee is required" }),
  email: z.string().email({ message: "Invalid email" }).or(z.literal("")),
  phoneNumber: z.string().min(1, { message: "" }),
  address: z.string(),
  thumbnail: z.string(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

export const ClientForm: FC<ClientFormProps> = ({
  onCancel,
  client,
  hookForm,
  onSubmit,
}) => {

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = hookForm;

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
      className="flex h-full flex-col justify-between overflow-y-auto"
    >
      <div>
        <ModalHeader
          title={client ? client.name : "New Client"}
          className="border-b p-8"
          showAvatar={!!client}
        />
        <div className="flex flex-col gap-6 px-8 pt-12">
          <Input
            id="name"
            label="Client Name"
            placeholder="Client name"
            left={
              <icons.UserIcon className="m-auto h-5 w-5 text-primary-white-600" />
            }
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            id="email"
            label="Email"
            placeholder="lightit@lightit.io"
            left={
              <icons.EnvelopeIcon className="m-auto h-5 w-5 text-primary-white-600" />
            }
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            id="phone"
            label="Phone"
            placeholder="(+54) 000-0000-0000"
            {...register("phoneNumber")}
            left={
              <icons.PhoneIcon className="m-auto h-5 w-5 text-primary-white-600" />
            }
            error={errors.phoneNumber?.message}
          />
          <Input
            id="address"
            label="Address"
            placeholder="P. Sherman, Wallaby St. 42 - Sidney"
            left={
              <icons.HomeIcon className="m-auto h-5 w-5 text-primary-white-600" />
            }
            {...register("address")}
            error={errors.address?.message}
          />}
        </div>
      </div>

      <div className="flex flex-row justify-end space-x-3 pb-9 pr-8">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" type="submit">
          {client ? "Edit Client" : "Save Client"}
        </Button>
      </div>
    </form>
  );
};
