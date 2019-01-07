<template>
	<div class="user_manage">
		<el-row>
			<el-col :span="24">
				<div class="grid-content bg-purple-dark">
					<el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
						<el-form-item label="姓名 : " prop="name">
							<el-input v-model="formInline.name" placeholder="请输入姓名"></el-input>
						</el-form-item>
						<el-form-item label="手机号 : " prop="phone">
							<el-input type="phone" v-model="formInline.phone" placeholder="请输入手机号"></el-input>
						</el-form-item>
						<el-form-item label="起止时间 : " prop="date">
							<el-date-picker v-model="formInline.date" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
							:default-time="['00:00:00', '23:59:59']" :disabled="formInline.type">
							</el-date-picker>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit">查询</el-button>
							<el-button @click="resetForm('formInline')">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
			</el-col>
		</el-row>

		<div class="content_btn">
			<!--<el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">新增</el-button>-->
			<el-button type="primary" icon="el-icon-edit" @click="editorDialog">修改</el-button>
			<el-button type="primary" icon="el-icon-delete" @click="delDialog">删除</el-button>
			<!--<el-button type="primary" icon="el-icon-close">禁用</el-button>-->
		</div>

		<el-table :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange" element-loading-text="拼命加载中" class="dialog_set" border style="width: 100%">
			<el-table-column type="selection" width="55" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="appUserNumber" label="编号" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="appUserName" label="姓名" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="appUserPhone" label="手机号" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="appUserEmail" label="邮箱" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="appUserSex" label="性别" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.appUserSex==0">男</span>
					<span v-if="scope.row.appUserSex==1">女</span>
				</template>
			</el-table-column>
			<el-table-column prop="appUserAge" label="年龄" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="createTime" label="注册时间" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					{{timestampToTime(scope.row.createTime)}}
				</template>
			</el-table-column>
			<el-table-column prop="appUserWechatOpenid" label="微信OpenID" align="center" show-overflow-tooltip>
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

		<!--修改弹出层-->
		<el-dialog title="修改" v-loading="visLoading" :visible.sync="dialogFormVisible" @close="resetForm('ruleForm')" :show-close="false">
			<span style="position:absolute;left:15px;top:0;font-size:16px;">说明 : <font style="color:#f56c6c">*</font>号项必填</span>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
				<el-form-item label="编号 : " required>
					<template slot-scope="scope">
						<span>{{ruleForm.code}}</span>
					</template>
				</el-form-item>
				<el-form-item label="用户姓名 : " prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入用户姓名"></el-input>
				</el-form-item>
				<el-form-item label="性别 : " prop="resource">
					<el-radio-group v-model="ruleForm.resource">
						<el-radio label="0">男</el-radio>
						<el-radio label="1">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="手机号码 : " prop="phone">
					<el-input v-model="ruleForm.phone" placeholder="请输入手机号码"></el-input>
				</el-form-item>
				<el-form-item label="邮箱 : " prop="email">
					<el-input type="mail" v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
				</el-form-item>
				<el-form-item label="出生日期 : " prop="date">
					<el-input v-model="ruleForm.date" placeholder="如 : 2010-10-10"></el-input>
				</el-form-item>
				<el-form-item label="备注 : " prop="desc">
					<el-input type="textarea" v-model="ruleForm.desc"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
				<el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
				<el-button @click="dialogFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			var validatePass=(rule, value, callback) => {
				var date =/^(\d{4})-(\d{2})-(\d{2})$/;
				if (value =='') {
					callback(new Error('请输入出生日期'));
				} else if (!date.test(value)) {
					callback(new Error('请按照格式输入，如：2010-10-10'));
				} else {
					callback();
				}
			};
			return {
				tableLoading:false,
				dialogVisible:false,
				total:0,
				pageSize:10,
				currentPage:1,
				selectList:[],
				visLoading:false,
				formInline: {
					phone: '',
					name: '',
					date: ''
				},
				tableData: [],
				dialogFormVisible: false,
				ruleForm: {
					code:'',
					name: '',
					resource: '',
					phone:'',
					email:'',
					date:'',
					desc:''
				},
				rules: {
					name: [{
						required: true,
						message: '请输入用户姓名',
						trigger: 'blur'
					}],
					resource: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					phone: [{
						required: true,
						message: '请输入手机号码',
						trigger: 'blur'
					}],
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}],
					date: [{
						required: true,
						validator: validatePass,
						trigger: 'blur'
					}],
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
				let startDate = '';
				let endDate = '';
				let appUserName=this.formInline.name;
				let appUserPhone=this.formInline.phone;
				if (this.formInline.date != '') {
					startDate = new Date(this.formInline.date[0]).toISOString(); //将获取的北京时间GST时间转换成UTC时间格式 .toISOString()方法ie9以下浏览器不识别
					endDate = new Date(this.formInline.date[1]).toISOString();
				}
				let formData={
					"appUserName":appUserName,
					"appUserPhone":appUserPhone,
					"startDate": startDate,
					"endDate": endDate,
					"page":{
						"currentPage":this.currentPage,
						"pageSize":this.pageSize
					}
				};	
				this.$axios({
					method: 'post',
					url: '/appUser/findByCondition',
					contentType: 'application/json',
					headers:{
						"wkToken":sessionStorage.token,
					},
					data: formData,
				}).then((response) => {
					console.log(response);
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
								title: '查询失败',
								message: '请稍后重试'
							});
						});
					}else if(response.data.rows.length>0){
						let dataList=response.data.rows;
						let total=response.data.total;
						this.tableData=dataList;
						this.total=total;
					}else{
						this.$notify.error({
							title: '查询失败',
							message: '请稍后重试'
						});
					}
					this.tableLoading=false;
				}).catch((error) => {
					console.log(error);
					this.tableLoading=false;
					this.$notify.error({
						title: '查询失败',
						message: '请稍后重试'
					});
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			submit(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.visLoading=true;
						let appUserNumber=this.ruleForm.code;
						let appUserName=this.ruleForm.name;
						let appUserSex=this.ruleForm.resource;
						let appUserPhone=this.ruleForm.phone;
						let appUserEmail=this.ruleForm.email;
						let description=this.ruleForm.desc;
						let appUserId=this.selectList[0].appUserId;
						let appUserBirthday=this.ruleForm.date;
						let data={
							"appUserBirthday":appUserBirthday,
							"appUserEmail":appUserEmail,
							"appUserId":appUserId,
							"appUserName":appUserName,
							"appUserNumber":appUserNumber,
							"appUserPhone":appUserPhone,
							"appUserSex":appUserSex,
							"description":description
						}
						this.$axios({
							method: 'post',
							url: '/appUser/update',
							contentType: 'application/json',
							headers:{
								"wkToken":sessionStorage.token,
							},
							data: data,
						}).then((response) => {
							console.log(response);
							if(response.data.code==0){
								this.$notify.success({
									title: '成功',
									message: '修改成功，请稍后重试'
								});
								this.dialogFormVisible=false;
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
										message: '修改失败，请稍后重试'
									});
								});
							}else{
								this.$notify.error({
									title: '失败',
									message: '修改失败，请稍后重试'
								});
							}
							this.visLoading=false;
						}).catch((error) => {
							console.log(error);
							this.visLoading=false;
							this.$notify.error({
								title: '失败',
								message: '修改失败，请稍后重试'
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
			editorDialog(){
				let list=this.selectList;
				console.log(list);
				if(list.length>1){
					this.$notify.error({
						title: '失败',
						message: '只能选择一行数据！'
					});
				}else if(list.length==1){
					this.ruleForm={
						code:list[0].appUserNumber,
						name:list[0].appUserName,
						resource:list[0].appUserSex,
						phone:list[0].appUserPhone,
						email:list[0].appUserEmail,
						date:list[0].appUserBirthday,
						desc:list[0].description
					};
					this.dialogFormVisible=true;
				}else{
					this.$notify.error({
						title: '失败',
						message: '请选择一行信息！'
					});
				}
			},
			delDialog(){
				let list=this.selectList;
				if(list.length>1){
					this.$notify.error({
						title: '失败',
						message: '只能选择一行数据！'
					});
				}else if(list.length==1){
					this.$confirm('是否删除？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let id=list[0].appUserId;
						this.$axios({
							method: 'post',
							url: '/appUser/delete',
							contentType: 'application/json',
							headers:{
								"wkToken":sessionStorage.token,
							},
							data: {"appUserId":id},
						}).then((response) => {
							console.log(response);
							if(response.data.code==0){
								this.$notify.success({
									title: '成功',
									message: '删除成功!'
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
										message: '删除失败,请稍后重试'
									});
								});
							}else{
								this.$notify.error({
									title: '失败',
									message: '删除失败,请稍后重试'
								});
							}
						}).catch((error) => {
							console.log(error);
							this.$notify.error({
								title: '失败',
								message: '删除失败,请稍后重试'
							});
						})
					}).catch(() => {
					         
					});
				}else{
					this.$notify.error({
						title: '失败',
						message: '请选择一行信息！'
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.user_manage{
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