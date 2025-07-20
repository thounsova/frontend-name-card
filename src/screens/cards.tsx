"use client";

import React, { useState } from "react";
import { requestCard } from "@/lib/api/card-api";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, Trash } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "sonner";

type ISocialLink = {
  id: string;
  platform: string;
  url: string;
};

type IUser = {
  id: string;
  full_name: string;
  email: string;
};

export type ICard = {
  id: string;
  card_type: string;
  gender: string;
  dob: string;
  address: string;
  nationality: string;
  phone: string;
  created_at: string;
  user: IUser;
  socialLinks: ISocialLink[];
};

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages === 0) return null;

  const createPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 5) pages.push("...");
      const start = Math.max(4, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) if (!pages.includes(i)) pages.push(i);
      if (currentPage < totalPages - 3) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => {
        if (a === "...") return 1;
        if (b === "...") return -1;
        return (a as number) - (b as number);
      });
  };

  const pages = createPageNumbers();

  return (
    <nav className="inline-flex items-center space-x-2" aria-label="Pagination Navigation">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border border-orange-400 text-orange-600 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Previous
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 select-none text-orange-600">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-1 rounded border transition ${
              page === currentPage
                ? "bg-orange-600 text-white border-orange-700 shadow-sm"
                : "border-orange-400 hover:bg-orange-100 text-orange-600"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border border-orange-400 text-orange-600 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next
      </button>
    </nav>
  );
};

const CardsTable: React.FC = () => {
  const { GET_CARDS, DELETE_CARD } = requestCard();
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const sortField = sorting[0]?.id ?? "created_at";
  const sortOrder = sorting.length === 0 || sorting[0]?.desc ? "DESC" : "ASC";
  const nameFilter = (columnFilters.find((f) => f.id === "full_name")?.value ?? "") as string;

  const { data, isLoading } = useQuery({
    queryKey: ["cards", pagination.pageIndex, pagination.pageSize, sortField, sortOrder, nameFilter],
    queryFn: () =>
      GET_CARDS({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortBy: sortField,
        sortOrder,
        is_deleted: false,
        title: nameFilter || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => DELETE_CARD(id),
    onSuccess: () => {
      toast.success("Card deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
    onError: () => {
      toast.error("Failed to delete card");
    },
  });

  const columns: ColumnDef<ICard>[] = [
    {
      id: "no",
      header: "No.",
      cell: ({ row, table }) => {
        const { pageIndex, pageSize } = table.getState().pagination;
        return <div>{pageIndex * pageSize + row.index + 1}</div>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "full_name",
      accessorFn: (row) => row.user.full_name,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
          className="flex items-center space-x-1 text-orange-600 hover:text-orange-800 font-semibold"
        >
          <span>Name</span> <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <div className="capitalize text-orange-700 font-medium">{getValue<string>()}</div>
      ),
    },
    {
      id: "email",
      accessorFn: (row) => row.user.email,
      header: "Email",
      cell: ({ getValue }) => <div className="lowercase text-orange-600">{getValue<string>()}</div>,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ getValue }) => <div className="capitalize text-orange-600">{getValue<string>()}</div>,
    },
    {
      accessorKey: "dob",
      header: "DOB",
      cell: ({ getValue }) =>
        getValue() ? (
          <div className="text-orange-600">{dayjs(getValue<string>()).format("YYYY-MM-DD")}</div>
        ) : null,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ getValue }) => <div className="text-orange-600">{getValue<string>()}</div>,
    },
    {
      accessorKey: "nationality",
      header: "Nationality",
      cell: ({ getValue }) => <div className="text-orange-600">{getValue<string>()}</div>,
    },
    {
      accessorKey: "card_type",
      header: "Card Type",
      cell: ({ getValue }) => <div className="text-orange-700 font-semibold">{getValue<string>()}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ getValue }) => <div className="text-orange-600">{getValue<string>()}</div>,
    },
    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        const card = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 text-orange-600 hover:text-orange-800">
                <ChevronDown className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <Button
                variant="ghost"
                className="w-full justify-start text-orange-600 hover:bg-orange-100"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this card?")) {
                    deleteMutation.mutate(card.id);
                  }
                }}
              >
                <Trash className="w-4 h-4 mr-2" /> Delete
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    pageCount: data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex-1 p-6 md:p-8 bg-orange-50 rounded-lg shadow-md space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-orange-800">Cards Dashboard</h2>
      </header>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("full_name")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("full_name")?.setFilterValue(e.target.value)}
          className="max-w-sm border-orange-300 focus:ring-orange-400 focus:border-orange-400"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-orange-400 text-orange-600 hover:bg-orange-100">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-orange-300">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(val) => col.toggleVisibility(!!val)}
                  className="capitalize text-orange-700"
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border border-orange-300 bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="bg-orange-200 text-white">
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-orange-700">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-orange-100 cursor-pointer transition">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-orange-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-orange-700">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-orange-700">
        <div className="text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of {data?.meta?.total || 0} row(s) selected.
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <label htmlFor="rowsPerPage" className="text-sm font-medium">
              Rows per page
            </label>
            <select
              id="rowsPerPage"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="h-8 w-[70px] rounded border border-orange-300 bg-orange-50 px-3 py-1 text-sm text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <Pagination
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
            onPageChange={(page) => table.setPageIndex(page - 1)}
          />

          <div className="text-sm select-none">
            Page {data?.meta?.page || 1} of {table.getPageCount()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsTable;
