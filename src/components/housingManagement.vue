<template>
	<div class="housing">
		<el-row>
			<el-col :span="24">
				<div class="grid-content bg-purple-dark">
					<el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
						<el-form-item label="房屋状态" prop="region">
							<el-select v-model="formInline.region" placeholder="请选择房屋状态">
								<el-option label="全部" value="6"></el-option>
								<el-option label="出租中" value="1"></el-option>
								<el-option label="已被预订" value="2"></el-option>
								<el-option label="房源锁定" value="3"></el-option>
								<el-option label="待签租房合同" value="4"></el-option>
								<el-option label="已出租" value="5"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="所属商家" prop="user">
							<el-select v-model="formInline.user" filterable placeholder="请选择所属商家">
								<el-option v-for="item in selectData" :key="item.$index" :value="item.bgMerchantId" :label="item.bgMerchantName"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="房源编号" prop="name">
							<el-input v-model="formInline.name" placeholder="请输入房源标号"></el-input>
						</el-form-item>
						<el-form-item label="起止时间" prop="date">
							<el-date-picker 
								v-model="formInline.date" 
								type="daterange" 
								range-separator="至" 
								start-placeholder="开始日期" 
								end-placeholder="结束日期"
								:default-time="['00:00:00', '23:59:59']"
								:disabled="formInline.type">
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
			<el-button type="primary" icon="el-icon-plus" @click="openDialog('0')">新增</el-button>
			<el-button type="primary" icon="el-icon-edit" @click="openDialog('1')">修改</el-button>
			<el-button type="primary" icon="el-icon-download" @click="downElenent">下架房源</el-button>
		</div>

		<el-table 
			:data="tableData" 
			v-loading="tableLoading" 
			element-loading-text="拼命加载中" 
			border 
			style="width: 100%;"
			class="dialog_set"
			@selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="bgRoomNumber" label="商家编号" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="bgRoomMerchantId" label="所属商家" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="bgRoomPrice" label="价格" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="bgRoomStatus" label="房源状态" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.bgRoomStatus==1">出租中</span>
					<span v-if="scope.row.bgRoomStatus==2">已被预订</span>
					<span v-if="scope.row.bgRoomStatus==3">房源锁定</span>
					<span v-if="scope.row.bgRoomStatus==4">待签租房合同</span>
					<span v-if="scope.row.bgRoomStatus==5">已出租</span>
					<span v-if="scope.row.bgRoomStatus==6">已下架</span>
				</template>
			</el-table-column>
			<el-table-column prop="bgRoomViewNum" label="房源浏览人数" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="bgRoomAppointNum" label="预约人数" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="bgRoomRecommend" label="是否为推荐房源" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.bgRoomRecommend==0">否</span>
					<span v-if="scope.row.bgRoomRecommend==1">是</span>
				</template>
			</el-table-column>
			<el-table-column prop="bgRoomTipsText" label="房源标签" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="bgRoomPrice" label="创建时间" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					{{timestampToTime(scope.row.createTime)}}
				</template>
			</el-table-column>
			<el-table-column prop="description" label="备注" show-overflow-tooltip align="center">
			</el-table-column>
		</el-table>

		<el-pagination background layout="total, sizes, prev, pager, next, jumper" 
			:total="total" 
			:page-sizes="[10, 20, 30, 40, 50]" 
			:page-size="pageSize" 
			:current-page="currentPage"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange">
		</el-pagination>

		<!--新增弹出层-->
		<el-dialog :title="titleText" v-loading="dialogLoading" :visible.sync="dialogFormVisible" @close="dialogClose" :show-close="false">
			<span style="position:absolute;left:15px;top:0;font-size:16px;">说明:<font style="color:#f56c6c">*</font>号项必填</span>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
				<el-form-item label="标题 : " prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入标题"></el-input>
				</el-form-item>
				<el-row style="margin-bottom:0;" :gutter="10">
					<el-col :span="8">
						<el-form-item label="地址 : " prop="country">
							<el-select v-model="ruleForm.country" placeholder="所属国家" @change="countryChange" style="">
								<el-option v-for="item in countryData" :key="item.areaName" :label="item.areaName" :value="item.areaParentCode"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="" prop="city" label-width="0">
							<el-select v-model="ruleForm.city" placeholder="所属城市" style="width:100%">
								<el-option v-for="ci in cityData" :key="ci.areaName" :label="ci.areaName" :value="ci.areaCode"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="" prop="address" label-width="0">
							<el-input v-model="ruleForm.address" placeholder="详细地址" style=""></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="margin-bottom:0" :gutter="10">
					<el-col :span="8">
						<el-form-item label="经纬度 : " prop="lat" required>
							<el-input v-model="ruleForm.lat" placeholder="请输入经度" style=""></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="" prop="long" label-width="0">
							<el-input v-model="ruleForm.long" placeholder="请输入纬度" style=""></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="margin-bottom:0" :gutter="10">
					<el-col :span="8">
						<el-form-item label="价格(英镑) : " prop="pice" required>
							<el-input v-model="ruleForm.pice" placeholder="请输入价格" style=""></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="" prop="time" label-width="0">
							<el-select v-model="ruleForm.time" placeholder="" style="width:100%">
								<el-option label="周" value="0"></el-option>
								<el-option label="月" value="1"></el-option>
								<el-option label="年" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="最多预约人数 : " prop="much" required>
					<el-select v-model="ruleForm.much" placeholder="" style="width:120px;">
						<el-option label="1" value="1"></el-option>
						<el-option label="2" value="2"></el-option>
						<el-option label="3" value="3"></el-option>
						<el-option label="4" value="4"></el-option>
						<el-option label="5" value="5"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否为推荐房源 : " prop="resource" required>
					<el-radio-group v-model="ruleForm.resource">
						<el-radio label="1">是</el-radio>
						<el-radio label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="房源标签 : " prop="type" required>
					<el-checkbox-group v-model="ruleForm.type">
						<el-checkbox v-for="t in typeData" :label="t.bgDataDictValueId" :key="t.bgDataDictValueId">{{t.bgDataDictValue}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-row style="margin-bottom:0" :gutter="10">
					<el-col :span="10">
						<el-form-item label="所属房屋公司 : " prop="company" style="" >
							<el-select v-model="ruleForm.company" placeholder="" style="">
								<el-option v-for="item in selectData" :key="item.$index" :value="item.bgMerchantId" :label="item.bgMerchantName"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="房屋性质 : " prop="comp" style="" label-width="100px">
							<el-select v-model="ruleForm.comp" placeholder="" style="width:100%;">
								<el-option v-for="c in compData" :label="c.bgDataDictValue" :key="c.bgDataDictValueId" :value="c.bgDataDictValueId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="房屋类型 : " prop="com" style="" label-width="100px">
							<el-select v-model="ruleForm.com" placeholder="" style="width:100%;">
								<el-option v-for="a in comData" :label="a.bgDataDictValue" :key="a.bgDataDictValueId" :value="a.bgDataDictValueId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>	
				<el-form-item label="商家营业执照 : " required>
					<el-upload 
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
				<el-form-item label="房屋详情 : " prop="details">
					<el-input type="textarea" v-model="ruleForm.details" placeholder="填写此处内容时，请按特定格式填写。"></el-input>
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

		<!--运营处理-->
		<el-dialog title="下架房源" v-loading="downLoading" :visible.sync="dialogFormVisible2" :show-close="false" class="down-dialog">
			<span style="position:absolute;left:15px;top:0;font-size:16px;">说明 : <font style="color:#f56c6c">*</font>号项必填</span>
			<div class="down-content">
				<p>您确定要下架当前房源么？</p>
				<p>房源下架后，与该房源相关联的订单状态都会变为："房源已下架"。</p>
				<p>如需再上架该房源，可重新新增该房源信息。</p>
			</div>
			<div slot="footer" class="dialog-footer" style="text-align:right;padding-right:35px;">
				<el-button type="primary" @click="submit3">确 定</el-button>
				<el-button @click="dialogFormVisible2 = false">关闭</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				downLoading:false,
				dialogLoading:false,
				titleText:'',
				countryData:[],
				cityData:[],
				compData:[],
				typeData:[],
				comData:[],
				selectList:[],
				dialogVisible: false,
				total:0,
				pageSize:10,
				currentPage:1,
				tableLoading:false,
				selectData:[],
				formInline: {
					region: '6',
					user: '',
					name: '',
					date: '',
					type:false
				},
				tableData: [],
				dialogFormVisible: false,
				ruleForm: {
					name: '',
					country:'',
					city:'',
					address:'',
					lat:'',
					long:'',
					pice:'',
					time:'0',
					much:'1',
					resource: '',
					company:'',
					comp:'',
					com:'',
					desc: '',
					img: [],
					msg: "请上传图片",
					key: false,
					type: [],
					details:''
				},
				rules: {
					name: [{
						required: true,
						message: '请输入商家全称',
						trigger: 'blur'
					}],
					country: [{
						required: true,
						message: '请选择所属国家',
						trigger: 'blur'
					}],
					city:[{
						required: true,
						message: '请选择所属城市',
						trigger: 'blur'
					}],
					address:[{
						required: true,
						message: '请输入详细地址',
						trigger: 'blur'
					}],
					lat:[{
						required: true,
						message: '请输入经度',
						trigger: 'blur'
					}],
					long:[{
						required: true,
						message: '请输入纬度',
						trigger: 'blur'
					}],
					pice:[{
						required: true,
						message: '请输入价格',
						trigger: 'blur'
					}],
					resource: [{
						required: true,
						message: '请选择是否启用',
						trigger: 'change'
					}],
					type: [{
						required: true,
						message: '请选择房源标签',
						trigger: 'change'
					}],
					company: [{
						required: true,
						message: '请选择所属房屋公司',
						trigger: 'change'
					}],
					comp: [{
						required: true,
						message: '请选择房屋性质',
						trigger: 'change'
					}],
					com: [{
						required: true,
						message: '请选择房屋类型',
						trigger: 'change'
					}],
					details:[{
						required: true,
						message: '请输入房屋详情',
						trigger: 'blur'
					}]
				},
				dialogFormVisible2: false
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
			// 获取所有商家
			getSelect(){
				this.$axios({
					method: 'get',
					url: '/merchant/queryAllMerchant',
					contentType: 'application/json',
				}).then((response)=> {
					this.selectData=response.data;
				}).catch((error)=> {
					console.log(error);
				})
			},
			// 查询国家
			getCountry(){
				this.$axios({
					method: 'get',
					url:'/area/queryCountryInfo',
					contentType: 'application/json',
				}).then((response)=> {
					console.log(response);
					if(response.data.code==0){
						this.countryData=response.data.result;
					}
				}).catch((error)=> {
					console.log(error);
				})
			},
			// 选中国家变化时
			countryChange(val){
				this.ruleForm.city='';
				this.$axios({
					method: 'post',
					url:'/area/findByParentCode',
					contentType: 'application/json',
					headers:{
						"wkToken":sessionStorage.token,
					},
					data:{"areaParentCode":val},
				}).then((response)=> {
					console.log(response);
					if(response.data.code==0){
						this.cityData=response.data.result;
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
							this.cityData=[];
							this.$notify.error({
								title: '失败',
								message: '获取城市失败，请稍后重试！'
							});
						});
					}else{
						this.cityData=[];
						this.$notify.error({
							title: '失败',
							message: '获取城市失败，请稍后重试！'
						});
					}
				}).catch((error)=> {
					console.log(error);
					this.cityData=[];
					this.$notify.error({
						title: '失败',
						message: '获取城市失败，请稍后重试！'
					});
				})
			},
			// 获取房屋性质
			getComp(){
				this.$axios({
					method: 'get',
					url:'/houseProperty/queryList',
					contentType: 'application/json',
				}).then((response)=> {
					this.compData=response.data;
				}).catch((error)=> {
					console.log(error);
				})
			},
			// 获取房屋类型
			getCom(){
				this.$axios({
					method: 'get',
					url:'/houseType/queryList',
					contentType: 'application/json',
				}).then((response)=> {
					this.comData=response.data;
				}).catch((error)=> {
					console.log(error);
				})
			},
			// 获取房源标签
			getType(){
				this.$axios({
					method: 'get',
					url:'/houseLabel/queryList',
					contentType: 'application/json',
				}).then((response)=> {
					this.typeData=response.data;
				}).catch((error)=> {
					console.log(error);
				})
			},
			onSubmit() {
				this.tableLoading=true;
				this.formInline.type=true;
				let bgRoomStatus=this.formInline.region;
				let bgRoomMerchantId=this.formInline.user;
				let bgRoomNumber=this.formInline.name;
				if(bgRoomStatus=="6"){bgRoomStatus=''};
				let startDate='';
				let endDate='';
				let pageSize=this.pageSize;
				let currentPage=this.currentPage;
				if(this.formInline.date!=''){
					startDate=new Date(this.formInline.date[0]).toISOString();//将获取的北京时间GST时间转换成UTC时间格式 .toISOString()方法ie9以下浏览器不识别
					endDate=new Date(this.formInline.date[1]).toISOString();
				}
				let data={
					"bgRoomStatus":bgRoomStatus,
					"bgRoomMerchantId":bgRoomMerchantId,
					"bgRoomNumber":bgRoomNumber,
					"endDate":endDate,
					"startDate":startDate,
					"page": {
						"currentPage":currentPage,
						"pageSize": pageSize,
						"pageTotal": '',
					}
				};
				this.$axios({
					method: 'post',
					url: '/room/findByCondition',
					contentType: 'application/json',
					headers:{
						"wkToken":sessionStorage.token,
					},
					data:data,
				}).then((response)=> {
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
								message: '请稍后重试！'
							});
						});
					}else if(response.data.rows.length>0){
						this.tableData=response.data.rows;
						this.total=response.data.total;
					}else{
						this.$notify.error({
							title: '查询失败',
							message: '请稍后重试！'
						});
					}
					this.tableLoading=false;
					this.formInline.type=false;
				}).catch((error)=> {
					console.log(error);
					this.tableLoading=false;
					this.formInline.type=false;
					this.$notify.error({
						title: '查询失败',
						message: '请稍后重试！'
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
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			// 弹出层关闭时的回调
			dialogClose(){
				this.resetForm('ruleForm');
				this.ruleForm.city='';
				this.ruleForm.country='';
				this.ruleForm.address='';
				this.ruleForm.lat='';
				this.ruleForm.long='';
				this.ruleForm.details='';
				this.ruleForm.much='1';
				this.ruleForm.company='';
				this.ruleForm.name='';
				this.ruleForm.pice='';
				this.ruleForm.time='0';
				this.ruleForm.comp='';
				this.ruleForm.resource='';
				this.ruleForm.com='';
				this.ruleForm.desc='';
				this.ruleForm.type=[];
				this.titleText='';
				this.ruleForm.img=[];
			},
			// 打开弹出层
			openDialog(data){
				if(data=='0'){
					this.titleText="新增";
					this.dialogFormVisible=true;
				}else{
					let list = this.selectList;
					if (list.length > 0) {
						if (list.length > 1) {
							this.$notify.error({
								title: '失败',
								message: '只能选择一行数据！'
							});
						} else {
							let fileArr = list[0].attachIdList;
							if (fileArr.length > 0) {
								for (var i = 0; i < fileArr.length; i++) {
									this.ruleForm.img.push({
										url: '/attach/getAttachById?picAttachId=' + fileArr[i]
									});
								}
							}
							let bgRoomTips='';
							if(list[0].bgRoomTips!=null&&list[0].bgRoomTips!=''){
								bgRoomTips=list[0].bgRoomTips.replace(/\s+/g,"");
							}else{
								bgRoomTips='';
							}
							this.ruleForm.city=list[0].bgRoomAddressCity;
							this.ruleForm.country=list[0].bgRoomAddressCountry;
							this.ruleForm.address=list[0].bgRoomAddressDetail;
							this.ruleForm.lat=list[0].bgRoomAddressX;
							this.ruleForm.long=list[0].bgRoomAddressY;
							this.ruleForm.details=list[0].bgRoomDetail;
							this.ruleForm.much=list[0].bgRoomMaxAppointNum;
							this.ruleForm.company=list[0].bgRoomMerchantId;
							this.ruleForm.name=list[0].bgRoomName;
							this.ruleForm.pice=list[0].bgRoomPrice;
							this.ruleForm.time=list[0].bgRoomPriceUnit;
							this.ruleForm.comp=list[0].bgRoomProperty;
							this.ruleForm.resource=list[0].bgRoomRecommend;
							this.ruleForm.com=list[0].bgRoomType;
							this.ruleForm.desc=list[0].description;
							this.ruleForm.type=bgRoomTips.split(',');
							this.titleText="修改";
							this.dialogFormVisible=true;
						}
					}else{
						this.$notify.error({
							title: '失败',
							message: '请选择一行信息！'
						});
					}
				}
			},
			//表格选择行改变时的钩子
			handleSelectionChange(val) {
				this.selectList = val;
				console.log(this.selectList)
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
						url: '/room/upload',
						contentType: 'application/json',
						headers:{
							"wkToken":sessionStorage.token,
						},
						data: uploadFile,
					}).then((response) => {
						if (response.data.code == 0) {
							callback(response.data);
						} else if(response.data.code == (-999)){
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
						}else {
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
			submit2(formName) {
				this.$refs[formName].validate((valid) => {
					let imgList=this.ruleForm.img;
					if(valid&&imgList.length>0) {
						this.ruleForm.key = false;
						this.dialogLoading = true;
						let title=this.titleText;
						if(title=="新增"){
							this.uploadImg(imgList,(data)=>{
								console.log(data);
								if(data!='false'){
									let picArr=[];
									for(var i=0;i<data.result.length;i++){
										picArr.push(data.result[i].picAttachId);
									}
									let addData={
										"attachIdList":picArr,
										"bgRoomAddressCity":this.ruleForm.city,
										"bgRoomAddressCountry":this.ruleForm.country,
										"bgRoomAddressDetail":this.ruleForm.address,
										"bgRoomAddressX":this.ruleForm.lat,
										"bgRoomAddressY": this.ruleForm.long,
										"bgRoomDetail":this.ruleForm.details,
										"bgRoomMaxAppointNum":this.ruleForm.much,
										"bgRoomMerchantId":this.ruleForm.company,
										"bgRoomName": this.ruleForm.name,
										"bgRoomPrice":this.ruleForm.pice,
										"bgRoomPriceUnit":this.ruleForm.time,
										"bgRoomProperty":this.ruleForm.comp,
										"bgRoomRecommend":this.ruleForm.resource,
										"bgRoomType":this.ruleForm.com,
										"description":this.ruleForm.desc,
										"roomLabelIdList":this.ruleForm.type
									};
									this.$axios({
										method: 'post',
										url: '/room/insert',
										contentType: 'application/json',
										headers:{
											"wkToken":sessionStorage.token,
										},
										data: addData,
									}).then((response) => {
										if (response.data.code == 0) {
											this.dialogFormVisible=false;
											this.$notify.success({
												title: '成功',
												message: '新增房源成功！'
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
													message: '新增房源失败，请稍后重试！'
												});
											});
										} else {
											this.$notify.error({
												title: '失败',
												message: '新增房源失败，请稍后重试！'
											});
										}
										this.dialogLoading = false;
									}).catch((error) => {
										console.log(error);
										this.$notify.error({
											title: '失败',
											message: '新增房源失败，请稍后重试！'
										});
										this.dialogLoading = false;
									})
								}else{
									this.dialogLoading = false;	
								}
							});
						}else{
							this.visupload(imgList,(data)=>{
								console.log(data);
								let visData={
									"attachIdList":data,
									"bgRoomAddressCity":this.ruleForm.city,
									"bgRoomAddressCountry":this.ruleForm.country,
									"bgRoomAddressDetail":this.ruleForm.address,
									"bgRoomAddressX":this.ruleForm.lat,
									"bgRoomAddressY": this.ruleForm.long,
									"bgRoomDetail":this.ruleForm.details,
									"bgRoomMaxAppointNum":this.ruleForm.much,
									"bgRoomMerchantId":this.ruleForm.company,
									"bgRoomName": this.ruleForm.name,
									"bgRoomPrice":this.ruleForm.pice,
									"bgRoomPriceUnit":this.ruleForm.time,
									"bgRoomProperty":this.ruleForm.comp,
									"bgRoomRecommend":this.ruleForm.resource,
									"bgRoomType":this.ruleForm.com,
									"description":this.ruleForm.desc,
									"roomLabelIdList":this.ruleForm.type
								};
								this.$axios({
									method: 'post',
									url:'/room/update',
									contentType: 'application/json',
									headers:{
										"wkToken":sessionStorage.token,
									},
									data: visData,
								}).then((response) => {
									console.log(response);
									if (response.data.code == 0) {
										this.dialogFormVisible = false;
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
									this.dialogLoading = false;
								}).catch((error) => {
									console.log(error);
									this.$notify.error({
										title: '失败',
										message: '修改失败，请稍后重试！'
									});
									this.dialogLoading = false;
								})
							});
						}
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
			handleRemove(file, fileList) {
				this.ruleForm.img = fileList;
				let imgList = this.ruleForm.img;
				if (imgList.length > 0) {
					this.ruleForm.key = false;
				} else {
					this.ruleForm.key = true;
				}
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
			downElenent(){
				let data=this.selectList;
				if(data.length<=0){
					this.$notify.error({
						title: '失败',
						message: '请选择一行信息！'
					});
				}else if(data.length==1){
					let code=data[0].bgRoomStatus;
					if(code=="6"){
						this.$confirm('该房源已被下架，不可再进行“下架操作”。', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '关闭',
							type: 'warning'
						}).then(() => {
						  
						}).catch(() => {
						          
						});
					}else{
						this.dialogFormVisible2=true;
					}
				}else{
					this.$notify.error({
						title: '失败',
						message: '只能选择一行信息！'
					});
				}
			},
			submit3() {
				this.downLoading=true;
				let data=this.selectList;
				this.$axios({
					method: 'post',
					url: '/room/soldOut',
					contentType: 'application/json',
					headers:{
						"wkToken":sessionStorage.token,
					},
					data:{"bgRoomId":data[0].bgRoomId},
				}).then((response) => {
					console.log(response);
					if (response.data.code == 0) {
						this.downLoading=false;
						this.dialogFormVisible2=false;
						this.$notify.success({
							title: '成功',
							message: '房源下架成功！'
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
								message: '房源下架失败，请稍后重试！'
							});
						});
					} else {
						this.$notify.error({
							title: '失败',
							message: '房源下架失败，请稍后重试！'
						});
					}
				}).catch((error) => {
					console.log(error);
					this.$notify.error({
						title: '失败',
						message: '房源下架失败，请稍后重试！'
					});
				})
			},
			
		},
		created(){
			this.getSelect();
			this.getCountry();
			this.getComp();
			this.getCom();
			this.getType();
		}
	}
</script>

<style lang="scss">
	.housing{
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
			width: 1000px;
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
		
		.set_dialog .el-dialog {
			width: 700px;
		}
		.down-dialog .el-dialog{
			width:630px;
			.down-content{
				p{
					width:100%;
					height:auto;
					line-height:40px;
					font-size: 16px;
					margin-bottom: 0;
				}
			}
		}
	}
	
</style>
