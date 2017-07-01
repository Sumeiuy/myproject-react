/**
 * 查询用户的可见报表看板的信息
 */

exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: [
      {
        id: 11,
        name: '分公司经营业绩看板',
        boardType: 'TYPE_JYYJ',
        boardTypeDesc: '经营业绩',
        boardStatus: 'RELEASE',
        boardStatusDesc: '发布',
        description: '看板postman1',
        ownerOrgId: 'ZZ001041',
        createTime: '2017-06-27 10:15:03',
        updateTime: '2017-06-27 12:23:53',
        pubTime: null,
        isEditable: 'N',
        summuryIndicators: 'pNewCustNum,tgInNum,custNum,totAset,gjAvgPercent',
        detailIndicators: 'custAmountDetail:effCustNum;InminorCustNum;newCustNum;hignLoseCustPercent,newBusinessDetail:rzrqBusi;ttfBusi;gqppBusi;hgtBusi;sgtBusi',
      },
      {
        id: 12,
        name: '分公司投顾绩效看板',
        boardType: 'TYPE_TGJX',
        boardTypeDesc: '投顾绩效',
        boardStatus: 'RELEASE',
        boardStatusDesc: '发布',
        description: '看板postman1',
        ownerOrgId: 'ZZ001041',
        createTime: '2017-06-27 10:15:03',
        updateTime: '2017-06-27 12:23:53',
        pubTime: null,
        isEditable: 'N',
        summuryIndicators: 'pNewCustNum,tgInNum,custNum,totAset,gjAvgPercent',
        detailIndicators: 'custAmountDetail:effCustNum;InminorCustNum;newCustNum;hignLoseCustPercent,newBusinessDetail:rzrqBusi;ttfBusi;gqppBusi;hgtBusi;sgtBusi',
      },
      {
        id: 13,
        name: '临时的经营业绩看板',
        boardType: 'TYPE_JYYJ',
        boardTypeDesc: '经营业绩',
        boardStatus: 'RELEASE',
        boardStatusDesc: '发布',
        description: '看板postman1',
        ownerOrgId: 'ZZ001041',
        createTime: '2017-06-27 10:15:03',
        updateTime: '2017-06-27 12:23:53',
        pubTime: null,
        isEditable: 'N',
        summuryIndicators: 'pNewCustNum,tgInNum,custNum,totAset,gjAvgPercent',
        detailIndicators: 'custAmountDetail:effCustNum;InminorCustNum;newCustNum;hignLoseCustPercent,newBusinessDetail:rzrqBusi;ttfBusi;gqppBusi;hgtBusi;sgtBusi',
      },
    ],
  };
};
