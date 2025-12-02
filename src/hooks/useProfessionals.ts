import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, CURRENT_BUSINESS_ID } from "../api/axios";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils";
import type { Professional, ProfessionalPayload } from "../types";

export function useProfessionals() {
  const queryClient = useQueryClient();

  const professionalsQuery = useQuery({
    queryKey: ["professionals"],
    queryFn: async () => {
      const res = await api.get("/professionals");
      return res.data.professionals as Professional[];
    }
  });

  const createProfessionalMutation = useMutation({
    mutationFn: async (data: ProfessionalPayload) => {
      const payload = {
        ...data,
        business: CURRENT_BUSINESS_ID
      };
      const res = await api.post("/professionals", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast.success("Profesional agregado al equipo");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo crear el profesional"));
    }
  });

  const updateProfessionalMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProfessionalPayload }) => {
      const res = await api.put(`/professionals/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast.success("Profesional actualizado");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo actualizar el profesional"));
    }
  });

  const deleteProfessionalMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/professionals/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast.success("Profesional eliminado del equipo");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo eliminar el profesional"));
    }
  });

  return {
    professionalsQuery,
    createProfessionalMutation,
    updateProfessionalMutation,
    deleteProfessionalMutation
  };
}
