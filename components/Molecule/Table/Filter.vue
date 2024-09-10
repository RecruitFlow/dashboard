<script setup lang="ts" generic="TData, TValue">
import type { Column } from "@tanstack/vue-table";

import { cn } from "@/lib/utils";

interface DataTableFacetedFilter {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: string;
  }[];
}

const props = defineProps<DataTableFacetedFilter>();

const facets = computed(() => props.column?.getFacetedUniqueValues());

const selectedValues = computed(
  () => new Set(props.column?.getFilterValue() as string[])
);
</script>

<template>
  <ShaPopover>
    <ShaPopoverTrigger as-child>
      <ShaButton variant="outline" size="sm" class="h-full border-dashed">
        <Icon name="i-mage-plus-circle" class="mr-2 h-4 w-4" />
        {{ title }}
        <template v-if="selectedValues.size > 0">
          <ShaSeparator orientation="vertical" class="mx-2 h-4" />
          <ShaBadge
            variant="secondary"
            class="rounded-sm px-1 font-normal lg:hidden"
          >
            {{ selectedValues.size }}
          </ShaBadge>
          <div class="hidden space-x-1 lg:flex">
            <ShaBadge
              v-if="selectedValues.size > 2"
              variant="secondary"
              class="rounded-sm px-1 font-normal"
            >
              {{ selectedValues.size }} selected
            </ShaBadge>

            <template v-else>
              <ShaBadge
                v-for="option in options.filter((option) =>
                  selectedValues.has(option.value)
                )"
                :key="option.value"
                variant="secondary"
                class="rounded-sm px-1 font-normal"
              >
                {{ option.label }}
              </ShaBadge>
            </template>
          </div>
        </template>
      </ShaButton>
    </ShaPopoverTrigger>
    <ShaPopoverContent class="w-[200px] p-0" align="start">
      <ShaCommand
        :filter-function="(list: DataTableFacetedFilter['options'], term) => list.filter(i => i.label.toLowerCase()?.includes(term)) "
      >
        <ShaCommandInput :placeholder="title" />
        <ShaCommandList>
          <ShaCommandEmpty>No results found.</ShaCommandEmpty>
          <ShaCommandGroup>
            <ShaCommandItem
              v-for="option in options"
              :key="option.value"
              :value="option"
              @select="
                (e) => {
                  const isSelected = selectedValues.has(option.value);

                  if (isSelected) {
                    selectedValues.delete(option.value);
                  } else {
                    selectedValues.add(option.value);
                  }

                  const filterValues = Array.from(selectedValues);

                  column?.setFilterValue(
                    filterValues.length ? filterValues : undefined
                  );
                }
              "
            >
              <div
                :class="
                  cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    selectedValues.has(option.value)
                      ? 'bg-primary text-primary-foreground'
                      : 'opacity-50 [&_svg]:invisible'
                  )
                "
              >
                <Icon name="i-mage-check" :class="cn('h-4 w-4')" />
              </div>
              <Icon
                v-if="option.icon"
                :name="option.icon"
                :class="cn('mr-2 h-4 w-4 text-muted-foreground')"
              />

              <span>{{ option.label }}</span>
              <span
                v-if="facets?.get(option.value)"
                class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs"
              >
                {{ facets.get(option.value) }}
              </span>
            </ShaCommandItem>
          </ShaCommandGroup>

          <template v-if="selectedValues.size > 0">
            <ShaCommandSeparator />
            <ShaCommandGroup>
              <ShaCommandItem
                :value="{ label: 'Clear filters' }"
                class="justify-center text-center"
                @select="column?.setFilterValue(undefined)"
              >
                Clear filters
              </ShaCommandItem>
            </ShaCommandGroup>
          </template>
        </ShaCommandList>
      </ShaCommand>
    </ShaPopoverContent>
  </ShaPopover>
</template>
