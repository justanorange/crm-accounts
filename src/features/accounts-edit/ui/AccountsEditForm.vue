<script setup lang="ts">
  import { accountTypes, type Account, type AccountType } from '@/entities/account';
  import { useAccountsStore } from '@/app/store';

  const accounts = useAccountsStore();

  const initialData = [
    { tags: 'test;test2', type: 'local', login: 'user1', password: 'password1' },
    { tags: 'test;test2', type: 'local', login: 'user1', password: 'password1' },
    { tags: 'test;test2', type: 'local', login: 'user1', password: 'password1' },
    { tags: 'Значение', type: 'ldap', login: 'Значение' },
    { tags: 'Значение', type: 'ldap', login: 'Значение' },
  ];

  if (accounts.items.length === 0) {
    initialData.forEach(account => {
      /* Для упрощения ts-ignore, так как это просто начальные данные, а не реальный код добавления новой учетной записи. */
      accounts.add({
        /* @ts-ignore */
        type: account.type,
        login: account.login,
        /* @ts-ignore */
        password: account.password,
        tags: account.tags.split(';').map(tag => ({ text: tag.trim() })).filter(tag => tag.text !== ''),
      });
    });
  }

  const deleteAccount = (id: number) => {
    if (confirm('Вы уверены?')) {
      accounts.delete(id);
    }
  };

  const changeTags = (event: Event, id: number) => {
    const input = event.target as HTMLInputElement;
    const tags = input.value.split(';').map(tag => ({ text: tag.trim() })).filter(tag => tag.text !== '');
    accounts.update(id, { tags });
  };

  const changeType = (event: Event, account: Account) => {
    const id = account.id;
    const select = event.target as HTMLSelectElement;
    const type = select.value as AccountType;

    if (account.password !== null && account.password !== '' && type === 'ldap') {
      if (!confirm('При смене типа записи на LDAP, пароль будет удалён. Вы уверены?')) {
        select.value = account.type;
        return;
      }
    }
    accounts.update(id, { type });

    if (type === 'ldap') {
      accounts.update(id, { password: null });
    }
  };

  const changeLogin = (event: Event, id: number) => {
    const input = event.target as HTMLInputElement;
    if (input.value.trim() === '') {
      input.classList.add('required');
      input.value = accounts.items.find(account => account.id === id)?.login || '';
      return;
    }
    input.classList.remove('required');
    accounts.update(id, { login: input.value });
  };

  const changePassword = (event: Event, id: number) => {
    const input = event.target as HTMLInputElement;
    if (input.value.trim() === '') {
      input.classList.add('required');
      input.value = accounts.items.find(account => account.id === id)?.password || '';
      return;
    }
    input.classList.remove('required');
    accounts.update(id, { password: input.value });
  };
  
</script>

<template>
  <div v-if="accounts.items.length === 0">Нет записей для отображения</div>
  <div v-else>
    <div class="notice">
      <div class="icon">?</div>
      <div>Для указания нескольких меток для одной пары логин/пароль используйте разделитель <code>;</code></div>
    </div>

    <div class="accounts">
      <div class="accounts-head">
        <div>Метки</div>
        <div>Тип записи</div>
        <div>Логин</div>
        <div>Пароль</div>
      </div>
      <div class="accounts-item" v-for="account in accounts.items" :key="account.id">
        <div class="account-tags">
          <input
            type="text"
            :value="account.tags.map(tag => tag.text).join(';')"
            maxlength="50"
            @change.lazy="changeTags($event, account.id)"
          >
        </div>
        <div class="account-type">
          <select name="" id="" @change="changeType($event, account)">
            <option
              v-for="type in accountTypes"
              :key="type.value"
              :value="type.value"
              :selected="account.type === type.value"
            >{{ type.label }}</option>
          </select>
        </div>
        <div class="account-login" :class="{'account-login--ldap': account.type === 'ldap'}">
          <input
            type="text"
            maxlength="100"
            :value="account.login"
            @change.lazy="changeLogin($event, account.id)"
            required
          >
        </div>
        <div class="account-password" v-if="account.type === 'local'">
          <input
            type="password"
            maxlength="100"
            :value="account.password"
            @change.lazy="changePassword($event, account.id)"
            required
          >
        </div>
        <div class="account-delete">
          <button
            class="delete-button"
            title="Удалить"
            @click="deleteAccount(account.id)"
          >&times;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
  .notice {
    background-color: rgb(43 142 255 / 0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: 20px;
    margin: 1em 0;

    .icon {
      font-weight: 600;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: rgb(43, 142, 255);
      flex-shrink: 0;
      color: white;
    }
  }

  .accounts {
    display: grid;
    grid-template-columns: repeat(4, 1fr) min-content;
    gap: 8px;
  }

  .accounts-head {
    display: contents;

    div {
      font-weight: 600;
      padding: 8px;
      text-transform: uppercase;
      color: rgb(0 0 0 / 0.5);
      font-size: 12px;

      &:last-child {
        grid-column: span 2;
      }
    }
  }

  .accounts-item {
    display: contents;
  }

  .account-login--ldap {
    grid-column: span 2;
  }

  input, select {
    width: 100%;
    display: block;
    padding: 6px 12px;
    border: 1px solid rgb(0 0 0 / 0.1);
    border-radius: 4px;
    font-size: 16px;
  }

  input.required {
    border-color: rgb(255 43 43);
    background-color: rgb(255 43 43 / 0.1);
  }

  .delete-button {
    font-size: 20px;
    line-height: 1;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    background-color: rgb(50% 50% 50% / 0.1);
    color: rgb(255 43 43);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;

    &:hover {
      background-color: rgb(255 43 43);
      color: white;
    }
  }
</style>
