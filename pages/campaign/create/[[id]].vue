<script setup lang="ts">
import {
  CreateCampaignDocument,
  CampaignByIdDocument,
  UpdateCampaignDocument,
} from "@/generated/graphql/graphql.js";

import type { CampaignByIdQueryVariables } from "@/generated/graphql/graphql.js";
import * as z from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useToast } from "@/components/ui/toast/use-toast";

type Providers = "WORKUA" | "ROBOTAUA" | "LINKEDIN";
type CampaignEndType = "NEVER" | "DATE" | "COUNT";

const { params } = useRoute();
const { toast } = useToast();

definePageMeta({
  name: `campaign-create`,
  title: "Campaign",
  icon: "i-mage-file-plus",
  parent: "campaign",
});

const schema = toTypedSchema(
  z.object({
    name: z.string().min(4, "Must be at least 4 characters"),
    keyword: z.string().min(6, "Must be at least 6 characters"),
    providers: z
      .array(z.string())
      .min(1, "At least one provider is required")
      .default([]),
    endType: z.string().min(1, "End type is required"),
  })
);

const form = useForm({
  validationSchema: schema,
  initialValues: {
    providers: [] as Providers[],
    endType: "NEVER" as CampaignEndType,
  },
});

const providersList = ref<{ label: string; value: Providers; icon: string }[]>([
  {
    label: "LinkedIn",
    value: "LINKEDIN",
    icon: "i-bxl-linkedin-square",
  },
  {
    label: "Google",
    value: "WORKUA",
    icon: "i-bxl-google",
  },
  {
    label: "Amazon",
    value: "ROBOTAUA",
    icon: "i-bxl-amazon",
  },
]);

const endTypeList = [
  { label: "Never", value: "NEVER", icon: "i-mage-reload" },
  { label: "Date", value: "DATE", icon: "i-mage-alarm-clock" },
  { label: "Count", value: "COUNT", icon: "i-mage-lock" },
];

const onSubmit = form.handleSubmit(async (values) => {
  console.log(values);
  const isUpdate = !!params.id;

  const result = await (isUpdate
    ? useMutation(UpdateCampaignDocument, {
        variables: { updateCampaignInput: values, id: params.id as string },
      })
    : useMutation(CreateCampaignDocument, {
        variables: { createCampaignInput: values },
      })
  ).mutate();

  const success = !result?.errors?.length;

  toast({
    title: `${isUpdate ? "Updated" : "Created"}`,
    description: success
      ? `Campaign has been ${isUpdate ? "updated" : "created"}`
      : "Error",
    variant: success ? "default" : "destructive",
  });

  if (success) {
    navigateTo({ name: "campaign" });
  }
});

if (params.id) {
  const { data } = await useAsyncQuery(CampaignByIdDocument, {
    campaignById: params.id,
  } as CampaignByIdQueryVariables);

  const campaign = data.value?.campaignById;

  if (campaign) {
    form.setValues({
      name: campaign.name,
      keyword: campaign.keyword,
      providers: [...campaign.providers] as Providers[],
      endType: campaign.endType as CampaignEndType,
    });
  }
}
</script>

<template>
  <div>
    <ClientOnly>
      <Teleport to="#nav-toolbar">
        <ShaButton @click="onSubmit" variant="default"> Submit </ShaButton>
      </Teleport>
    </ClientOnly>
    <Form class="flex gap-10 w-full" @submit="onSubmit">
      <div class="flex flex-col gap-4 basis-1/3">
        <ShaFormField v-slot="{ componentField }" size="lg" name="name">
          <AtomFormInput
            label="Name"
            name="name"
            icon="i-mage-bookmark-minus"
            placeholder="Back-end"
            :field="componentField"
          />
        </ShaFormField>

        <ShaFormField v-slot="{ componentField }" size="lg" name="keyword">
          <AtomFormInput
            label="Keyword"
            name="keyword"
            icon="i-mage-stars-c"
            placeholder="Senior Pomidor"
            description="Will be used as main search keyword"
            :field="componentField"
          />
        </ShaFormField>

        <ShaFormField v-slot="{ componentField }" size="lg" name="endType">
          <AtomFormSelect
            label="Trigger of end"
            name="endType"
            placeholder="Select end type"
            description="Define when campaign should be stopped"
            :field="componentField"
            :items="endTypeList"
          />
        </ShaFormField>
      </div>

      <div class="flex flex-col gap-4 basis-2/3">
        <ShaFormField
          v-slot="{ componentField }"
          size="lg"
          label="Providers"
          name="providers"
          help="Providers to search for candidates"
        >
          <ShaFormItem>
            <ShaFormLabel>Providers</ShaFormLabel>
            <ShaFormDescription>
              Providers to search for candidates
            </ShaFormDescription>
            <ShaFormControl>
              <div class="flex gap-2">
                <div
                  v-for="provider of providersList"
                  class="size-32 border-2 rounded-xl grid place-items-center cursor-pointer"
                  :class="
                    form.values.providers?.find((el) => el === provider.value)
                      ? 'border-black'
                      : 'border-gray-400'
                  "
                  @click="
                    () => {
                      const providers =
                        form.controlledValues.value.providers || [];

                      providers?.includes(provider.value)
                        ? providers?.splice(
                            providers?.indexOf(provider.value),
                            1
                          )
                        : providers.push(provider.value);

                      form.setFieldValue('providers', providers);
                    }
                  "
                >
                  <Icon
                    :name="provider.icon"
                    class="size-16"
                    :class="
                      form.values.providers?.find((el) => el === provider.value)
                        ? 'text-black'
                        : 'text-gray-400'
                    "
                  />
                </div>
              </div>

              <ShaInput v-bind="componentField" class="hidden" />
            </ShaFormControl>

            <ShaFormMessage />
          </ShaFormItem>
        </ShaFormField>
      </div>
    </Form>
  </div>
</template>
