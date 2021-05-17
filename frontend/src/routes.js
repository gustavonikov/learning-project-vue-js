import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './components/home/Home.vue'
import AdminPages from './components/admin/AdminPages.vue'
import ArticlesByCategory from './components/article/ArticlesByCategory.vue'
import ArticleById from './components/article/ArticleById.vue'
import Auth from './components/auth/Auth.vue'

import userKey from './utils/userKey'

Vue.use(VueRouter)

const routes = [
	{
		name: 'home',
		path: '/',
		component: Home
	}, 
	{
		name: 'adminPages',
		path: '/admin',
		component: AdminPages,
		meta: { requiresAdmin: true }
	},
	{
		name: 'articlesByCategory',
		path: '/categories/:id/articles',
		component: ArticlesByCategory
	},
	{
		name: 'articleById',
		path: '/articles/:id',
		component: ArticleById
	},
	{
		name: 'auth',
		path: '/auth',
		component: Auth
	}
]

const router = new VueRouter({
	mode: 'history',
	routes
})

router.beforeEach((to, from, next) => {
	const json = localStorage.getItem(userKey)

	if (to.matched.some(record => record.meta.requiresAdmin)) {
		const user = JSON.parse(json)

		// criar função no backend e requerer ela aqui pra validar se o usuário é adm ou não
		user && user.admin ? next() : next({ path: '/' }) 
	} else {
		next() 
	}
})

export default router