<template>
	<div class="bgLogin">
		<div class="login_main">
			<div class="login_main_left">
				<img src="../images/loginwel.png" />
			</div>
			<div class="login_main_right">
				<el-form ref="user" :model="user" class="right_form">
					<p>
						<span>{{user.useText}}</span>
					</p>
					<el-form-item prop="username">
						<el-input type="text" v-model="user.username" auto-complete="off" placeholder="请输入登录账号"></el-input>
					</el-form-item>
					<el-form-item prop="pwd">
						<el-input type="password" v-model="user.pwd" auto-complete="off" placeholder="请输入登录密码"></el-input>
					</el-form-item>
					<el-form-item prop="checkcode">
						<el-input type="text" v-model="user.getcode" auto-complete="off" placeholder="验证码"></el-input>
						<el-button class="text_psd" @click="createCode" v-model="user.checkcode" plain>{{user.checkcode}}</el-button>
					</el-form-item>
					<el-form-item style="width:100%;">
						<el-button class="login_post" type="primary" :loading="loading"  style="width:100%;height:80px;background:#F8B62A;border-radius:40px;font-size:26px;color:#261B1B" @click="login" autofocus>{{loadtext}}</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	var code="";
	export default {
		data() {
			return {
				loading:false,
				loadtext:"登陆",
				user: {
					useText:'',
					username: '',
					pwd: '',
					checkcode: '',
					getcode: ''
				},

			}
		},
		methods: {
			login() {
// 				this.loading=true;
// 				this.loadtext="登陆中...";
// 				setTimeout(()=>{
// 					this.loading=false;
// 					this.loadtext="登陆";
// 					this.$router.push({
// 						path: '/businessManagement'
// 					});
// 				},3000);
				if(this.user.username==""){
					this.user.useText='请输入登录账号 ! ';
				}else if(this.user.pwd==""){
					this.user.useText='请输入登录密码 ! ';
				}else if(this.user.getcode==''){
					this.user.useText='请输入验证码 ! ';
				}else if(this.user.getcode.toLocaleLowerCase()!=this.user.checkcode.toLocaleLowerCase()){
					this.user.useText='您输入的验证码不正确，请重新输入 ! ';
				}else{
					this.user.useText='';
					this.loading=true;
					this.loadtext="登陆中...";
					this.$axios({
			            method: 'post',
			            url: '/system/login',
			            contentType: 'application/json',
			            data: {
			              "userAccount": this.user.username,
			              "password": this.user.pwd
			            }
			         }).then((response)=> {
			            console.log(response);
						if(response.data.code==0){
							this.$notify.success({
								title: '成功',
								message: '登录成功！'
							});
							if(response.data.result.loginUser.menuList!=undefined&&response.data.result.loginUser.menuList.length>0){
								let menuList=JSON.stringify(response.data.result.loginUser.menuList);
								sessionStorage.setItem('menuList',menuList);
							}
							sessionStorage.setItem("token",response.data.result.wkToken);
							sessionStorage.setItem("userName",this.user.username);
							this.$router.push({
								path: '/businessManagement'
							});
 						}else{
							this.$notify.error({
								title: '失败',
								message: '登录失败，请稍后重试！'
							});
						}
						this.loading=false;
						this.loadtext="登陆";
			         }).catch((error)=> {
			            console.log(error);
						this.loading=false;
						this.loadtext="登陆";
						this.$notify.error({
							title: '失败',
							message: '登录失败，请稍后重试！'
						});
			        })
				}
			},
			// 图片验证码
			createCode() {
				//先清空验证码的输入
				this.code = "";
				this.user.checkcode = "";
				this.user.getcode = "";
				//验证码的长度  
				var codeLength = 4;
				//随机数 
				var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
				for(var i = 0; i < codeLength; i++) {
					//取得随机数的索引（0~35）
					var index = Math.floor(Math.random() * 36);
					//根据索引取得随机数加到code上
					this.code += random[index];
				}
				//把code值赋给验证码  
				this.user.checkcode = this.code;
				console.log(this.user.checkcode)
			},
		},
		created(){
			this.createCode();
		}
	}
</script>
<style lang="scss">
	.bgLogin{
		.login_main {
			width: 100%;
			height: 580px;
			position: fixed;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			box-sizing: border-box;
			padding: 0 0 0 210px;
			display: flex;
			min-width: 1490px;
			.login_main_left,
			.login_main_right {
				flex: 1;
			}
			.login_main_left {
				position: relative;
				img {
					display: inline-block;
					position: absolute;
					width: 80%;
					height: auto;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
				}
			}
			.login_main_right {
				.right_form {
					box-sizing: border-box;
					border-top: solid 10px #F8B62A;
					width: 590px;
					height: 100%;
					background: rgba(255, 255, 255, 0.89);
					padding:24px 56px 50px;
					p {
						width: 100%;
						height: 46px;
						box-sizing: border-box;
						padding-left: 15px;
						span {
							display: inline-block;
							width: 100%;
							font-size: 24px;
							line-height: 46px;
							margin-bottom: 22px;
							color: #D22424;
							/*display: none;*/
						}
					}
					.el-input:nth-of-type(1) {
						margin-top: 22px;
					}
					.el-input {
						width: 100%;
						height: 70px;
						box-sizing: border-box;
						padding: 0 30px;
						border: solid 1px #999;
						background: #fff;
						margin-top: 40px;
						input {
							width: 100%;
							height: 100%;
							border: none;
							outline: none;
							font-size: 24px;
						}
					}
					.el-form-item:nth-last-of-type(2) {
						margin-bottom:40px;
						.el-form-item__content{
							display:flex;
							.el-input,.text_psd{
								flex:1;
							}
							.text_psd{
								margin:22px 0 0 10px;
								border:none;
								span{
									font-size:24px;
									color:#999;
								}
							}
						}
					}
				}
			}
		}
	}
</style>