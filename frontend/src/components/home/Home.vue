<template>
	<div>
		<page-title icon="fa fa-home" main="Dashboard" sub="Base de Conhecimento">
		</page-title>
		<div class="stats">
			<stat
				title="Categorias"
				:value="stat.categories"
				icon="fa fa-folder"
				color="#d54d50"
			>
			</stat>
			<stat
				title="Artigos"
				:value="stat.articles"
				icon="fa fa-file"
				color="#3bc480"
			>
			</stat>
			<stat
				title="Usuários"
				:value="stat.users"
				icon="fa fa-user"
				color="#3282cd"
			>
			</stat>
		</div>
	</div>
</template>

<script>
import PageTitle from '../template/PageTitle.vue'
import api from '../../services/api'
import Stat from './Stat.vue'

export default {
	name: 'Home',
	components: { PageTitle, Stat },
	data() {
		return {
			stat: {}
		}
	},
	methods: {
		getStats() {
			api.get('/stats')
				.then(res => this.stat = res.data)
		}
	},
	mounted() {
		this.getStats()
	}
}
</script>

<style>
	.stats {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
</style>