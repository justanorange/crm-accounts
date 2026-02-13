<script setup lang="ts">
import { useAccountsStore } from '@/app/store';
import AccountsEditForm from '@/features/accounts-edit/ui/AccountsEditForm.vue';

const accounts = useAccountsStore();

const addNew = () => {
  accounts.addNew();
};
</script>

<template>
  <header>
    <h1>Учётные записи</h1>
    <button title="Добавить учётную запись" @click="addNew">+</button>
  </header>

  <AccountsEditForm />
</template>

<style scoped>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    button {
      font-size: 20px;
      line-height: 1;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgb(43 142 255);
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
    }
  }

  h1 {
    font-size: 24px;
    margin: 0;
  }
</style>