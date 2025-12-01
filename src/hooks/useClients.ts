import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, CURRENT_BUSINESS_ID } from "../api/axios";
import { getErrorMessage } from "../utils";
import toast from "react-hot-toast";

export interface Client {
  _id: string;
  business: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface ClientPayload {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export function useClients() {
  const queryClient = useQueryClient();

  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await api.get("/clients");
      return res.data.clients as Client[]; 
    }
  });

  const createClientMutation = useMutation({
    mutationFn: async (data: ClientPayload) => {
      const payload = {
        ...data,
        business: CURRENT_BUSINESS_ID
      };
      const res = await api.post("/clients", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente creado");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo crear el cliente"));
    }
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ClientPayload }) => {
      const res = await api.put(`/clients/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente actualizado");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo actualizar al cliente"));
    }
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/clients/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente eliminado");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo eliminar al cliente"));
    }
  });

  return {
    clientsQuery,
    createClientMutation,
    updateClientMutation,
    deleteClientMutation
  };
}
