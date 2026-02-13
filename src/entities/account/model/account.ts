import type { AccountType } from './types';

export const accountTypes: { value: AccountType; label: string }[] = [
  { value: 'local', label: 'Локальная' },
  { value: 'ldap', label: 'LDAP' },
];
