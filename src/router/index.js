import Vue from 'vue'
import VueRouter from 'vue-router'
import Account from "../views/Account";
import Like from "../views/Like";
import Proxy from "../views/Proxy";
import Watch from "../views/Watch";
import Follow from "../views/Follow";

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
    }
]

const router = new VueRouter({
    routes
})

export default router
