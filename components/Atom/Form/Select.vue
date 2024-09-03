<script lang="ts" setup>
import type { ComponentFieldBindingObject } from "vee-validate";

interface FormInputProps {
  label: string;
  name: string;
  placeholder?: string;
  description?: string;
  items: { label: string; value: string; icon: string }[];
  field: ComponentFieldBindingObject;
}

defineProps<FormInputProps>();
</script>

<template>
  <ShaFormItem>
    <!-- ===LABEL BLOCK=== -->
    <ShaFormLabel v-if="label">{{ label }}</ShaFormLabel>
    <!-- ===LABEL BLOCK=== -->

    <!-- ===SELECT BLOCK=== -->
    <ShaSelect v-bind="field">
      <ShaFormControl>
        <ShaSelectTrigger>
          <ShaSelectValue :placeholder="placeholder" />
        </ShaSelectTrigger>
      </ShaFormControl>

      <!-- ===SELECT DROPDOWN BLOCK=== -->
      <ShaSelectContent>
        <ShaSelectGroup>
          <ShaSelectItem
            v-for="item in items"
            :value="item.value"
            :key="item.value"
          >
            <div
              class="flex items-center gap-3 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-foreground"
            >
              <Icon class="size-4" :name="item.icon" />
              {{ item.label }}
            </div>
          </ShaSelectItem>
        </ShaSelectGroup>
      </ShaSelectContent>
      <!-- ===SELECT DROPDOWN BLOCK=== -->
    </ShaSelect>
    <!-- ===SELECT BLOCK=== -->

    <!-- ===DESCRIPTION BLOCK=== -->
    <ShaFormDescription v-if="description">
      {{ description }}
    </ShaFormDescription>
    <!-- ===DESCRIPTION BLOCK=== -->

    <!-- ===ERROR BLOCK=== -->
    <ShaFormMessage />
    <!-- ===ERROR BLOCK=== -->
  </ShaFormItem>
</template>
