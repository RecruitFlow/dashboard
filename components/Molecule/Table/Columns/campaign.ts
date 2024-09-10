import { h } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Icon } from "#components";
import DropdownAction from "~/components/Molecule/Table/Dropdown.vue";
import { ArrowUpDown, ChevronDown } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/vue-table";
import type { Campaign } from "@/generated/graphql/graphql.js";

export const columns: ColumnDef<Campaign>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate"),
        "onUpdate:checked": (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all"
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        "onUpdate:checked": (value) => row.toggleSelected(!!value),
        ariaLabel: "Select row"
      }),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "name",
    header: () => h("div", { class: "text-left" }, "Name"),
    cell: ({ row }) => {
      return h("div", { class: "text-left font-base" }, row.getValue("name"));
    },
    enableSorting: true
  },
  {
    accessorKey: "keyword",
    header: () => h("div", { class: "text-left" }, "Keyword"),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-left font-base" },
        row.getValue("keyword")
      );
    },
    enableSorting: true
  },
  {
    accessorKey: "status",
    id: "status",
    header: () => h("div", { class: "text-left" }, "Status"),
    cell: ({ row }) => {
      const options = {
        ACTIVE: "i-mdi-progress-star-four-points",
        PAUSED: "i-mdi-progress-question",
        DELETED: "i-mdi-progress-close",
        ENDED: "i-mdi-progress-check"
      };

      const value = row.getValue("status") as
        | "ACTIVE"
        | "PAUSED"
        | "DELETED"
        | "ENDED";
      return h(
        Badge,
        {
          class: "text-left font-base",
          variant: "outline"
        },
        () => [
          h(Icon, {
            class: "mr-2 h-4 w-4",
            name: options[value]
          }),
          value
        ]
      );
    },
    enableSorting: true
  },
  {
    accessorKey: "providers",
    header: () => h("div", { class: "text-left" }, "Providers"),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-left font-base" },
        row.getValue("providers")
      );
    },
    enableSorting: true
  },
  {
    accessorKey: "endType",
    header: () => h("div", { class: "text-left" }, "End Type"),
    cell: ({ row }) => {
      const options = {
        NEVER: "i-mage-reload",
        DATE: "i-mage-alarm-clock",
        COUNT: "i-mage-lock"
      };

      const value = row.getValue("endType") as "NEVER" | "DATE" | "COUNT";

      return h(
        Badge,
        { class: "text-left font-base", variant: "secondary" },
        () => [
          h(Icon, {
            class: "mr-2 h-4 w-4",
            name: options[value]
          }),
          value
        ]
      );
    },
    enableSorting: true
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc")
        },
        () => ["Created", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-left font-base" },
        useRelativeTime(row.getValue("createdAt"))
      );
    },
    enableSorting: true
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const campaign = row.original;

      return h(
        "div",
        { class: "relative" },
        h(DropdownAction, {
          data: campaign
        })
      );
    }
  }
];
