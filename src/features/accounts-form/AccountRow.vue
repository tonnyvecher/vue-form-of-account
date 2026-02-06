<template>
  <div class="d-flex align-center ga-2 mb-3">
    <v-text-field
      v-model="labelInput"
      placeholder="XXX; YYY; ZZZ"
      variant="outlined"
      density="compact"
      hide-details="auto"
      :error="errors.label"
      :maxlength="50"
      style="width: 260px"
      @blur="validateAndMaybeSave('label')"
    />

    <v-select
      v-model="type"
      :items="typeItems"
      item-title="title"
      item-value="value"
      variant="outlined"
      density="compact"
      hide-details="auto"
      style="width: 160px"
      @update:model-value="onTypeChange"
    />

    <v-text-field
      v-model="login"
      placeholder="Значение"
      variant="outlined"
      density="compact"
      hide-details="auto"
      :error="errors.login"
      :maxlength="100"
      style="width: 260px"
      @blur="validateAndMaybeSave('login')"
    />

    <div style="width: 240px">
      <v-text-field
        v-if="type === 'LOCAL'"
        v-model="password"
        placeholder="••••••••"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
        density="compact"
        hide-details="auto"
        :error="errors.password"
        :maxlength="100"
        :append-inner-icon="showPassword ? mdiEyeOff : mdiEye"
        @click:append-inner="showPassword = !showPassword"
        style="width: 260px"
        @blur="validateAndMaybeSave('password')"
      />

      <div v-else class="text-caption text-medium-emphasis" style="padding: 10px 0"></div>
    </div>

    <v-btn
      :icon="mdiDeleteOutline"
      variant="text"
      @click="$emit('delete', { id: initial.id, isDraft })"
      style="margin: 20px"
    />
  </div>
</template>

<script setup lang="ts">
import type { Account, AccountType } from '@/shared/types/accounts'
import { labelsToInput, parseLabels } from '@/shared/utils/labels'
import { onMounted, reactive, ref } from 'vue'
import { mdiEye, mdiEyeOff, mdiDeleteOutline } from '@mdi/js'

interface Props {
  initial: Account
  isDraft: boolean
}

interface Emits {
  (e: 'save', account: Account): void
  (e: 'delete', payload: { id: string; isDraft: boolean }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const typeItems = [
  { title: 'Локальная', value: 'LOCAL' },
  { title: 'LDAP', value: 'LDAP' },
] as const

const labelInput = ref('')
const type = ref<AccountType>('LOCAL')
const login = ref('')
const password = ref<string>('')
const showPassword = ref(false)

const errors = reactive({
  label: false,
  login: false,
  password: false,
})

onMounted(() => {
  labelInput.value = labelsToInput(props.initial.labels)
  type.value = props.initial.type
  login.value = props.initial.login
  password.value = props.initial.password ?? ''
})

const validateAll = (): boolean => {
  errors.label = false
  errors.login = false
  errors.password = false

  if (labelInput.value.length > 50) errors.label = true

  const loginTrimmed = login.value.trim()
  if (!loginTrimmed || loginTrimmed.length > 100) errors.login = true

  if (type.value === 'LOCAL') {
    const pass = password.value
    if (!pass || pass.length > 100) errors.password = true
  }

  return !(errors.label || errors.login || errors.password)
}

const buildAccount = (): Account => {
  const labels = parseLabels(labelInput.value)
  return {
    id: props.initial.id,
    labels,
    type: type.value,
    login: login.value.trim(),
    password: type.value === 'LOCAL' ? password.value : null,
  }
}

const validateAndMaybeSave = (_field: 'label' | 'login' | 'password') => {
  const ok = validateAll()
  if (!ok) return

  emit('save', buildAccount())
}

const onTypeChange = () => {
  if (type.value === 'LDAP') password.value = ''

  validateAndMaybeSave('password')
}
</script>
