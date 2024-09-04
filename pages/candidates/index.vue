<script lang="ts" setup>
import {
  CandidatesDocument,
  RemoveCandidateDocument,
} from "@/generated/graphql/graphql.js";

import { columns } from "@/components/Organism/Table/Candidate/columns.ts";

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
const toast = useToast();

//================ VARIABLES ================//
// Selected Rows
const selectedRows = ref<Candidate[]>([]);

// Pagination
const sort = ref({ column: "name", direction: "asc" });

//================ REQUEST ================//
const variables = reactive<CandidatesQueryVariables>({
  listCandidateInput: {
    offset: 0,
    limit: 13,
    sortKey: sort.value.column,
    sortValue: sort.value.direction,
  },
});

const {
  refetch: execute,
  loading: pending,
  result: data,
} = useQuery<CandidatesQuery>(CandidatesDocument, variables, {
  fetchPolicy: "no-cache",
});

//================ Functions ================//

async function deleteCandidates() {
  const result = await useMutation(RemoveCandidateDocument, {
    variables: {
      removeCandidate: selectedRows.value.map((el) => el?.id),
    },
  }).mutate();

  if (!result?.data?.removeCandidate) {
    toast.add({
      title: "Error",
      description: `Unsuccessful deleting candidate...`,
      color: "red",
    });

    return;
  }

  toast.add({
    title: "Success",
    description: `Deleted ${selectedRows.value.length} candidates`,
    color: "primary",
  });

  selectedRows.value = [];
  execute();
}

//================ WATCHERS ================//
</script>

<template>
  <OrganismTableCandidateDataTable
    v-if="data?.candidates"
    class="h-full"
    :columns="columns"
    :data="data?.candidates || []"
    :total="data?.candidatesCount.count || 0"
    :loading="pending"
    :limit="variables.listCandidateInput.limit"
    @update:pagination="
      ($event) => {
        variables.listCandidateInput.offset =
          $event.pageIndex * $event.pageSize;
        variables.listCandidateInput.limit = $event.pageSize;
      }
    "
    @update:sorting="
      ($event) => {
        sort.column = $event[0].id;
        sort.direction = !$event[0].desc ? 'asc' : 'desc';
        // execute();
      }
    "
  />

  <ClientOnly>
    <Teleport to="#nav-toolbar">
      <NuxtLink :to="{ name: 'campaign-create' }">
        <ShaButton variant="secondary">
          <Icon name="i-mage-plus" class="size-5 mr-2" />
          Create
        </ShaButton>
      </NuxtLink>
    </Teleport>
  </ClientOnly>
</template>
