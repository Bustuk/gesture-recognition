import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import InIframe from '../views/InIframe.vue'
import AddNewGesture from '../views/AddNewGesture.vue'
import TrainModel from '../views/TrainModel.vue'
import TestModel from '../views/TestModel.vue'

const routes = [
  { path: '/', component: Home, children: [
    { path: '', component: AddNewGesture },
    { path: 'train-model', component: TrainModel },
    { path: 'test-model', component: TestModel },] 
  },
  { path: '/iframe', component: InIframe },
]

export default createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

