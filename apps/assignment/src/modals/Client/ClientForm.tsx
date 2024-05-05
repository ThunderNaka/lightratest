import type { FC } from "react";
import { useMutation } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { useToastStore } from "@lightit/toast";
import { Button, Dropzone, icons, IconWrapper, Input } from "@lightit/ui";

import type { ClientWithProjects } from "~/api/clients";
import { uploadFile } from "~/api/files";
import { ModalHeader } from "~/components";
import { errorToast } from "~/utils";

interface ClientFormProps {
  onCancel: () => void;
  onSubmit: (values: ClientFormValues) => void;
  client?: ClientWithProjects;
  hookForm: UseFormReturn<ClientFormValues>;
}

export const clientSchema = z.object({
  id: z.number().optional(), // unused by the form, but sent to BE
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }).or(z.literal("")),
  phoneNumber: z.string(),
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
  const pushToast = useToastStore((state) => state.pushToast);

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = hookForm;

  const setUploadedFileUrl = (thumbnail: string) =>
    hookForm.setValue("thumbnail", thumbnail, { shouldDirty: true });

  const uploadedFileUrl = hookForm.watch("thumbnail");

  const { mutate: uploadFileMutation, isLoading } = useMutation({
    mutationFn: uploadFile.mutation,
    onSuccess: (data) => {
      setUploadedFileUrl(data.data.url);
      void pushToast({
        type: "success",
        title: "Upload Complete",
        message: "Client image successfully uploaded!",
      });
    },
    onError: errorToast,
  });

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
            type="email"
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
          />
          <Dropzone
            containerClassName="w-full h-[198px]"
            id="thumbnail"
            loading={isLoading}
            onDrop={(acceptedFiles) => {
              if (acceptedFiles.length > 1) {
                void pushToast({
                  type: "error",
                  title: "Validation Error",
                  message: "Only one image can be uploaded",
                });
              } else {
                const firstFile = acceptedFiles[0];
                firstFile && uploadFileMutation(firstFile);
              }
            }}
          >
            {uploadedFileUrl && (
              <div className="mb-2 flex h-full w-full flex-col rounded">
                <div className="flex w-full flex-col overflow-hidden">
                  <div className="mb-1 mt-4 flex h-[200px] w-full overflow-hidden rounded">
                    <div className="flex w-full items-center justify-between overflow-clip rounded pt-2">
                      <img
                        src={uploadedFileUrl}
                        alt="Project Logo"
                        className="overflow-clip rounded-md px-2 py-2"
                      />
                    </div>
                  </div>
                  <div className="flex content-center items-end justify-end py-1 pr-4 text-primary-white-600">
                    <div className="flex">
                      <IconWrapper size="sm" className="mx-2">
                        <icons.CameraIcon
                          height={20}
                          width={20}
                          className="cursor-pointer"
                          onClick={() => {
                            setUploadedFileUrl("");
                          }}
                        ></icons.CameraIcon>
                      </IconWrapper>
                      Select new image
                    </div>
                    <div className="flex">
                      <IconWrapper size="sm" className="mx-2">
                        <icons.TrashIcon
                          height={20}
                          width={20}
                          className="cursor-pointer"
                          onClick={() => {
                            setUploadedFileUrl("");
                          }}
                        />
                      </IconWrapper>
                      Delete
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Dropzone>
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
