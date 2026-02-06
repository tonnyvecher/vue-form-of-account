import type { LabelItem } from '../types/accounts'

export function parseLabels(input: string): LabelItem[] {
  return input
    .split(';')
    .map((string) => string.trim())
    .filter(Boolean)
    .map((text) => ({ text }))
}

export function labelsToInput(labels: LabelItem[]): string {
  return labels.map((label) => label.text).join('; ')
}
