<script lang="ts" setup>
import {
  CandidatesDocument,
  RemoveCandidateDocument,
} from "@/generated/graphql/graphql.js";

import { columns } from "@/components/Molecule/Table/Columns/candidate";

import type {
  CandidatesQuery,
  Candidate,
  CandidatesQueryVariables,
} from "@/generated/graphql/graphql.js";

definePageMeta({
  name: "candidates",
  title: "Candidates",
  icon: "i-mage-users",
});

//================ CONST DATA ================//
// const toast = useToast();

//================ VARIABLES ================//
// Selected Rows
const selectedRows = ref<Candidate[]>([]);

//================ REQUEST ================//
const variables = reactive<CandidatesQueryVariables["listCandidateInput"]>({
  offset: 0,
  limit: 13,
  sortKey: "salary",
  sortValue: "asc",
});

const {
  refetch: refetch,
  loading: pending,
  result: data,
} = useQuery<CandidatesQuery>(
  CandidatesDocument,
  {
    listCandidateInput: variables,
  },
  {
    fetchPolicy: "no-cache",
  }
);

//================ Functions ================//

// async function deleteCandidates() {
//   const result = await useMutation(RemoveCandidateDocument, {
//     variables: {
//       removeCandidate: selectedRows.value.map((el) => el?.id),
//     },
//   }).mutate();

//   if (!result?.data?.removeCandidate) {
//     toast.add({
//       title: "Error",
//       description: `Unsuccessful deleting candidate...`,
//       color: "red",
//     });

//     return;
//   }

//   toast.add({
//     title: "Success",
//     description: `Deleted ${selectedRows.value.length} candidates`,
//     color: "primary",
//   });

//   selectedRows.value = [];
//   execute();
// }

// === Table Actions ===
provide("tableActions", {
  edit: (id: string) => {
    console.log("Edit", id);
  },
});

//================ WATCHERS ================//
</script>

<template>
  <MoleculeTable
    class="h-full"
    :columns="columns"
    :data="data?.candidates || []"
    :total="data?.candidatesCount.count || 0"
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
        <ShaButton>
          <Icon name="i-mage-plus" class="size-5 mr-2" />
          Create
        </ShaButton>
      </NuxtLink>
    </Teleport>
  </ClientOnly>
</template>
