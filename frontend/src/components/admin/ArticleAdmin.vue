<template>
	<div class="article-admin">
			<b-form>
			<input type="hidden" id="article-id" v-model="article.id" >
			<b-form-group label="Nome:" label-for="article-name">
				<b-form-input 
					id="article-name" 
					type="text" 
					v-model="article.name"
					placeholder="Informe o nome do artigo"
					:readonly="mode === 'remove'"
					required
				/>
			</b-form-group>
			<b-form-group label="Descrição:" label-for="article-description">
				<b-form-input 
					id="article-description" 
					type="text" 
					v-model="article.description"
					placeholder="Informe a descrição do artigo"
					:readonly="mode === 'remove'"
					required
				/>
			</b-form-group>
			<b-form-group label="Imagem (URL):" label-for="article-image" v-show="mode === 'save'">
				<b-form-input 
					id="article-image" 
					type="text" 
					v-model="article.imageUrl"
					placeholder="Insira a imagem para o artigo"
					:readonly="mode === 'remove'"
					required
				/>
			</b-form-group>
			<b-form-group label="Categoria:" label-for="article-category-id" v-if="mode === 'save'">
				<b-form-select id="article-category-id" :options="categories" v-model="article.categoryId">
				</b-form-select>
			</b-form-group>
			<b-form-group label="Autor:" label-for="article-author">
				<b-form-select id="article-author" :options="users" :disabled="mode === 'remove'" v-model="article.userId">
				</b-form-select>
			</b-form-group>
			<b-form-group label="Conteúdo" label-for="category-content">
				<vue-editor v-show="mode === 'save'" v-model="article.content" placeholder="Informe o conteúdo do artigo..."></vue-editor>
			</b-form-group>
			<b-button 
				variant="primary" 
				class="button" 
				v-if="mode === 'save'"
				@click="save"
			>
				Salvar
			</b-button>
			<b-button 
				variant="danger" 
				class="button" 
				v-if="mode === 'remove'"
				@click="remove"
			>
				Excluir
			</b-button>
			<b-button class="ml-3 button" @click="reset">Cancelar</b-button>
		</b-form>
		<hr>
		<b-table hover striped :items="articles" :fields="fields" sort-icon-left>
			<template v-slot:cell(actions)="{ item }">
				<b-button variant="warning" @click="loadArticle(item)" class="mr-2">
					<i class="fa fa-pencil"></i>
				</b-button>
				<b-button variant="danger" @click="loadArticle(item, 'remove')">
					<i class="fa fa-trash"></i>
				</b-button>
			</template>
		</b-table>
		<b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit"></b-pagination>
	</div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import api from '../../services/api'
import showError from '../../utils/showError'

export default {
	name: 'ArticleAdmin',
	components: { VueEditor },
	data() {
		return {
			mode: 'save',
			article: {},
			articles: [],
			categories: [],
			users: [],
			page: 1,
			limit: 0,
			count: 0,
			fields: [
				{ key: 'id', label: 'Código', sortable: true},
				{ key: 'name', label: 'Nome', sortable: true},
				{ key: 'description', label: 'Descrição', sortable: true},
				{ key: 'actions', label: 'Ações' }
			]
		}
	},
	methods: {
		loadArticles() {
			api.get(`articles?page=${this.page}`).then(res => {
				const { data, count, limit } = res.data
				this.articles = data
				this.count = count
				this.limit = limit
			})
		},
		reset() {
			this.mode = 'save'
			this.article = {}
			this.loadArticles()
		},
		save() {
			const method = this.article.id ? 'put' : 'post'
			const id = this.article.id ? `/${this.article.id}` : ''

			console.log(this.article)

			api[method](`/articles${id}`, this.article)
				.then(() => {
					this.$toasted.global.defaultSuccess()
					this.reset()
				})
				.catch(showError)
		},
		remove() {
			const id = this.article.id
			api.delete(`/articles/${id}`)
				.then(() => {
					this.$toasted.global.defaultSuccess()
					this.reset()
				})
				.catch(showError)
		},
		loadArticle(article, mode = 'save') {
			this.mode = mode
			api.get(`/articles/${article.id}`)
				.then(res => this.article = res.data)
		},
		loadCategories() {
			api.get('/categories')
				.then(res => {
					this.categories = res.data.map(category => {
						return {
							value: category.id,
							text: category.path
						}
					})
				})
		},
		loadUsers() {
			api.get('/users')
				.then(res => {
					this.users = res.data.map(user => {
						return {
							value: user.id,
							text: `${user.name} - ${user.email}`
						}
					})
				})
		}
	},
	watch: {
		page() {
			this.loadArticles()
		}
	},
	mounted() {
		this.loadUsers()
		this.loadArticles()
		this.loadCategories()
	}
}
</script>

<style>

</style>