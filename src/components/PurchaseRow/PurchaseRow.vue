<template>
  <div class="q-mb-sm shadow-1 rounded-borders cursor-pointer">
    <div class="column-xs row-sm q-px-lg q-py-sm no-wrap">
      <div class="row items-center">
        <q-checkbox v-model="temp" v-if="true" dense size="sm" />
        <div
          class="column q-gutter-sm-x-md text-weight-regular text-mp-white-0"
        >
          <q-chip
            color="mp-white-0"
            dense
            text-color="mp-red-0"
            style="width: 80px; max-width: 80px"
          >
            <div class="text-caption text-mp-blue-1" data-test="date">
              {{ date }}
            </div>
          </q-chip>
          <div
            class="text-subtitle2 text-weight-medium text-lowercase text-mp-white-0 mp-purchase-line"
            data-test="title"
          >
            {{ title }}
          </div>
        </div>
      </div>
      <q-space />
      <div class="column justify-end q-mt-xs-md">
        <!-- <div class="row q-gutter-x-xs">
                    <q-chip
                      v-for="tag in p.attributes.tags.data"
                      :key="tag.id"
                      :label="tag.attributes.name"
                      dense
                      removable
                      clickable
                      icon="sell"
                      color="mp-white-0"
                      text-color="primary"
                      @remove="
                        handleTagRemove(
                          { id: tag.id, ...tag.attributes },
                          {
                            id: p.id,
                            ...p.attributes,
                          }
                        )
                      "
                    />
                  </div> -->
        <div class="row items-center q-gutter-x-sm">
          <q-chip
            color="mp-white-0"
            dense
            text-color="mp-red-0"
            icon="paid"
            style="width: 90px; max-width: 90px"
          >
            <span data-test="price"> {{ price }}</span>
          </q-chip>
          <q-chip
            :color="isShared ? 'warning' : 'positive'"
            dense
            text-color="primary"
            icon="account_circle"
            style="width: 120px; max-width: 120px"
          >
            <q-space />
            <div class="text-caption" v-if="isShared" data-test="shared">
              DIVIDIDA
              <q-tooltip max-height="40px" data-test="shared.names">{{
                purchasers.map((p) => p.name).join(' - ')
              }}</q-tooltip>
            </div>
            <div class="text-caption" v-else data-test="purchaser.name">
              {{ purchaser.name.toUpperCase() }}
            </div>
            <q-space />
          </q-chip>
          <q-icon
            name="more_horiz"
            color="mp-white-0"
            size="sm"
            class="cursor-pointer"
            v-ripple
            data-test="divide.icon"
          >
            <q-menu auto-close :class="{ 'z-max': $q.screen.lt.md }">
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  @click="$emit('dividePurchaseClick', purchaseId)"
                >
                  <q-item-section avatar>
                    <q-icon name="safety_divider" color="primary" />
                  </q-item-section>
                  <q-item-section> Dividir Compra </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./PurchaseRow.ts" />
