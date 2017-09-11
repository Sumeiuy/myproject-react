exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "num": "123456456",
      "baseInfo": {
        "head": "基本信息",
        "content": [ 
          {
            "title": "标题",
            "content": "20170906今天南京又下雨了"
          }, {
            "title": "子类型",
            "content": "私密客户思密达"
          }, {
            "title": "客户",
            "content": "张三"
          }, {
            "title": "备注",
            "content": "斯蒂芬斯蒂芬是否斯蒂芬斯蒂芬十点多"
          }
        ]
      },
      "draftInfo": {
        "head": "拟稿信息",
        "content": [
          {
            "title": "拟稿",
            "content": "沈旭祥"
          }, {
            "title": "提请时间",
            "content": "20170906"
          }, {
            "title": "状态",
            "content": "已完成"
          }
        ]
      },
      "serverInfo": [
        {
          "id": "HTSC001231",
          "name": "王某某",
          "position": "岗位A",
          "department": "南京奥体东营业部"
        }, {
          "id": "HTSC001232",
          "name": "孙某某",
          "position": "岗位B",
          "department": "南京江华路营业部"
        }, {
          "id": "HTSC001233",
          "name": "沈某某",
          "position": "岗位C",
          "department": "南京铁心桥营业部"
        }, {
          "id": "HTSC001234",
          "name": "吴某某",
          "position": "岗位D",
          "department": "南京奥体东营业部"
        }, {
          "id": "HTSC00125",
          "name": "张某某",
          "position": "岗位E",
          "department": "南京不知道营业部"
        }
      ]
    }
  };
}