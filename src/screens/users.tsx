import React, { useState } from "react";
import { requestUser } from "@/lib/api/user-api";
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
import UserDeleteAlertDialog from "@/store/user-delete-alert-dialog";
import { useUserDeleteDialog } from "@/store/user-delete-dialog-store";
import { ArrowUpDown, ChevronDown, Pen, Trash } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IUser } from "@/types/user-type";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/lib/pagination";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Badge } from "@/components/ui/badge";
import { useUserStatusDialog } from "@/store/user-status-dialog-store";
import UserStatusAlertDialog from "@/components/user-status-dialong";
import { useUserEditModal } from "@/store/user-edit-modal-store";
import EditUserModal from "@/components/Layout/user-edit-modal";

dayjs.extend(utc);
dayjs.extend(timezone);

const UsersTable = () => {
  const queryClient = useQueryClient();
  const { USERS, UPDATE_USER, DELETE_USER } = requestUser();

  const { isOpen, userId, userName, openDialog, closeDialog } = useUserDeleteDialog();

  const { mutate: updateUserStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) => UPDATE_USER(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: (id: string) => DELETE_USER(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const sortField = sorting[0]?.id ?? "created_at";
  const sortOrder = sorting.length === 0 ? "DESC" : sorting[0]?.desc ? "DESC" : "ASC";
  const emailFilter = columnFilters.find((f) => f.id === "email")?.value ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["users", pagination.pageIndex, pagination.pageSize, sortField, sortOrder, emailFilter],
    queryFn: () =>
      USERS({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortBy: sortField,
        sortOrder,
        email: emailFilter,
      }),
  });

  const columns: ColumnDef<IUser>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="rounded-md border-orange-400 text-orange-600 focus:ring-orange-500 transition"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="rounded-md border-orange-400 text-orange-600 focus:ring-orange-500 transition"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "no",
      header: "No.",
      cell: ({ row, table }) => (
        <div className="text-gray-700 font-semibold">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + row.index + 1}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) => {
        const avatar = row.getValue("avatar") as string;
        const defaultAvatar = "https://ui-avatars.com/api/?name=User&background=random";
        return (
          <img
            src={avatar || defaultAvatar}
            alt="User avatar"
            className="h-10 w-10 rounded-full object-cover border-2 border-orange-400 shadow-sm"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="text-orange-600 hover:bg-orange-100 rounded-md transition"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Fullname <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize text-gray-900 font-medium">{row.getValue("full_name")}</div>,
    },
    {
      accessorKey: "user_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="text-orange-600 hover:bg-orange-100 rounded-md transition"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Username <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize text-gray-800">{row.getValue("user_name")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="text-orange-600 hover:bg-orange-100 rounded-md transition"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Email <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase text-gray-700">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "is_active",
      header: () => <div className="text-gray-700 font-semibold">Status</div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Badge
            className={`cursor-pointer rounded-full px-3 py-1 font-semibold shadow-sm transition
              ${user.is_active ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white" : "bg-gray-300 text-gray-600"}
              hover:brightness-110`}
            onClick={() => useUserStatusDialog.getState().setDialog(user.id, user.is_active)}
          >
            {user.is_active ? "Active" : "Blocked"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: () => <div className="text-gray-700 font-semibold">Created At</div>,
      cell: ({ row }) => {
        const rawDate = row.getValue("created_at") as string;
        const formatted = dayjs(rawDate).add(7, "hour").format("YYYY-MM-DD hh:mm A");
        return <div className="text-sm text-gray-500">{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex space-x-2 items-center">
            <Button
              className="flex items-center space-x-1 rounded-md border-orange-600 hover:bg-orange-400 px-3 py-1 text-white text-sm font-medium shadow hover:brightness-110 transition"
              onClick={() => useUserEditModal.getState().openModal(user)}
            >
              <Pen className="w-4 h-4" />
              <span>Edit</span>
            </Button>
            <Button
              className="flex items-center space-x-1 rounded-md bg-red-500 px-3 py-1 text-white text-sm font-medium shadow hover:brightness-110 transition"
              onClick={() => openDialog(user.id, user.full_name)}
            >
              <Trash className="w-4 h-4" />
              <span>Delete</span>
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    pageCount: data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : -1,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
  });

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-white rounded-lg shadow-lg">
      <UserDeleteAlertDialog
        open={isOpen}
        userName={userName}
        onClose={closeDialog}
        onConfirm={() => {
          if (userId) {
            deleteUser(userId);
            closeDialog();
          }
        }}
      />
      <UserStatusAlertDialog
        onConfirm={(userId, newStatus) => updateUserStatus({ id: userId, status: newStatus })}
        isLoading={isUpdating}
      />
      <EditUserModal />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">User Dashboard</h2>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("email")?.setFilterValue(e.target.value)}
          className="max-w-sm rounded-lg border-orange-400 focus:border-orange-600 focus:ring-orange-400 focus:ring-2 transition"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto rounded-lg border-orange-400 text-orange-600 hover:bg-orange-50 transition"
            >
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-lg shadow-lg border border-gray-200">
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide())
              .map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.id}
                  className="capitalize text-gray-800"
                  checked={c.getIsVisible()}
                  onCheckedChange={(v) => c.toggleVisibility(!!v)}
                >
                  {c.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border border-orange-400 overflow-hidden shadow-md">
        <Table>
          <TableHeader className="bg-orange-50">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    className="text-gray-700 font-semibold border-b border-orange-300"
                  >
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500 font-semibold">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-orange-50 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-b border-orange-200 text-gray-800"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-600 font-medium">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="text-gray-600 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of {data?.meta?.total || 0} row(s) selected.
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-700">Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="h-8 w-[70px] rounded-lg border border-orange-400 bg-white px-3 py-1 text-sm text-orange-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            >
              {[5, 10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <Pagination
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
            onPageChange={(page) => table.setPageIndex(page - 1)}
            
          />
          <div className="text-sm text-gray-600">
            Page {data?.meta?.page || 1} of {table.getPageCount()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
