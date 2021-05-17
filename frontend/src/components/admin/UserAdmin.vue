<template>
	<div class="user-admin">
		<b-form>
			<input type="hidden" id="user-id" v-model="user.id" >
			<b-row>
				<b-col md="6" sm="12">
					<b-form-group label="Nome:" label-for="user-name">
						<b-form-input 
							id="user-name" 
							type="text" 
							v-model="user.name"
							placeholder="Informe o nome do usuário"
							:readonly="mode === 'remove'"
							required
						/>
					</b-form-group>
				</b-col>
				<b-col md="6" sm="12">
					<b-form-group label="E-mail:" label-for="user-email">
						<b-form-input 
							id="user-email" 
							type="text" 
							v-model="user.email"
							placeholder="Informe o e-mail do usuário"
							:readonly="mode === 'remove'"
							required
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-form-checkbox id="user-admin" v-show="mode === 'save'" v-model="user.admin" class="mt-2 mb-3">
				Administrador ?
			</b-form-checkbox>
			<b-row v-show="mode === 'save'">
				<b-col md="6" sm="12">
					<b-form-group label="Senha:" label-for="user-password">
						<b-form-input 
							id="user-password" 
							type="password" 
							v-model="user.password"
							placeholder="Informe a senha do usuário"
							required
						/>
					</b-form-group>
				</b-col>
				<b-col md="6" sm="12">
					<b-form-group label="Confirmação de senha:" label-for="user-confirm-password">
						<b-form-input 
							id="user-confirm-password" 
							type="password" 
							v-model="user.confirmPassword"
							placeholder="Confirme a senha"
							required
						/>
					</b-form-group>
				</b-col>
			</b-row>
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
		<b-table hover striped :items="users" :fields="fields" sort-icon-left>
			<template v-slot:cell(actions)="{ item }">
				<b-button variant="warning" @click="loadUser(item)" class="mr-2">
					<i class="fa fa-pencil"></i>
				</b-button>
				<b-button variant="danger" @click="loadUser(item, 'remove')">
					<i class="fa fa-trash"></i>
				</b-button>
			</template>
		</b-table>
	</div>
</template>

<script>
import api from '../../services/api'
import showError from '../../utils/showError'

export default {
	name: 'UserAdmin',
	data() {
		return {
			mode: 'save',
			user: {},
			users: [],
			fields: [
				{ key: 'id', label: 'Código', sortable: true},
				{ key: 'name', label: 'Nome', sortable: true},
				{ key: 'email', label: 'E-mail', sortable: true},
				{ key: 'admin', label: 'Administrador', sortable: true, 
					formatter: value => value ? 'Sim' : 'Não'
				},
				{ key: 'actions', label: 'Ações' }
			]
		}
	},
	methods: {
		loadUsers() {
			api.get('users').then(res => this.users = res.data)
		},
		reset() {
			this.mode = 'save'
			this.user = {}
			this.loadUsers()
		},
		save() {
			const method = this.user.id ? 'put' : 'post'
			const id = this.user.id ? `/${this.user.id}` : ''

			api[method](`/users${id}`, this.user)
				.then(() => {
					this.$toasted.global.defaultSuccess()
					this.reset()
				})
				.catch(showError)
		},
		remove() {
			const id = this.user.id
			api.delete(`/users/${id}`)
				.then(() => {
					this.$toasted.global.defaultSuccess()
					this.reset()
				})
				.catch(showError)
		},
		loadUser(user, mode = 'save') {
			this.mode = mode
			this.user = { ...user }
			console.log(user)
		}
	},
	mounted() {
		this.loadUsers()
	}
}
</script>

<style>
	.button {
		width: 90px;
	}
</style>