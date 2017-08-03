// /**
//  * 查询用户的可见报表看板的信息
//  */

// exports.response = function (req, res) {
//   return {
//     code: '0',
//     msg: 'OK',
//     resultData: [
//       {
//         id: 11,
//         name: '分公司经营业绩看板',
//         boardType: 'TYPE_JYYJ',
//         boardTypeDesc: '经营业绩',
//         boardStatus: 'RELEASE',
//         boardStatusDesc: '发布',
//         description: '看板postman1',
//         ownerOrgId: 'ZZ001041',
//         createTime: '2017-06-27 10:15:03',
//         updateTime: '2017-06-27 12:23:53',
//         pubTime: null,
//         isEditable: 'N',
//         summuryIndicators: 'pNewCustNum,tgInNum,custNum,totAset,gjAvgPercent',
//         detailIndicators: 'custAmountDetail:effCustNum;InminorCustNum;newCustNum;hignLoseCustPercent,newBusinessDetail:rzrqBusi;ttfBusi;gqppBusi;hgtBusi;sgtBusi',
//       },
//       {
//         id: 12,
//         name: '分公司投顾绩效看板',
//         boardType: 'TYPE_TGJX',
//         boardTypeDesc: '投顾绩效',
//         boardStatus: 'RELEASE',
//         boardStatusDesc: '发布',
//         description: '看板postman1',
//         ownerOrgId: 'ZZ001041',
//         createTime: '2017-06-27 10:15:03',
//         updateTime: '2017-06-27 12:23:53',
//         pubTime: null,
//         isEditable: 'N',
//         summuryIndicators: 'pNewCustNum,tgInNum,custNum,totAset,gjAvgPercent',
//         detailIndicators: 'custAmountDetail:effCustNum;InminorCustNum;newCustNum;hignLoseCustPercent,newBusinessDetail:rzrqBusi;ttfBusi;gqppBusi;hgtBusi;sgtBusi',
//       },
//       {
//         id: 13,
//         name: '临时的经营业绩看板',
//         boardType: 'TYPE_JYYJ',
//         boardTypeDesc: '经营业绩',
//         boardStatus: 'RELEASE',
//         boardStatusDesc: '发布',
//         description: '看板postman1',
//         ownerOrgId: 'ZZ001041',
//         createTime: '2017-06-27 10:15:03',
//         updateTime: '2017-06-27 12:23:53',
//         pubTime: null,
//         isEditable: 'N',
//         summuryIndicators: 'pNewCustNum,tgInNum,custNum,totAset,gjAvgPercent',
//         detailIndicators: 'custAmountDetail:effCustNum;InminorCustNum;newCustNum;hignLoseCustPercent,newBusinessDetail:rzrqBusi;ttfBusi;gqppBusi;hgtBusi;sgtBusi',
//       },
//     ],
//   };
// };

/**
 * 查询用户的可见报表看板的信息
 */

exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: {
      "ordinary": [
      {                                       //这个数组里面是普通看板
        "id": 70,
        "name": "看板postmanddd1",
        "boardType": "TYPE_JYYJ",
        "boardTypeDesc": "经营业绩",
        "boardStatus": "RELEASE",
        "boardStatusDesc": "发布",
        "description": "看板postmanddd1",
        "ownerOrgId": "ZZ001041093",
        "createTime": "2017-06-28 15:17:33",
        "updateTime": "2017-07-17 17:29:12",
        "pubTime": "2017-07-17 17:29:12",
        "isEditable": "N",
        "summuryIndicators": "tgNum,tgInNum,custNum,totAset,gjAvgPercent",
        "detailIndicators": "custAmountDetail:effCustNum;gqppBusi;hgtBusi;sgtBusi",
        "coreIndicators": "tgNum,tgInNum,custNum,totAset,gjAvgPercent",
        "custContrastIndicators": null,
        "investContrastIndicators": null
      }
    ],
    "history": [              //历史对比的看板
      {
        "id": 410,
        "name": "经营业绩历史对比",
        "boardType": "TYPE_LSDB_JYYJ",
        "boardTypeDesc": "经营业绩历史对比",
        "boardStatus": "RELEASE",
        "boardStatusDesc": "发布",
        "description": "用来测试999",
        "ownerOrgId": "ZZ001041",
        "createTime": "2017-08-01 16:34:49",
        "updateTime": "2017-08-01 16:34:49",
        "pubTime": null,
        "isEditable": "Y",
        "summuryIndicators": null,
        "detailIndicators": null,
        "coreIndicators": "tgInNum",
        "custContrastIndicators": "tgInNum",
        "investContrastIndicators": "tgInNum"
      },
      {
        "id": 411,
        "name": "经营业绩历史对比1",
        "boardType": "TYPE_LSDB_JYYJ",
        "boardTypeDesc": "经营业绩历史对比2",
        "boardStatus": "RELEASE",
        "boardStatusDesc": "发布",
        "description": "用来测试999",
        "ownerOrgId": "ZZ001041",
        "createTime": "2017-08-01 16:34:49",
        "updateTime": "2017-08-01 16:34:49",
        "pubTime": null,
        "isEditable": "Y",
        "summuryIndicators": null,
        "detailIndicators": null,
        "coreIndicators": "tgInNum",
        "custContrastIndicators": "tgInNum",
        "investContrastIndicators": "tgInNum"
      },
      {
        "id": 412,
        "name": "经营业绩历史对比2",
        "boardType": "TYPE_LSDB_JYYJ",
        "boardTypeDesc": "经营业绩历史对比3",
        "boardStatus": "RELEASE",
        "boardStatusDesc": "发布",
        "description": "用来测试999",
        "ownerOrgId": "ZZ001041",
        "createTime": "2017-08-01 16:34:49",
        "updateTime": "2017-08-01 16:34:49",
        "pubTime": null,
        "isEditable": "Y",
        "summuryIndicators": null,
        "detailIndicators": null,
        "coreIndicators": "tgInNum",
        "custContrastIndicators": "tgInNum",
        "investContrastIndicators": "tgInNum"
      },
      {
        "id": 413,
        "name": "经营业绩历史对比3",
        "boardType": "TYPE_LSDB_JYYJ",
        "boardTypeDesc": "经营业绩历史对比4",
        "boardStatus": "RELEASE",
        "boardStatusDesc": "发布",
        "description": "用来测试999",
        "ownerOrgId": "ZZ001041",
        "createTime": "2017-08-01 16:34:49",
        "updateTime": "2017-08-01 16:34:49",
        "pubTime": null,
        "isEditable": "Y",
        "summuryIndicators": null,
        "detailIndicators": null,
        "coreIndicators": "tgInNum",
        "custContrastIndicators": "tgInNum",
        "investContrastIndicators": "tgInNum"
      }
    ]
    }
  };
};
