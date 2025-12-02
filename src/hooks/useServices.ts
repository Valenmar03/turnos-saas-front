import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, CURRENT_BUSINESS_ID } from "../api/axios";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/errors";
import type { Service, ServicePayload } from "../types";



export function useServices() {
  const queryClient = useQueryClient();

  // GET
  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await api.get("/services");
      return res.data.services as Service[];
    }
  });

  // CREATE
  const createServiceMutation = useMutation({
    mutationFn: async (data: ServicePayload) => {
      const payload = {
        ...data,
        business: CURRENT_BUSINESS_ID
      };
      const res = await api.post("/services", payload);
      return res.data;
    },
    onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["services"] });
    toast.success("Servicio creado");
  },
  onError: (error) => {
    toast.error(getErrorMessage(error, "No se pudo crear el servicio"));
  }
  });

  // UPDATE
  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ServicePayload }) => {
      const res = await api.put(`/services/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Servicio actualizado");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo actualizar el servicio"));
    }
  });

  // DELETE
  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/services/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Servicio eliminado");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo eliminar el servicio"));
    }
  });

  return {
    servicesQuery,
    createServiceMutation,
    updateServiceMutation,
    deleteServiceMutation
  };
}
