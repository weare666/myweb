<template>
	<div class="account">
		<el-row>
			<el-col :span="24">
				<div class="grid-content bg-purple-dark">
					<el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="formInline.name" placeholder="请输入姓名"></el-input>
						</el-form-item>
						<el-form-item label="手机号码" prop="phone">
							<el-input v-model="formInline.phone" placeholder="请输入手机号码"></el-input>
						</el-form-item>
						<el-form-item label="员工工号" prop="num">
							<el-input v-model="formInline.num" placeholder="请输入员工工号"></el-input>
						</el-form-item>
						<el-form-item label="起止时间" prop="date">
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
			<el-button type="primary" icon="el-icon-plus" @click="setDialog('0')">新增</el-button>
			<el-button type="primary" icon="el-icon-edit" @click="setDialog('1')">修改</el-button>
			<el-button type="primary" icon="el-icon-delete" @click="delRole">删除</el-button>
			<!--<el-button type="primary" icon="el-icon-close">解除锁定</el-button> -->
		</div>

		<el-table :data="tableData" 
			v-loading="tableLoading" 
			@selection-change="handleSelectionChange" 
			element-loading-text="拼命加载中"
			class="dialog_set" 
			border style="width: 100%">
			<el-table-column type="selection" width="55" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="bgUserAccount" label="账号" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="bgUserName" label="用户姓名" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="bgUserSex" label="性别" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.bgUserSex==0">男</span>
					<span v-if="scope.row.bgUserSex==1">女</span>
				</template>
			</el-table-column>
			<el-table-column prop="bgUserPhone" label="手机号码" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="bgUserEmail" label="邮箱" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="bgUserEmpId" label="员工工号" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="description" label="备注" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					{{timestampToTime(scope.row.createTime)}}
				</template>
			</el-table-column>
			<el-table-column prop="" label="操作" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<a href="javascript:;" v-if="scope.row.isActive==0" @click="unLock(scope.row.bgUserId)">解除锁定</a>
					<a href="javascript:;" v-if="scope.row.isActive==1" @click="lock(scope.row.bgUserId)">锁定</a>
					<a href="javascript:;" @click="resetPsd(scope.row.bgUserId)">密码重置</a>
				</template>
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
		<el-dialog :title="titleText" v-loading="diaLoading" :visible.sync="dialogFormVisible" :show-close="false" class="acc_dialog" @close="dialogClose">
			<span style="position:absolute;left:15px;top:0;font-size:16px;">说明:<font style="color:#f56c6c">*</font>号项必填</span>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="用户姓名 : " prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入用户姓名"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所属部门 : " prop="team">
							<el-input v-model="ruleForm.team" placeholder="请输入所属部门"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="性别 : " prop="sex">
							<el-radio-group v-model="ruleForm.sex">
								<el-radio label="0">男</el-radio>
								<el-radio label="1">女</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="登录账号 : " prop="num">
							<el-input v-model="ruleForm.num" placeholder="请输入登录账号"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="手机号码 : " prop="phone">
							<el-input v-model="ruleForm.phone" placeholder="请输入手机号码"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="登录密码 : " prop="psd">
							<el-input v-model="ruleForm.psd" placeholder="请输入登录密码"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="邮箱 : " prop="mail">
							<el-input v-model="ruleForm.mail" placeholder="请输入邮箱号码"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="确认密码 : " prop="dpsd">
							<el-input v-model="ruleForm.dpsd" placeholder="请再次输入密码"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="员工工号 : " prop="wnum">
							<el-input v-model="ruleForm.wnum" placeholder="请输入员工工号"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="用户角色 : " prop="region">
							<el-select v-model="ruleForm.region" placeholder="请选择用户角色" style="width:100%">
								<el-option v-for="item in roleList" :key="item.bgRoleId" :label="item.bgRoleName" :value="item.bgRoleId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="备注 : " prop="desc">
					<el-input type="textarea" v-model="ruleForm.desc"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
				<el-button type="primary" @click="submit2('ruleForm')">确 定</el-button>
				<el-button @click="dialogFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>
		
		<!-- 修改密码 -->
		<el-dialog title="密码重置" v-loading="resetLoading" :visible.sync="resetDialog" :show-close="false" class="reset_dialog" @close="resetForm('ruleForm1')" width="500px">
			<el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="130px" class="demo-ruleForm">
				<el-form-item label="请输入新密码 : " prop="psd">
					<el-input v-model="ruleForm1.psd" placeholder="请输入新密码"></el-input>
				</el-form-item>
				<el-form-item label="请确认新密码 : " prop="doublepsd">
					<el-input v-model="ruleForm1.doublepsd" placeholder="请确认新密码"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
				<el-button type="primary" @click="submit3('ruleForm1')">确 定</el-button>
				<el-button @click="resetDialog = false">关闭</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			var validatePass=(rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm.psd) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			var validatePass1=(rule, value, callback) => {
				if (value === '') {
					callback(new Error('请确认新密码'));
				} else if (value !== this.ruleForm1.psd) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				titleText:'',
				dialogVisible: false,
				diaLoading:false,
				formInline: {
					phone: '',
					num: '',
					name: '',
					date: ''
				},
				roleList:[],
				pageSize: 10,
				total: 0,
				currentPage: 1,
				tableData: [],
				selectList:[],
				tableLoading:false,
				dialogFormVisible: false,
				ruleForm: {
					name: '',
					team:'',
					sex:'',
					num:'',
					phone:'',
					psd:'',
					mail:'',
					dpsd:'',
					wnum:'',
					region:'',
					desc:''
				},
				rules: {
					name: [{
						required: true,
						message: '请输入用户姓名',
						trigger: 'blur'
					}],
					team: [{
						required: true,
						message: '请输入所属部门',
						trigger: 'blur'
					}],
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					num: [{
						required: true,
						message: '请输入登录账号',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						message: '请输入手机号码',
						trigger: 'blur'
					}],
					psd: [{
						required: true,
						message: '请输入登录密码',
						trigger: 'blur'
					}],
					mail: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}],
					dpsd: [{
						validator: validatePass,
						required: true,
						trigger: 'blur'
					}],
					wnum: [{
						required: true,
						message: '请输入员工工号',
						trigger: 'blur'
					}],
					region:[{
						required: true,
						message: '请选择用户角色',
						trigger: 'change'
					}]
				},
				resetLoading: false,
				resetDialog:false,
				ruleForm1: {
					psd:'',
					doublepsd:'',
					id:''
				},
				rules1: {
					psd: [{
						required: true,
						message: '请输入新密码',
						trigger: 'blur'
					}],
					doublepsd: [{
						required: true,
						validator: validatePass1,
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
			getRole(){
				this.$axios({
					method: 'get',
					url: '/bgRole/queryRoleInfo',
					contentType: 'application/json',
				}).then((response) => {
					console.log(response);
					if(response.data.code==0){
						this.roleList=response.data.result;
					}
				}).catch((error) => {
					console.log(error);
				})
			},
			onSubmit() {
				this.tableLoading=true;
				let bgUserName=this.formInline.name;
				let bgUserPhone=this.formInline.phone;
				let bgUserEmpId=this.formInline.num;
				let startDate = '';
				let endDate = '';
				if (this.formInline.date != '') {
					startDate = new Date(this.formInline.date[0]).toISOString(); //将获取的北京时间GST时间转换成UTC时间格式 .toISOString()方法ie9以下浏览器不识别
					endDate = new Date(this.formInline.date[1]).toISOString();
				}
				let data={
					"bgUserEmpId":bgUserEmpId,
					"bgUserName":bgUserName,
					"bgUserPhone":bgUserPhone,
					"endDate":endDate,
					"page": {
						"currentPage":this.currentPage,
						"pageSize":this.pageSize
					},
					"startDate":startDate
				};
				this.$axios({
					method: 'post',
					url:'/bgUser/findByCondition',
					contentType: 'application/json',
					headers:{
						"wkToken":sessionStorage.token,
					},
					data: data,
				}).then((response) => {
					console.log(response);
					let dataList=response.data.rows;
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
								message: '请稍后重试'
							});
						});
					}else if(dataList.length>0){
						this.tableData=dataList;
						this.total=response.data.total;
					}else{
						this.$notify.error({
							title: '失败',
							message: '请稍后重试'
						});
					}
					this.tableLoading=false;
				}).catch((error) => {
					console.log(error);
					this.tableLoading=false;
					this.$notify.error({
						title: '失败',
						message: '请稍后重试'
					});
				})
			},
			//表格每页当前页改变时
			handleCurrentChange(val) {
				this.currentPage = val;
				this.onSubmit();
			},
			//表格选择行改变时的钩子
			handleSelectionChange(val) {
				this.selectList = val;
			},
			//每页显示数改变时执行
			handleSizeChange(val) {
				console.log(val)
				this.pageSize = val;
				this.onSubmit();
			},
			// 解锁
			unLock(data){
				this.$axios({
					method: 'post',
					url:'/bgUser/unlockAccount',
					contentType: 'application/json',
					headers:{
						"wkToken":sessionStorage.token,
					},
					data: {"bgUserId":data},
				}).then((response) => {
					if(response.data.code==0){
						this.$notify.success({
							title: '成功',
							message: '解除锁定成功'
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
								message: '解除锁定失败，请稍后重试'
							});	
						});
					}else{
						this.$notify.error({
							title: '失败',
							message: '解除锁定失败，请稍后重试'
						});	
					}
				}).catch((error) => {
					console.log(error);
					this.$notify.error({
						title: '失败',
						message: '解除锁定失败，请稍后重试'
					});
				})
			},
			// 锁定
			lock(data){
				this.$confirm('您确定要锁定当前用户吗？<br/>一旦锁定，该用户将无法登录系统。', '提示', {
					dangerouslyUseHTMLString:true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
						method: 'post',
						url:'/bgUser/lockAccount',
						contentType: 'application/json',
						headers:{
							"wkToken":sessionStorage.token,
						},
						data: {"bgUserId":data},
					}).then((response) => {
						if(response.data.code==0){
							this.$notify.success({
								title: '成功',
								message: '锁定成功'
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
									message: '锁定失败，请稍后重试'
								});	
							});
						}else{
							this.$notify.error({
								title: '失败',
								message: '锁定失败，请稍后重试'
							});	
						}
					}).catch((error) => {
						console.log(error);
						this.$notify.error({
							title: '失败',
							message: '锁定失败，请稍后重试'
						});
					})
				}).catch(() => {
				           
				});
			},
			// 密码重置
			resetPsd(id){
				this.resetDialog=true;
				this.ruleForm1.id=id;
			},
			delRole(){
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
						this.$axios({
							method: 'post',
							url:'/bgUser/delete',
							contentType: 'application/json',
							headers:{
								"wkToken":sessionStorage.token,
							},
							data: {"bgUserId":list[0].bgUserId},
						}).then((response) => {
							if(response.data.code==0){
								this.$notify.success({
									title: '成功',
									message: '删除成功'
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
										message: '删除失败，请稍后重试'
									});	
								});
							}else{
								this.$notify.error({
									title: '失败',
									message: '删除失败，请稍后重试'
								});	
							}
						}).catch((error) => {
							console.log(error);
							this.$notify.error({
								title: '失败',
								message: '删除失败，请稍后重试'
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
			setDialog(data){
				if(data=="0"){
					this.titleText="新增";
					this.dialogFormVisible=true;
				}else{
					let list=this.selectList;
					if(list.length>1){
						this.$notify.error({
							title: '失败',
							message: '只能选择一行数据！'
						});
					}else if(list.length==1){
						this.ruleForm={
							name:list[0].bgUserName,
							team:list[0].bgUserDept,
							sex:list[0].bgUserSex,
							num:list[0].bgUserAccount,
							phone:list[0].bgUserPhone,
							psd:list[0].bgUserPwd,
							mail:list[0].bgUserEmail,
							dpsd:list[0].bgUserPwd,
							wnum:list[0].bgUserEmpId,
							region:list[0].roleId,
							desc:list[0].description
						};
						this.titleText="修改";
						this.dialogFormVisible=true;
					}else{
						this.$notify.error({
							title: '失败',
							message: '请选择一行数据！'
						});
					}
				}
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			submit2(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let title=this.titleText;
						this.diaLoading=true;
						let bgUserName=this.ruleForm.name;
						let bgUserDept=this.ruleForm.team;
						let bgUserSex=this.ruleForm.sex;
						let bgUserAccount=this.ruleForm.num;
						let bgUserPhone=this.ruleForm.phone;
						let bgUserPwd=this.ruleForm.psd;
						let bgUserEmail=this.ruleForm.mail;
						let bgUserEmpId=this.ruleForm.wnum;
						let roleId=this.ruleForm.region;
						let description=this.ruleForm.desc;
						let data={
							"bgUserId":this.selectList[0].bgUserId,
							"bgUserAccount":bgUserAccount,
							"bgUserDept":bgUserDept,
							"bgUserEmail":bgUserEmail,
							"bgUserEmpId":bgUserEmpId,
							"bgUserName":bgUserName,
							"bgUserPhone":bgUserPhone,
							"bgUserPwd":bgUserPwd,
							"bgUserSex":bgUserSex,
							"description":description,
							"roleId":roleId
						};
						if(title=="新增"){
							this.$axios({
								method: 'post',
								url: '/bgUser/insert',
								contentType: 'application/json',
								headers:{
									"wkToken":sessionStorage.token,
								},
								data:data,
							}).then((response) => {
								console.log(response);
								if(response.data.code==0){
									this.dialogFormVisible=false;
									this.$notify.success({
										title: '成功',
										message: '增加商家成功！'
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
											message: '请稍后重试！'
										});
									});
								}else{
									this.$notify.error({
										title: '失败',
										message: '请稍后重试！'
									});
								}
								this.diaLoading=false;
							}).catch((error) => {
								console.log(error);
								this.diaLoading=false;
								this.$notify.error({
									title: '失败',
									message: '请稍后重试！'
								});
							})
						}else{
							this.$axios({
								method: 'post',
								url: '/bgUser/update',
								contentType: 'application/json',
								headers:{
									"wkToken":sessionStorage.token,
								},
								data:data,
							}).then((response) => {
								console.log(response);
								if(response.data.code==0){
									this.dialogFormVisible=false;
									this.$notify.success({
										title: '成功',
										message: '修改商家成功！'
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
											message: '请稍后重试！'
										});
									});
								}else{
									this.$notify.error({
										title: '失败',
										message: '请稍后重试！'
									});
								}
								this.diaLoading=false;
							}).catch((error) => {
								console.log(error);
								this.diaLoading=false;
								this.$notify.error({
									title: '失败',
									message: '请稍后重试！'
								});
							})
						}
					} else {
						return false;
					}
				});
			},
			dialogClose(){
				this.resetForm('ruleForm');
				this.ruleForm={
					name: '',
					team:'',
					sex:'',
					num:'',
					phone:'',
					psd:'',
					mail:'',
					dpsd:'',
					wnum:'',
					region:'',
					desc:''
				};
				this.ruleForm1.id='';
			},
			submit3(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.resetLoading=true;
						this.$axios({
							method: 'post',
							url: '/bgUser/updatePassWord',
							contentType: 'application/json',
							headers:{
								"wkToken":sessionStorage.token,
							},
							data:{
								"bgUserId":this.ruleForm1.id,
								"bgUserPwd":this.ruleForm1.psd
							},
						}).then((response) => {
							console.log(response);
							if(response.data.code==0){
								this.resetDialog=false;
								this.$notify.success({
									title: '成功',
									message: '修改密码成功！'
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
										message: '修改密码失败，请稍后重试'
									});
								});
							}else{
								this.$notify.error({
									title: '失败',
									message: '修改密码失败，请稍后重试'
								});
							}
							this.resetLoading=false;
						}).catch((error) => {
							console.log(error);
							this.$notify.error({
								title: '失败',
								message: '修改密码失败，请稍后重试'
							});
						})
					} else {
						return false;
					}
				});
			},
		},
		created(){
			this.getRole();
		}
	}
</script>

<style lang="scss">
	.account{
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
		.acc_dialog{
			.el-row{
				margin-bottom:0;
			}
			.el-form-item{
				margin-bottom:0;
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
			.el-row{
				margin-bottom:20px;
				.el-col{
					margin-bottom:0;
				}
			}
			.el-dialog__body {
				padding: 50px 60px 30px;
				position: relative;
			}
		}
		
		.el-upload--picture-card {
			width: 80px;
			height: 80px;
			line-height: 89px;
		}
		
		.el-upload-list--picture-card .el-upload-list__item {
			width: 80px;
			height: 80px;
		}
		
		.el-icon-zoom-in {
			display: none;
		}
		
		.el-upload-list--picture-card .el-upload-list__item-actions span+span {
			margin-left: 0;
		}
	}
</style>