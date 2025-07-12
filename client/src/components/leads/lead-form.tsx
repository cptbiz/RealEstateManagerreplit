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
import { insertLeadSchema, type Lead, type InsertLead } from "@shared/schema";

interface LeadFormProps {
  lead?: Lead | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function LeadForm({ lead, onSuccess, onCancel }: LeadFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertLead>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      firstName: lead?.firstName || "",
      lastName: lead?.lastName || "",
      email: lead?.email || "",
      phone: lead?.phone || "",
      source: lead?.source || "",
      status: lead?.status || "new",
      notes: lead?.notes || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertLead) => {
      if (lead) {
        return apiRequest("PUT", `/api/leads/${lead.id}`, data);
      } else {
        return apiRequest("POST", "/api/leads", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: `Lead ${lead ? "updated" : "created"} successfully`,
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
        description: `Failed to ${lead ? "update" : "create"} lead`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertLead) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name*</Label>
          <Input
            id="firstName"
            {...form.register("firstName")}
            placeholder="Enter first name"
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name*</Label>
          <Input
            id="lastName"
            {...form.register("lastName")}
            placeholder="Enter last name"
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email*</Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          placeholder="Enter email address"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          {...form.register("phone")}
          placeholder="Enter phone number"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Select onValueChange={(value) => form.setValue("source", value)} defaultValue={form.getValues("source")}>
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="advertising">Advertising</SelectItem>
              <SelectItem value="walk_in">Walk-in</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select onValueChange={(value) => form.setValue("status", value)} defaultValue={form.getValues("status")}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="unqualified">Unqualified</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...form.register("notes")}
          placeholder="Enter any additional notes..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : (lead ? "Update" : "Create")}
        </Button>
      </div>
    </form>
  );
}
