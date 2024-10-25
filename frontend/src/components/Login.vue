<template>
  <v-container>
    <v-card max-width="500" class="mx-auto">
      <v-card-actions>
        <v-col>
          <v-text-field v-model="username" label="ユーザ名" type="text">
          </v-text-field>
          <v-text-field v-model="password" label="パスワード" type="password">
          </v-text-field>
          <v-btn color="primary" variant="tonal" @click="login">
            ログイン
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useRouteQuery } from '@vueuse/router';
import { useFetch } from "@vueuse/core";
import { useAuthFetch } from "@/composable/core";

const password = ref("");
const username = ref("");

const router = useRouter();
const redirectUrl = useRouteQuery('redirect', '/');

const { data } = await useFetch('/api/ping').get().json();

const login = async () => {
  const { data, error, statusCode } = await useAuthFetch('/api/login').post({
    username: username.value,
    password: password.value
  }).json();

  if (statusCode.value === 200) {
    router.push(redirectUrl.value);
  } else {
    password.value = "";
  }
}
</script>
