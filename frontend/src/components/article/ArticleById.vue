<template>
	<div class="article-by-id">
		<page-title icon="fa fa-file-o" :main="article.name" :sub="article.description" />
		<div class="article-content" v-html="article.content">

		</div>
	</div>
</template>

<script>
import api from '../../services/api'
import PageTitle from '../template/PageTitle.vue'

export default {
	name: 'ArticleById',
	components: { PageTitle },
	data() {
		return {
			article: {}
		}
	},
	mounted() {
		api.get(`/articles/${this.$route.params.id}`)
			.then(res => this.article = res.data)
			.catch(error => console.log(error))
	}
}
</script>

<style>
	.article-content {
		background-color: #fff;
		border-radius: 8px;
		padding: 25px;
	}

	.article-content pre {
		padding: 20px;
		border-radius: 8px;
		font-size: 1.2rem;

		background-color: #1e1e1e;
		color: #fff;
	}

	.article-content img {
		max-width: 100%;
	}

	.article-content :last-child {
		margin-bottom: 0;
	}
</style>