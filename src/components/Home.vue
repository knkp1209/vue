<template>
	<div>
		<el-container class="body">
			<el-header>
				<div class="left">
					<span class="logo">
						<img src="@/assets/logo.svg" />
					</span>
					<span class="menuIconContainer">
						<i class="el-icon-s-fold menuIcon" @click="isCollapse = !isCollapse"></i>
					</span>
				</div>
				<div class="right">
					<el-dropdown @command="handleCommand">
							<span class="el-dropdown-link user">
								{{user}}<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="">退出</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</el-header>
			<el-container class="container-main">
				<el-aside width="200px" v-show="isCollapse">
					<el-menu :default-active="navIndex" background-color="#0f5a9f" text-color="#fff" active-text-color="#ffd04b"
									  :router="true">
						<menu-tree :nodes="nodes"></menu-tree>
					</el-menu>
				</el-aside>
				<el-main v-loading="loading">
					<transition name="el-zoom-in-bottom">
						<router-view/>
					</transition>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>
<script>
	import MenuTree from '@/components/MenuTree'
	import cookie from '@/lib/cookie'

	export default {
		name: 'Home',
		data() {
			return {
				nodes: {},
				user: '',
				isCollapse: true,
			}
		},
		components: {MenuTree},
		created() {
			this.nodes = JSON.parse(window.localStorage.getItem('permission'))[0].children
			this.user = window.localStorage.getItem('user')
			this.getConfig()
		},
		methods: {
			handleCommand(command) {
				this.$http(this.$api.Logout, 'index').then(() => {
					this.logout()
				}).catch(msg => {
					this.$message.error(msg);
					this.logout()
				})
			},
			getConfig() {
				if (this.$store.state.config == false) {
					this.$http(this.$api.Config, 'index').then(({data}) => {
						let obj = {}
						for (let i = 0; i < data.length; i++) {
							obj[data[i].name] = {
								value: data[i].value,
								remark: data[i].remark
							}
						}
						this.$store.commit('Mconfig', obj)
					}).catch(msg => {
						this.$message.error(msg)
					})
				}
			},
			logout() {
				window.localStorage.clear()
				window.location.href = this.$root._router.options.base
				cookie.set('login',0,-1)
			}
		},
		computed: {
			loading() {
				return this.$store.state.loading;
			},
			navIndex() {
				return this.$store.state.navIndex;
			}
		}
	}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.body {
		display: flex;
		flex-flow: column;
		height: 100vh;
	}

	.el-header {
		display: flex;
		position: fixed;
		z-index: 999;
		width: 100%;
		height: 60px;
		background: #0f5a9f;
		align-items: center;
		padding-left: 0px;
	}

	.el-aside .el-menu {
		border-right: solid 0px;
		height: 100%;
	}

	.left {
		width: 200px;
		height: 100%;
		display: flex;
		flex-flow: row;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
	}

	.right {
		display: flex;
		flex: 1;
		flex-direction: row-reverse;
	}

	.logo, .user {
		color: #FFFFFF;
	}

	.logo {
		width: 150px;
		padding: 8px 0px 0px 20px;
	}

	.logo img{
		width: 120px;
	}

	.menuIconContainer {
		cursor: pointer;
		background: #FFF;
		height: 40px;
		width: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.menuIcon{
		cursor: pointer;
		color: #0f5a9f;
		font-size: 30px;
	}

	.user {
		font-size: 20px;
	}

	.container-main {
		margin-top: 60px;
	}
</style>
