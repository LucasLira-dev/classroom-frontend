import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

export default function FacultyList() {

    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(
        searchParams.get("search") ?? ""
    )


    const facultyColumns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                id: 'name',
                accessorKey: 'name',
                size: 240,
                header: () => <p className="column-title"> Name </p>,
                cell: ({ row, getValue }) => {
                    const name = getValue<string>();
                    const image = row.original.image;

                    return (
                        <div className="flex items-center gap-3">
                        <Avatar>
                            {image && <AvatarImage src={image} alt={name} />}
                            <AvatarFallback>{getInitials(name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-foreground text-sm font-semibold">{name}</span>
                        </div>
                    );
                }
            }, 
            {
                id: 'email',
                accessorKey: 'email',
                size: 200,
                header: () => <p className="column-title"> Email </p>,
                cell: ({ getValue }) => {
                    return (
                        <span className="text-foreground text-sm"> {getValue<string>()} </span>
                    )
                }
            },
            {
                id: 'role',
                accessorKey: 'role',
                size: 150,
                header: () => <p className="column-title"> Role </p>,
                cell: ({ getValue }) => {
                    return (
                        <Badge variant="default"> {getValue<string>()} </Badge>
                    )
                }
            }, 
            {
                id: 'details',
                accessorKey: 'id',
                size: 100,
                header: () => <p className="column-title"> Details </p>,
                cell: ({ row }) => {
                    return (
                        <ShowButton 
                            resource="users"
                            recordItemId={row.original.id}
                            variant="outline"
                            size="sm"
                        >
                            View
                        </ShowButton>
                    )
                }
            }
        ], []
    )

    const searchFilters = searchQuery ? [
        {
            field: 'name',
            operator: 'contains' as const,
            value: searchQuery
        }
    ] : [];

    const facultyTable = useTable<User>({
        columns: facultyColumns,
        refineCoreProps: {
            resource: 'users',
            pagination: {
                pageSize: 20,
                mode: 'server',
            },
            filters: {
                permanent: [
                    { field: 'role', operator: 'eq', value: 'teacher' },
                ],
                ...searchFilters
            },
            sorters: {
                initial: [
                    { field: 'name', order: 'desc' }
                ]
            }
        }
    })
    
    return (
        <ListView>
            <Breadcrumb />

            <h1 className="page-title"> Faculty </h1>

            <div className="intro-row">
                <p>Browse and manage faculty members.</p>
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
                </div>
            </div>

            <DataTable table={facultyTable} />
        </ListView>
    )
}

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};