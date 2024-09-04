<script setup lang="ts">
import { MoreHorizontal } from "lucide-vue-next";

defineProps<{
  candidate: {
    id: string;
  };
}>();

function copy(id: string) {
  navigator.clipboard.writeText(id);
}
</script>

<template>
  <ShaDropdownMenu>
    <ShaDropdownMenuTrigger as-child>
      <ShaButton variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </ShaButton>
    </ShaDropdownMenuTrigger>
    <ShaDropdownMenuContent align="end">
      <ShaDropdownMenuLabel>Actions</ShaDropdownMenuLabel>
      <ShaDropdownMenuItem @click="copy(candidate.id)">
        Copy payment ID
      </ShaDropdownMenuItem>
      <ShaDropdownMenuSeparator />
      <ShaDropdownMenuItem>View customer</ShaDropdownMenuItem>
      <ShaDropdownMenuItem>View payment details</ShaDropdownMenuItem>
    </ShaDropdownMenuContent>
  </ShaDropdownMenu>
</template>
