<script setup>
import { ref, onMounted } from 'vue';
import { useAuthFetch } from '@/composable/core';

import { useFetch } from '@vueuse/core';

const url = ref("/api/todo");
const todo = ref("");


const { isFetching, error, data } = await useAuthFetch(url, { refetch: true}).get().json();

const addTask = async () => {
  if (todo.value.length === 0 ) return;

  const { data, error, statusCode } = await useAuthFetch("/api/todo").post({
    title: todo.value
  }).json();

  if (statusCode.value === 200) {
    url.value = `/api/todo?id=${data.value.id}`
  }
  todo.value = "";
};

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const toggleTodo = async (item) => {
  const { data, error, statusCode } = await useAuthFetch('/api/todo').put({
    id: item.id,
    title: item.title,
    completed: !item.completed
  }).json();
  
  if (statusCode.value === 200) {
    url.value = `/api/todo?id=${makeid(128)}`
  }
}

</script>

<template>
  <h1>tasks</h1>

  <v-container class="fill-height align-start">
    <v-responsive class="mt-4 mx-auto" max-width="900">
      <v-row>
        <v-text-field label="TODOの追加" v-model="todo" @keyup.enter="addTask"></v-text-field>
      </v-row>
      <v-row v-for="item in data">
        <v-col cols="12">
          <v-card class="py-4" color="surface-variant" :prepend-icon="item.completed ? 'mdi-checkbox-outline' :'mdi-checkbox-blank-outline'" rounded="lg"
            variant="outlined" link @click="toggleTodo(item)">
            <template #image>
              <v-img position="top right" />
            </template>

            <template #subtitle>
              <div class="text-subtitle-1"> {{ item.title }}
              </div>
            </template>

            <v-overlay opacity=".12" scrim="primary" contained model-value persistent />
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>
