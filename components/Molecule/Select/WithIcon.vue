<script lang="ts" setup>
import { cn } from "@/lib/utils";

interface AccountSwitcherProps {
  isCollapsed: boolean;
  items: {
    label: string;
    value: string;
    icon: string;
  }[];
}

const props = defineProps<AccountSwitcherProps>();

const selectedItem = ref({});
</script>

<template>
  <ShaSelect v-bind="selectedItem" class="w-full">
    <ShaSelectTrigger
      aria-label="Select account"
      :class="
        cn(
          'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
          {
            'flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden':
              isCollapsed,
          }
        )
      "
    >
      <ShaSelectValue placeholder="Select an account">
        <div class="flex items-center gap-3">
          <Icon class="size-4" :name="selectedItem?.icon" />
          <span v-if="!isCollapsed">
            {{ selectedItem?.label }}
          </span>
        </div>
      </ShaSelectValue>
    </ShaSelectTrigger>
    <ShaSelectContent>
      <ShaSelectItem
        v-for="item of items"
        :key="item.value"
        :value="item.value"
      >
        <div
          class="flex items-center gap-3 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-foreground"
        >
          <Icon class="size-4" :name="item.icon" />
          {{ item.label }}
        </div>
      </ShaSelectItem>
    </ShaSelectContent>
  </ShaSelect>
</template>
