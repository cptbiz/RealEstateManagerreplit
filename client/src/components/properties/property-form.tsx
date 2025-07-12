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
import { insertPropertySchema, type Property, type InsertProperty } from "@shared/schema";

interface PropertyFormProps {
  property?: Property | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PropertyForm({ property, onSuccess, onCancel }: PropertyFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertProperty>({
    resolver: zodResolver(insertPropertySchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      address: property?.address || "",
      city: property?.city || "",
      state: property?.state || "",
      zipCode: property?.zipCode || "",
      propertyType: property?.propertyType || "house",
      status: property?.status || "available",
      price: property?.price || "",
      bedrooms: property?.bedrooms || undefined,
      bathrooms: property?.bathrooms || undefined,
      squareFootage: property?.squareFootage || undefined,
      lotSize: property?.lotSize || undefined,
      yearBuilt: property?.yearBuilt || undefined,
      features: property?.features || [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      if (property) {
        return apiRequest("PUT", `/api/properties/${property.id}`, data);
      } else {
        return apiRequest("POST", "/api/properties", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: `Property ${property ? "updated" : "created"} successfully`,
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
        description: `Failed to ${property ? "update" : "create"} property`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProperty) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title*</Label>
        <Input
          id="title"
          {...form.register("title")}
          placeholder="Enter property title"
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
          placeholder="Enter property description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address*</Label>
        <Input
          id="address"
          {...form.register("address")}
          placeholder="Enter street address"
        />
        {form.formState.errors.address && (
          <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City*</Label>
          <Input
            id="city"
            {...form.register("city")}
            placeholder="Enter city"
          />
          {form.formState.errors.city && (
            <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State*</Label>
          <Input
            id="state"
            {...form.register("state")}
            placeholder="Enter state"
          />
          {form.formState.errors.state && (
            <p className="text-sm text-destructive">{form.formState.errors.state.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code*</Label>
          <Input
            id="zipCode"
            {...form.register("zipCode")}
            placeholder="Enter zip code"
          />
          {form.formState.errors.zipCode && (
            <p className="text-sm text-destructive">{form.formState.errors.zipCode.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyType">Property Type*</Label>
          <Select onValueChange={(value) => form.setValue("propertyType", value)} defaultValue={form.getValues("propertyType")}>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
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
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price*</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...form.register("price")}
          placeholder="Enter price"
        />
        {form.formState.errors.price && (
          <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            {...form.register("bedrooms", { valueAsNumber: true })}
            placeholder="Number of bedrooms"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            type="number"
            {...form.register("bathrooms", { valueAsNumber: true })}
            placeholder="Number of bathrooms"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="squareFootage">Square Footage</Label>
          <Input
            id="squareFootage"
            type="number"
            {...form.register("squareFootage", { valueAsNumber: true })}
            placeholder="Square footage"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearBuilt">Year Built</Label>
          <Input
            id="yearBuilt"
            type="number"
            {...form.register("yearBuilt", { valueAsNumber: true })}
            placeholder="Year built"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lotSize">Lot Size</Label>
        <Input
          id="lotSize"
          type="number"
          step="0.01"
          {...form.register("lotSize")}
          placeholder="Lot size in acres"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : (property ? "Update" : "Create")}
        </Button>
      </div>
    </form>
  );
}
