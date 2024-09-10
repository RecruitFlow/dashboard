<script lang="ts" setup>
import type {
  ListCampaignInput,
  Campaign,
  CampaignQuery
} from "@/generated/graphql/graphql.js";

import type { ComponentExposed } from "vue-component-type-helpers";

import {
  CampaignDocument,
  RemoveCampaignDocument
} from "@/generated/graphql/graphql.js";

import MoleculeTable from "@/components/Molecule/Table/index.vue";

import { useToast } from "@/components/ui/toast/use-toast";

import { columns } from "@/components/Molecule/Table/Columns/campaign";

definePageMeta({
  name: "campaign",
  title: "Campaigns",
  icon: "i-mage-megaphone-a"
});

//================ CONST DATA ================//

const { toast } = useToast();

//================ VARIABLES ================//
const variables = reactive<ListCampaignInput>({
  offset: 0,
  limit: 10,
  sortKey: "createdAt",
  sortValue: "desc",
  filters: []
});
//================ REQUEST ================//

const {
  loading: pending,
  result: data,
  refetch: refetch
} = useQuery<CampaignQuery>(
  CampaignDocument,
  {
    listCampaignInput: variables
  },
  {
    fetchPolicy: "no-cache"
  }
);

const table = useTemplateRef<ComponentExposed<typeof MoleculeTable>>("table");

//================ Functions ================//

async function deleteCampaigns(ids: string[] = []) {
  const result = await useMutation(RemoveCampaignDocument, {
    variables: {
      removeCampaignId: ids
    }
  }).mutate();

  if (result?.data?.removeCampaign) {
    toast({
      title: `Success`,
      description: `Deleted ${ids.length} campaigns`,
      variant: "default"
    });

    table.value?.resetSelectedColumns();

    refetch();
  } else {
    toast({
      title: `Error`,
      description: `Error deleting ${ids.length} campaigns`,
      variant: "destructive"
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
  }
});
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="w-full h-fit flex gap-1 py-2">
      <div class="basis-1/2 flex gap-1">
        <div class="relative w-full max-w-xs items-center">
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
        <MoleculeTableFilter
          title="Status"
          :column="table?.getColumn('status')"
          :options="[
            {
              label: 'Active',
              value: 'ACTIVE',
              icon: 'i-mdi-progress-star-four-points'
            },
            {
              label: 'Paused',
              value: 'PAUSED',
              icon: 'i-mdi-progress-question'
            },
            {
              label: 'Deleted',
              value: 'DELETED',
              icon: 'i-mdi-progress-close'
            },
            { label: 'Ended', value: 'ENDED', icon: 'i-mdi-progress-check' }
          ]"
        />

        <MoleculeTableFilter
          title="End Type"
          :column="table?.getColumn('endType')"
          :options="[
            {
              label: 'Never',
              value: 'NEVER',
              icon: 'i-mage-reload'
            },
            {
              label: 'Date',
              value: 'DATE',
              icon: 'i-mage-alarm-clock'
            },
            {
              label: 'Count',
              value: 'COUNT',
              icon: 'i-mage-lock'
            }
          ]"
        />

        <ShaButton
          v-if="variables.filters.length"
          variant="ghost"
          @click="table?.resetFilters()"
        >
          Reset
          <Icon name="i-material-symbols-close-rounded" class="size-5 ml-1" />
        </ShaButton>
      </div>

      <div class="basis-1/2 justify-end flex gap-1">
        <ShaButton
          variant="secondary"
          :disabled="!table?.haveSelectedRow"
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
          Pause
        </ShaButton>

        <ShaButton
          variant="destructive"
          :disabled="!table?.haveSelectedRow"
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
      class="h-full"
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
      @update:filters="
        ($event) => {
          variables.filters = $event;
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
