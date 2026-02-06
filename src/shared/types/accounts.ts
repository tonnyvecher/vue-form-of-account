export type AccountType = 'LOCAL' | 'LDAP'

export interface LabelItem {
  text: string
}

export interface Account {
  id: string
  labels: LabelItem[]
  type: AccountType
  login: string
  password: string | null
}
