import { h } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import DropdownAction from "~/components/Molecule/Table/Dropdown.vue";
import { ArrowUpDown, ChevronDown } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/vue-table";
import type { Candidate } from "@/generated/graphql/graphql.js";

export const columns: ColumnDef<Candidate>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate"),
        "onUpdate:checked": (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        "onUpdate:checked": (value) => row.toggleSelected(!!value),
        ariaLabel: "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => h("div", { class: "text-left" }, "Name"),
    cell: ({ row }) => {
      return h("div", { class: "text-left font-base" }, row.getValue("name"));
    },
    enableSorting: false,
  },
  {
    accessorKey: "position",
    header: () => h("div", { class: "text-left" }, "Position"),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-left font-base" },
        row.getValue("position")
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "yearsOfExperience",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () =>
            column.toggleSorting(column.getIsSorted() === "asc", false),
        },
        () => ["Experience", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      const { yearsOfExperience } = row.original;
      return h(
        "div",
        { class: "text-left font-base" },
        yearsOfExperience > 1
          ? `${yearsOfExperience} years`
          : `${yearsOfExperience} year`
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "salary",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Salary", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      const { salary } = row.original;
      return h("div", { class: "text-left font-base" }, `${salary} $`);
    },
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Created", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      const { createdAt } = row.original;
      return h(
        "div",
        { class: "text-left font-base" },
        useRelativeTime(createdAt)
      );
    },
    enableSorting: true,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const candidate = row.original;

      return h(
        "div",
        { class: "relative" },
        h(DropdownAction, {
          data: candidate,
        })
      );
    },
  },
];
