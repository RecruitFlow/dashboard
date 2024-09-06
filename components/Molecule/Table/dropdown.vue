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
        Copy ID
      </ShaDropdownMenuItem>
      <ShaDropdownMenuSeparator />
      <ShaDropdownMenuItem>Edit</ShaDropdownMenuItem>
      <ShaDropdownMenuItem>Details</ShaDropdownMenuItem>
      <ShaDropdownMenuItem class="bg-red-400/20">Delete</ShaDropdownMenuItem>
    </ShaDropdownMenuContent>
  </ShaDropdownMenu>
</template>
