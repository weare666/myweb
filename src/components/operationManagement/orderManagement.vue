<template>
	<div class="order_manage">
		<el-row>
			<el-col :span="24">
				<div class="grid-content bg-purple-dark">
					<el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
						<el-form-item label="订单状态" prop="region">
							<el-select v-model="formInline.region" placeholder="请选择订单状态">
								<el-option label="全部" value=""></el-option>
								<el-option label="预定中" value="0"></el-option>
								<el-option label="已取消预定" value="1"></el-option>
								<el-option label="房源锁定" value="2"></el-option>
								<el-option label="房屋已出租" value="3"></el-option>
								<el-option label="待签合同" value="4"></el-option>
								<el-option label="已完成" value="5"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="订单编号" prop="user">
							<el-input v-model="formInline.user" placeholder="请输入订单编号"></el-input>
						</el-form-item>
						<el-form-item label="房源编号" prop="name">
							<el-input v-model="formInline.name" placeholder="请输入房源编号"></el-input>
						</el-form-item>
						<el-form-item label="订单人姓名" prop="people">
							<el-input v-model="formInline.people" placeholder="请输入订单人姓名"></el-input>
						</el-form-item>
						<el-form-item label="手机号" prop="phone">
							<el-input v-model="formInline.phone" placeholder="请输入房源编号"></el-input>
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
			<el-button type="primary" icon="el-icon-delete" @click="delOrder">删除</el-button>
			<el-button type="primary" icon="el-icon-close" @click="setOrder()">运营处理</el-button>
		</div>

		<el-table 
			:data="tableData"
			 class="dialog_set" 
			 v-loading="tableLoading" 
			 @selection-change="handleSelectionChange" 
			 element-loading-text="拼命加载中" 
			 border style="width: 100%">
			<el-table-column type="selection" width="55" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="bgOrderNumber" label="订单编号" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="bgOrderCreateTime" label="订单时间" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					{{timestampToTime(scope.row.bgOrderCreateTime)}}
				</template>
			</el-table-column>
			<el-table-column prop="orderUserName" label="订单人姓名" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="orderUserPhone" label="手机号" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="orderUserSex" label="性别" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.orderUserSex==0">男</span>
					<span v-if="scope.row.orderUserSex==1">女</span>
				</template>
			</el-table-column>
			<el-table-column prop="bgRoomNumber" label="预订房源编号" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="bgOrderStatus" label="订单状态" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<a href="javascript:;" v-if="scope.row.bgOrderStatus==0">预约中</a>
					<a href="javascript:;" v-if="scope.row.bgOrderStatus==1">已取消预约</a>
					<a href="javascript:;" v-if="scope.row.bgOrderStatus==2">房源锁定</a>
					<a href="javascript:;" v-if="scope.row.bgOrderStatus==3">房屋已出租</a>
					<a href="javascript:;" v-if="scope.row.bgOrderStatus==4">待签合同</a>
					<a href="javascript:;" v-if="scope.row.bgOrderStatus==5">已完成</a>
				</template>
			</el-table-column>
			<el-table-column prop="bgOrderCheckinDate" label="预计入住时间" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					{{timestampToTime(scope.row.bgOrderCheckinDate)}}
				</template>
			</el-table-column>
			<el-table-column prop="bgOrderRentTenancy" label="租期" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="" label="查看" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<a href="javascript:;" @click="setOrder(scope.row)">查看</a>
				</template>
			</el-table-column>
			<el-table-column prop="description" label="备注" align="center" show-overflow-tooltip>
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
		<el-dialog title="运营处理" v-loading="setLoading" :visible.sync="dialogFormVisible" :show-close="false" class="order_dialog" @close="resetDialog">
			<span style="position:absolute;left:15px;top:0;font-size:16px;">说明:<font style="color:#f56c6c">*</font>号项必填</span>
			<el-form label-width="165px" class="demo-ruleForm" :model="orderForm" :rules="rules" ref="orderForm">
				<el-row style="border-bottom:solid 1px #999;line-height:50px;">订单信息</el-row>
				<el-row>
					<el-col :span="12">
						<el-row>
							<el-col :span="12" style="text-align:right;padding-right:10px;">
								订单编号 :
							</el-col>
							<el-col :span="12">
								{{orderForm.code}}
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12" style="text-align:right;padding-right:10px;">
								订单时间 :
							</el-col>
							<el-col :span="12">
								{{timestampToTime(orderForm.time)}}
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12" style="text-align:right;padding-right:10px;">
								订单状态 :
							</el-col>
							<el-col :span="12" style="color:#FF3300" v-if="orderForm.state==0">
								预约中
							</el-col>
							<el-col :span="12" style="color:#FF3300" v-if="orderForm.state==1">
								已取消预约
							</el-col>
							<el-col :span="12" style="color:#FF3300" v-if="orderForm.state==2">
								房源锁定
							</el-col>
							<el-col :span="12" style="color:#FF3300" v-if="orderForm.state==3">
								房屋已出租
							</el-col>
							<el-col :span="12" style="color:#FF3300" v-if="orderForm.state==4">
								待签合同
							</el-col>
							<el-col :span="12" style="color:#FF3300" v-if="orderForm.state==5">
								已完成
							</el-col>
						</el-row>
					</el-col>
					<el-col :span="12">
						<el-row>
							<el-col :span="12" style="text-align:right;padding-right:10px;">
								订单人姓名 :
							</el-col>
							<el-col :span="12">
								{{orderForm.name}}
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12" style="text-align:right;padding-right:10px;">
								性别 :
							</el-col>
							<el-col :span="12" v-if="orderForm.sex==0">
								男
							</el-col>
							<el-col :span="12" v-if="orderForm.sex==1">
								女
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12" style="text-align:right;padding-right:10px;">
								手机号 :
							</el-col>
							<el-col :span="12">
								{{orderForm.phone}}
							</el-col>
						</el-row>
					</el-col>
				</el-row>
				<el-row style="border-bottom:solid 1px #999;line-height:50px;margin-bottom:0;">运营处理</el-row>
				<el-row>
					<el-steps :active="orderForm.active" finish-status="success" align-center style="margin-top:30px;">
						<el-step title="房源锁定"></el-step>
						<el-step title="缴纳房租"></el-step>
						<el-step title="签订合同"></el-step>
					</el-steps>
				</el-row>
				<el-row style="line-height:50px;margin-bottom:0;border-top:solid 1px #999;" v-if="status1==0||status1==1">房源锁定(房源锁定)</el-row>
				<el-row v-if="status1==0">
					<el-col :span="12">
						<el-row>
							<el-form-item label="是否已缴纳租房押金" prop="doPay">
								<el-select v-model="orderForm.doPay" placeholder="请选择是否已缴纳租房押金" style="width:100%;">
									<el-option label="否" value="0"></el-option>
									<el-option label="是" value="1"></el-option>
								</el-select>
							</el-form-item>
						</el-row>
						<el-row>
							<el-col :span="16">
								<el-form-item label="缴纳金额" prop="much">
									<el-input v-model="orderForm.much" placeholder="请输入缴纳金额"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="" prop="unit" label-width="0">
									<el-select v-model="orderForm.unit" placeholder="请选择单位" style="margin-left:5px;">
										<el-option label="英镑(£)" value="0"></el-option>
										<el-option label="人民币(¥)" value="1"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-form-item label="流水编号" prop="code1">
								<el-input v-model="orderForm.code1" placeholder="请输入流水编号"></el-input>
							</el-form-item>
						</el-row>
					</el-col>
					<el-col :span="12">
						<el-row>
							<el-form-item label="是否已缴纳平台服务费" prop="doService">
								<el-select v-model="orderForm.doService" placeholder="请选择是否已缴纳平台服务费" style="width:100%;">
									<el-option label="否" value="0"></el-option>
									<el-option label="是" value="1"></el-option>
								</el-select>
							</el-form-item>
						</el-row>
						<el-row>
							<el-col :span="16">
								<el-form-item label="缴纳金额" prop="much1">
									<el-input v-model="orderForm.much1" placeholder="请输入缴纳金额"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="" prop="unit1" label-width="0">
									<el-select v-model="orderForm.unit1" placeholder="请选择单位" style="margin-left:5px;">
										<el-option label="英镑(£)" value="0"></el-option>
										<el-option label="人民币(¥)" value="1"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-form-item label="流水编号" prop="code2">
								<el-input v-model="orderForm.code2" placeholder="请输入流水编号"></el-input>
							</el-form-item>
						</el-row>
					</el-col>
				</el-row>
				<el-row v-if="status1==1">
					<el-col :span="12">
						<el-row>
							<el-form-item label="处理时间 : " prop="setTime">
								{{timestampToTime(orderForm.setTime)}}
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="是否已缴纳租房押金" prop="doPay">
								{{orderForm.doPay==0?'否':'是'}}
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="缴纳金额" prop="">
								{{orderForm.unit==0?orderForm.much+'英镑(£)':orderForm.much+'人民币(¥)'}}
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="流水编号" prop="code1">
								{{orderForm.code1}}
							</el-form-item>
						</el-row>
					</el-col>
					<el-col :span="12">
						<el-row>
							<el-form-item label="处理人员 : " prop="setPeople">
								{{orderForm.setPeople}}
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="是否已缴纳平台服务费" prop="doService">
								{{orderForm.doService==0?'否':'是'}}
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="缴纳金额" prop="much1">
								{{orderForm.unit1==0?orderForm.much1+'英镑(£)':orderForm.much1+'人民币(¥)'}}
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="流水编号" prop="code2">
								{{orderForm.code2}}
							</el-form-item>
						</el-row>
					</el-col>
				</el-row>
				<el-row style="border-top:solid 1px #999;line-height:50px;margin-bottom:0;" v-if="status2==0||status2==1">缴纳房租(待签租房合同)</el-row>
				<el-row style="padding:0 200px;" v-if="status2==0">
					<el-form-item label="是否已缴纳房租" prop="doRent">
						<el-select v-model="orderForm.doRent" placeholder="请选择是否已缴纳房租" style="width:100%;">
							<el-option label="否" value="0"></el-option>
							<el-option label="是" value="1"></el-option>
						</el-select>
					</el-form-item>
				</el-row>
				<el-row style="padding:0 200px;" v-if="status2==0">
					<el-col :span="16">
						<el-form-item label="缴纳金额" prop="premium">
							<el-input v-model="orderForm.premium" placeholder="请输入缴纳金额"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="" prop="unit2" label-width="0">
							<el-select v-model="orderForm.unit2" placeholder="请选择单位" style="margin-left:5px;">
								<el-option label="英镑(£)" value="0"></el-option>
								<el-option label="人民币(¥)" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="padding:0 200px;" v-if="status2==0">
					<el-form-item label="流水编号" prop="code3">
						<el-input v-model="orderForm.code3" placeholder="请输入流水编号"></el-input>
					</el-form-item>
				</el-row>
				<el-row style="padding:0 100px;" v-if="status2==1">
					<el-col :span="12">
						<el-form-item label="处理时间" prop="setTime1">
							{{timestampToTime(orderForm.setTime1)}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="处理人员" prop="setPeople1">
							{{orderForm.setPeople1}}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="padding:0 100px;" v-if="status2==1">
					<el-form-item label="是否已缴纳房租" prop="doRent">
						{{orderForm.doRent==0?'否':'是'}}
					</el-form-item>
				</el-row>
				<el-row style="padding:0 100px;" v-if="status2==1">
					<el-form-item label="缴纳金额" prop="">
						{{orderForm.unit2==0?orderForm.premium+'英镑(£)':orderForm.premium+'人民币(¥)'}}
					</el-form-item>
				</el-row>
				<el-row style="padding:0 100px;" v-if="status2==1">
					<el-form-item label="流水编号" prop="code1">
						{{orderForm.code3}}
					</el-form-item>
				</el-row>
				
				<el-row style="border-top:solid 1px #999;line-height:50px;margin-bottom:0;" v-if="status3==0||status3==1">签订合同(已完成)</el-row>
				<el-row style="padding:0 200px;" v-if="status3==0">
					<el-form-item label="是否已签订租房合同" prop="signed">
						<el-select v-model="orderForm.signed" placeholder="请选择是否已签订租房合同" style="width:100%;">
							<el-option label="否" value="0"></el-option>
							<el-option label="是" value="1"></el-option>
						</el-select>
					</el-form-item>
				</el-row>
				<el-row style="padding:0 200px;" v-if="status3==0">
					<el-form-item label="合同编号" prop="code4">
						<el-input v-model="orderForm.code4" placeholder="请输入合同编号"></el-input>
					</el-form-item>
				</el-row>
				<el-row style="padding:0 100px;" v-if="status3==1">
					<el-col :span="12">
						<el-form-item label="处理时间" prop="setTime2">
							{{timestampToTime(orderForm.setTime2)}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="处理人员" prop="setPeople2">
							{{orderForm.setPeople2}}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="padding:0 100px;" v-if="status3==1">
					<el-form-item label="是否已签订租房合同" prop="signed">
						{{orderForm.signed==0 ? '否' : '是'}}
					</el-form-item>
				</el-row>
				<el-row style="padding:0 100px;" v-if="status3==1">
					<el-form-item label="合同编号" prop="code4">
						{{orderForm.code4}}
					</el-form-item>
				</el-row>
				
				<el-row style="border-top:solid 1px #999;height:50px;margin-bottom:0;"></el-row>
				<el-form-item label="备注 : " prop="desc">
					<el-input type="textarea" v-model="orderForm.desc"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
				<el-button type="primary" @click="submit2('orderForm')">确 定</el-button>
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
				total:0,
				pageSize:10,
				currentPage:1,
				dialogVisible: false,
				selectList:[],
				formInline: {
					region:'',
					user: '',
					name: '',
					date: '',
					people:'',
					photo:''
				},
				tableData: [],
				dialogFormVisible: false,
				orderForm: {
					// 订单信息
					code:'',
					name:'',
					time:'',
					sex:'',
					state:'',
					phone:'',
					// 运营处理
					step:'',
					active:0,
					// 房源锁定
					doPay:'0',
					doService:'0',
					much:'',
					unit:'0',
					much1:'',
					unit1:'0',
					code1:'',
					code2:'',
					setPeople:'',
					setTime:'',
					// 缴纳房租
					setPeople1:'',
					setTime1:'',
					doRent:'0',
					premium:'',
					unit2:'0',
					code3:'',
					// 签订合同
					setPeople2:'',
					setTime2:'',
					signed:'0',
					code4:'',
					// 备注
					desc:'',
				},
				rules:{
					doPay:[
						{ required: true, message: '请选择是否已缴纳租房押金', trigger: 'change' }
					],
					much:[
						{ required: true, message: '请输入缴纳金额', trigger: 'blur' }
					],
					unit:[
						{ required: true, message: '请选择单位', trigger: 'change' }
					],
					code1:[
						{ required: true, message: '请输入流水编号', trigger: 'blur' }
					],
					doService:[
						{ required: true, message: '请选择是否已缴纳平台服务费', trigger: 'change' }
					],
					much1:[
						{ required: true, message: '请输入缴纳金额', trigger: 'blur' }
					],
					unit1:[
						{ required: true, message: '请选择单位', trigger: 'change' }
					],
					code2:[
						{ required: true, message: '请输入流水编号', trigger: 'blur' }
					],
					doRent:[
						{ required: true, message: '请选择是否已缴纳房租', trigger: 'change' }
					],
					premium:[
						{ required: true, message: '请输入缴纳金额', trigger: 'blur' }
					],
					unit2:[
						{ required: true, message: '请选择单位', trigger: 'change' }
					],
					code3:[
						{ required: true, message: '请输入流水编号', trigger: 'blur' }
					],
					signed:[
						{ required: true, message: '请选择是否已签订租房合同', trigger: 'change' }
					],
					code4:[
						{ required: true, message: '请输入合同编号', trigger: 'blur' }
					],
				},
				status1:0,
				status2:0,
				status3:0,
				setLoading:false,
				state:'',
				submitCode:''
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
				this.tableLoading = true;
				let startDate = '';
				let endDate = '';
				if (this.formInline.date != '') {
					startDate = new Date(this.formInline.date[0]).toISOString(); //将获取的北京时间GST时间转换成UTC时间格式 .toISOString()方法ie9以下浏览器不识别
					endDate = new Date(this.formInline.date[1]).toISOString();
				}
				let bgOrderStatus=this.formInline.region;
				let bgOrderNumber=this.formInline.user;
				let bgRoomNumber=this.formInline.name;
				let orderUserName=this.formInline.people;
				let orderUserPhone=this.formInline.phone;
				let data={
					"bgOrderNumber":bgOrderNumber,
					"bgOrderStatus":bgOrderStatus,
					"bgRoomNumber":bgRoomNumber,
					"endDate":endDate,
					"orderUserName":orderUserName,
					"orderUserPhone":orderUserPhone,
					"page": {
						"currentPage":this.currentPage,
						"pageSize":this.pageSize
					},
					"startDate":startDate
				};
				this.$axios({
					method: 'post',
					url: '/order/findByCondition',
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
						this.tableLoading=false;
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
			submit2(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(this.state==0){
							console.log(this.submitCode)
							this.setLoading=true;
							let description=this.orderForm.desc;
							if(this.submitCode==1){
								let bgOrderRentDepositFlag=this.orderForm.doPay;
								let bgOrderRentDepositMoney=this.orderForm.much;
								let bgOrderRentDepositUnit=this.orderForm.unit;
								let bgOrderRentDepositSerialnum=this.orderForm.code1;
								let bgOrderRentServiceFlag=this.orderForm.doService;
								let bgOrderRentServiceMoney=this.orderForm.much1;
								let bgOrderRentServiceUnit=this.orderForm.unit1;
								let bgOrderRentServiceSeralnum=this.orderForm.code2;
								let data1={
									"bgOrderId":this.selectList[0].bgOrderId,
									"bgOrderRentDepositFlag":bgOrderRentDepositFlag,
									"bgOrderRentDepositMoney":bgOrderRentDepositMoney,
									"bgOrderRentDepositSerialnum":bgOrderRentDepositSerialnum,
									"bgOrderRentDepositUnit":bgOrderRentDepositUnit,
									"bgOrderRentServiceFlag":bgOrderRentServiceFlag,
									"bgOrderRentServiceMoney":bgOrderRentServiceMoney,
									"bgOrderRentServiceSeralnum":bgOrderRentServiceSeralnum,
									"bgOrderRentServiceUnit":bgOrderRentServiceUnit,
									"description":description
								};
								this.$axios({
									method: 'post',
									url: '/order/lockRoom',
									contentType: 'application/json',
									headers:{
										"wkToken":sessionStorage.token,
									},
									data: data1,
								}).then((response) => {
									console.log(response);
									if(response.data.code==0){
										this.$notify.success({
											title: '成功',
											message: '运营处理成功'
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
												message: '运营处理失败，请稍后重试'
											});
										});
									}else{
										this.$notify.error({
											title: '失败',
											message: '运营处理失败，请稍后重试'
										});
									}
									this.setLoading=false;
								}).catch((error) => {
									console.log(error);
									this.setLoading=false;
									this.$notify.error({
										title: '失败',
										message: '运营处理失败，请稍后重试'
									});
								})
							}else if(this.submitCode==2){
								let bgOrderRentFlag=this.orderForm.doRent;
								let bgOrderRentMoney=this.orderForm.premium;
								let bgOrderRentUnit=this.orderForm.unit2;
								let bgOrderRentSerialnum=this.orderForm.code3;
								let data2={
									"bgOrderId":this.selectList[0].bgOrderId,
									"bgOrderRentFlag":bgOrderRentFlag,
									"bgOrderRentMoney":bgOrderRentMoney,
									"bgOrderRentUnit":bgOrderRentUnit,
									"bgOrderRentSerialnum":bgOrderRentSerialnum,
									"description":description
								};
								this.$axios({
									method: 'post',
									url: '/order/payRent',
									contentType: 'application/json',
									headers:{
										"wkToken":sessionStorage.token,
									},
									data: data2,
								}).then((response) => {
									console.log(response);
									if(response.data.code==0){
										this.$notify.success({
											title: '成功',
											message: '运营处理成功'
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
												message: '运营处理失败，请稍后重试'
											});
										});
									}else{
										this.$notify.error({
											title: '失败',
											message: '运营处理失败，请稍后重试'
										});
									}
									this.setLoading=false;
								}).catch((error) => {
									console.log(error);
									this.setLoading=false;
									this.$notify.error({
										title: '失败',
										message: '运营处理失败，请稍后重试'
									});
								})
							}else{
								let bgOrderRentContractFlag=this.orderForm.signed;
								let bgOrderRentContractSerialnum=this.orderForm.code4;
								let data3={
									"bgOrderId":this.selectList[0].bgOrderId,
									"bgOrderRentContractFlag":bgOrderRentContractFlag,
									"bgOrderRentContractSerialnum":bgOrderRentContractSerialnum,
									"description":description
								};
								this.$axios({
									method: 'post',
									url: '/order/signContract',
									contentType: 'application/json',
									headers:{
										"wkToken":sessionStorage.token,
									},
									data: data3,
								}).then((response) => {
									console.log(response);
									if(response.data.code==0){
										this.$notify.success({
											title: '成功',
											message: '运营处理成功'
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
												message: '运营处理失败，请稍后重试'
											});
										});
									}else{
										this.$notify.error({
											title: '失败',
											message: '运营处理失败，请稍后重试'
										});
									}
									this.setLoading=false;
								}).catch((error) => {
									console.log(error);
									this.setLoading=false;
									this.$notify.error({
										title: '失败',
										message: '运营处理失败，请稍后重试'
									});
								})
							}
						}else{
							this.dialogFormVisible=false;
						}
					} else {
						return false;
					}
				});
			},
			delOrder(){
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
						let id=list[0].bgOrderId;
						this.$axios({
							method: 'post',
							url: '/order/delete',
							contentType: 'application/json',
							headers:{
								"wkToken":sessionStorage.token,
							},
							data: {"bgOrderId":id},
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
			setOrder(data){
				if(data==undefined){
					this.state=0;
					let list=this.selectList;
					if(list.length>1){
						this.$notify.error({
							title: '失败',
							message: '只能选择一行数据！'
						});
					}else if(list.length==1){
						this.orderForm.code=list[0].bgOrderNumber;
						this.orderForm.name=list[0].orderUserName;
						this.orderForm.time=list[0].bgOrderCreateTime;
						this.orderForm.sex=list[0].orderUserSex;
						this.orderForm.state=list[0].bgOrderStatus;
						this.orderForm.phone=list[0].orderUserPhone;
						this.orderForm.setTime=list[0].createTime;
						this.orderForm.setPeople=list[0].createBy;
						this.orderForm.doPay=list[0].bgOrderRentDepositFlag;
						this.orderForm.doService=list[0].bgOrderRentServiceFlag;
						this.orderForm.much=list[0].bgOrderRentDepositMoney;
						this.orderForm.unit=list[0].bgOrderRentDepositUnit;
						this.orderForm.much1=list[0].bgOrderRentServiceMoney;
						this.orderForm.unit1=list[0].bgOrderRentServiceUnit;
						this.orderForm.code1=list[0].bgOrderRentDepositSerialnum;
						this.orderForm.code2=list[0].bgOrderRentServiceSeralnum;
						this.orderForm.setTime1=list[0].createTime;
						this.orderForm.setPeople1=list[0].createBy;
						this.orderForm.doRent=list[0].bgOrderRentFlag;
						this.orderForm.premium=list[0].bgOrderRentMoney;
						this.orderForm.unit2=list[0].bgOrderRentUnit;
						this.orderForm.code3=list[0].bgOrderRentSerialnum;
						this.orderForm.setTime2=list[0].createTime;
						this.orderForm.setPeople2=list[0].createBy;
						this.orderForm.signed=list[0].bgOrderRentContractFlag;
						this.orderForm.code4=list[0].bgOrderRentContractSerialnum;
						if(list[0].bgOrderRentDepositFlag==1&&list[0].bgOrderRentServiceFlag==1){
							this.orderForm.active=1;
							this.status1=1;
							if(list[0].bgOrderRentFlag==1){
								this.orderForm.active=2;
								this.status2=1;
								if(list[0].bgOrderRentContractFlag==1){
									this.orderForm.active=3;
									this.status3=1;
								}else{
									this.status3=0;
									this.submitCode=3;
								}
							}else{
								this.status2=0;
								this.status3=2;
								this.submitCode=2;
							}
						}else{
							this.status1=0;
							this.status2=2;
							this.status3=2;
							this.submitCode=1;
						}
						this.orderForm.desc=list[0].description;
						this.dialogFormVisible=true;
					}else{
						this.$notify.error({
							title: '失败',
							message: '请选择一行信息！'
						});
					}
				}else{
					this.state=1;
					let list=data;
					this.orderForm.code=list.bgOrderNumber;
					this.orderForm.name=list.orderUserName;
					this.orderForm.time=list.bgOrderCreateTime;
					this.orderForm.sex=list.orderUserSex;
					this.orderForm.state=list.bgOrderStatus;
					this.orderForm.phone=list.orderUserPhone;
					if(list.bgOrderRentDepositFlag==1&&list.bgOrderRentServiceFlag==1){
						this.orderForm.setTime=list.createTime;
						this.orderForm.setPeople=list.createBy;
						this.orderForm.doPay=list.bgOrderRentDepositFlag;
						this.orderForm.doService=list.bgOrderRentServiceFlag;
						this.orderForm.much=list.bgOrderRentDepositMoney;
						this.orderForm.unit=list.bgOrderRentDepositUnit;
						this.orderForm.much1=list.bgOrderRentServiceMoney;
						this.orderForm.unit1=list.bgOrderRentServiceUnit;
						this.orderForm.code1=list.bgOrderRentDepositSerialnum;
						this.orderForm.code2=list.bgOrderRentServiceSeralnum;
						
						this.orderForm.active=1;
						this.status1=1;
					}else{
						this.status1=2;
					}
					if(list.bgOrderRentFlag==1){
						this.orderForm.setTime1=list.createTime;
						this.orderForm.setPeople1=list.createBy;
						this.orderForm.doRent=list.bgOrderRentFlag;
						this.orderForm.premium=list.bgOrderRentMoney;
						this.orderForm.unit2=list.bgOrderRentUnit;
						this.orderForm.code3=list.bgOrderRentSerialnum;
						
						this.orderForm.active=2;
						this.status2=1;
					}else{
						this.status2=2;
					}
					if(list.bgOrderRentContractFlag==1){
						this.orderForm.setTime2=list.createTime;
						this.orderForm.setPeople2=list.createBy;
						this.orderForm.signed=list.bgOrderRentContractFlag;
						this.orderForm.code4=list.bgOrderRentContractSerialnum;
						
						this.orderForm.active=3;
						this.status3=1;
					}else{
						this.status3=2;
					}
					this.orderForm.desc=list.description;
					this.dialogFormVisible=true;
				}
			},
			resetDialog(){
				this.orderForm={
					// 订单信息
					code:'',
					name:'',
					time:'',
					sex:'',
					state:'',
					phone:'',
					// 运营处理
					step:'',
					active:0,
					// 房源锁定
					doPay:'0',
					doService:'0',
					much:'',
					unit:'0',
					much1:'',
					unit1:'0',
					code1:'',
					code2:'',
					setPeople:'',
					setTime:'',
					// 缴纳房租
					setPeople1:'',
					setTime1:'',
					doRent:'0',
					premium:'',
					unit2:'0',
					code3:'',
					// 签订合同
					setPeople2:'',
					setTime2:'',
					signed:'0',
					code4:'',
					// 备注
					desc:'',
				};
				this.status1=0;
				this.status2=0;
				this.status3=0;
			}	
		}
	}
</script>

<style lang="scss">
	.order_manage{
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
				.el-form-item{
					margin-bottom:0;
				}
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
		
		.order_dialog .el-dialog {
			width: 910px!important;
		}
	}
	
</style>