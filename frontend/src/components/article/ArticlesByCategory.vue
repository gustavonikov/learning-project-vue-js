<template>
	<div class="articles-by-category">
		<page-title icon="fa fa-folder-o" :main="category.name" sub="Categoria" />
	
		<ul>
			<li v-for="article in articles" :key="article.id">
				<article-item :article="article" />
			</li>
		</ul>
		<div class="load-more">
			<button v-if="loadMore" class="btn btn-lg btn-outline-primary" @click="getArticles">
				Carregar mais artigos
			</button>
		</div>
	</div>
</template>

<script>
import api from '../../services/api'
import PageTitle from '../template/PageTitle.vue'
import ArticleItem from './ArticleItem.vue'

export default {
	name: 'ArticlesByCategory',
	components: { PageTitle, ArticleItem },
	data() {
		return {
			category: {},
			articles: [],
			page: 1,
			loadMore: true
		}
	},
	watch: {
		$route(to) {
			this.category.id = to.params.id,
			this.articles = []
			this.page = 1
			this.loadMore = true

			this.getCategory()
			this.getArticles()
		}
	},
	methods: {
		getCategory() {
			api.get(`/categories/${this.category.id}`)
				.then(res => this.category = res.data)
		},
		getArticles() {
			api.get(`/categories/${this.category.id}/articles?page=${this.page}`)
				.then(res => {
					this.articles = this.articles.concat(res.data)
					this.page++

					if (res.data.length === 0) this.loadMore = false
				})
		}
	},
	mounted() {
		this.category.id = this.$route.params.id
		this.getCategory()
		this.getArticles()
	}
}
</script>

<style>
	.articles-by-category ul {
		list-style: none;
		padding: 0;
	}

	.articles-by-category .load-more {
		display: flex;
		flex-direction: column;
		align-items: center;

		margin-top: 30px;
	}
</style>