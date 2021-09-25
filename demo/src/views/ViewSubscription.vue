<template>
  <div class="flex flex-col space-y-6">
    <h1 class="text-xl">Subscription</h1>
    <nav class="flex items-center space-x-4">
      <RouterLink class="px-4 py-3 bg-blue-600 text-white hover:text-blue-100" :to="{ name: 'account.subscription.upgrade.start' }">Upgrade</RouterLink>
      <RouterLink class="px-4 py-3 bg-red-600 text-white hover:text-red-100" :to="{ name: 'account.subscription.cancel' }">Cancel</RouterLink>
    </nav>
  </div>
</template>
