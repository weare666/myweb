<template>
	<div class="houseProperty">
		<!--<el-row>
			<el-col :span="24">
				<div class="grid-content bg-purple-dark">
					<el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
						<el-form-item label="启用状态" prop="region">
							<el-select v-model="formInline.region" placeholder="请选择启用状态">
								<el-option label="全部" value="shanghai"></el-option>
								<el-option label="区域二" value="beijing"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="商家编号" prop="user">
							<el-input v-model="formInline.user" placeholder="请输入商家编号"></el-input>
						</el-form-item>
						<el-form-item label="商家全称" prop="name">
							<el-input v-model="formInline.name" placeholder="商家全称"></el-input>
						</el-form-item>
						<el-form-item label="起止时间" prop="date">
							<el-date-picker v-model="formInline.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit">查询</el-button>
							<el-button @click="resetForm('formInline')">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
			</el-col>
		</el-row>-->

		<div class="content_btn">
			<el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">新增</el-button>
			<el-button type="primary" icon="el-icon-edit" @click="editorInfo">修改</el-button>
			<el-button type="primary" icon="el-icon-delete" @click="delInfo">删除</el-button>
			<!-- <el-button type="primary" icon="el-icon-close">禁用</el-button> -->
			<!-- <el-button type="primary" icon="el-icon-close">禁用</el-button> -->
			<!-- <el-button type="primary" icon="el-icon-close">禁用</el-button> -->
			<!-- <el-button type="primary" icon="el-icon-close">禁用</el-button> -->
			<!-- <el-button type="primary" icon="el-icon-close">禁用</el-button> -->
			<!-- <el-button type="primary" icon="el-icon-close">禁用</el-button> -->
			<!-- <el-button type="primary" icon="el-icon-close">禁用</el-button> -->
		</div>

		<el-table :data="tableData"
			v-loading="tableLoading" 
			@selection-change="handleSelectionChange" 
			element-loading-text="拼命加载中"
			class="dialog_set" 
			border 
			style="width: 100%">
			<el-table-column type="selection" width="55" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="bgDataDictValue" label="房屋性质" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip align="center">
				<template slot-scope="scope" v-if="scope.row.createTime!=null&&scope.row.createTime!=''">
					{{timestampToTime(scope.row.createTime)}}
				</template>
			</el-table-column>
			<el-table-column prop="description" label="备注" show-overflow-tooltip align="center">
			</el-table-column>
		</el-table>
		<el-pagination background 
			layout="total, sizes, prev, pager, next, jumper" 
			:total="total" 
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange" 
			:page-sizes="[10, 20, 30, 40, 50]" 
			:page-size="pageSize" 
			:current-page="currentPage">
		</el-pagination>

		<!--新增弹出层-->
		<el-dialog title="新增" v-loading="addLoading" :visible.sync="dialogFormVisible" :show-close="false" @close="resetForm('ruleForm')">
			<span style="position:absolute;left:15px;top:0;font-size:16px;">说明 : <font style="color:#f56c6c">*</font>号项必填</span>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
				<el-form-item label="房屋性质名称 : " prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入房屋性质名称"></el-input>
				</el-form-item>
				<!--<el-form-item label="是否启用 : " prop="resource">
					<el-radio-group v-model="ruleForm.resource">
						<el-radio label="是"></el-radio>
						<el-radio label="否"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="商家营业执照 : " required>
					<el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-remove="handleRemove" :limit="9" >
						<i class="el-icon-plus"></i>
					</el-upload>
					<div class="el-form-item__error" v-show="ruleForm.key">{{ruleForm.msg}}</div>
				</el-form-item>-->
				<el-form-item label="备注 : " prop="desc">
					<el-input type="textarea" v-model="ruleForm.desc"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
				<el-button type="primary" @click="submit2('ruleForm')">确 定</el-button>
				<el-button @click="dialogFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>
		
		<!--修改弹出层-->
		<el-dialog title="修改" :visible.sync="dialogFormVisible1" v-loading="ediLoading" :show-close="false" @close="resetForm('ruleForm1')">
			<span style="position:absolute;left:15px;top:0;font-size:16px;">说明 : <font style="color:#f56c6c">*</font>号项必填</span>
			<el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="150px" class="demo-ruleForm">
				<el-form-item label="房屋性质名称 : " prop="name">
					<el-input v-model="ruleForm1.name" placeholder="请输入房屋性质名称"></el-input>
				</el-form-item>
				<!--<el-form-item label="是否启用 : " prop="resource">
					<el-radio-group v-model="ruleForm1.resource">
						<el-radio label="是"></el-radio>
						<el-radio label="否"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="商家营业执照 : " required>
					<el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-remove="handleRemove1" :limit="9" >
						<i class="el-icon-plus"></i>
					</el-upload>
					<div class="el-form-item__error" v-show="ruleForm1.key">{{ruleForm.msg}}</div>
				</el-form-item>-->
				<el-form-item label="备注 : " prop="desc">
					<el-input type="textarea" v-model="ruleForm1.desc"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
				<el-button type="primary" @click="submit3('ruleForm1')">确 定</el-button>
				<el-button @click="dialogFormVisible1 = false">关闭</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				addLoading:false,
				ediLoading:false,
				dialogVisible:false,
				tableLoading:false,
				selectList:[],
				pageSize: 10,
				total: 0,
				currentPage: 1,
				formInline: {
					region: '',
					user: '',
					name: '',
					date: ''
				},
				tableData: [],
				dialogFormVisible: false,
				ruleForm: {
					name: '',
					resource: '',
					desc: '',
					img: '',
					msg:"请上传图片",
					key:false
				},
				rules: {
					name: [{
						required: true,
						message: '请输入房屋性质名称',
						trigger: 'blur'
					}]
				},
				dialogFormVisible1: false,
				ruleForm1: {
					name: '',
					resource: '',
					desc: '',
					img: '',
					msg:"请上传图片",
					key:false
				},
				rules1: {
					name: [{
						required: true,
						message: '请输入房屋性质名称',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			timestampToTime(timestamp,code) {
				if(timestamp!=null){
					if(code==undefined){
						var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
						var Y = date.getFullYear() + '-';
						var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
						var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
						var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
						var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
						var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
						return Y + M + D + h + m + s;
					}else{
						var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
						var Y = date.getFullYear() + '-';
						var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
						var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
						var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
						var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
						var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
						return Y + M + D;
					}
				}else{
					return '';
				}
			},
			onSubmit() {
				this.tableLoading=true;
				let data={
					"page": {
						"currentPage":this.currentPage,
						"pageSize": this.pageSize
					}
				};
				this.$axios({
					method:'post',
					url:'/houseProperty/findByCondition',
					contentType:'application/json',
					headers:{
						"wkToken":sessionStorage.token,
					},
					data:data,
				}).then((response)=> {
					console.log(response);
					let labelData=response.data.rows;
					if(response.data.code == (-999)){
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
								message: '获取房屋性质失败，请稍后重试！'
							});
						});
					}else if(labelData.length>0){
						this.tableData=labelData;
						this.total=response.data.total;
					}else{
						this.$notify.error({
							title: '失败',
							message: '获取房屋性质失败，请稍后重试！'
						});
					}
					this.tableLoading=false;
				}).catch((error)=> {
					console.log(error);
					this.tableLoading=false;
					this.$notify.error({
						title: '失败',
						message: '获取房屋性质失败，请稍后重试！'
					});
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			submit2(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.addLoading=true;
						let name=this.ruleForm.name;
						let desc=this.ruleForm.desc;
						let data={
							"bgDataDictValue":name,
							"description":desc
						};
						this.$axios({
							method:'post',
							url:'/houseProperty/insert',
							contentType:'application/json',
							headers:{
								"wkToken":sessionStorage.token,
							},
							data:data,
						}).then((response)=> {
							console.log(response);
							if(response.data.code==0){
								this.dialogFormVisible=false;
								this.$notify.success({
									title: '成功',
									message: '新增房屋性质成功！'
								});
								this.onSubmit();
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
										message: '新增房屋性质失败，请稍后重试！'
									});
								});
							}else{
								this.$notify.error({
									title: '失败',
									message: '新增房屋性质失败，请稍后重试！'
								});
							}
							this.addLoading=false;
						}).catch((error)=> {
							console.log(error);
							this.addLoading=false;
							this.$notify.error({
								title: '失败',
								message: '新增房屋性质失败，请稍后重试！'
							});
						})
					} else {
						return false;
					}
				});
			},
			//表格选择行改变时的钩子
			handleSelectionChange(val) {
				this.selectList = val;
			},
			//表格每页当前页改变时
			handleCurrentChange(val) {
				this.currentPage = val;
				this.onSubmit();
			},
			//每页显示数改变时执行
			handleSizeChange(val) {
				console.log(val)
				this.pageSize = val;
				this.onSubmit();
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			editorInfo(){
				let list=this.selectList;
				if(list.length>1){
					this.$notify.error({
						title: '失败',
						message: '只能选择一行数据！'
					});
				}else if(list.length==1){
					this.ruleForm1.name=list[0].bgDataDictValue;
					this.ruleForm1.desc=list[0].description;
					this.dialogFormVisible1=true;
				}else{
					this.$notify.error({
						title: '失败',
						message: '请选择一行数据！'
					});
				}
			},
			delInfo(){
				let list=this.selectList;
				if(list.length>1){
					this.$notify.error({
						title: '失败',
						message: '只能选择一行数据！'
					});
				}else if(list.length==1){
					this.$confirm('是否删除?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let idlist=[];
						idlist.push(list[0].bgDataDictValueId);
						this.$axios({
							method:'post',
							url:'/houseProperty/delete',
							contentType:'application/json',
							headers:{
								"wkToken":sessionStorage.token,
							},
							data:{"dataDictValueIdList":idlist},
						}).then((response)=> {
							console.log(response);
							if(response.data.code==0){
								this.dialogFormVisible1=false;
								this.$notify.success({
									title: '成功',
									message: '删除房屋性质成功！'
								});
								this.onSubmit();
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
										message: '删除失败，请稍后重试！'
									});
								});
							}else{
								this.$notify.error({
									title: '失败',
									message: '删除失败，请稍后重试！'
								});
							}
						}).catch((error)=> {
							console.log(error);
							this.$notify.error({
								title: '失败',
								message: '删除失败，请稍后重试！'
							});
						})
					}).catch(() => {
						       
					});
				}else{
					this.$notify.error({
						title: '失败',
						message: '请选择一行数据！'
					});
				}
			},
			submit3(formName) {
				console.log(this.selectList)
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.ediLoading=true;
						let name=this.ruleForm1.name;
						let desc=this.ruleForm1.desc;
						let data={
							"bgDataDictValueId":this.selectList[0].bgDataDictValueId,
							"bgDataDictValue":name,
							"description":desc
						};
						this.$axios({
							method:'post',
							url:'/houseProperty/update',
							contentType:'application/json',
							headers:{
								"wkToken":sessionStorage.token,
							},
							data:data,
						}).then((response)=> {
							console.log(response);
							if(response.data.code==0){
								this.dialogFormVisible1=false;
								this.$notify.success({
									title: '成功',
									message: '修改房屋性质成功！'
								});
								this.onSubmit();
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
										message: '修改房屋性质失败，请稍后重试！'
									});
								});
							}else{
								this.$notify.error({
									title: '失败',
									message: '修改房屋性质失败，请稍后重试！'
								});
							}
							this.ediLoading=false;
						}).catch((error)=> {
							console.log(error);
							this.ediLoading=false;
							this.$notify.error({
								title: '失败',
								message: '修改房屋性质失败，请稍后重试！'
							});
						})
					} else {
						return false;
					}
				});
			},
			handleRemove1(file, fileList) {
				console.log(file, fileList);
			},
		},
		created(){
			this.onSubmit();
		}
	}
</script>

<style lang="scss">
	.houseProperty{
		.el-table__body-wrapper {
			overflow-x: hidden;
			overflow-y:auto;
		}
		.el-row {
			margin-bottom: 20px;
			.bg-purple-dark {
				background: #fff;
				padding-top: 18px;
				padding-left: 20px;
			}
			.el-range-separator {
				width: 24px;
			}
		}
		
		.content_btn {
			margin-bottom: 20px;
		}
		
		.el-pagination {
			text-align: right;
		}
		
		.el-dialog {
			width: 700px;
			.el-dialog__body {
				padding: 50px 60px 30px;
				position: relative;
			}
		}
		.el-upload--picture-card{
			width:80px;
			height:80px;
			line-height:89px;
		}
		.el-upload-list--picture-card .el-upload-list__item {
			width:80px;
			height:80px;
		}
		.el-icon-zoom-in{
			display:none;
		}
		.el-upload-list--picture-card .el-upload-list__item-actions span+span{
			margin-left:0;
		}
	}
	
</style>