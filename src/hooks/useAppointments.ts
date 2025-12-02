import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils";
import type { Appointment, AppointmentPayload } from "../types";

export function useAppointments() {
  const queryClient = useQueryClient();

  const appointmentsQuery = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await api.get("/appointments");
      return res.data.appointments as Appointment[];
    }
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentPayload) => {
      const payload = {
        ...data,
        status: data.status ?? "confirmed",
        source: data.source ?? "manual"
      };
      const res = await api.post("/appointments", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Turno creado correctamente");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo crear el turno"));
    }
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/appointments/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Turno eliminado");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo eliminar el turno"));
    }
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/appointments/${id}/cancel`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Turno cancelado");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "No se pudo cancelar el turno"));
    }
  });

  return {
    appointmentsQuery,
    createAppointmentMutation,
    deleteAppointmentMutation,
    cancelAppointmentMutation
  };
}
