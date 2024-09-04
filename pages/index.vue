<script setup lang="ts">
import {
  RangeAnalyticDocument,
  GroupByFieldDocument,
} from "@/generated/analytic/graphql.js";
import dayjs from "dayjs";
import CustomTooltip from "@/components/Molecule/Chart/Tooltip.vue";
import CustomExperienceTooltip from "@/components/Molecule/Chart/ExperienceTooltip.vue";

import type {
  RangeAnalyticQuery,
  GroupByFieldQuery,
  GroupByFieldQueryVariables,
} from "@/generated/analytic/graphql.js";

definePageMeta({
  name: "index",
  title: "Dashboard",
  icon: "i-mage-dashboard-bar",
});

const { loading: rangeAnalyticPending, result: rangeAnalytic } =
  useQuery<RangeAnalyticQuery>(
    RangeAnalyticDocument,
    {
      range: 31,
    },
    { clientId: "analytic", fetchPolicy: "no-cache" }
  );

const { loading: experienceAnalyticPending, result: experienceAnalytic } =
  useQuery<GroupByFieldQuery>(
    GroupByFieldDocument,
    {
      groupAnalyticInput: { field: "yearsOfExperience" },
    } as GroupByFieldQueryVariables,
    { clientId: "analytic", fetchPolicy: "no-cache" }
  );

const { loading: ageAnalyticPending, result: ageAnalytic } =
  useQuery<GroupByFieldQuery>(
    GroupByFieldDocument,
    {
      groupAnalyticInput: { field: "age" },
    } as GroupByFieldQueryVariables,
    { clientId: "analytic", fetchPolicy: "no-cache" }
  );

const { loading: workLocationAnalyticPending, result: workLocationAnalytic } =
  useQuery<GroupByFieldQuery>(
    GroupByFieldDocument,
    {
      groupAnalyticInput: { field: "workLocation" },
    } as GroupByFieldQueryVariables,
    { clientId: "analytic", fetchPolicy: "no-cache" }
  );
</script>

<template>
  <section class="grid grid-rows-6 grid-cols-6 size-full gap-5">
    <ShaCard
      v-if="!ageAnalyticPending && ageAnalytic"
      class="row-span-3 col-span-2 size-full relative flex flex-col overflow-hidden"
    >
      <ShaCardHeader class="h-10 p-2">
        <ShaCardTitle class="text-md">Candidates By Age</ShaCardTitle>
      </ShaCardHeader>

      <ShaSeparator />

      <ShaCardContent class="size-full grid place-items-center mt-5">
        <ShaBarChart
          index="metric"
          :data="ageAnalytic.GroupByField"
          :categories="['count']"
          :show-grid-line="false"
          :show-legend="false"
          :show-x-axis="false"
          :show-y-axis="false"
          :colors="['black']"
          :custom-tooltip="CustomExperienceTooltip"
        />
      </ShaCardContent>
    </ShaCard>

    <ShaCard
      v-if="!experienceAnalyticPending && experienceAnalytic"
      class="row-span-3 col-span-2 size-full relative flex flex-col overflow-hidden"
    >
      <ShaCardHeader class="h-10 p-2">
        <ShaCardTitle class="text-md">Experiences Rates</ShaCardTitle>
      </ShaCardHeader>

      <ShaSeparator />

      <ShaCardContent class="size-full grid place-items-center mt-5">
        <ShaBarChart
          index="metric"
          :data="experienceAnalytic.GroupByField"
          :categories="['count']"
          :show-grid-line="false"
          :show-legend="false"
          :show-x-axis="false"
          :show-y-axis="false"
          :colors="['black']"
          :custom-tooltip="CustomExperienceTooltip"
        />
      </ShaCardContent>
    </ShaCard>

    <ShaCard
      v-if="!workLocationAnalyticPending && workLocationAnalytic"
      class="row-span-3 col-span-2 size-full relative flex flex-col overflow-hidden"
    >
      <ShaCardHeader class="h-10 p-2">
        <ShaCardTitle class="text-md">Work Location</ShaCardTitle>
      </ShaCardHeader>

      <ShaSeparator />

      <ShaCardContent class="size-full grid place-items-center mt-5">
        <ShaBarChart
          index="metric"
          :data="workLocationAnalytic.GroupByField"
          :categories="['count']"
          :show-grid-line="false"
          :show-legend="false"
          :show-x-axis="false"
          :show-y-axis="false"
          :colors="['black']"
        />
      </ShaCardContent>
    </ShaCard>

    <ShaCard
      v-if="!rangeAnalyticPending && rangeAnalytic"
      class="row-span-3 col-span-6 size-full overflow-hidden flex flex-col"
    >
      <ShaCardHeader class="h-10 py-2 px-3">
        <ShaCardTitle class="text-md">Candidates</ShaCardTitle>
      </ShaCardHeader>

      <ShaSeparator />

      <ShaCardContent class="size-full grid place-items-center mt-5">
        <ShaAreaChart
          :data="rangeAnalytic.candidateRangeAnalytic"
          :categories="['count']"
          :show-grid-line="true"
          :show-legend="true"
          :show-x-axis="false"
          :show-y-axis="false"
          index="date"
          :colors="['green']"
          :custom-tooltip="CustomTooltip"
          :x-formatter="
            (tick, i:number, ticks) => {
              return `${dayjs(rangeAnalytic?.candidateRangeAnalytic[i].date).format(
                'DD MMM'
              )}`;
            }
          "
        />
      </ShaCardContent>
    </ShaCard>
  </section>
</template>
