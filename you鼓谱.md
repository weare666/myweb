#### 1.you鼓谱后台项目

##### 1.登陆

接口地址：http://a241d44547.qicp.vip:38170/Drummer/backLogin

请求参数

| 参数名称 | 类型   | 是否必填 | 说明   | 备注 |
| -------- | ------ | -------- | ------ | ---- |
| username | String | 是       | 用户名 |      |
| password | String | 是       | 密码   |      |

入参JSON示例

```json
{
  "username":"admin",
  "password":"123456"
}
```

返回参数

| 参数名称              | 类型   | 是否必填 | 说明       | 备注 |
| --------------------- | ------ | -------- | ---------- | ---- |
| rc                    | String | 是       | 响应标识   |      |
| msg                   | String | 是       | 响应信息   |      |
| ext                   | String | 否       | 扩展字段   |      |
| list                  | String | 否       | 数据集合   |      |
| pageInfo              | Object | 否       | 分页对象   |      |
| pageInfo.current_page | int    | 否       | 当前页码   |      |
| pageInfo.page_size    | int    | 否       | 每页大小   |      |
| pageInfo.total_num    | int    | 否       | 总数据条数 |      |
|                       |        |          |            |      |

出参JSON示例

```json
{
	"rc": "1",
	"msg": "执行成功！",
  "ext": "hanlyn"
}
```

##### 2.图片上传

接口地址：http://a241d44547.qicp.vip:38170/Drummer/upload

请求参数

| 参数名称 | 类型 | 是否必填 | 说明     | 备注 |
| -------- | ---- | -------- | -------- | ---- |
| file     | File | 是       | 文件名称 |      |

入参JSON示例

```json
file:"AUUTO28P001.png"
```

返回参数

| 参数名称 | 类型   | 是否必填 | 说明     | 备注 |
| -------- | ------ | -------- | -------- | ---- |
| rc       | String | 是       | 响应标识 |      |
| msg      | String | 是       | 响应信息 |      |
| ext      | String | 否       | 扩展字段 |      |

出参JSON示例

```json
{
    "rc": "1",
    "msg": "成功",
    "ext": "http://a241d44547.qicp.vip:38170//images/2020-05-28/4357bb94-6634-4b49-ae58-596a35604f59.jpg"
}
```

##### 3.更新歌手列表

接口地址：http://a241d44547.qicp.vip:38170/Drummer/updateSingerInformation

请求参数

| 参数名称     | 类型   | 是否必填 | 说明         | 备注        |
| ------------ | ------ | -------- | ------------ | ----------- |
| singer_id    | String | 否       | 歌手编号     |             |
| singer_name  | String | 是       | 歌手姓名     |             |
| singer_image | String | 是       | 歌手图片地址 |             |
| is_used      | String | 是       | 每页大小     | 0否1是      |
| introduction | String | 否       | 歌手描述     |             |
| operator     | String | 是       | 操作员       |             |
| type         | String | 是       | 操作类型     | 1新增,2修改 |

入参JSON示例

```json
{
  "singer_id": "",
  "singer_name":"薛之谦",
  "singer_image":"1111.png",
  "is_used": "0",
  "introduction": 1,
  "operator": 10,
  "type":"1"
}
```

返回参数

| 参数名称 | 类型   | 是否必填 | 说明     | 备注 |
| -------- | ------ | -------- | -------- | ---- |
| rc       | String | 是       | 响应标识 |      |
| msg      | String | 是       | 响应信息 |      |
| ext      | String | 否       | 扩展字段 |      |
| list     | Array  | 否       | 数据集合 |      |

出参JSON示例

```json
{
    "rc": "1",
    "msg": "成功",
    "ext": null,
    "list": null
}
```

##### 4.查询歌手信息

接口地址：http://a241d44547.qicp.vip:38170/Drummer/listSingerInformation

请求参数

| 参数名称     | 类型   | 是否必填 | 说明     | 备注 |
| ------------ | ------ | -------- | -------- | ---- |
| singer_name  | String | 否       | 歌手名称 |      |
| is_used      | String | 否       | 是否启用 | 0    |
| current_page | int    | 是       | 当前页码 | 1    |
| page_size    | int    | 是       | 每页大小 | 10   |

入参JSON示例

```json
{
  "singer_name": "薛之谦",
  "is_used": "0",
  "current_page": 1,
  "page_size": 10
}
```

返回参数

| 参数名称          | 类型   | 是否必填 | 说明         | 备注    |
| ----------------- | ------ | -------- | ------------ | ------- |
| rc                | String | 是       | 响应标识     |         |
| msg               | String | 是       | 响应信息     |         |
| ext               | String | 否       | 扩展字段     |         |
| list              | Array  | 否       | 数据集合     |         |
| list.singer_id    | String | 是       | 歌手编号     |         |
| list.singer_name  | String | 是       | 医生答复次数 |         |
| list.singer_image | String | 否       | 歌手图片地址 |         |
| list.is_used      | String | 是       | 是否启用     | 0否 1是 |
| list.introduction | String | 是       | 歌手信息     |         |
| list.creator      | String | 是       | 创建者       |         |
| list.create_time  | String | 是       | 创建时间     |         |
| list.updater      | String | 否       | 修改者       |         |
| list.update_time  | String | 否       | 修改时间     |         |
| pageInfo          | Object | 是       | 分页对象     | 同上    |

出参JSON示例

```json
{
    "rc":"1",
    "msg":"成功",
    "ext":null,
    "list":[
        {
            "singer_id":"5fce0366-99f6-4cde-ade5-88c89be9787a",
            "singer_name":"123321",
            "singer_image":"http://a241d44547.qicp.vip:38170//images/2020-05-28/4357bb94-6634-4b49-ae58-596a35604f59.jpg",
            "is_used":"0",
            "introduction":"",
            "creator":"admin",
            "create_time":"2020-05-29 04:42:14.0",
            "updater":null,
            "update_time":null
        },
        {
            "singer_id":"d8b39694-cc02-486c-ba05-53aa771b8d70",
            "singer_name":"122334455",
            "singer_image":"http://a241d44547.qicp.vip:38170//images/2020-05-28/5b44d286-69f3-41ff-b9de-20e31dfba146.jpg",
            "is_used":"0",
            "introduction":"",
            "creator":"admin",
            "create_time":"2020-05-29 04:39:42.0",
            "updater":null,
            "update_time":null
        },
        {
            "singer_id":"6c3edc58-b0f1-4cce-b7a7-8540e419d84c",
            "singer_name":"123123",
            "singer_image":"http://a241d44547.qicp.vip:38170//images/2020-05-28/23482935-a380-4018-996b-8812af8dde57.png",
            "is_used":"0",
            "introduction":"123",
            "creator":"admin",
            "create_time":"2020-05-29 04:36:51.0",
            "updater":null,
            "update_time":null
        },
        {
            "singer_id":"2391de70-d175-4ad6-908a-3a77e7d96f00",
            "singer_name":"搜索哦",
            "singer_image":"http://a241d44547.qicp.vip:38170//images/2020-05-28/d747a8da-6948-4d71-bf22-78fc12c6945e.jpeg",
            "is_used":"0",
            "introduction":"123",
            "creator":"admin",
            "create_time":"2020-05-29 04:34:18.0",
            "updater":null,
            "update_time":null
        },
        {
            "singer_id":"51b111a7-a534-4c5e-83e8-6cbae6cffec4",
            "singer_name":"11223333",
            "singer_image":"http://a241d44547.qicp.vip:38170//images/2020-05-28/d290d1bc-4565-4c8c-a24b-1b05585551f5.png",
            "is_used":"0",
            "introduction":"",
            "creator":"admin",
            "create_time":"2020-05-29 04:25:47.0",
            "updater":null,
            "update_time":null
        }
    ],
    "pageInfo":{
        "first":1,
        "last":5,
        "totalPage":5,
        "prev":1,
        "next":2,
        "startNum":0,
        "start":1,
        "end":5,
        "count":10,
        "current_page":1,
        "page_size":5,
        "total_num":21
    }
}
```

##### 5.删除歌手信息

接口地址：http://a241d44547.qicp.vip:38170/Drummer/deleteSingerInformation

请求参数

| 参数名称  | 类型   | 是否必填 | 说明     | 备注 |
| --------- | ------ | -------- | -------- | ---- |
| singer_id | String | 是       | 歌手编号 |      |

入参JSON示例

```json
{
  "singer_id": "0001"
}
```

返回参数

| 参数名称 | 类型   | 是否必填 | 说明     | 备注 |
| -------- | ------ | -------- | -------- | ---- |
| rc       | String | 是       | 响应标识 |      |
| msg      | String | 是       | 响应信息 |      |
| ext      | String | 否       | 扩展字段 |      |
| list     | Array  | 否       | 数据集合 |      |

出参JSON示例

```json
{
    "rc":"1",
    "msg":"成功",
    "ext":null,
    "list": null
}
```

##### 6.查询谱曲列表

接口地址：http://a241d44547.qicp.vip:38170/Drummer/listSpectrumInformation

请求参数

| 参数名称      | 类型   | 是否必填 | 说明         | 备注 |
| ------------- | ------ | -------- | ------------ | ---- |
| singer_id     | String | 否       | 歌手编号     |      |
| spectrum_name | String | 否       | 谱曲名称     |      |
| is_match      | String | 否       | 是否比赛曲目 |      |
| price         | String | 否       | 价格         |      |
| current_page  | int    | 是       | 当前页码     | 1    |
| page_size     | int    | 是       | 每页大小     | 10   |

入参JSON示例

```json
{
  "singer_name": "薛之谦",
  "spectrum_name": "耳朵",
  "is_match": "",
  "price": "1",
  "current_page": 1,
  "page_size": 10
}
```

返回参数

| 参数名称           | 类型   | 是否必填 | 说明         | 备注 |
| ------------------ | ------ | -------- | ------------ | ---- |
| rc                 | String | 是       | 响应标识     |      |
| msg                | String | 是       | 响应信息     |      |
| ext                | String | 否       | 扩展字段     |      |
| list               | Array  | 否       | 数据集合     |      |
| list.spectrum_id   | String | 是       | 谱曲编号     |      |
| list.singer_id     | String | 否       | 歌手编号     |      |
| list.singer_name   | String | 否       | 歌手姓名     |      |
| list.spectrum_name | String | 是       | 谱曲姓名     |      |
| list.author        | String | 否       | 谱曲作者     |      |
| list.is_match      | String | 否       | 是否比赛曲目 |      |
| list.price         | String | 否       | 价格         |      |
| list.duration      | String | 是       | 时长         |      |
| list.creator       | String | 是       | 创建者       |      |
| list.create_time   | String | 是       | 创建时间     |      |

出参JSON示例

```json
{
    "rc": "1",
    "msg": "成功",
    "ext": null,
    "list": [
        {
            "spectrum_id": "1",
            "singer_id": "1",
            "singer_name": "薛之谦",
            "spectrum_name": "意外",
            "author": "薛之谦",
            "is_match": "0",
            "price": "3.00000000",
            "duration": "3:31",
            "operator": null,
            "creator": "admin",
            "create_time": "2020-04-13 13:00:00.0",
            "images": null
        },
        {
            "spectrum_id": "2",
            "singer_id": null,
            "singer_name": null,
            "spectrum_name": "老街",
            "author": "李荣浩",
            "is_match": "0",
            "price": "3.00000000",
            "duration": "4:22",
            "operator": null,
            "creator": null,
            "create_time": null,
            "images": null
        },
        {
            "spectrum_id": "3",
            "singer_id": "1",
            "singer_name": "薛之谦",
            "spectrum_name": "绅士",
            "author": "薛之谦",
            "is_match": "0",
            "price": "3.00000000",
            "duration": "3:54",
            "operator": null,
            "creator": "admin",
            "create_time": "2020-04-13 13:00:00.0",
            "images": null
        }
    ],
    "info": null,
    "pageInfo": {
        "first": 1,
        "last": 1,
        "totalPage": 1,
        "prev": 1,
        "next": 1,
        "startNum": 0,
        "start": 1,
        "end": 1,
        "count": 10,
        "current_page": 1,
        "page_size": 5,
        "total_num": 3
    }
}
```

##### 7.保存谱曲信息

接口地址：http://a241d44547.qicp.vip:38170/Drummer/saveSpectrumInformation

请求参数

| 参数名称      | 类型   | 是否必填 | 说明           | 备注      |
| :------------ | :----- | :------- | :------------- | :-------- |
| singer_id     | String | 否       | 歌手编号       |           |
| spectrum_name | String | 否       | 谱曲名称       |           |
| author        | String | 否       | 创作人         |           |
| is_match      | String | 否       | 是否是比赛曲目 | 0:否 1:是 |
| price         | String | 是       | 价格           |           |
| operator      | String | 是       | 操作者         |           |
| duration      | String | 是       | 时长           |           |
| images        | List   | 否       | 谱曲图片集合   |           |
|               |        |          |                |           |

入参JSON示例

```
{
  "singer_name": "薛之谦",
  "spectrum_name": "耳朵",
  "author": "李荣浩"
  "is_match": "0",
  "price": "3",
  "operator": "hanlyn",
  "duration": "3:01"
  "images":{
  	"ASDLKJ...","ASDIUWE..."
  }
}

```

出参JSON示例

| 参数名称 | 类型   | 是否必填 | 说明     | 备注 |
| :------- | :----- | :------- | :------- | :--- |
| rc       | String | 是       | 响应标识 |      |
| msg      | String | 是       | 响应信息 |      |
| ext      | String | 否       | 扩展字段 |      |
| list     | Array  | 否       | 数据集合 |      |

返回参数

```
{
    "rc":"1",
    "msg":"成功",
    "ext":null,
    "list": null
}
```

##### 8.修改谱曲信息

接口地址：http://a241d44547.qicp.vip:38170/Drummer/updateSpectrumInformation

请求参数

| 参数名称      | 类型   | 是否必填 | 说明           | 备注      |
| :------------ | :----- | :------- | :------------- | :-------- |
| spectrum_id   | String | 否       | 谱曲编号       |           |
| spectrum_name | String | 否       | 谱曲名称       |           |
| singer_id     | String | 否       | 歌手编号       |           |
| author        | String | 否       | 创作人         |           |
| is_match      | String | 否       | 是否是比赛曲目 | 0:否 1:是 |
| price         | String | 是       | 价格           |           |
| operator      | String | 是       | 操作者         |           |
| duration      | String | 是       | 时长           |           |
| images        | List   | 否       | 谱曲图片集合   |           |

入参JSON示例

```
{
	"spectrum_id":"O291MSD"
  "singer_name": "薛之谦",
  "spectrum_name": "耳朵",
  "author": "李荣浩"
  "is_match": "0",
  "price": "3",
  "operator": "hanlyn",
  "duration": "3:01"
  "images":{
  	"ASDLKJ...","ASDIUWE..."
  }
}

```

出参JSON示例

| 参数名称 | 类型   | 是否必填 | 说明     | 备注 |
| :------- | :----- | :------- | :------- | :--- |
| rc       | String | 是       | 响应标识 |      |
| msg      | String | 是       | 响应信息 |      |
| ext      | String | 否       | 扩展字段 |      |
| list     | Array  | 否       | 数据集合 |      |

返回参数

```
{
    "rc":"1",
    "msg":"成功",
    "ext":null,
    "list": null
}
```

##### 9.删除谱曲信息

接口地址：http://a241d44547.qicp.vip:38170/Drummer/deleteSpectrumInformation

请求参数

| 参数名称    | 类型   | 是否必填 | 说明     | 备注 |
| ----------- | ------ | -------- | -------- | ---- |
| spectrum_id | String | 是       | 谱曲编号 |      |

入参JSON示例

```json
{
  "spectrum_id": "0001"
}
```

返回参数

| 参数名称 | 类型   | 是否必填 | 说明     | 备注 |
| -------- | ------ | -------- | -------- | ---- |
| rc       | String | 是       | 响应标识 |      |
| msg      | String | 是       | 响应信息 |      |
| ext      | String | 否       | 扩展字段 |      |
| list     | Array  | 否       | 数据集合 |      |

出参JSON示例

```json
{
    "rc":"1",
    "msg":"成功",
    "ext":null,
    "list": null
}
```

##### 