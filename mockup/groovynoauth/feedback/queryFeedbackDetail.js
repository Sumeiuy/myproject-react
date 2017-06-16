exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData":
    {
      "feedbackDTO": {
        "appId": "MCRM",
        "createTime": "2017-12-11",
        "description": "描述", // 描述
        "id": '1111', // 问题数据库id
        "issueType": "D", // 问题类型
        "mediaUrls": null, // 图片路径
        "pageName": "页面名", // 页面名
        "title": "问题标题", // 标题
        "userId": "002332",
        "userInfo": { // 用户信息
          "name": "1-OH2N",
          "rowId": "1-OH2N",
          "gender": "女",
          "eMailAddr": "example@htsc.com",
          "cellPhone": "18969025699",
          "department": "信息技术部", //部门
        },
        "userType": "emp", // 用户类型
        "version": "1.1.2", // 版本
        "functionName": "页面模块", // 功能模块
        "goodRate": "是", // 是否好评
        "status": "2", // 问题状态
        "processer": "011105", // 处理问题的员工
        "tag": "5", // 问题标签
        "processTime": "2017-12-13", //处理问题时间
        "feedId": "101", // 问题逻辑id
        "jiraId": "1.1.2", // 对应的jiraId
        "attachmentJson": null,
        "attachModelList": null, // 上传的附件列表
      },
      feedbackRecord: {
        "page": {
          "curPageNum": 1,
          "pageSize": 10,
        },
        "returnList": [
          {
            "id": 11,
            "feedbackId": 111,
            "createTime": "2017-12-12",
            "empId": "011105",
            "description": "xxxxxx",
            "processSuggest": null,
            "title": "title",
            "department": "信息技术部", //部门
          },
          {
            "id": 22,
            "feedbackId": 222,
            "createTime": "2017-12-12",
            "empId": "011105",
            "description": "xxxxxx",
            "processSuggest": null,
            "title": "title",
            "department": "信息技术部", //部门
          }
        ]
      }
    }
  };
}