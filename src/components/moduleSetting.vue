<template>
	<!--  @tab-click="handleClick" -->
	<el-tabs v-model="activeName" v-loading="topLoading" element-loading-text="拼命加载中">
		<el-tab-pane label="配置服务协议" name="first">
			<el-row>
				<quill-editor v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)">
				</quill-editor>
			</el-row>
			<el-row style="margin-top:20px;text-align:right;">
				<el-button type="primary" @click="submit" v-show="show">保存</el-button>
				<el-button type="primary" icon="el-icon-edit" @click="protocolConfiguration" v-show="click">编辑</el-button>
			</el-row>
		</el-tab-pane>
		<el-tab-pane label="帮助" name="second">
			<el-row>
				<quill-editor v-model="content1" ref="myQuillEditor1" :options="editorOption1" @blur="onEditorBlur1($event)" @focus="onEditorFocus1($event)" @change="onEditorChange1($event)">
				</quill-editor>
			</el-row>
			<el-row style="margin-top:20px;text-align:right;"> 
				<el-button type="primary" @click="submit1" v-show="show1">保存</el-button>
				<el-button type="primary" icon="el-icon-edit" @click="protocolConfiguration1" v-show="click1">编辑</el-button>
			</el-row>
			<el-row style="border-bottom:solid 1px #999;line-height:50px;margin-bottom:20px;">设置添加的微信号</el-row>
			<el-row style="padding:0 400px;">
				<el-col :span="12">
					<el-row>
						<el-col :span="12" style="text-align:right;padding-right:20px;">客服微信号 : </el-col>
						<el-col :span="12">
							<img src="../images/ImportedLayers.png" style="width:100px;height:100px;margin-left:10px;cursor:pointer;" @click="centerDialogVisible=true" />
							<p style="color:#409EFF;line-height:50px;cursor:pointer;" @click="centerDialogVisible=true">点击 上传/修改 图片</p>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="12">
					<el-row>
						<el-col :span="12" style="text-align:right;padding-right:20px;">平台公众号 : </el-col>
						<el-col :span="12">
							<img src="../images/ImportedLayers.png" style="width:100px;height:100px;margin-left:10px;cursor:pointer;" @click="centerDialogVisible1=true" />
							<p style="color:#409EFF;line-height:50px;cursor:pointer;" @click="centerDialogVisible1=true">点击 上传/修改 图片</p>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</el-tab-pane>

		<!--客服微信弹出层-->
		<el-dialog title="添加客服微信二维码图片" class="module_dialog" :visible.sync="centerDialogVisible" v-loading="picLoading" width="500px" :show-close="false">
			<el-row style="margin-bottom:20px;">
				<el-col :span="12" style="min-width: 280px;max-width: 280px;">
					<!-- <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload> -->
					<div :class="class1">
						<el-input id="file" type="file" accept="image/*" @change="imgChange"></el-input>
						<img :src="img1" alt="">
					</div>
				</el-col>
				<el-col :span="12" style="min-width: 180px;max-width: 180px;">
					<img :src="img2" style=" width: 150px;height: 150px;float:right;margin-top: 128px;" />
				</el-col>
			</el-row>
			<el-row>请添加大小不要超过2M的图片，右侧为图片预览。</el-row>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
			    <el-button type="primary" @click="picSave1">保 存</el-button>
			    <el-button @click="centerDialogVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		
		<!--公众号弹出层-->
		<el-dialog title="添加微信公众号二维码图片" class="module_dialog" :visible.sync="centerDialogVisible1" v-loading="picLoading1" width="500px" :show-close="false">
			<el-row style="margin-bottom:20px;">
				<el-col :span="12" style="min-width: 280px;max-width: 280px;">
					<!-- <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload> -->
					<div :class="class2">
						<el-input id="file1" type="file" accept="image/*" @change="imgChange1"></el-input>
						<img :src="img3" alt="">
					</div>
				</el-col>
				<el-col :span="12" style="min-width: 180px;max-width: 180px;">
					<img :src="img4" style=" width: 150px;height: 150px;float:right;margin-top: 128px;" />
				</el-col>
			</el-row>
			<el-row>请添加大小不要超过2M的图片，右侧为图片预览。</el-row>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
			    <el-button type="primary" @click="picSave2">保 存</el-button>
			    <el-button @click="centerDialogVisible1 = false">取 消</el-button>
			</div>
		</el-dialog>

	</el-tabs>
</template>
<script>
	import { quillEditor } from 'vue-quill-editor'
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],
		['blockquote', 'code-block'],
		[{
			'header': 1
		}, {
			'header': 2
		}],
		[{
			'list': 'ordered'
		}, {
			'list': 'bullet'
		}],
		[{
			'script': 'sub'
		}, {
			'script': 'super'
		}],
		[{
			'indent': '-1'
		}, {
			'indent': '+1'
		}],
		[{
			'direction': 'rtl'
		}],
		[{
			'size': ['small', false, 'large', 'huge']
		}],
		[{
			'header': [1, 2, 3, 4, 5, 6, false]
		}],
		[{
			'font': []
		}],
		[{
			'color': []
		}, {
			'background': []
		}],
		[{
			'align': []
		}],
		//      ['clean'],
		['link', 'image', 'video']
	];
	export default {
		data() {
			return {
				activeName: 'first',
				picLoading:false,
				picLoading1:false,
				topLoading:false,
				class1:'upload_box',
				img1:'',
				img2:require('../images/ImportedLayers.png'),
				class2:'upload_box',
				img3:'',
				img4:require('../images/ImportedLayers.png'),
				content: '',
				show: false,
				set: false,
				click: true,
				editorOption: {
					placeholder: '请输入《服务协议》的详细内容。',
					theme: 'snow', // or 'bubble'
					modules: {
						toolbar: toolbarOptions
					}
				},
				content1: '',
				show1: false,
				set1: false,
				click1: true,
				editorOption1: {
					placeholder: '请输入《租房说明》的详细内容。',
					theme: 'snow', // or 'bubble'
					modules: {
						toolbar: toolbarOptions
					}
				},
				centerDialogVisible: false,
				imageUrl: '',
				centerDialogVisible1: false,
				imageUrl1: ''
			};
		},
		computed: {
			editor() {
				return this.$refs.myQuillEditor.quill
			},
			editor1() {
				return this.$refs.myQuillEditor1.quill
			}
		},
		created() {
			this.getservice();
			this.getrental();
		},
		methods: {
			//			quillImgSuccess(res, file) { // 富文本编辑框图片上传
			//				// console.log(URL.createObjectURL(file.raw));
			//				// this.form.icon = URL.createObjectURL(file.raw);
			//				// res为图片服务器返回的数据
			//				// 获取富文本组件实例
			//				let quill = this.$refs.myQuillEditor.quill
			//				// 如果上传成功
			//				if(res.errno == '0') {
			//					// 获取光标所在位置
			//					let length = quill.getSelection().index;
			//					// 插入图片  res.data为服务器返回的图片地址
			//					quill.insertEmbed(length, 'image', res.data)
			//					// 调整光标到最后
			//					quill.setSelection(length + 1)
			//				} else {
			//					this.$message.error('图片插入失败')
			//				}
			//			},
			//tab点击切换时执行	
// 			handleClick(tab, event) {
// 				console.log(tab, event);
// 			},
			// 获取服务协议
			getservice(){
				this.$axios({
					method: 'post',
					url: '/moduleSetting/queryAgreement',
					contentType: 'application/json',
					headers:{
						"wkToken":sessionStorage.token,
					},
				}).then((response) => {
					if(response.data.code==0){
						if(response.data.result.bgModuleValue!=null&&response.data.result.bgModuleValue!=undefined){
							this.content=response.data.result.bgModuleValue;
						}	
					}else if(response.data.code == (-999)){
						this.$confirm('token已失效，请重新登录！', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$router.push({
								path: '/'
							});
						}).catch(() => {
							this.$notify.error({
								title: '失败',
								message: '获取服务协议失败，请稍后重试！'
							});
						});
					} else{
						this.$notify.error({
							title: '失败',
							message: '获取服务协议失败，请稍后重试！'
						});
					}
				}).catch((error) => {
					console.log(error);
					this.$notify.error({
						title: '失败',
						message: '获取服务协议失败，请稍后重试！'
					});
				})
			},
			getrental(){
				this.$axios({
					method: 'post',
					url: '/moduleSetting/queryRentExplain',
					contentType: 'application/json',
					headers:{
						"wkToken":sessionStorage.token,
					},
				}).then((response) => {
					if(response.data.code==0){
						if(response.data.result.bgModuleValue!=null&&response.data.result.bgModuleValue!=undefined){
							this.content1=response.data.result.bgModuleValue;
						}
					}else if(response.data.code == (-999)){
						this.$confirm('token已失效，请重新登录！', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$router.push({
								path: '/'
							});
						}).catch(() => {
							this.$notify.error({
								title: '失败',
								message: '获取租房说明失败，请稍后重试！'
							});
						});
					}else{
						this.$notify.error({
							title: '失败',
							message: '获取租房说明失败，请稍后重试！'
						});
					}
				}).catch((error) => {
					console.log(error);
					this.$notify.error({
						title: '失败',
						message: '获取租房说明失败，请稍后重试！'
					});
				})
			},
			onEditorBlur(editor) { //失去焦点事件    
			},
			onEditorFocus(editor) { //获得焦点事件
				editor.enable(this.set);
			},
			onEditorChange({
				editor,
				html,
				text
			}) { //富文本编辑器  文本改变时 设置字段值
				this.content = html
			},
			protocolConfiguration() {
				this.set = true;
				this.show = true;
				this.click = false;
				this.$refs.myQuillEditor.quill.enable(this.set);
				this.$refs.myQuillEditor.quill.focus();
			},
			submit() {
				let cont=this.content;
				if(cont==''){
					this.$notify.error({
						title: '失败',
						message: '请输入服务协议！'
					});
				}else{
					this.topLoading=true;
					this.$axios({
						method: 'post',
						url: '/moduleSetting/saveAgreement',
						contentType: 'application/json',
						headers:{
							"wkToken":sessionStorage.token,
						},
						data:{
							"bgModuleType":'1',
							"bgModuleValue":cont
						}
					}).then((response) => {
						if(response.data.code==0){
							this.$notify.success({
								title: '成功',
								message: '保存服务协议成功！'
							});
						}else if(response.data.code == (-999)){
							this.$confirm('token已失效，请重新登录！', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								this.$router.push({
									path: '/'
								});
							}).catch(() => {
								this.$notify.error({
									title: '失败',
									message: '保存服务协议失败，请稍后重试！'
								});
							});
						}else{
							this.$notify.error({
								title: '失败',
								message: '保存服务协议失败，请稍后重试！'
							});
						}
						this.topLoading=false;
					}).catch((error) => {
						console.log(error);						
						this.topLoading=false;
						this.$notify.error({
							title: '失败',
							message: '保存服务协议失败，请稍后重试！'
						});
					})
				}
			},
			onEditorBlur1(editor1) { //失去焦点事件    
			},
			onEditorFocus1(editor1) { //获得焦点事件
				editor1.enable(this.set1);
			},
			onEditorChange1({
				editor,
				html,
				text
			}) { //富文本编辑器  文本改变时 设置字段值
				this.content1 = html
			},
			protocolConfiguration1() {
				this.set1 = true;
				this.show1 = true;
				this.click1 = false;
				this.$refs.myQuillEditor1.quill.enable(this.set1);
				this.$refs.myQuillEditor1.quill.focus();
			},
			submit1() {
				let cont=this.content1;
				if(cont==''){
					this.$notify.error({
						title: '失败',
						message: '请输入服务协议！'
					});
				}else{
					this.topLoading=true;
					this.$axios({
						method: 'post',
						url: '/moduleSetting/saveRentExplain',
						contentType: 'application/json',
						headers:{
							"wkToken":sessionStorage.token,
						},
						data:{
							"bgModuleType":'2',
							"bgModuleValue":cont
						}
					}).then((response) => {
						if(response.data.code==0){
							this.$notify.success({
								title: '成功',
								message: '保存服务协议成功！'
							});
						}else if(response.data.code == (-999)){
							this.$confirm('token已失效，请重新登录！', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								this.$router.push({
									path: '/'
								});
							}).catch(() => {
								this.$notify.error({
									title: '失败',
									message: '保存服务协议失败，请稍后重试！'
								});
							});
						}else{
							this.$notify.error({
								title: '失败',
								message: '保存服务协议失败，请稍后重试！'
							});
						}
						this.topLoading=false;
					}).catch((error) => {
						console.log(error);						
						this.topLoading=false;
						this.$notify.error({
							title: '失败',
							message: '保存服务协议失败，请稍后重试！'
						});
					})
				}
			},

			handleAvatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
			},
			imgChange(){
				let file=document.getElementById('file').files[0];
				let src=URL.createObjectURL(file);
				this.class1='upload_box hide_plus';
				this.img1=src;
				this.img2=src;
			},
			picSave1(){
				let file=document.getElementById('file').files[0];
				if(file!=undefined){
					this.picLoading=true;
					this.uploadImg(file,'/moduleSetting/serviceUpload',(data)=>{
						console.log(data);
						if(data!='false'){
							this.centerDialogVisible=false;
							this.$notify.success({
								title: '成功',
								message: '添加客服微信二维码图片成功！'
							});
						}
						this.picLoading=false;
					});
				}else{
					this.$notify.error({
						title: '失败',
						message: '请上传一张图片后再试！'
					});
				}
			},
			imgChange1(){
				let file=document.getElementById('file1').files[0];
				let src=URL.createObjectURL(file);
				this.class2='upload_box hide_plus';
				this.img3=src;
				this.img4=src;
			},
			picSave2(){
				let file=document.getElementById('file1').files[0];
				if(file!=undefined){
					this.picLoading1=true;
					this.uploadImg(file,'/moduleSetting/platformUpload',(data)=>{
						console.log(data);
						if(data!='false'){
							this.centerDialogVisible1=false;
							this.$notify.success({
								title: '成功',
								message: '添加微信公众号二维码图片成功！'
							});
						}
						this.picLoading1=false;
					});
				}else{
					this.$notify.error({
						title: '失败',
						message: '请上传一张图片后再试！'
					});
				}
			},
			//图片转换成formData文件流，并上传的钩子
			uploadImg(data,url,callback) {
				let uploadFile = new FormData();
				uploadFile.append('uploadFile',data);
				if ("undefined" != typeof(uploadFile) && uploadFile != null && uploadFile != "") {
					this.$axios({
						method: 'post',
						url:url,
						contentType: 'application/json',
						headers:{
							"wkToken":sessionStorage.token,
						},
						data: uploadFile,
					}).then((response) => {
						if (response.data.code == 0) {
							callback(response.data);
						}else if(response.data.code == (-999)){
							this.$confirm('token已失效，请重新登录！', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								this.$router.push({
									path: '/'
								});
							}).catch(() => {
								this.$notify.error({
									title: '失败',
									message: '图片上传失败，请稍后重试！'
								});
								callback('false');
							});
						} else {
							this.$notify.error({
								title: '失败',
								message: '图片上传失败，请稍后重试！'
							});
							callback('false');
						}
					}).catch((error) => {
						console.log(error);
						this.$notify.error({
							title: '失败',
							message: '图片上传失败，请稍后重试！'
						});
						callback('false');
					})
				}
			},
		},
		components: {
			//使用编辑器
			quillEditor
		}
	};
</script>

<style lang="scss">
	.quill-editor {
		height: 345px;
		.ql-container {
			height: 303px;
		}
	}
	
	/*.el-dialog__title {
		border-left: none;
	}*/
	.module_dialog .el-dialog .el-dialog__body{
		padding:20px!important;
		.el-row{
			
		}
	}
	.upload_box{
		width:279px;
		height:279px;
		border:1px dashed #d9d9d9;
		border-radius: 6px;
		position: relative;
		overflow: hidden;
		img{
			width:100%;
			height:100%;
			display:block;
			z-index:1;
			position:absolute;
			left:0;
			top:0;
		}
		.el-input{
			z-index:2;
			width:100%;
			height: 100%;
			input{
				width:100%;
				height:100%;
				opacity:0;
				cursor: pointer;
			}
		}
		.el-input:before{
			content:'';
			display:block;
			width:24px;
			height:2px;
			background:#d9d9d9;
			position:absolute;
			left:50%;
			top:50%;
			transform: translate(-50%,-50%);
		}
		.el-input:after{
			content:'';
			display:block;
			width:2px;
			height:24px;
			background:#d9d9d9;
			position:absolute;
			left:50%;
			top:50%;
			transform: translate(-50%,-50%);
		}
	}
	
	.upload_box:hover{
		border:1px dashed #409EFF;
	}
	.hide_plus{
		.el-input:before{
			display:none;
		}
		.el-input:after{
			display:none;
		}
	}
	.avatar-uploader{
		width:279px;
	}
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 278px;
		height: 278px;
		line-height: 278px;
		text-align: center;
	}
	
	.avatar {
		width: 278px;
		height: 278px;
		display: block;
	}
</style>