<script setup lang="ts" generic="TData, TValue">
import { type Table } from "@tanstack/vue-table";

interface DataTablePaginationProps {
  table: Table<TData>;
}
defineProps<DataTablePaginationProps>();
</script>

<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex-1 text-sm text-muted-foreground">
      {{ table.getFilteredSelectedRowModel().rows.length }} of
      {{ table.getFilteredRowModel().rows.length }} row(s) selected.
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Rows per page</p>
        <ShaSelect
          :model-value="`${table.getState().pagination.pageSize}`"
          @update:model-value="table.setPageSize"
        >
          <ShaSelectTrigger class="h-8 w-[70px]">
            <ShaSelectValue
              :placeholder="`${table.getState().pagination.pageSize}`"
            />
          </ShaSelectTrigger>
          <ShaSelectContent side="top">
            <ShaSelectItem
              v-for="pageSize in [10, 13, 20, 30, 40, 50]"
              :key="pageSize"
              :value="`${pageSize}`"
            >
              {{ pageSize }}
            </ShaSelectItem>
          </ShaSelectContent>
        </ShaSelect>
      </div>
      <div
        class="flex w-[100px] items-center justify-center text-sm font-medium"
      >
        Page {{ table.getState().pagination.pageIndex + 1 }} of
        {{ table.getPageCount() }}
      </div>
      <div class="flex items-center space-x-2">
        <ShaButton
          variant="outline"
          class="hidden w-8 h-8 p-0 lg:flex"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <span class="sr-only">Go to first page</span>
          <Icon name="i-solar-double-alt-arrow-left-linear" class="w-4 h-4" />
        </ShaButton>
        <ShaButton
          variant="outline"
          class="w-8 h-8 p-0"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <span class="sr-only">Go to previous page</span>
          <Icon name="i-solar-alt-arrow-left-linear" class="w-4 h-4" />
        </ShaButton>
        <ShaButton
          variant="outline"
          class="w-8 h-8 p-0"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <span class="sr-only">Go to next page</span>
          <Icon name="i-solar-alt-arrow-right-linear" class="w-4 h-4" />
        </ShaButton>
        <ShaButton
          variant="outline"
          class="hidden w-8 h-8 p-0 lg:flex"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <span class="sr-only">Go to last page</span>
          <Icon name="i-solar-double-alt-arrow-right-linear" class="w-4 h-4" />
        </ShaButton>
      </div>
    </div>
  </div>
</template>
