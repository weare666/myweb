<template>
	<div class="z-index" style="height: 100%;">
		<div class="layout" style="height: 100%;">
			<div class="layout_box">
				<el-container>
					<el-header>
						<header class="header">
							<div class="header__logo">
								<div class="chinaunion_red">
									<img src="../images/chinaunion_red.png" style="max-height: 100%;max-width: 100%;">
								</div>
							</div>
							<ul class="header__user-center">
								<li>
									<el-dropdown trigger="click">
										<span class="el-dropdown-link">
			                            	<i class="el-icon-fa fa-user"></i>
			                            	<span class="el-dropdown-name">{{userName}}</span>
										</span>
										<el-dropdown-menu slot="dropdown">
											<!--<el-dropdown-item><span @click="">修改密码</span></el-dropdown-item>-->
											<el-dropdown-item><span @click="exit" style="display: block;">退出登录</span></el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</li>
							</ul>
						</header>
					</el-header>
					<el-container>
						<el-aside width="200px">
							<aside class="menu-tree">
								<el-menu :router="true" :default-active="adminleftnavnum" :collapse="isCollapse" :unique-opened="true">
									<el-submenu v-for="(t1,v1) in menuList" :key="v1" :index="v1++ +''">
										<template slot="title">
											<i :class="t1.bgMenuIcon"></i>
											<span slot="title">{{t1.bgMenuName}}</span>
										</template>
										<el-menu-item-group>
											<el-menu-item v-for="(t2,v2) in t1.childMenuList" :key="v2" :index="t2.bgMenuUrl">{{t2.bgMenuName}}</el-menu-item>
										</el-menu-item-group>
									</el-submenu>
								</el-menu>
							</aside>
						</el-aside>
						<el-container>
							<el-main>
								<!--内容-->
								<router-view></router-view>
							</el-main>
							<!--<el-footer>
								底部
								<div class="footer">
									<p>Copyright © 2017 CUSC WHRD Center All Rights Reserved</p>
								</div>
							</el-footer>-->
						</el-container>
					</el-container>
				</el-container>
			</div>
		</div>

	</div>
</template>

<script>
	import { mapActions } from "vuex";
	import { mapState } from "vuex";
	export default {
		data() {
			return {
				isCollapse: false,
				userName: sessionStorage.userName,
				adminleftnavnum:"",
				menuList:[]
			}
		},
		methods: {
			getMenuList(){
				let menuList=sessionStorage.menuList;
				if(menuList!=undefined){
					menuList=JSON.parse(menuList);
					this.menuList=menuList[0].childMenuList;
					this.adminleftnavnum='/'+this.$route.path.substr(1);
				}else{
					this.$confirm('获取个人导航列表失败，是否重新登录？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						// 返回登录页
						this.$router.push({
							path: '/'
						});
					}).catch(()=>{
						
					})
				}
			},
			sum(data){
				console.log(data);
			},
			exit() {
				this.$confirm('是否退出？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '我再考虑一下',
					type: 'info'
				}).then(() => {
					// 返回登录页
					this.$router.push({
						path: '/'
					});
				}).catch(()=>{
					
				})
			},
		},
		created(){
			this.getMenuList();
		},
	}	
</script>