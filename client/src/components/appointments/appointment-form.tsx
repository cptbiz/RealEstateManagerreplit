import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertAppointmentSchema, type Appointment, type InsertAppointment } from "@shared/schema";

interface AppointmentFormProps {
  appointment?: Appointment | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AppointmentForm({ appointment, onSuccess, onCancel }: AppointmentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertAppointment>({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
      title: appointment?.title || "",
      description: appointment?.description || "",
      startTime: appointment?.startTime ? new Date(appointment.startTime).toISOString().slice(0, 16) : "",
      endTime: appointment?.endTime ? new Date(appointment.endTime).toISOString().slice(0, 16) : "",
      location: appointment?.location || "",
      appointmentType: appointment?.appointmentType || "showing",
      status: appointment?.status || "scheduled",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      // Convert string dates to Date objects
      const appointmentData = {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      };

      if (appointment) {
        return apiRequest("PUT", `/api/appointments/${appointment.id}`, appointmentData);
      } else {
        return apiRequest("POST", "/api/appointments", appointmentData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: `Appointment ${appointment ? "updated" : "created"} successfully`,
      });
      onSuccess();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: `Failed to ${appointment ? "update" : "create"} appointment`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAppointment) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title*</Label>
        <Input
          id="title"
          {...form.register("title")}
          placeholder="Enter appointment title"
        />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          placeholder="Enter appointment description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time*</Label>
          <Input
            id="startTime"
            type="datetime-local"
            {...form.register("startTime")}
          />
          {form.formState.errors.startTime && (
            <p className="text-sm text-destructive">{form.formState.errors.startTime.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time*</Label>
          <Input
            id="endTime"
            type="datetime-local"
            {...form.register("endTime")}
          />
          {form.formState.errors.endTime && (
            <p className="text-sm text-destructive">{form.formState.errors.endTime.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...form.register("location")}
          placeholder="Enter appointment location"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="appointmentType">Type*</Label>
          <Select onValueChange={(value) => form.setValue("appointmentType", value)} defaultValue={form.getValues("appointmentType")}>
            <SelectTrigger>
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="showing">Showing</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="inspection">Inspection</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status*</Label>
          <Select onValueChange={(value) => form.setValue("status", value)} defaultValue={form.getValues("status")}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : (appointment ? "Update" : "Create")}
        </Button>
      </div>
    </form>
  );
}
