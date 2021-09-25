<template>
  <div>
    <nav class="h-12 shadow bg-gray-100 flex divide-x items-center">
      <RouterLink class="px-4 py-3 hover:text-blue-500" :to="{ name: 'home' }">Home</RouterLink>
      <RouterLink class="px-4 py-3 hover:text-blue-500" :to="{ name: 'about' }">About</RouterLink>
      <RouterLink class="px-4 py-3 hover:text-blue-500" :to="{ name: 'account.manage' }">Account</RouterLink>
    </nav>
    <div class="p-10">
      <RouterView :key="$route.name" />
    </div>
    <div class="w-1/3 top-5 overflow-auto fixed right-5 bottom-5 p-4 bg-white shadow rounded">
      <pre class="text-xs">{{ $route.matched }}</pre>
    </div>
  </div>
</template>

<script setup>

</script>
