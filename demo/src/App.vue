<template>
  <div>
    <nav>
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      <RouterLink :to="{ name: 'about' }">About</RouterLink>
      <RouterLink :to="{ name: 'account.manage' }">Account</RouterLink>
      <RouterLink :to="{ name: 'account.subscription.view' }">Subscription</RouterLink>
      <RouterLink :to="{ name: 'account.subscription.upgrade.select-new-plan' }">Upgrade</RouterLink>
    </nav>
    <RouterView :key="$route.name" />
  </div>
</template>

<script setup>

</script>
