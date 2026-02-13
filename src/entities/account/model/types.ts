export type AccountType = 'local' | 'ldap';

export interface Account {
  id: number;
  tags: AccountTag[];
  type: AccountType;
  login: string;
  password: string | null;
}

export type AccountTag = {
  text: string;
};

export interface AccountTypeForm {
  value: string;
  label: string;
}

export type AccountCreateForm = Omit<Account, 'id'>;
