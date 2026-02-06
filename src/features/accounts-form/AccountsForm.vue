<template>
  <v-container class="py-6" style="max-width: 980px">
    <div class="d-flex align-center justify-space-between mb-4">
      <h3 class="text-h3">Учетные записи</h3>
      <v-btn :icon="mdiPlus" variant="outlined" @click="addDraft" />
    </div>

    <v-alert type="info" variant="tonal" density="compact" class="mb-4">
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
    </v-alert>

    <div class="d-flex text-caption text-medium-emphasis mb-2">
      <div style="width: 260px">Метки</div>
      <div style="width: 160px">Тип записи</div>
      <div style="width: 260px">Логин</div>
      <div style="width: 240px">Пароль</div>
      <div style="width: 60px"></div>
    </div>

    <AccountRow
      v-for="row in rows"
      :key="row.id"
      :initial="row"
      :isDraft="draftIds.has(row.id)"
      @save="onSave"
      @delete="onDelete"
    />
  </v-container>
</template>

<script setup lang="ts">
import type { Account } from '@/shared/types/accounts'
import AccountRow from './AccountRow.vue'
import { useAccountsStore } from '@/stores/accounts.store'
import { computed, reactive } from 'vue'
import { mdiPlus } from '@mdi/js'

type DraftAccount = Account

const store = useAccountsStore()

const drafts = reactive<DraftAccount[]>([])
const draftIds = computed(() => new Set(drafts.map((draft) => draft.id)))

const rows = computed<Account[]>(() => [...store.accounts, ...drafts])

const newId = (): string => crypto.randomUUID()

const addDraft = () => {
  drafts.push({
    id: newId(),
    labels: [],
    type: 'LOCAL',
    login: '',
    password: '',
  })
}

const onSave = (account: Account) => {
  const idx = drafts.findIndex((draft) => draft.id === account.id)
  if (idx !== -1) drafts.splice(idx, 1)
  store.upsert(account)
}

const onDelete = (payload: { id: string; isDraft: boolean }) => {
  if (payload.isDraft) {
    const idx = drafts.findIndex((draft) => draft.id === payload.id)
    if (idx !== -1) drafts.splice(idx, 1)
    return
  }
  store.remove(payload.id)
}
</script>
