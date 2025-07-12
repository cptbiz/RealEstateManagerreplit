import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Users, User } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { UserType } from "@shared/schema";

export default function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [companyLicense, setCompanyLicense] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { userType: UserType; companyName?: string; companyLicense?: string }) => {
      await apiRequest("/api/auth/user/type", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Тип пользователя обновлен",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      // Перенаправляем на главную страницу
      window.location.href = "/";
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить тип пользователя",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    mutation.mutate({
      userType: selectedType,
      companyName: selectedType !== "individual" ? companyName : undefined,
      companyLicense: selectedType !== "individual" ? companyLicense : undefined,
    });
  };

  const userTypes = [
    {
      type: "developer" as UserType,
      title: "Застройщик",
      description: "Строительные компании и девелоперы",
      icon: <Building className="h-12 w-12 text-blue-600" />,
      color: "border-blue-200 hover:border-blue-300",
    },
    {
      type: "agency" as UserType,
      title: "Агентство недвижимости",
      description: "Риэлторские агентства и брокеры",
      icon: <Users className="h-12 w-12 text-green-600" />,
      color: "border-green-200 hover:border-green-300",
    },
    {
      type: "individual" as UserType,
      title: "Физическое лицо",
      description: "Частные лица и индивидуальные инвесторы",
      icon: <User className="h-12 w-12 text-purple-600" />,
      color: "border-purple-200 hover:border-purple-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Выберите тип пользователя
          </h1>
          <p className="text-gray-600">
            Выберите подходящий тип для настройки функций системы
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {userTypes.map((userType) => (
              <Card
                key={userType.type}
                className={`cursor-pointer transition-all ${userType.color} ${
                  selectedType === userType.type
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:shadow-lg"
                }`}
                onClick={() => setSelectedType(userType.type)}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {userType.icon}
                  </div>
                  <CardTitle className="text-xl">{userType.title}</CardTitle>
                  <CardDescription>{userType.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {selectedType && selectedType !== "individual" && (
            <Card>
              <CardHeader>
                <CardTitle>Информация о компании</CardTitle>
                <CardDescription>
                  Заполните данные о вашей компании
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Название компании *</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Введите название компании"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="companyLicense">Лицензия/Регистрация</Label>
                  <Input
                    id="companyLicense"
                    value={companyLicense}
                    onChange={(e) => setCompanyLicense(e.target.value)}
                    placeholder="Номер лицензии или свидетельства"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={!selectedType || mutation.isPending}
              className="px-8 py-2"
            >
              {mutation.isPending ? "Сохранение..." : "Продолжить"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}