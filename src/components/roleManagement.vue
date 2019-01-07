<template>
	<div class="role">
		<el-row>
			<el-col :span="24">
				<div class="grid-content bg-purple-dark">
					<el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
						<el-form-item label="角色名称" prop="name">
							<el-input v-model="formInline.name" placeholder="请输入角色名称"></el-input>
						</el-form-item>
						<el-form-item label="起止时间" prop="date">
							<el-date-picker v-model="formInline.date" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
							:default-time="['00:00:00', '23:59:59']">
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
			<el-button type="primary" icon="el-icon-plus" @click="addDialog">新增</el-button>
			<el-button type="primary" icon="el-icon-edit" @click="ediDialog">修改</el-button>
			<el-button type="primary" icon="el-icon-delete" @click="delType">删除</el-button>
			<!--<el-button type="primary" icon="el-icon-close">禁用</el-button>-->
		</div>

		<el-table :data="tableData"
			v-loading="tableLoading" 
			@selection-change="handleSelectionChange" 
			element-loading-text="拼命加载中"
			class="dialog_set"
			border style="width: 100%">
			<el-table-column type="selection" width="55" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="bgRoleName" label="角色名称" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="isActive" label="状态" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.isActive == 0">禁用</span>
					<span v-if="scope.row.isActive == 1">启用</span>
				</template>
			</el-table-column>
			<el-table-column prop="description" label="备注" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="description" label="创建时间" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					{{timestampToTime(scope.row.createTime)}}
				</template>
			</el-table-column>
			<el-table-column prop="" label="操作" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<a href="javascript:;" v-if="scope.row.isActive == 0" @click="operation('0',scope.row.bgRoleId)">启用</a>
					<a href="javascript:;" v-if="scope.row.isActive == 1" @click="operation('1',scope.row.bgRoleId)">禁用</a>
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
		<el-dialog title="新增" v-loading="addLoading" @close="resetForm('ruleForm')" :visible.sync="dialogFormVisible" :show-close="false">
			<span style="position:absolute;left:15px;top:0;font-size:16px;">说明:<font style="color:#f56c6c">*</font>号项必填</span>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
				<el-form-item label="角色名称 : " prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入角色名称"></el-input>
				</el-form-item>
				<el-form-item label="备注 : " prop="desc">
					<el-input type="textarea" v-model="ruleForm.desc"></el-input>
				</el-form-item>
				<el-form-item label="角色权限 : " prop="data1">
					<el-tree
						:data='ruleForm.data1'
						show-checkbox 
						node-key="id"
						ref="tree1"
						:props="ruleForm.defaultProps"></el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
				<el-button type="primary" @click="submit2('ruleForm')">确 定</el-button>
				<el-button @click="dialogFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>

		<!--修改弹出层-->
		<el-dialog title="修改" v-loading="visLoading" @close="resetForm('ruleForm1')" :visible.sync="dialogFormVisible1" :show-close="false">
			<span style="position:absolute;left:15px;top:0;font-size:16px;">说明:<font style="color:#f56c6c">*</font>号项必填</span>
			<el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="150px" class="demo-ruleForm">
				<el-form-item label="角色名称 : " prop="name">
					<el-input v-model="ruleForm1.name" placeholder="请输入角色名称"></el-input>
				</el-form-item>
				<el-form-item label="备注 : " prop="desc">
					<el-input type="textarea" v-model="ruleForm1.desc"></el-input>
				</el-form-item>
				<el-form-item label="角色权限 : " prop="data2">
					<el-tree 
						:data='ruleForm1.data2'
						show-checkbox 
						node-key="bgMenuId"
						ref="tree2"
						:default-checked-keys="ruleForm1.defaultList"
						:props="ruleForm1.defaultProps1"></el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
				<el-button type="primary" @click="submit3('ruleForm1')">确 定</el-button>
				<el-button @click="dialogFormVisible1 = false">关闭</el-button>
			</div>
		</el-dialog>
		
		<!-- 删除 -->
		<el-dialog title="删除" v-loading="delLoading" :visible.sync="delDialog" :show-close="false">
			<div class="type_box">
				<p>您确定要删除当前角色吗？</p>
				<p>一旦删除，该角色关联的用户将无法使用该角色下的功能！</p>
				<div class="type_box_sp" v-show="delState">
					<div class="box_sp_left">关联角色 : </div>
					<div class="box_sp_right"><span v-for="item in delArr" :key="item.bgUserId">{{item.bgUserName}}</span></div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
				<el-button type="primary" @click="delRole">确 定</el-button>
				<el-button @click="delDialog = false">关闭</el-button>
			</div>
		</el-dialog>
		
		<!-- 禁用、启用 -->
		<el-dialog :title="typeTitle" v-loading="typeLoading" :visible.sync="typeDialog" :show-close="false">
			<div class="type_box" v-if="typeTitle=='启用'">
				<p>您确定要启用当前角色吗？</p>
				<p>一旦启用，该角色关联的用户可以使用该角色下的功能！</p>
				<div class="type_box_sp" v-show="typeState">
					<div class="box_sp_left">关联角色 : </div>
					<div class="box_sp_right"><span v-for="item in typeArr" :key="item.bgUserId">{{item.bgUserName}}</span></div>
				</div>
			</div>
			<div class="type_box" v-if="typeTitle=='禁用'">
				<p>您确定要禁用当前角色吗？</p>
				<p>一旦禁用，该角色关联的用户将无法使用该角色下的功能！</p>
				<div class="type_box_sp" v-show="typeState">
					<div class="box_sp_left">关联角色 : </div>
					<div class="box_sp_right"><span v-for="item in typeArr" :key="item.bgUserId">{{item.bgUserName}}</span></div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
				<el-button type="primary" @click="submit4">确 定</el-button>
				<el-button @click="typeDialog = false">关闭</el-button>
			</div>
		</el-dialog>
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dialogVisible: false,
				addLoading:false,
				visLoading:false,
				tableLoading:false,
				selectList:[],
				pageSize: 10,
				total: 0,
				currentPage: 1,
				formInline: {
					name: '',
					date: ''
				},
				tableData: [],
				dialogFormVisible: false,
				ruleForm: {
					name: '',
					desc: '',
					data1:[],
					defaultProps: {
						label: 'bgMenuName',
						children: 'childMenuList',
						id:'bgMenuId',
						parentId:'bgMenuParentId'
					},
				},
				rules: {
					name: [{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}],
					data1: [{
						required: true,
						message: '请选择角色权限',
						trigger: 'change'
					}]
				},
				dialogFormVisible1: false,
				ruleForm1: {
					name: '',
					desc: '',
					data2: [],
					defaultList:[],
					defaultProps1: {
						label: 'bgMenuName',
						children: 'childMenuList',
						id:'bgMenuId',
						parentId:'bgMenuParentId'
					}
				},
				rules1: {
					name: [{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}],
					data2: [{
						required: true,
						message: '请选择角色权限',
						trigger: 'change'
					}]
				},
				typeId:'',
				typeTitle:'',
				typeLoading:false,
				typeDialog:false,
				typeArr:[],
				typeState:false,
				delLoading:false,
				delDialog:false,
				delArr:[],
				delState:false
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
				let name=this.formInline.name;
				let startDate = '';
				let endDate = '';
				let pageSize = this.pageSize;
				let currentPage = this.currentPage;
				if (this.formInline.date != '') {
					startDate = new Date(this.formInline.date[0]).toISOString(); //将获取的北京时间GST时间转换成UTC时间格式 .toISOString()方法ie9以下浏览器不识别
					endDate = new Date(this.formInline.date[1]).toISOString();
				}
				let data={
					"bgRoleName":name,
					"endDate":endDate,
					"page": {
						"currentPage":currentPage,
						"pageSize":pageSize
					},
					"startDate":startDate
				}
				this.$axios({
					method: 'post',
					url: '/bgRole/findByCondition',
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
								title: '查询失败',
								message: '请稍后重试'
							});
						});
					} else if(dataList.length>0){
						this.tableData=dataList;
						this.total=response.data.total;
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
			//表格每页当前页改变时
			handleCurrentChange(val) {
				this.currentPage = val;
				this.onSubmit();
			},
			//每页显示数改变时执行
			handleSizeChange(val) {
				this.pageSize = val;
				this.onSubmit();
			},
			//表格选择行改变时的钩子
			handleSelectionChange(val) {
				this.selectList = val;
			},
// 			loadNode1(node,resolve) {
// 				console.log(node);
// 				if(node.level == 0){
// 					this.getRoletree('',(data)=>{
// 						if(data!='false'&&data.length>0){
// 							let arr=[];
// 							for(let i=0;i<data.length;i++){
// 								arr.push({
// 									'label':data[i].bgMenuName,
// 									'id':data[i].bgMenuId,
// 									'parentId':data[i].bgMenuParentId,
// 									'leaf':false
// 								});
// 							}
// 							return resolve(arr);
// 						}else{
// 							return resolve([]);
// 						}
// 					});
// 				}else{
// 					let id=node.data.id;
// 					this.getRoletree(id,(data)=>{
// 						if(data!='false'&&data.length>0){
// 							let arr=[];
// 							for(let i=0;i<data.length;i++){
// 								arr.push({
// 									'label':data[i].bgMenuName,
// 									'id':data[i].bgMenuId,
// 									'parentId':data[i].bgMenuParentId,
// 									'leaf':false
// 								});
// 							}
// 							return resolve(arr);
// 						}else{
// 							return resolve([]);
// 						}
// 					});
// 				}
// 			},
// 			loadNode2(node,resolve) {
// 				if(node.level == 0){
// 					this.getRoletree('',(data)=>{
// 						if(data!='false'&&data.length>0){
// 							let arr=[];
// 							for(let i=0;i<data.length;i++){
// 								arr.push({
// 									'label':data[i].bgMenuName,
// 									'id':data[i].bgMenuId,
// 									'parentId':data[i].bgMenuParentId,
// 									'leaf':false
// 								});
// 							}
// 							return resolve(arr);
// 						}else{
// 							return resolve([]);
// 						}
// 					});
// 				}else{
// 					let id=node.data.id;
// 					this.getRoletree(id,(data)=>{
// 						if(data!='false'&&data.length>0){
// 							let arr=[];
// 							for(let i=0;i<data.length;i++){
// 								arr.push({
// 									'label':data[i].bgMenuName,
// 									'id':data[i].bgMenuId,
// 									'parentId':data[i].bgMenuParentId,
// 									'leaf':false
// 								});
// 							}
// 							return resolve(arr);
// 						}else{
// 							return resolve([]);
// 						}
// 					});
// 				}
// 			},
			addDialog(){
				this.getRoletree('',(data)=>{
					console.log(data);
					if(data!='false'){
						this.ruleForm.data1=data;
					}else{
						this.ruleForm.data1=[];
					}
				});
				this.dialogFormVisible = true;
			},
			// 获取角色权限树
			getRoletree(data,callback){
				this.$axios({
					method: 'post',
					url: '/bgMenu/queryByParentId',
					contentType: 'application/json',
					headers:{
						"wkToken":sessionStorage.token,
					},
					data: {"bgMenuParentId":data},
				}).then((response) => {
					console.log(response);
					let list=response.data;
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
							callback('false');
						});
					} else if(list.length>0){
						callback(list);
					}else{
						callback('false');
					}
				}).catch((error) => {
					console.log(error);
					callback('false');
				})
			},
			submit2(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.addLoading=true;
						let bgRoleName=this.ruleForm.name;
						let description=this.ruleForm.desc;
						let list=this.$refs.tree1.getCheckedNodes();
						let idList=[];
						for(var i=0;i<list.length;i++){
							idList.push(list[i].bgMenuId);
						}
						let data={
						  "authList":idList,
						  "bgRoleName":bgRoleName,
						  "description":description
						};
						this.$axios({
							method: 'post',
							url:'/bgRole/insert',
							contentType: 'application/json',
							headers:{
								"wkToken":sessionStorage.token,
							},
							data: data,
						}).then((response) => {
							console.log(response);
							if(response.data.code==0){
								this.dialogFormVisible=false;
								this.$notify.success({
									title: '成功',
									message: '新增角色成功！'
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
										message: '新增角色失败，请稍后重试'
									});
								});
							}else{
								this.$notify.error({
									title: '失败',
									message: '新增角色失败，请稍后重试'
								});
							}
							this.addLoading=false;
						}).catch((error) => {
							console.log(error);
							this.addLoading=false;
							this.$notify.error({
								title: '失败',
								message: '新增角色失败，请稍后重试'
							});
						})
					} else {
						return false;
					}
				});
			},
			ediDialog(){
				let list=this.selectList;
				if (list.length > 1) {
					this.$notify.error({
						title: '失败',
						message: '只能选择一行信息！'
					});
				}else if(list.length==1){
					this.getRoletree('',(data)=>{
						console.log(data);
						if(data!='false'){
							this.ruleForm1.data2=data;
						}else{
							this.ruleForm1.data2=[];
						}
						this.ruleForm1.name=list[0].bgRoleName;
						this.ruleForm1.desc=list[0].description;
						if(list[0].authList!=null){
							this.ruleForm1.defaultList=list[0].authList;
						}else{
							this.ruleForm1.defaultList=[];
						}
						this.dialogFormVisible1 = true;
					});
				}else {
					this.$notify.error({
						title: '失败',
						message: '请选择一行信息！'
					});
				}
			},
			submit3(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.visLoading=true;
						let bgRoleName=this.ruleForm1.name;
						let description=this.ruleForm1.desc;
						let list=this.$refs.tree2.getCheckedNodes();
						let idList=[];
						for(var i=0;i<list.length;i++){
							idList.push(list[i].bgMenuId);
						}
						let data={
							"bgRoleId":this.selectList[0].bgRoleId,
							"authList":idList,
							"bgRoleName":bgRoleName,
							"description":description
						};
						this.$axios({
							method: 'post',
							url:'/bgRole/update',
							contentType: 'application/json',
							headers:{
								"wkToken":sessionStorage.token,
							},
							data: data,
						}).then((response) => {
							console.log(response);
							if(response.data.code==0){
								this.dialogFormVisible1=false;
								this.$notify.success({
									title: '成功',
									message: '修改角色成功！'
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
										message: '修改角色失败，请稍后重试'
									});
								});
							}else{
								this.$notify.error({
									title: '失败',
									message: '修改角色失败，请稍后重试'
								});
							}
							this.visLoading=false;
						}).catch((error) => {
							console.log(error);
							this.visLoading=false;
							this.$notify.error({
								title: '失败',
								message: '修改角色失败，请稍后重试'
							});
						})
					} else {
						return false;
					}
				});
			},
			delType(){
				let list=this.selectList;
				if (list.length > 1) {
					this.$notify.error({
						title: '失败',
						message: '只能选择一行信息！'
					});
				}else if(list.length==1){
					this.delArr=[];
					this.delState=false;
					this.$axios({
						method: 'post',
						url:'/bgRole/findUserByRoleId',
						contentType: 'application/json',
						headers:{
							"wkToken":sessionStorage.token,
						},
						data: {"bgRoleId":list[0].bgRoleId},
					}).then((response) => {
						console.log(response)
						if(response.data.code==0){
							if(response.data.result!=null&&response.data.result.length>0){
								this.delState=true;
								this.delArr=response.data.result;
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
								
							});
						}
						this.delDialog=true;
					}).catch((error) => {
						console.log(error);
						this.delDialog=true;
					});
				}else {
					this.$notify.error({
						title: '失败',
						message: '请选择一行信息！'
					});
				}	
			},
			delRole(){
				let list=this.selectList;
				this.$axios({
					method: 'post',
					url:'/bgRole/delete',
					contentType: 'application/json',
					headers:{
						"wkToken":sessionStorage.token,
					},
					data: {"bgRoleId":list[0].bgRoleId},
				}).then((response) => {
					if(response.data.code==0){
						this.$notify.success({
							title: '成功',
							message: '删除成功'
						});
						this.delDialog=false;
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
			},
			//启用,禁用
			operation(code,id){
				this.typeId=id;
				this.typeTitle='';
				this.typeArr=[];
				this.typeState=false;
				this.$axios({
					method: 'post',
					url:'/bgRole/findUserByRoleId',
					contentType: 'application/json',
					headers:{
						"wkToken":sessionStorage.token,
					},
					data: {"bgRoleId":id},
				}).then((response) => {
					console.log(response)
					if(response.data.code==0){
						if(response.data.result!=null&&response.data.result.length>0){
							this.typeState=true;
							this.typeArr=response.data.result;
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
								
							});
						}
				}).catch((error) => {
					console.log(error);
				});
				if(code==0){
					this.typeTitle="启用";
					this.typeDialog=true;
				}else{
					this.typeTitle="禁用";
					this.typeDialog=true;
				}
			},
			submit4(){
				this.typeLoading=true;
				if(this.typeTitle=="启用"){
					this.$axios({
						method: 'post',
						url:'/bgRole/enable',
						contentType: 'application/json',
						headers:{
							"wkToken":sessionStorage.token,
						},
						data: {"bgRoleId":this.typeId},
					}).then((response) => {
						console.log(response)
						if(response.data.code==0){
							this.typeDialog=false;
							this.$notify.success({
								title: '成功',
								message: '启用角色成功!'
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
									message: '启用角色失败，请稍后重试'
								});
							});
						}else{
							this.$notify.error({
								title: '失败',
								message: '启用角色失败，请稍后重试'
							});
						}
						this.typeLoading=false;
					}).catch((error) => {
						console.log(error);
						this.typeLoading=false;
						this.$notify.error({
							title: '失败',
							message: '启用角色失败，请稍后重试'
						});
					});
				}else{
					this.$axios({
						method: 'post',
						url:'/bgRole/disable',
						contentType: 'application/json',
						headers:{
							"wkToken":sessionStorage.token,
						},
						data: {"bgRoleId":this.typeId},
					}).then((response) => {
						console.log(response)
						if(response.data.code==0){
							this.typeDialog=false;
							this.$notify.success({
								title: '成功',
								message: '禁用角色成功!'
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
									message: '禁用角色失败，请稍后重试'
								});
							});
						}else{
							this.$notify.error({
								title: '失败',
								message: '禁用角色失败，请稍后重试'
							});
						}
						this.typeLoading=false;
					}).catch((error) => {
						console.log(error);
						this.typeLoading=false;
						this.$notify.error({
							title: '失败',
							message: '禁用角色失败，请稍后重试'
						});
					});
				}
			}
		},
		created(){
			
		}
	}
</script>

<style lang="scss">
	.role{
		.el-tree-node__content{
			height:40px;
		}
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
			width: 600px;
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
		
		.type_box{
			p{
				width:100%;
				line-height:40px;
				font-size:16px;
				margin-bottom:0;
			}
			.type_box_sp{
				width:100%;
				height:auto;
				position:relative;
				margin-top:20px;
				.box_sp_left{
					width:80px;
					line-height:40px;
					font-size:16px;
					position:absolute;
					left:0;
					top:0;
				}
				.box_sp_right{
					width:100%;
					padding-left:80px;
					span{
						margin-left:10px;
						line-height:40px;
						font-size:16px;
					}
				}
			}
		}
	}
	
</style>