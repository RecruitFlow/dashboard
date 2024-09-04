<script setup lang="ts" generic="TData, TValue">
import type {
  ColumnDef,
  SortingState,
  PaginationState,
} from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/vue-table";
import { valueUpdater } from "@/lib/table/valueUpdater";
import TablePagination from "./pagination.vue";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number;
  loading: boolean;
}>();

const emit = defineEmits({
  "update:pagination": (value: PaginationState) => true,
  "update:sorting": (value: SortingState) => true,
});

const sorting = ref<SortingState>([]);

const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 13,
});

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
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onPaginationChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, pagination),
  state: {
    get sorting() {
      return sorting.value;
    },
    get pagination() {
      return pagination.value;
    },
  },
  manualPagination: true,
  get rowCount() {
    return props.total;
  },
});

watch(pagination, () => {
  emit("update:pagination", pagination.value);
});

watch(sorting, () => {
  emit("update:sorting", sorting.value);
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
        <!-- <ShaTableRow v-if="loading">
          <ShaTableCell
            :colspan="columns.length"
            class="h-96 w-full text-center"
          >
            <Loader2 class="w-12 h-12 animate-spin m-auto" />
          </ShaTableCell>
        </ShaTableRow> -->
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

      <TablePagination :table="table" class="p-2" />
    </div>
  </div>
</template>
