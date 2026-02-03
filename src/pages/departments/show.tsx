import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Department } from "@/types";
import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { BookOpen, Layers, Users } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router";

type DepartmentDetails = {
  department: Department;
  totals: {
    subjectsCount: number;
    classesCount: number;
    enrolledStudentsCount: number;
  };
};

type DepartmentSubject = {
    id: number;
    code: string;
    name: string;
    description: string | null;
}

type DepartmentClass = {
  id: number;
  name: string;
  status?: string | null;
  capacity?: number | null;
  subject?: {
    id: number;
    name: string;
    code?: string | null;
  } | null;
  teacher?: {
    id: string;
    name: string;
    email?: string | null;
    image?: string | null;
  } | null;
};

type DepartmentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

export default function DepartmentsShow() {

    const { id } = useParams();
    const departmentId = id ?? "";

    const { query: departmentQuery } = useShow<DepartmentDetails>({
        resource: 'departments',
        id: departmentId,
    })

    const departmentDetails = departmentQuery.data?.data

    const subjectsColumns = useMemo<ColumnDef<DepartmentSubject>[]>(() => [
        {
            id: 'code',
            accessorKey: 'code',
            size: 120,
            header: () => <p className="column-title"> Code </p>,
            cell: ({ getValue }) => {
                const code = getValue<string>();

                return code ? (
                    <Badge> {code} </Badge>
                ) : (
                    <Badge variant="outline"> No Code </Badge>
                )
            } 
        }, 
        {
            id: 'name',
            accessorKey: 'name',
            size: 240,
            header: () => <p className="column-title"> Name </p>,
            cell: ({ getValue }) => <span className="text-muted-foreground"> {getValue<string>()} </span>     
        },
        {
            id: 'description',
            accessorKey: 'description',
            size: 320,
            header: () => <p className="column-title"> Description </p>,
            cell: ({ getValue }) => {
                const description = getValue<string | null>();

                return description ? (
                    <span className="truncate line-clamp-2"> {description} </span>
                ) : (
                    <span className="text-muted-foreground"> No Description </span>
                )
            }
        }, 
        {
            id: 'details',
            size: 140,
            header: () => <p className="column-title"> Details </p>,
            cell: ({ row }) => (
                <ShowButton
                resource="subjects"
                recordItemId={row.original.id}
                variant="outline"
                size="sm">
                    View
                </ShowButton>
            )
        }
    ], []);

    const classColumns = useMemo<ColumnDef<DepartmentClass>[]>(() => [
        {
            id: 'name',
            accessorKey: 'name',
            size: 240,
            header: () => <p className="column-title"> Class Name </p>,
            cell: ({ getValue }) => <span className="text-muted-foreground"> {getValue<string>()} </span>     
        },
        {
            id: 'subject',
            accessorKey: 'subject',
            size: 200,
            header: () => <p className="column-title"> Subject </p>,
            cell: ({ row }) => {
                const subject = row.original.subject;

                if (!subject) {
                    return <span className="text-muted-foreground"> No Subject </span>;
                }

                return (
                    <span className="truncate">
                        {subject.name}
                        {subject.code ? ` (${subject.code})` : ""}
                    </span>
                )
            }
        }, 
        {
            id: 'teacher',
            accessorKey: 'teacher',
            size: 300,
            header: () => <p className="column-title"> Teacher </p>,
            cell: ({ row }) => {
                const teacher = row.original.teacher;

                if (!teacher) {
                    return <span className="text-muted-foreground"> No assigned </span>;
                }

                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                            {teacher.image && (
                                <AvatarImage src={teacher.image} alt={teacher.name} />
                            )}
                            <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <span className="truncate">
                                {teacher.name}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                                {teacher.email}
                            </span>
                        </div>
                    </div>
                    )
            }
        },
        {
            id: 'status',
            accessorKey: 'status',
            size: 120,
            header: () => <p className="column-title"> Status </p>,
            cell: ({ getValue }) => {
                const status = getValue<"active" | "inactive">();
                const variant = status === "active" ? "default" : "secondary";

                return <Badge variant={variant}> {status} </Badge>
            }
        },
        {
            id: 'details',
            size: 140,
            header: () => <p className="column-title"> Details </p>,
            cell: ({ row }) => (
                <ShowButton
                resource="classes"
                recordItemId={row.original.id}
                variant="outline"
                size="sm">
                    View
                </ShowButton>
            )
        }
    ], []);

    const userColumns = useMemo<ColumnDef<DepartmentUser>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 240,
        header: () => <p className="column-title">User</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              {row.original.image && (
                <AvatarImage src={row.original.image} alt={row.original.name} />
              )}
              <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="truncate">{row.original.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "role",
        accessorKey: "role",
        size: 140,
        header: () => <p className="column-title">Role</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>()}</Badge>
        ),
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="users"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View
          </ShowButton>
        ),
      },
    ],
    []
  );


    const subjectsTable = useTable<DepartmentSubject>({
        columns: subjectsColumns,
        refineCoreProps: {
            resource:  `departments/${departmentId}/subjects`,
            pagination: {
                pageSize: 5,
                mode: 'server',
            }
        }
    })

    const classesTable = useTable<DepartmentClass>({
        columns: classColumns,
        refineCoreProps: {
            resource:  `departments/${departmentId}/classes`,
            pagination: {
                pageSize: 5,
                mode: 'server',
            }
        }
    })

    const teachersTable = useTable<DepartmentUser>({
        columns: userColumns,
        refineCoreProps: {
            resource:  `departments/${departmentId}/users`,
            pagination: {
                pageSize: 5,
                mode: 'server',
            },
            filters: {
                permanent: [
                    { field: 'role', operator: 'eq', value: 'teacher'}
                ]
            }
        },
    })

    const studentsTable = useTable<DepartmentUser>({
        columns: userColumns,
        refineCoreProps: {
            resource: `departments/${departmentId}/users`,
            pagination: {
                pageSize: 5,
                mode: 'server',
            },
            filters: {
                permanent: [
                    { field: 'role', operator: 'eq', value: 'student'}
                ]
            }
        }
    })

    if (departmentQuery.isLoading || departmentQuery.isError || !departmentDetails) {
        return (
            <ShowView className="class-view class-show space-y-6">
                <ShowViewHeader resource="departments" title="Department Details" />
                <p className="state-message">
                    {departmentQuery.isLoading ? "Loading department details..." : departmentQuery.isError ? "Failed to load department details." : "Department details not found."}
                </p>
            </ShowView>
        )
    }

    return (
        <ShowView className="class-view class-show space-y-6">
            <ShowViewHeader resource="departments" title={departmentDetails?.department.name ?? "Department Details"} />
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        {departmentDetails.department.description ?? "No description provided."}
                    </p>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                            <span>Total Subjects</span>
                            <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="mt-2 text-2xl font-semibold">
                            {departmentDetails.totals.subjectsCount}
                        </div>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                            <span>Total Classes</span>
                            <Layers className="h-4 w-4" />
                        </div>
                        <div className="mt-2 text-2xl font-semibold">
                            {departmentDetails.totals.classesCount}
                        </div>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                            <span>Enrolled Students</span>
                            <Users className="h-4 w-4" />
                        </div>
                        <div className="mt-2 text-2xl font-semibold">
                            {departmentDetails.totals.enrolledStudentsCount}
                        </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
 
             <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable table={subjectsTable} paginationVariant="simple"/>
                </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Classes</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable table={classesTable} paginationVariant="simple"/>
                </CardContent>
            </Card>
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Teachers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable table={teachersTable} paginationVariant="simple"/>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable table={studentsTable} paginationVariant="simple"/>
                    </CardContent>
                </Card> 
            </div>
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