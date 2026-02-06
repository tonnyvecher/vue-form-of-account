import type { Account } from '@/shared/types/accounts'
import { loadFromStorage, saveToStorage } from '@/shared/utils/storage'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'accounts_v1'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>(loadFromStorage<Account[]>(STORAGE_KEY, []))

  const count = computed(() => accounts.value.length)

  function upsert(account: Account) {
    const idx = accounts.value.findIndex((acc) => acc.id === account.id)
    if (idx === -1) accounts.value.push(account)
    else accounts.value[idx] = account
  }

  function remove(id: string) {
    accounts.value = accounts.value.filter((acc) => acc.id !== id)
  }

  watch(accounts, (val) => saveToStorage(STORAGE_KEY, val), { deep: true })

  return {
    accounts,
    count,
    upsert,
    remove,
  }
})
