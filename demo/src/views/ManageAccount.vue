<template>
  <div class="flex flex-col space-y-6">
    <h1 class="text-xl">Manage Account</h1>
    <nav class="flex items-center space-x-4">
      <RouterLink class="px-4 py-3 bg-blue-600 text-white hover:text-blue-100" :to="{ name: 'account.subscription.view' }">Subscription</RouterLink>
    </nav>
  </div>
</template>
