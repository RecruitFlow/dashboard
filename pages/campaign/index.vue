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

import { columns } from "@/components/Molecule/Table/Columns/campaign";

definePageMeta({
  name: "campaign",
  title: "Campaigns",
  icon: "i-mage-megaphone-a",
});

//================ CONST DATA ================//

//================ VARIABLES ================//
// const toast = useToast();

// Pagination
const sort = ref({ column: "name", direction: "asc" });

//================ REQUEST ================//
const variables = reactive<ListCampaignInput>({
  offset: 0,
  limit: 10,
  filterKey: null,
  filterValue: null,
  sortKey: sort.value.column,
  sortValue: sort.value.direction,
});

const { loading: pending, result: data } = useQuery<CampaignQuery>(
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

// async function deleteCampaigns() {
//   const result = await useMutation(RemoveCampaignDocument, {
//     variables: {
//       removeCampaignId: selectedRows.value.map((el) => el?.id),
//     },
//   }).mutate();

//   if (result?.data?.removeCampaign) {
//     toast.add({
//       title: "Success",
//       description: `Deleted ${selectedRows.value.length} campaigns`,
//       color: "primary",
//     });

//     selectedRows.value = [];

//     execute();
//   }
// }
</script>

<template>
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
        sort.column = $event[0].id;
        sort.direction = !$event[0].desc ? 'asc' : 'desc';
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
</template>
