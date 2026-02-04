import { CreateButton } from "@/components/refine-ui/buttons/create";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { useGetIdentity } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";


type DepartmentListItem = {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  totalSubjects?: number | null;
};

export default function DepartmentsList() {

    const [searchQuery, setSearchQuery] = useState("");

    const { data: currentUser } = useGetIdentity<User>();

    const departmentsColumns = useMemo<ColumnDef<DepartmentListItem>[]>(
        () => [
            {
                id:'code',
                accessorKey: 'code',
                header: () => <p className="column-title"> Code </p>,
                cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
            }, 
            {
                id: 'name',
                accessorKey: 'name',
                header: () => <p className="column-title"> Name </p>,
                cell: ({ getValue }) => <span className="text-foreground"> {getValue<string>()} </span>,
                filterFn: "includesString"
            }, 
            {
                id: 'totalSubjects',
                accessorKey: 'totalSubjects',
                header: () => <p className="column-title"> Total Subjects </p>,
                cell: ({ getValue }) => {
                    const total = getValue<number>();
                    return <Badge variant="secondary">{total ?? 0}</Badge>;
                }
            }, 
            {
                id: 'description',
                accessorKey: 'description',
                header: () => <p className="column-title"> Description </p>,
                cell: ({ getValue }) => {
                    const description = getValue<string>();

                    return description ? (
                        <span className="text-foreground"> {description} </span>
                    ) : (
                        <span className="text-muted-foreground italic"> No description provided </span>
                    )
                }
            }, 
            {
                id: 'details',
                accessorKey: 'id',
                header: () => <p className="column-title"> Details </p>,
                cell: ({ row }) => (
                    <ShowButton 
                        resource="departments" 
                        recordItemId={row.original.id} 
                        variant="outline"
                        size="sm"
                    >
                        View
                    </ShowButton>
                )
            }
        ], []
    )

    const searchFilters = searchQuery ? [
        {
            field: 'name',
            operator: 'contains' as const,
            value: searchQuery
        }, 
        {
          field: "code",
          operator: "contains" as const,
          value: searchQuery,
        },
    ] : [];

    const departmentTable = useTable<DepartmentListItem>({
        columns: departmentsColumns,
        refineCoreProps: {
            resource: 'departments',
            pagination: {
                pageSize: 10,
                mode: 'server'
            },
            filters: {
                permanent: [
                    ...searchFilters
                ]
            }
        }
    })

    return (
        <ListView>
            <Breadcrumb />

            <h1 className="page-title"> Departments </h1>

            <div className="intro-row">
                <p>Quick access to essential metrics and management tools.</p>
                <div className="actions-row">
                <div className="search-field">
                    <Search className="search-icon"/>
                    <Input
                        type="text"
                        placeholder="Search by name..."
                        className="pl-10 w-full"
                        value={searchQuery}
                        onChange={(e)=> setSearchQuery(e.target.value)}
                    />
                    </div>
                    {
                        currentUser?.role === 'teacher' && (
                            <CreateButton resource="departments" />
                        )
                    }
                </div>
            </div>

                <DataTable table={departmentTable} />
        </ListView>
    )
}