<script setup lang="ts">
import { cn } from "@/lib/utils";

const isCollapsed = ref(true);

const accounts = [
  {
    label: "Robert Barateon",
    email: "some@email.com",
    icon: "i-mage-telegram",
  },
  {
    label: "John Snow",
    email: "some2@email.com",
    icon: "i-mage-stars-c",
  },
];

function onCollapse() {
  isCollapsed.value = true;
}

function onExpand() {
  isCollapsed.value = false;
}
</script>

<template>
  <ShaTooltipProvider :delay-duration="0">
    <ShaResizablePanelGroup
      id="resize-panel-group-1"
      class="h-dvh w-full items-stretch flex flex-col"
      direction="horizontal"
    >
      <ShaResizablePanel
        id="resize-panel-1"
        :default-size="200"
        :collapsed-size="3"
        collapsible
        :min-size="12"
        :max-size="15"
        :class="
          cn(
            isCollapsed &&
              'min-w-[50px] transition-all duration-300 ease-in-out'
          )
        "
        @expand="onExpand"
        @collapse="onCollapse"
      >
        <div class="p-2 grid place-items-center h-14">
          <MoleculeSelectAccount
            class="w-full"
            :is-collapsed="isCollapsed"
            :accounts="accounts"
          />
        </div>
        <ShaSeparator />
        <SICNavBar
          class="h-full flex flex-col gap-2 mt-2"
          :class="cn(isCollapsed && 'items-center')"
          :is-collapsed="isCollapsed"
        />
      </ShaResizablePanel>

      <ShaResizableHandle id="resize-handle-1" with-handle />

      <ShaResizablePanel id="resize-panel-2">
        <div class="flex flex-col size-full">
          <div class="h-14 w-full flex justify-between items-center px-2">
            <MoleculeBreadcrumbs />
            <div id="nav-toolbar" />
          </div>
          <ShaSeparator />
          <section
            class="w-full py-2 px-3 h-[calc(100dvh-56px)] overflow-y-auto"
          >
            <slot />
          </section>
        </div>
        <UNotifications />
      </ShaResizablePanel>
    </ShaResizablePanelGroup>
  </ShaTooltipProvider>
</template>
