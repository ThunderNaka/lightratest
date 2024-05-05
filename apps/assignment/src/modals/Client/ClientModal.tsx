import type { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { useToastStore } from "@lightit/toast";
import { SideModal } from "@lightit/ui";

import {
  createClient,
  getClientWithProjectsQuery,
  updateClient,
} from "~/api/clients";
import { ScreenLoading } from "~/components";
import { errorToast, handleAxiosFieldErrors } from "~/utils";
import { ClientForm, clientSchema } from "./ClientForm";
import type { ClientFormValues } from "./ClientForm";

interface ClientModalProps {
  onClose: () => void;
  show: boolean;
}

export const ClientModal: FC<ClientModalProps> = ({ onClose, show }) => {
  const pushToast = useToastStore((state) => state.pushToast);

  const queryClient = useQueryClient();
  const params = useParams<{ clientId: string }>();
  const clientId = params.clientId ? parseInt(params.clientId) : null;

  const { data, isLoading: isLoadingClients } = useQuery({
    ...getClientWithProjectsQuery(clientId),
    onError: errorToast,
  });
  const client = data?.data;

  const hookForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    values: {
      id: client?.id,
      name: client?.name ?? "",
      address: client?.address ?? "",
      email: client?.email ?? "",
      phoneNumber: client?.phoneNumber ?? "",
      thumbnail: client?.thumbnail ?? "",
    },
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  });

  const { mutate: createClientMutation } = useMutation({
    mutationFn: createClient.mutation,
    onSuccess: (data) => {
      createClient.invalidates(queryClient, { clientId: data.data.id });
      void pushToast({
        type: "success",
        title: "Creation Success",
        message: `Client ${data.data.name} successfully created!`,
      });
      onClose();
    },
    onError: (err) => {
      errorToast(err);
      handleAxiosFieldErrors(err, hookForm.setError);
    },
  });

  const { mutate: editClientMutation } = useMutation({
    mutationFn: updateClient.mutation,
    onSuccess: (data) => {
      updateClient.invalidates(queryClient, {
        clientId: data.data.id,
      });
      void pushToast({
        type: "success",
        title: "Update Success",
        message: `Client ${data.data.name} successfully updated!`,
      });
      onClose();
    },
    onError: (err) => {
      errorToast(err);
      handleAxiosFieldErrors(err, hookForm.setError);
    },
  });

  return (
    <SideModal show={show} onClose={onClose} className="w-[35rem]">
      {isLoadingClients && !clientId === null ? (
        <ScreenLoading />
      ) : (
        <ClientForm
          onCancel={onClose}
          client={client}
          onSubmit={(data) => {
            client
              ? editClientMutation({
                  ...data,
                  id: client.id,
                })
              : createClientMutation(data);
          }}
          hookForm={hookForm}
        />
      )}
    </SideModal>
  );
};
