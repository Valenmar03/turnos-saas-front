import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";
import { getErrorMessage } from "../utils/errors";
import toast from "react-hot-toast";
import type {
  Professional,
  ProfessionalPayload,
  CreateProfessionalPayload
} from "../types";

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
    mutationFn: async (data: CreateProfessionalPayload) => {
      const payload = {
        ...data
      };
      const res = await api.post("/professionals", payload);
      return res.data as {
        ok: boolean;
        msg: string;
        professional: Professional;
        tempPassword?: string;
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast.success("Profesional creado");
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
