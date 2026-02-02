import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Subject } from "@/types";
import { useLink, useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router";



type SubjectClass = {
  id: number;
  name: string;
  status?: string | null;
  capacity?: number | null;
  teacher?: {
    id: string;
    name: string;
    email?: string | null;
    image?: string | null;
  } | null;
};

type SubjectUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};


export default function SubjectsShow(){

    const Link = useLink();

    const { id } = useParams();
    const subjectId = id ?? "";

    const { query } = useShow<Subject>({
        resource: "subjects",
        id: subjectId,
    })

    const subjectDetails = query.data?.data;

    const classesColumns = useMemo<ColumnDef<SubjectClass>[]>(
        () => [
            {
                id: 'name',
                accessorKey: 'name',
                size: 240,
                header: () => <p className="column-title"> Class </p>,
                cell: ( { getValue }) => <span className="text-foreground">
                    {getValue<string>()}
                </span>
            },
            {
                id: 'teacher',
                accessorKey: 'teacher',
                size: 300,
                header: () => <p className="column-title"> Teacher </p>,
                cell: ({ row }) => {
                    const teacher = row.original.teacher;

                    if (!teacher) {
                        return <span className="text-muted-foreground"> No assigned </span>
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
                                <Link 
                                className="font-bold text-lg"
                                to={`/users/show/${teacher.id}`}> 
                                    {teacher.name} 
                                </Link>
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
                size: 140,
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
                    resource="users"
                    recordItemId={row.original.id}
                    variant="outline"
                    size="sm">
                        View
                    </ShowButton>
                ),
            },
        ],
        []
    );

    const userColumns = useMemo<ColumnDef<SubjectUser>[]>(
        () => [
            {
                'id': 'name',
                'accessorKey': 'name',
                'size': 240,
                'header': () => <p className="column-title"> User </p>,
                'cell': ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                            {row.original.image && (
                                <AvatarImage src={row.original.image} alt={row.original.name} />
                            )}
                            <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <Link 
                            className="font-bold text-lg"
                            to={`/users/show/${row.original.id}`}> 
                                    {row.original.name} 
                            </Link>
                            <span className="text-xs text-muted-foreground truncate">
                                {row.original.email}
                            </span>
                        </div>
                    </div>
                )
            },
            {
                'id': 'role',
                'accessorKey': 'role',
                'size': 140,
                'header': () => <p className="column-title"> Role </p>,
                'cell': ({ getValue }) => (
                    <Badge variant="default">
                        {getValue<string>()}
                    </Badge>
                )
            },
            {
                id: 'details',
                size: 140,
                header: () => <p className="column-title"> Details </p>,
                cell: ({ row }) => (
                    <ShowButton
                    resource="users"
                    recordItemId={row.original.id}
                    variant="outline"
                    size="sm">
                        View
                    </ShowButton>
                ),
            }
        ], []
    )

    const classesTable = useTable<SubjectClass>({
        columns: classesColumns,
        refineCoreProps: {
            resource: `subjects/${subjectId}/classes`,
            pagination: {
                pageSize: 10,
                mode: "server"
            }
        }
    })

    const teachersTable = useTable<SubjectUser>({
        columns: userColumns,
        refineCoreProps: {
            resource: `subjects/${subjectId}/users`,
            pagination: {
                pageSize: 10,
                mode: "server"
            },
            filters: {
                permanent: [
                    { field: "role", operator: "eq", value: "teacher" }
                ]
            },
        },
    })

    const studentsTable = useTable<SubjectUser>({
        columns: userColumns,
        refineCoreProps: {
            resource: `subjects/${subjectId}/users`,
            pagination: {
                pageSize: 10,
                mode: "server"
            },
            filters: {
                permanent: [
                    { field: "role", operator: "eq", value: "student" }
                ]
            },
        },
    })

    if (query.isLoading || query.isError || !subjectDetails) {
        return (
            <ShowView className="class-view class-show space-y-6">
                <ShowViewHeader resource="subjects" title="Subject Details" />
                <p className="state-message">
                    {query.isLoading ? "Loading class details..." : query.isError ? "Failed to load class details." : "Class details not found."}
                </p>
            </ShowView>
        )
    }

    return (
        <ShowView className="class-view class-show space-y-6">
            <ShowViewHeader resource="subjects" title={subjectDetails?.name ?? "Subject Details"} />

            <Card className="details-card">
                {/* Subject Details */}
                <div>
                    <div className="details-header">
                        <div className="flex flex-col gap-4">
                            <h1> Subject overview </h1>
                            <p>{subjectDetails.description}</p>
                        </div>
                        <Badge variant="secondary" >
                            {subjectDetails.code}
                        </Badge>
                    </div>
                </div>
            </Card>

            <Card className="details-card">
                <div className="details-section space-y-4">
                    <h2 className="font-bold text-lg"> Department </h2>
                        { subjectDetails.department ? (
                            <div className="gap-2">
                                <Link 
                                className="font-bold text-lg"
                                to={`/departments/show/${subjectDetails.department.id}`}> 
                                    {subjectDetails.department.name} 
                                </Link>
                                <p
                                className="text-muted-foreground text-sm"> 
                                    {subjectDetails.department.description}
                                </p>
                            </div>
                        ) : (
                            <div className="gap-2">
                                <h2 className="font-bold text-lg"> No Department Assigned </h2>
                                <p> This subject is not assigned to any department. </p>
                            </div>
                        )}
                </div>
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