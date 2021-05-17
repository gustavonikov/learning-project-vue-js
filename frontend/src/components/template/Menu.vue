<template>
	<aside class="menu" v-show="isMenuVisible">
		<div class="menu-filter">
			<i class="fa fa-search fa-lg"></i>
			<input type="text" name="" placeholder="Digite para filtrar..." v-model="treeFilter" class="tree-filter">
		</div>
		<Tree :data="treeData" :options="treeOptions" :filter="treeFilter" ref="tree" />
	</aside>
</template>

<script>
import { mapState } from 'vuex'
import Tree from 'liquor-tree'
import api from '../../services/api'

export default {
	name: 'Menu',
	components: { Tree },
	computed: mapState(['isMenuVisible']),
	data() {
		return {
			treeFilter: '',
			treeData: this.getTreeData(),
			treeOptions: {
				propertyNames: {
					'text': 'name'
				},
				filter: {
					emptyText: 'Categoria não encontrada!'
				}
			}
		}
	},
	methods: {
		getTreeData() {
			return api.get('/categories/tree').then(res => res.data)
		},
		onNodeSelect(node) {
			this.$router.push({
				name: 'articlesByCategory',
				params: {id: node.id }
			})
		}
	},
	mounted() {
		this.$refs.tree.$on('node:selected', this.onNodeSelect)
	}
}
</script>

<style>
	.menu {
		grid-area: menu;

		background: linear-gradient(to right, #232526, #414345);

		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		
	}

	.menu span,
	.menu span:hover {
		color: #fff;
	}

	.tree-node.selected > .tree-content {
		background-color: transparent!important;
	} 

	.menu .tree-node.selected > .tree-content:hover,
	.menu .tree-node .tree-content:hover  {
		background-color: rgba(255, 255, 255, .2)!important;
	}

	.tree-arrow.has-child {
		filter: brightness(3);
	}

	.menu .menu-filter {
		display: flex;
		align-items: center;
		justify-content: center;

		margin: 20px;
		padding-bottom: 8px;

		border-bottom: 1px solid #aaa;
	}

	.menu .menu-filter i {
		color: #aaa;
		margin-right: 14px;
	}

	.menu input {
		color: #ccc;
		font-size: 1.3rem;
		border: 0;
		outline: 0;
		width: 100%;
		background: transparent;
	}

	.tree-filter-empty {
		color: #ccc;
		margin-left: 20px;
		font-size: 1.3rem;
	}
</style>