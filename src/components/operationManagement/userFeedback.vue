<template>
	<div class="user_feed">
		<el-row>
			<el-col :span="24">
				<div class="grid-content bg-purple-dark">
					<el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
						<el-form-item label="联系方式" prop="user">
							<el-input v-model="formInline.user" placeholder="请输入联系方式"></el-input>
						</el-form-item>
						<el-form-item label="处理状态" prop="region">
							<el-select v-model="formInline.region" placeholder="请选择启用状态">
								<el-option label="全部" value=""></el-option>
								<el-option label="未处理" value="0"></el-option>
								<el-option label="处理中" value="1"></el-option>
								<el-option label="已处理" value="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="反馈时间" prop="date">
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
			<el-button type="primary" icon="el-icon-delete" @click="delFeed">删除</el-button>
			<el-button type="primary" icon="el-icon-plus" @click="setOperate">运营处理</el-button>
		</div>

		<el-table :data="tableData" 
			v-loading="tableLoading" 
			@selection-change="handleSelectionChange" 
			element-loading-text="拼命加载中"
			class="dialog_set"
			border style="width: 100%">
			<el-table-column type="selection" width="55" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="appFeedbackContact" label="反馈人联系方式" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="appFeedbackStatus" label="处理状态" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<a href="javascript:;" v-if="scope.row.appFeedbackStatus==0">未处理</a>
					<a href="javascript:;" v-if="scope.row.appFeedbackStatus==1">处理中</a>
					<a href="javascript:;" v-if="scope.row.appFeedbackStatus==2">已处理</a>
				</template>
			</el-table-column>
			<el-table-column prop="appFeedbackTime" label="反馈时间" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					{{timestampToTime(scope.row.appFeedbackTime)}}
				</template>
			</el-table-column>
			<el-table-column prop="appFeedbackContent" label="反馈内容" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="updateBy" label="处理人" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="updateTime" label="处理时间" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					{{timestampToTime(scope.row.updateTime)}}
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

		<!--运营处理弹出层-->
		<el-dialog title="运营处理" v-loading="setLoading" :visible.sync="dialogFormVisible" :show-close="false" @close="resetForm('ruleForm')">
			<span style="position:absolute;left:15px;top:0;font-size:16px;">说明:<font style="color:#f56c6c">*</font>号项必填</span>
			<el-form :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm">
				<el-form-item label="反馈时间 : " prop="name">
					<el-row style="margin-bottom:0;">{{ruleForm.name}}</el-row>
				</el-form-item>
				<el-form-item label="反馈人手机号 : " prop="phone">
					<el-row style="margin-bottom:0;">{{ruleForm.phone}}</el-row>
				</el-form-item>
				<el-form-item label="反馈内容 : " prop="info" style="margin-bottom:10px;">
					<el-input type="textarea" v-model="ruleForm.info" :disabled="true" style="margin-top:10px"></el-input>
				</el-form-item>
				<el-form-item label="反馈图片 : ">
					<div class="img_list">
						<img v-for="(item,index) in ruleForm.img" :key="index" :src="item" alt=""/>
					</div>
				</el-form-item>
				<el-form-item label="是否启用 : " prop="resource" style="margin-top:10px">
					<el-radio-group v-model="ruleForm.resource">
						<el-radio label="0">未处理</el-radio>
						<el-radio label="1">处理中</el-radio>
						<el-radio label="2">已处理</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="备注 : " prop="desc">
					<el-input type="textarea" v-model="ruleForm.desc" style="margin-top:10px"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
				<el-button type="primary" @click="submit2('ruleForm')">确 定</el-button>
				<el-button @click="dialogFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableLoading:false,
				dialogVisible:false,
				pageSize: 10,
				total: 0,
				currentPage: 1,
				selectList:[],
				formInline: {
					region: '',
					user: '',
					date: ''
				},
				tableData: [],
				dialogFormVisible: false,
				ruleForm: {
					time:'',
					name: '',
					resource: '',
					desc: '',
					img: [require('../../images/ImportedLayers.png')],
					phone:"",
					info:""
				},
				setLoading:false
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
				if (this.formInline.date != '') {
					startDate = new Date(this.formInline.date[0]).toISOString(); //将获取的北京时间GST时间转换成UTC时间格式 .toISOString()方法ie9以下浏览器不识别
					endDate = new Date(this.formInline.date[1]).toISOString();
				}
				let appFeedbackContact=this.formInline.user;
				let appFeedbackStatus=this.formInline.region;
				let data={
					"appFeedbackContact":appFeedbackContact,
					"appFeedbackStatus":appFeedbackStatus,
					"page": {
						"currentPage":this.currentPage,
						"pageSize": this.pageSize
					},
					"endDate":endDate,
					"startDate":startDate
				}
				this.$axios({
					method: 'post',
					url: '/feedBack/findByCondition',
					contentType: 'application/json',
					headers:{
						"wkToken":sessionStorage.token,
					},
					data: data,
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
			//表格选择行改变时的钩子
			handleSelectionChange(val) {
				this.selectList = val;
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			// 删除
			delFeed(){
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
						let id=list[0].appFeedbackId;
						this.$axios({
							method: 'post',
							url: '/feedBack/delete',
							contentType: 'application/json',
							headers:{
								"wkToken":sessionStorage.token,
							},
							data: {"appFeedbackId":id},
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
			},
			// 运营处理
			setOperate(){
				let list=this.selectList;
				if(list.length>1){
					this.$notify.error({
						title: '失败',
						message: '只能选择一行数据！'
					});
				}else if(list.length==1){
					this.ruleForm.time=list[0].appFeedbackTime;
					this.ruleForm.name=this.timestampToTime(list[0].appFeedbackTime);
					this.ruleForm.phone=list[0].appFeedbackContact;
					this.ruleForm.info=list[0].appFeedbackContent;
					this.ruleForm.resource=list[0].appFeedbackStatus;
					let fileArr = list[0].fileIdList;
					if (fileArr.length > 0) {
						this.ruleForm.img=[];
						for (var i = 0; i < fileArr.length; i++) {
							this.ruleForm.img.push('/attach/getAttachById?picAttachId=' + fileArr[i]);
						}
					}else{
						this.ruleForm.img=[require('../../images/ImportedLayers.png')];
					}
					this.ruleForm.desc=list[0].description;
					this.dialogFormVisible=true;
				}else{
					this.$notify.error({
						title: '失败',
						message: '请选择一行信息！'
					});
				}
			},
			submit2(formName) {
				this.setLoading=true;
				let list=this.selectList;
				let appFeedbackTime=this.ruleForm.time;
				let appFeedbackContact=this.ruleForm.phone;
				let appFeedbackContent=this.ruleForm.info;
				let appFeedbackStatus=this.ruleForm.resource;
				let description=this.ruleForm.desc;
				let data={
					"appFeedbackId":list[0].appFeedbackId,	
					"appFeedbackContact":appFeedbackContact,
					"appFeedbackContent":appFeedbackContent,
					"appFeedbackStatus":appFeedbackStatus,
					"appFeedbackTime":appFeedbackTime,
					"description":description
				};
				this.$axios({
					method: 'post',
					url: '/feedBack/manage',
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
							message: '运营处理成功!'
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
								message: '运营处理失败,请稍后重试'
							});
						});
					}else{
						this.$notify.error({
							title: '失败',
							message: '运营处理失败,请稍后重试'
						});
					}
					this.setLoading=false;
				}).catch((error) => {
					console.log(error);
					this.setLoading=false;
					this.$notify.error({
						title: '失败',
						message: '运营处理失败,请稍后重试'
					});
				})
			}
		}
	}
</script>

<style lang="scss">
	.user_feed{
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
		.img_list{
			width:100%;
			height:auto;
			img{
				width:90px;
				height:90px;
				display:inline-block;
				margin-left:10px;
				margin-top:10px;
			}
			img:nth-of-type(4n+1){
				margin-left:0;
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
		.el-dialog .el-form-item{
			margin-bottom:0;
		}
	}
	
</style>