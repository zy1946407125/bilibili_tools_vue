import Vue from 'vue'
import VueRouter from 'vue-router'
import Account from "../views/Account";
import Like from "../views/Like";
import Proxy from "../views/Proxy";
import Watch from "../views/Watch";
import Follow from "../views/Follow";
import GoodsIDAndKey from "../views/GoodsIDAndKey";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Watch',
        component: Watch
    },
    {
        path: '/like',
        name: 'Like',
        component: Like
    },
    {
        path: '/watch',
        name: 'Watch',
        component: Watch
    },
    {
        path: '/follow',
        name: 'Follow',
        component: Follow
    },
    {
        path: '/account',
        name: 'Account',
        component: Account
    },
    {
        path: '/proxy',
        name: 'Proxy',
        component: Proxy
    },
    {
        path: '/goodsIDAndKey',
        name: 'GoodsIDAndKey',
        component: GoodsIDAndKey
    }
]

const router = new VueRouter({
    routes
})

export default router
