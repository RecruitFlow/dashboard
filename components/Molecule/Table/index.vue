<script setup lang="ts" generic="TData, TValue">
import type {
  ColumnDef,
  SortingState,
  PaginationState,
  RowSelectionState,
  ColumnFiltersState
} from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel
} from "@tanstack/vue-table";
import { valueUpdater } from "@/lib/table/valueUpdater";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number;
  loading: boolean;
}>();

const emit = defineEmits({
  "update:pagination": (value: PaginationState) => true,
  "update:sorting": (value: SortingState) => true,
  "update:filters": (value: ColumnFiltersState) => true
});

const sorting = ref<SortingState>([]);

const filters = ref<ColumnFiltersState>([]);

const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 13
});

const selectedRows = ref<RowSelectionState>({});

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, filters),
  onRowSelectionChange: (updaterOrValue) => {
    valueUpdater(updaterOrValue, selectedRows);
  },
  onPaginationChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, pagination),
  state: {
    get sorting() {
      return sorting.value;
    },
    get pagination() {
      return pagination.value;
    },
    get rowSelection() {
      return selectedRows.value;
    },
    get columnFilters() {
      return filters.value;
    }
  },
  manualPagination: true,
  manualFiltering: true,
  enableMultiSort: false,
  enableColumnFilters: true,
  get rowCount() {
    return props.total;
  }
});

watch(sorting, () => {
  emit("update:sorting", sorting.value);
});

watch(pagination, () => {
  emit("update:pagination", pagination.value);
});

watch(filters, () => {
  emit("update:filters", filters.value);
});

defineExpose({
  selectedRowsIds: () => table.getSelectedRowModel().rows.map((row) => row.id),
  resetSelectedColumns: table.resetRowSelection,
  resetFilters: table.resetColumnFilters,
  getColumn: table.getColumn,
  haveSelectedRow: computed(() => {
    return table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();
  })
});
</script>

<template>
  <div class="border rounded-md gap-2 flex flex-col justify-between">
    <ShaTable class="flex-1">
      <ShaTableHeader>
        <ShaTableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <ShaTableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </ShaTableHead>
        </ShaTableRow>
      </ShaTableHeader>
      <ShaTableBody>
        <template v-if="table.getRowModel().rows?.length">
          <ShaTableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <ShaTableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </ShaTableCell>
          </ShaTableRow>
        </template>
        <template v-else-if="loading">
          <ShaTableRow v-for="i in 4">
            <ShaTableCell :colspan="columns.length" class="h-24 text-center">
              <ShaSkeleton class="size-full" />
            </ShaTableCell>
          </ShaTableRow>
        </template>
        <template v-else>
          <ShaTableRow>
            <ShaTableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </ShaTableCell>
          </ShaTableRow>
        </template>
      </ShaTableBody>
    </ShaTable>

    <div class="basis-5">
      <ShaSeparator />

      <MoleculeTablePagination :table="table" class="p-2" />
    </div>
  </div>
</template>
