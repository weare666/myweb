<template>
	<div class="business">
		<el-row>
			<el-col :span="24">
				<div class="grid-content bg-purple-dark">
					<el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
						<el-form-item label="启用状态" prop="region">
							<el-select v-model="formInline.region">
								<el-option label="全部" value="2"></el-option>
								<el-option label="启用" value="1"></el-option>
								<el-option label="禁用" value="0"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="商家编号" prop="user">
							<el-input v-model="formInline.user" placeholder="请输入商家编号"></el-input>
						</el-form-item>
						<el-form-item label="商家全称" prop="name">
							<el-input v-model="formInline.name" placeholder="商家全称"></el-input>
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
			<el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">新增</el-button>
			<el-button type="primary" icon="el-icon-edit" @click="modifyDialog">修改</el-button>
			<el-button type="primary" icon="el-icon-delete" @click="removeTable">删除</el-button>
			<!--<el-button type="primary" icon="el-icon-close">禁用</el-button>-->
		</div>

		<el-table :data="tableData"
			v-loading="tableLoading" 
			@selection-change="handleSelectionChange" 
			element-loading-text="拼命加载中"
			class="dialog_set" border>
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="bgMerchantNumber" label="商家编号" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="bgMerchantName" label="商家全称" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="fileIdList" label="营业执照" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<a href="javascript:;" @click='seeClick(scope.row.fileIdList)'>查看</a>
				</template>
			</el-table-column>
			<el-table-column prop="isActive" label="启用/禁用" align="center">
				<template slot-scope="scope">
					<a href="javascript:;" v-if="scope.row.isActive == 0" @click='selectType(scope.row.isActive,scope.row.bgMerchantId)'>启用</a>
					<a href="javascript:;" v-if="scope.row.isActive == 1" @click='selectType(scope.row.isActive,scope.row.bgMerchantId)'>禁用</a>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					{{timestampToTime(scope.row.createTime)}}
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
		<el-dialog title="新增" :visible.sync="dialogFormVisible" :show-close="false" v-loading='ruleFormLoading' @close='addClose'>
			<span style="position:absolute;left:15px;top:0;font-size:16px;">说明:<font style="color:#f56c6c">*</font>号项必填</span>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" id='uploadForm'>
				<el-form-item label="商家全称 : " prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入商家全称"></el-input>
				</el-form-item>
				<el-form-item label="是否启用 : " prop="resource">
					<el-radio-group v-model="ruleForm.resource">
						<el-radio label="1">是</el-radio>
						<el-radio label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="商家营业执照 : " required>
					<el-upload id="file" 
						action="/merchant/upload" 
						multiple 
						list-type="picture-card" 
						:file-list="ruleForm.img" 
						:limit="9"
						:on-remove="handleRemove" 
						:on-change="handleChange" 
						:auto-upload="false" 
						accept="image/*">
						<i class="el-icon-plus"></i>
					</el-upload>
					<div class="el-form-item__error" v-show="ruleForm.key">{{ruleForm.msg}}</div>
				</el-form-item>
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
		<el-dialog title="修改" :visible.sync="dialogFormVisible1" v-loading='visDialog' :show-close="false" @close="visClose">
			<span style="position:absolute;left:15px;top:0;font-size:16px;">说明:<font style="color:#f56c6c">*</font>号项必填</span>
			<el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="150px" class="demo-ruleForm">
				<el-form-item label="商家全称 : " prop="name">
					<el-input v-model="ruleForm1.name" placeholder="请输入商家全称"></el-input>
				</el-form-item>
				<el-form-item label="是否启用 : " prop="resource">
					<el-radio-group v-model="ruleForm1.resource">
						<el-radio label="1">是</el-radio>
						<el-radio label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="商家营业执照 : " required>
					<el-upload 
						action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" ref="uploadForm"
						:on-remove="handleRemove1" 
						:file-list="ruleForm1.img" 
						:on-change="handleChange1" 
						:auto-upload="false" 
						accept="image/*"
						:limit="9">
						<i class="el-icon-plus"></i>
					</el-upload>
					<div class="el-form-item__error" v-show="ruleForm1.key">{{ruleForm1.msg}}</div>
				</el-form-item>
				<el-form-item label="备注 : " prop="desc">
					<el-input type="textarea" v-model="ruleForm1.desc"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
				<el-button type="primary" @click="submit3('ruleForm1')">确 定</el-button>
				<el-button @click="dialogFormVisible1 = false">关闭</el-button>
			</div>
		</el-dialog>

		<!--营业执照查看-->
		<el-dialog title="查看营业执照" :visible.sync="photoDialog" :show-close="false">
			<el-carousel indicator-position="outside" :interval="0">
				<el-carousel-item v-for="item in photoArr" :key="item">
					<img :src="item" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);" />
				</el-carousel-item>
			</el-carousel>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
				<el-button @click="photoDialog = false">关闭</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import '../styles/module_table.scss'
	export default {
		data() {
			return {
				photoDialog: false,
				photoArr: [],
				dialogVisible: false,
				tableLoading: false,
				ruleFormLoading: false,
				visDialog: false,
				formInline: {
					region: '2',
					user: '',
					name: '',
					date: '',
					type: false
				},
				tableData: [],
				dialogFormVisible: false,
				ruleForm: {
					name: '',
					resource: '',
					desc: '',
					img: [],
					msg: "请上传图片",
					key: false
				},
				selectList: [],
				rules: {
					name: [{
						required: true,
						message: '请输入商家全称',
						trigger: 'blur'
					}],
					resource: [{
						required: true,
						message: '请选择是否启用',
						trigger: 'change'
					}]
				},
				dialogFormVisible1: false,
				ruleForm1: {
					name: '',
					resource: '',
					desc: '',
					img: [],
					msg: "请上传图片",
					key: false
				},
				rules1: {
					name: [{
						required: true,
						message: '请输入商家全称',
						trigger: 'blur'
					}],
					resource: [{
						required: true,
						message: '请选择是否启用',
						trigger: 'change'
					}]
				},
				pageSize: 10,
				total: 0,
				currentPage: 1
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
			//页面查询按钮点击事件
			onSubmit() {
				this.tableLoading = true;
				this.formInline.type = true;
				let isActive = this.formInline.region;
				let bgMerchantNumber = this.formInline.user;
				let bgMerchantName = this.formInline.name;
				let startDate = '';
				let endDate = '';
				let pageSize = this.pageSize;
				let currentPage = this.currentPage;
				let total = this.total;
				if (isActive == '2') {
					isActive = ''
				};
				if (this.formInline.date != '') {
					startDate = new Date(this.formInline.date[0]).toISOString(); //将获取的北京时间GST时间转换成UTC时间格式 .toISOString()方法ie9以下浏览器不识别
					endDate = new Date(this.formInline.date[1]).toISOString();
				}
				let data = {
					"bgMerchantName": bgMerchantName,
					"bgMerchantNumber": bgMerchantNumber,
					"endDate": endDate,
					"isActive": isActive,
					"page": {
						"currentPage": currentPage,
						"pageSize": pageSize,
						"pageTotal": '',
					},
					"startDate": startDate
				};
				this.getTableData(data, (obj) => {
					if (obj == 'error') {
						this.$notify.error({
							title: '查询失败',
							message: '请稍后重试'
						});
						this.tableLoading = false;
						this.formInline.type = false;
					} else {
						this.tableData = obj.data.rows;
						this.total = obj.data.total;
						this.tableLoading = false;
						this.formInline.type = false;
					}
				});
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
			//获取主页表格数据事件
			getTableData(data, callback) {
				this.$axios({
					method: 'post',
					url: '/merchant/findByCondition',
					contentType: 'application/json',
					headers:{
						"wkToken":sessionStorage.token,
					},
					data: data,
				}).then((response) => {
					console.log(response);
					if(response.data.code==(-999)){
						this.$confirm('token已失效，请重新登录！', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							// callback('error');
							this.$router.push({
								path: '/'
							});
						}).catch(() => {
							callback('error');	
						});
					}else{
						callback(response);
					}
					
				}).catch((error) => {
					console.log(error);
					callback("error");
				})
			},
			//查看按钮功能
			seeClick(obj) {
				console.log('obj', obj);
				let fileArr = [];
				if (obj == null || obj.length <= 0) {
					this.$notify.error({
						title: '查看失败',
						message: '暂无营业执照可以查看！'
					});
				} else {
					for (var i = 0; i < obj.length; i++) {
						fileArr.push('/attach/getAttachById?picAttachId=' + obj[i]);
					}
					this.photoArr = fileArr;
					this.photoDialog = true;
				}
			},
			//启用/禁用功能
			selectType(type, id) {
				let data = {
					"bgMerchantId": id
				};
				if (type == 0) {
					this.$confirm('是否启用！?', '提示', {
						confirmButtonText: '是',
						cancelButtonText: '否',
						type: 'warning'
					}).then(() => {
						this.tableLoading = true;
						this.formInline.type = true;
						this.$axios({
							method: 'post',
							url: '/merchant/enable',
							contentType: 'application/json',
							headers:{
								"wkToken":sessionStorage.token,
							},
							data: data,
						}).then((response) => {
							console.log(response);
							if (response.data.code == 0) {
								this.$notify.success({
									title: '成功',
									message: '启用成功！'
								});
								this.tableLoading = false;
								this.formInline.type = false;
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
									this.tableLoading = false;
									this.formInline.type = false;
									this.$notify.error({
										title: '失败',
										message: '启用失败，请稍后重试！'
									});
								});
							} else {
								this.tableLoading = false;
								this.formInline.type = false;
								this.$notify.error({
									title: '失败',
									message: '启用失败，请稍后重试！'
								});
							}
						}).catch((error) => {
							console.log(error);
							this.tableLoading = false;
							this.formInline.type = false;
							this.$notify.error({
								title: '失败',
								message: '启用失败，请稍后重试！'
							});
						})
					}).catch(() => {

					});
				} else {
					this.$confirm('是否禁用！?', '提示', {
						confirmButtonText: '是',
						cancelButtonText: '否',
						type: 'warning'
					}).then(() => {
						this.tableLoading = true;
						this.formInline.type = true;
						this.$axios({
							method: 'post',
							url: '/merchant/disable',
							contentType: 'application/json',
							headers:{
								"wkToken":sessionStorage.token,
							},
							data: data,
						}).then((response) => {
							console.log(response);
							if (response.data.code == 0) {
								this.$notify.success({
									title: '成功',
									message: '禁用成功！'
								});
								this.tableLoading = false;
								this.formInline.type = false;
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
									this.tableLoading = false;
									this.formInline.type = false;
									this.$notify.error({
										title: '失败',
										message: '禁用失败，请稍后重试！'
									});
								});
							} else {
								this.tableLoading = false;
								this.formInline.type = false;
								this.$notify.error({
									title: '失败',
									message: '禁用失败，请稍后重试！'
								});
							}
						}).catch((error) => {
							console.log(error);
							this.tableLoading = false;
							this.formInline.type = false;
							this.$notify.error({
								title: '失败',
								message: '禁用失败，请稍后重试！'
							});
						})
					}).catch(() => {

					});
				}
			},
			// 上传之前验证上传格式
			// 			beforeAvatarUpload(file) {
			// 				console.log(file);
			//         const isJPG = file.type === 'image/jpeg';
			//         const isLt2M = file.size / 1024 / 1024 < 2;
			// 
			//         if (!isJPG) {
			//           this.$message.error('上传头像图片只能是 JPG 格式!');
			//         }
			//         if (!isLt2M) {
			//           this.$message.error('上传头像图片大小不能超过 2MB!');
			//         }
			//         return isJPG && isLt2M;
			//       },
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			handleChange(file, fileList) {
				this.ruleForm.img = fileList;
				let imgList = this.ruleForm.img;
				if (imgList.length > 0) {
					this.ruleForm.key = false;
				} else {
					this.ruleForm.key = true;
				}
			},
			submit2(formName) {
				this.$refs[formName].validate((valid) => {
					let imgList = this.ruleForm.img;
					if (valid && imgList.length > 0) {
						this.ruleForm.key = false;
						this.ruleFormLoading = true;
						this.uploadImg(imgList, (data) => {
							if (data != 'false') {
								let fileList = [];
								for (var i = 0; i < data.result.length; i++) {
									fileList.push(data.result[i].picAttachId);
								}
								// 开始提交
								let addData = {
									"bgMerchantName": this.ruleForm.name,
									"description": this.ruleForm.desc,
									"fileIdList": fileList,
									"isActive": this.ruleForm.resource,
								};
								this.$axios({
									method: 'post',
									url: '/merchant/insert',
									contentType: 'application/json',
									headers:{
										"wkToken":sessionStorage.token,
									},
									data: addData,
								}).then((response) => {
									if (response.data.code == 0) {
										this.dialogFormVisible = false;
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
									} else {
										this.$notify.error({
											title: '失败',
											message: '请稍后重试！'
										});
									}
									this.ruleFormLoading = false;
								}).catch((error) => {
									console.log(error);
									this.ruleFormLoading = false;
									this.$notify.error({
										title: '失败',
										message: '请稍后重试！'
									});
								})
							} else {
								this.ruleFormLoading = false;
							}
						});
					} else {
						if (imgList.length > 0) {
							this.ruleForm.key = false;
						} else {
							this.ruleForm.key = true;
						}
						return false;
					}
				});
			},
			//图片转换成formData文件流，并上传的钩子
			uploadImg(data, callback) {
				let uploadFile = new FormData();
				for (var i = 0; i < data.length; i++) {
					uploadFile.append('uploadFiles', data[i].raw);
				}
				if ("undefined" != typeof(uploadFile) && uploadFile != null && uploadFile != "") {
					this.$axios({
						method: 'post',
						url: '/merchant/upload',
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
			//移除新增图片上传的钩子
			handleRemove(file, fileList) {
				this.ruleForm.img = fileList;
				let imgList = this.ruleForm.img;
				if (imgList.length > 0) {
					this.ruleForm.key = false;
				} else {
					this.ruleForm.key = true;
				}
			},
			// 新增弹出层关闭时的回调，
			addClose() {
				this.resetForm('ruleForm');
				this.ruleForm.img = [];
			},
			// 修改弹出层关闭时的回调
			visClose() {
				this.resetForm('ruleForm1');
				this.ruleForm1.img = [];
			},
			//修改功能点击
			modifyDialog() {
				let list = this.selectList;
				if (list.length > 0) {
					if (list.length > 1) {
						this.$notify.error({
							title: '失败',
							message: '只能选择一行数据！'
						});
					} else {
						this.ruleForm1.name = list[0].bgMerchantName;
						this.ruleForm1.resource = list[0].isActive;
						let fileArr = list[0].fileIdList;
						if (fileArr.length > 0) {
							for (var i = 0; i < fileArr.length; i++) {
								this.ruleForm1.img.push({
									url: '/attach/getAttachById?picAttachId=' + fileArr[i]
								});
							}
						}
						this.ruleForm1.desc = list[0].description;
						this.dialogFormVisible1 = true;
					}
				} else {
					this.$notify.error({
						title: '失败',
						message: '请选择一行信息！'
					});
				}
			},
			//点击删除按钮
			removeTable() {
				let list = this.selectList;
				if (list.length > 0) {
					if (list.length > 1) {
						this.$notify.error({
							title: '失败',
							message: '只能选择一行数据！'
						});
					} else {
						this.$confirm('是否删除该商家？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '关闭',
							type: 'warning'
						}).then(() => {
							let data = {
								"bgMerchantId": list[0].bgMerchantId
							}
							this.$axios({
								method: 'post',
								url: '/merchant/delete',
								contentType: 'application/json',
								headers:{
									"wkToken":sessionStorage.token,
								},
								data: data,
							}).then((response) => {
								if (response.data.code == 0) {
									this.$notify.success({
										title: '成功',
										message: '删除成功！'
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
								} else {
									this.$notify.error({
										title: '失败',
										message: '删除失败，请稍后重试！'
									});
								}
							}).catch((error) => {
								console.log(error);
								this.$notify.error({
									title: '失败',
									message: '删除失败，请稍后重试！'
								});
							})
						}).catch(() => {
								
						});
					}
				} else {
					this.$notify.error({
						title: '失败',
						message: '请选择一行信息！'
					});
				}
			},
			//表格选择行改变时的钩子
			handleSelectionChange(val) {
				this.selectList = val;
			},
			// 修改时上传图片列表变化时的事件
			handleChange1(file, fileList) {
				this.ruleForm1.img = fileList;
				let imgList = this.ruleForm1.img;
				if (imgList.length > 0) {
					this.ruleForm1.key = false;
				} else {
					this.ruleForm1.key = true;
				}
			},
			// 修改时的图片上传钩子
			visupload(data,callback){
				let uploadFile = new FormData();
				let fileid=[];
				for(var i=0;i<data.length;i++){
					if(data[i].raw!=undefined){
						uploadFile.append('uploadFiles', data[i].raw);
					}else{
						fileid.push(data[i].url.split("=")[1]);
					}
				}
				if ("undefined" != typeof(uploadFile) && uploadFile != null && uploadFile != "") {
					this.$axios({
						method: 'post',
						url: '/merchant/upload',
						contentType: 'application/json',
						headers:{
							"wkToken":sessionStorage.token,
						},
						data: uploadFile,
					}).then((response) => {
						if (response.data.code == 0) {
							let arr=response.data.result;
							for(var j=0;j<arr.length;j++){
								fileid.push(arr[j].picAttachId);
							}
							callback(fileid);
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
			// 修改提交时的事件
			submit3(formName) {
				this.$refs[formName].validate((valid) => {
					let imgList=this.ruleForm1.img;
					if (valid&&imgList.length>0) {
						this.ruleForm1.key = false;
						this.visDialog = true;
						this.visupload(imgList,(data)=>{
							// 开始提交
							let addData = {
								"bgMerchantId":this.selectList[0].bgMerchantId,
								"bgMerchantName": this.ruleForm1.name,
								"description": this.ruleForm1.desc,
								"fileIdList": data,
								"isActive": this.ruleForm1.resource,
							};
							this.$axios({
								method: 'post',
								url: '/merchant/update',
								contentType: 'application/json',
								headers:{
									"wkToken":sessionStorage.token,
								},
								data: addData,
							}).then((response) => {
								console.log(response);
								if (response.data.code == 0) {
									this.dialogFormVisible1 = false;
									this.$notify.success({
										title: '成功',
										message: '修改成功！'
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
											message: '修改失败，请稍后重试！'
										});
									});
								} else {
									this.$notify.error({
										title: '失败',
										message: '修改失败，请稍后重试！'
									});
								}
								this.visDialog = false;
							}).catch((error) => {
								console.log(error);
								this.$notify.error({
									title: '失败',
									message: '修改失败，请稍后重试！'
								});
								this.visDialog = false;
							})
						});
					} else {
						if (imgList.length > 0) {
							this.ruleForm1.key = false;
						} else {
							this.ruleForm1.key = true;
						}
						return false;
					}
				});
			},
			// 修改时上传图片列表删除时的事件
			handleRemove1(file, fileList) {
				console.log(file, fileList);
				this.ruleForm1.img = fileList;
				let imgList = this.ruleForm1.img;
				if (imgList.length > 0) {
					this.ruleForm1.key = false;
				} else {
					this.ruleForm1.key = true;
				}
			},
		}
	}
</script>

<style lang="scss">
	.business{
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
