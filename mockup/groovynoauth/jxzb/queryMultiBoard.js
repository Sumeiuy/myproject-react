/**
 * 查询当前用户可以编辑的报表看板
 */

exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: [
      {
        id: 50,
        name: 'JZ-NJ-分公司看板-未发布', // 看板名称
        boardType: 'TYPE_JYYJ',  // 看板类型 //TYPE_JYYJ :经营业绩 //TYPE_TGJX :投顾绩效
        boardTypeDesc: '经营业绩',
        boardStatusDesc: '未发布',
        boardStatus: 'UNRELEASE', // 看板是否发布
        description: '看板postmanddd1',  // 看板描述
        ownerOrgId: 'ZZ001041',
        createTime: '2017-06-27 14:35:01',  // 创建时间
        updateTime: '2017-06-28 12:10:04', // 修改时间
        pubTime: null,  // 发布时间
        isEditable: 'Y',
        orgItemDtos: [ // 看板可见范围
          {
            id: 'ZZ001041',
            name: '经纪业务总部',
            level: '1',
          },
          {
            id: 'ZZ001041093',
            name: '南京分公司',
            level: '2',
          },
        ],
      },
      {
        id: 22,
        name: 'JZ-SZ-分公司看板-未发布',
        boardType: 'TYPE_JYYJ',
        boardTypeDesc: '经营业绩',
        boardStatusDesc: '未发布',
        description: '用来测试888',
        ownerOrgId: 'ZZ001041',
        boardStatus: 'UNRELEASE',
        createTime: '2017-06-27 11:22:20',
        updateTime: '2017-06-27 11:22:20',
        pubTime: null,
        isEditable: 'Y',
        orgItemDtos: [
          {
            id: 'ZZ001041',
            name: '经纪业务总部',
            level: '1',
          },
          {
            id: 'ZZ001041103',
            name: '苏州分公司',
            level: '2',
          },
        ],
      },
      {
        id: 23,
        name: 'JZ-SZ-分公司看板-已发布',
        boardType: 'TYPE_TGJX',
        boardTypeDesc: '投顾绩效',
        boardStatusDesc: '发布',
        description: '用来测试888',
        ownerOrgId: 'ZZ001041',
        boardStatus: 'RELEASE',
        createTime: '2017-06-27 11:22:20',
        updateTime: '2017-06-27 11:22:20',
        pubTime: '2017-06-28 12:10:04',
        isEditable: 'Y',
        orgItemDtos: [
          {
            id: 'ZZ001041',
            name: '经纪业务总部',
            level: '1',
          },
          {
            id: 'ZZ001041103',
            name: '苏州分公司',
            level: '2',
          },
        ],
      },
    ],
  };
};
