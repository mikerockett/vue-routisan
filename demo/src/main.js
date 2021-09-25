import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { Factory, Route, Guard } from 'vue-routisan'
import App from './App.vue'

class MyGuard extends Guard {
  handle(resolve, reject, context) {
    console.log('MyGuard triggered')
    resolve()
  }
}

const views = import.meta.globEager('./views/**/*.vue')
const view = (path) => views[`./views/${path}.vue`].default

Factory.usingResolver(view).withGuards({ MyGuard })

Route.view('/', 'Home').name('home')
Route.view('/about', 'About').guard('MyGuard').name('about')

Route.group({ prefix: 'account', name: 'account' }, () => {
  Route.view('/', 'ManageAccount').name('manage')

  Route.group({ prefix: 'subscription', name: 'subscription' }, () => {
    Route.view('/', 'ViewSubscription').name('view')
    Route.view('cancel', 'CancelSubscription').name('cancel')

    Route.view('upgrade', 'UpgradeSubscription').name('upgrade').children(() => {
      Route.group({ prefix: 'steps' }, () => {
        Route.view('select-new-plan', 'SelectNewPlan').name('select-new-plan')
        Route.view('review-payment-method', 'ReviewPaymentMethod').name('review-payment-method')
      })
    })
  })

  Route.view('cards', 'ManageCards').name('cards')
})

Factory.dump()
Route.dump()

const router = createRouter({
  routes: Factory.routes(),
  history: createWebHistory(),
})

const app = createApp(App)

app.use(router)

app.mount('#app')
