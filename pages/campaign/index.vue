<script lang="ts" setup>
import type {
  ListCampaignInput,
  Campaign,
  CampaignQuery,
} from "@/generated/graphql/graphql.js";

import type { ComponentExposed } from "vue-component-type-helpers";

import {
  CampaignDocument,
  RemoveCampaignDocument,
} from "@/generated/graphql/graphql.js";

import MoleculeTable from "@/components/Molecule/Table/index.vue";

import { useToast } from "@/components/ui/toast/use-toast";

import { columns } from "@/components/Molecule/Table/Columns/campaign";

definePageMeta({
  name: "campaign",
  title: "Campaigns",
  icon: "i-mage-megaphone-a",
});

//================ CONST DATA ================//

const { toast } = useToast();

//================ VARIABLES ================//
const variables = reactive<ListCampaignInput>({
  offset: 0,
  limit: 10,
  filterKey: null,
  filterValue: null,
  sortKey: "createdAt",
  sortValue: "desc",
});
//================ REQUEST ================//

const {
  loading: pending,
  result: data,
  refetch: refetch,
} = useQuery<CampaignQuery>(
  CampaignDocument,
  {
    listCampaignInput: variables,
  },
  {
    fetchPolicy: "no-cache",
  }
);

const table = useTemplateRef<ComponentExposed<typeof MoleculeTable>>("table");

//================ Functions ================//

async function deleteCampaigns(ids: string[] = []) {
  const result = await useMutation(RemoveCampaignDocument, {
    variables: {
      removeCampaignId: ids,
    },
  }).mutate();

  if (result?.data?.removeCampaign) {
    toast({
      title: `Success`,
      description: `Deleted ${ids.length} campaigns`,
      variant: "default",
    });

    table.value?.resetSelectedColumns();

    refetch();
  } else {
    toast({
      title: `Error`,
      description: `Error deleting ${ids.length} campaigns`,
      variant: "destructive",
    });
  }
}

// === Table Actions ===
provide("tableActions", {
  edit: (id: string) => {
    navigateTo({ name: "campaign-create", params: { id } });
  },
  details: (id: string) => {
    navigateTo({ name: "campaign-details", params: { id } });
  },
  delete: (id: string) => {
    deleteCampaigns([id]);
  },
});
</script>

<template>
  <div class="flex flex-col h-full">
    <div
      class="w-full h-fit border-[1px] border-b-0 rounded-t-md p-2 flex gap-1"
    >
      <div class="basis-1/2 flex gap-1">
        <div class="relative w-full max-w-sm items-center">
          <ShaInput
            id="search"
            type="text"
            placeholder="Search..."
            class="pl-10"
          />
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
          >
            <Icon name="i-mage-search" class="size-6 text-muted-foreground" />
          </span>
        </div>

        <MoleculeSelectWithIcon
          class="w-64"
          :items="[{ value: 'some', label: 'some', icon: 'some' }]"
          :is-collapsed="true"
        />
      </div>

      <div class="basis-1/2 justify-end flex">
        <ShaButton
          variant="destructive"
          :disabled="!table?.isSomeRowSelected()"
          @click="
            deleteCampaigns(
              table
                ?.selectedRowsIds()
                .map((id) => {
                  return data?.campaign[id]?.id;
                })
                .filter(Boolean)
            )
          "
        >
          Delete
        </ShaButton>
      </div>
    </div>

    <MoleculeTable
      ref="table"
      class="h-full rounded-t-none"
      :columns="columns"
      :data="data?.campaign || []"
      :total="data?.campaignCount.count || 0"
      :loading="pending"
      :limit="variables.limit"
      @update:pagination="
        ($event) => {
          variables.offset = $event.pageIndex * $event.pageSize;
          variables.limit = $event.pageSize;
        }
      "
      @update:sorting="
        ($event) => {
          variables.sortKey = $event[0].id;
          variables.sortValue = !$event[0].desc ? 'asc' : 'desc';
          refetch();
        }
      "
    />
    <ClientOnly>
      <Teleport to="#nav-toolbar">
        <NuxtLink :to="{ name: 'campaign-create' }">
          <ShaButton variant="default">
            <Icon name="i-mage-plus" class="size-5 mr-2" />
            Create
          </ShaButton>
        </NuxtLink>
      </Teleport>
    </ClientOnly>
  </div>
</template>
