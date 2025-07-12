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
import { insertContactSchema, type Contact, type InsertContact } from "@shared/schema";

interface ContactFormProps {
  contact?: Contact | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ContactForm({ contact, onSuccess, onCancel }: ContactFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      firstName: contact?.firstName || "",
      lastName: contact?.lastName || "",
      email: contact?.email || "",
      phone: contact?.phone || "",
      company: contact?.company || "",
      jobTitle: contact?.jobTitle || "",
      address: contact?.address || "",
      contactType: contact?.contactType || "client",
      notes: contact?.notes || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      if (contact) {
        return apiRequest("PUT", `/api/contacts/${contact.id}`, data);
      } else {
        return apiRequest("POST", "/api/contacts", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "Success",
        description: `Contact ${contact ? "updated" : "created"} successfully`,
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
        description: `Failed to ${contact ? "update" : "create"} contact`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
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
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            {...form.register("company")}
            placeholder="Enter company name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            {...form.register("jobTitle")}
            placeholder="Enter job title"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactType">Contact Type*</Label>
        <Select onValueChange={(value) => form.setValue("contactType", value)} defaultValue={form.getValues("contactType")}>
          <SelectTrigger>
            <SelectValue placeholder="Select contact type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="partner">Partner</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          {...form.register("address")}
          placeholder="Enter address"
        />
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
          {mutation.isPending ? "Saving..." : (contact ? "Update" : "Create")}
        </Button>
      </div>
    </form>
  );
}
