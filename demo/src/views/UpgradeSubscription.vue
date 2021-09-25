<template>
  <div>
    <p>Upgrade</p>
    <nav>
      <RouterLink :to="{ name: 'account.subscription.upgrade.select-new-plan' }">Select Plan</RouterLink>
      <RouterLink :to="{ name: 'account.subscription.upgrade.review-payment-method' }">Review Payment Method</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>
