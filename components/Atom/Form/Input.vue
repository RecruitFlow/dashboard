<script lang="ts" setup>
import type { ComponentFieldBindingObject } from "vee-validate";

interface FormInputProps {
  label?: string;
  icon?: string;
  placeholder?: string;
  description?: string;
  field: ComponentFieldBindingObject;
}

defineProps<FormInputProps>();
</script>

<template>
  <ShaFormItem>
    <ShaFormLabel v-if="label">{{ label }}</ShaFormLabel>
    <ShaFormControl>
      <template v-if="icon">
        <div class="!relative w-full items-center">
          <ShaInput v-bind="field" :placeholder="placeholder" class="pl-10" />
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
          >
            <Icon :name="icon" class="size-5" />
          </span>
        </div>
      </template>
      <template v-else>
        <ShaInput v-bind="field" :placeholder="placeholder" />
      </template>
    </ShaFormControl>
    <ShaFormDescription v-if="description">
      {{ description }}
    </ShaFormDescription>
    <ShaFormMessage />
  </ShaFormItem>
</template>
