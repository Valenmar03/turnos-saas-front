import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/errors";
import type { Business, BusinessPayload } from "../types";

export function useBusinesses() {
  const queryClient = useQueryClient();

  const businessesQuery = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const res = await api.get("/business"); 
      return res.data.businesses as Business[];
    }
  });

  const businessByIdQuery = (id?: string) =>
    useQuery({
      queryKey: ["businesses", id],
      enabled: !!id,
      queryFn: async () => {
        const res = await api.get(`/business/${id}`); 
        return res.data.business as Business;
      }
    });

  const myBusinessQuery = useQuery({
    queryKey: ["my-business"],
    queryFn: async () => {
      const res = await api.get("/business/me");
      return res.data.business as Business;
    },
  });


  const createBusinessMutation = useMutation({
    mutationFn: async (data: BusinessPayload) => {
      const res = await api.post("/business", data); // POST /api/business
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      toast.success("Negocio creado correctamente");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo crear el negocio"));
    }
  });

  const updateBusinessMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BusinessPayload> }) => {
      const res = await api.put(`/business/${id}`, data); // PUT /api/business/:id
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({ queryKey: ["businesses", variables.id] });
      toast.success("Negocio actualizado");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo actualizar el negocio"));
    }
  });

  const deleteBusinessMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/business/${id}`); // DELETE /api/business/:id
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      toast.success("Negocio eliminado");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo eliminar el negocio"));
    }
  });


  return {
    businessesQuery,
    businessByIdQuery,
    createBusinessMutation,
    updateBusinessMutation,
    deleteBusinessMutation,
    myBusinessQuery
  };
}
