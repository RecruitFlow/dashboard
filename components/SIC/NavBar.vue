<script setup lang="ts">
import { cn } from "@/lib/utils";

defineProps<{
  isCollapsed: boolean;
}>();

const links = [
  {
    label: "Dashboard",
    name: "index",
    path: "/",
    icon: "i-mage-dashboard-bar",
  },
  {
    label: "Campaigns",
    name: "campaign",
    path: "/campaign",
    icon: "i-mage-megaphone-a",
  },
  {
    label: "Candidates",
    name: "candidates",
    path: "/candidates",
    icon: "i-mage-users",
  },
];
</script>

<template>
  <div>
    <div
      v-for="link in links"
      :key="link.label"
      class="px-2 flex flex-col justify-center align-middle items-center"
    >
      <NuxtLink :to="link.path" class="w-full">
        <ShaTooltip v-if="isCollapsed" :key="link.name" :delay-duration="0">
          <ShaTooltipTrigger as-child>
            <ShaButton
              :variant="link.name === $route.name ? 'default' : 'ghost'"
              size="icon"
              class="h-9 w-9"
            >
              <Icon :name="link.icon" class="size-6" />
              <span class="sr-only">{{ link.label }}</span>
            </ShaButton>
          </ShaTooltipTrigger>
          <ShaTooltipContent side="right" class="flex items-center gap-4">
            {{ link.label }}
          </ShaTooltipContent>
        </ShaTooltip>
        <ShaButton
          v-else
          size="default"
          class="w-full text-md flex justify-start items-center p-2"
          :variant="link.name === $route.name ? 'default' : 'ghost'"
        >
          <Icon :name="link.icon" class="size-5 mr-2" />
          {{ link.label }}</ShaButton
        >
      </NuxtLink>
    </div>
  </div>
</template>
