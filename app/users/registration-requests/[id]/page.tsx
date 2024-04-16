import { DataTable } from "@/components/ui/data-table";
import prisma from "@/prisma/client";
import { columns } from "./components/columns";

export default async function RegistrationRequestsPage(params: {
  params: { id: string };
}) {
  const user = await prisma.user.findUnique({
    where: {
      telegramId: Number(params.params.id),
    },
  });

  const users = await prisma.user.findMany({
    where: {
      status: "PENDING",
    },
  });

  const accessRoles = ["ADMIN", "DIRECTOR", "FINANCE", "IT"];

  if (!user) {
    return <div>Пользователь не найден</div>;
  }

  if (user && !accessRoles.includes(user?.role ?? "")) {
    return <div>У вас нет доступа к этой странице</div>;
  }

  return (
    <div>
      <div>
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
}
