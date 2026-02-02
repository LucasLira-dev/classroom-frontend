import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";
import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router";


type FacultyDepartment = {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
};

type FacultySubject = {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  department?: {
    id: number;
    name: string;
    code?: string | null;
  } | null;
};

export default function FacultyShow() {

    const { id } = useParams();
    const userId = id ?? '';

    const { query } = useShow<User>({
        resource: "users",
        id: userId,
    })

    const user = query.data?.data;

    const departmentsColumns = useMemo<ColumnDef<FacultyDepartment>[]>(
      () => [
        {
          id: 'code',
          accessorKey: 'code',
          size: 50,
          header: () => <p className="column-title"> Code </p>,
          cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>() || "N/A"}</Badge>,
        },
        {
          id: 'name',
          accessorKey: 'name',
          size: 150,
          header: () => <p className="column-title"> Name </p>,
          cell: ({ getValue }) => <p className="font-medium">{getValue<string>()}</p>,
        }, 
        {
          id: 'description',
          accessorKey: 'description',
          size: 200,
          header: () => <p className="column-title"> Description </p>,
          cell: ({ getValue }) => <p>{getValue<string>() || "N/A"}</p>,
        }, 
        {
          id: 'details',
          header: () => <p className="column-title"> Details </p>,
          cell: ({ row }) => (
            <ShowButton
            resource="departments"
            recordItemId={row.original.id}
            variant="outline"
            size="sm">
              View
            </ShowButton>
          ),
        }
    ], []);

    const subjectsColumns = useMemo<ColumnDef<FacultySubject>[]>(
      () => [
        {
          id: 'code',
          accessorKey: 'code',
          size: 50,
          header: () => <p className="column-title"> Code </p>,
          cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>() || "N/A"}</Badge>,
        },
        {
          id: 'name',
          accessorKey: 'name',
          size: 150,
          header: () => <p className="column-title"> Name </p>,
          cell: ({ getValue }) => <p className="font-medium">{getValue<string>()}</p>,
        }, 
        {
          id: 'department',
          accessorKey: 'department.name',
          size: 100,
          header: () => <p className="column-title"> Department </p>,
          cell: ({ getValue }) => <p>{getValue<string>() || "N/A"}</p>,
        }, 
        {
          id: 'description',
          accessorKey: 'description',
          size: 200,
          header: () => <p className="column-title"> Description </p>,
          cell: ({ getValue }) => <p>{getValue<string>() || "N/A"}</p>,
        }, 
        {
          id: 'details',
          header: () => <p className="column-title"> Details </p>,
          cell: ({ row }) => (
            <ShowButton
            resource="subjects"
            recordItemId={row.original.id}
            variant="outline"
            size="sm">
              View
            </ShowButton>
          ),
        }
      ], []
    )

    const departmentTable = useTable<FacultyDepartment>({
      columns: departmentsColumns,
      refineCoreProps: {
        resource: `users/${userId}/departments`,
        pagination: {
          pageSize: 5,
          mode: 'server',
        }
      }
    })

    const subjectTable = useTable<FacultySubject>({
      columns: subjectsColumns,
      refineCoreProps: {
        resource: `users/${userId}/subjects`,
        pagination: {
          pageSize: 5,
          mode: 'server',
        }
      }
    })

    if (query.isLoading || query.isError || !user) {
        return (
            <ShowView className="class-view class-show space-y-6">
                <ShowViewHeader resource="users" title="Department Details" />
                <p className="state-message">
                    {query.isLoading ? "Loading user details..." : query.isError ? "Failed to load user details." : "User details not found."}
                </p>
            </ShowView>
        )
    }
    

    return (
        <ShowView className="class-view space-y-6">
            <ShowViewHeader resource="users" title={user?.name || "Faculty Details"} />

            <Card className="hover:shadow-md transition-shadow rounded-lg border">
                <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile</CardTitle>
                <Badge variant="default">{user?.role}</Badge>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="size-12">
                    {user?.image && <AvatarImage src={user.image} alt={user.name} />}
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                    <p className="text-lg font-semibold">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Departments</CardTitle>
                </CardHeader>
                <p className="px-6 text-sm text-muted-foreground">
                  Departments tied to {user?.name} based on classes and enrollments.
                </p>
              </div>
              <CardContent>
                <DataTable table={departmentTable} paginationVariant="simple"/>
                  </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Subjects</CardTitle>
                </CardHeader>
                <p className="px-6 text-sm text-muted-foreground">
                  Subjects associated with {user?.name} in this term.
                </p>
              </div>
              <CardContent>
                <DataTable table={subjectTable} paginationVariant="simple"/>
                  </CardContent>
            </Card>

        </ShowView>
    )
}


const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${
    parts[parts.length - 1][0] ?? ""
  }`.toUpperCase();
};