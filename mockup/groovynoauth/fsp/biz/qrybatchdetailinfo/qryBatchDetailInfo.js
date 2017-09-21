/**
 * @description 查询佣金调整详情
 */

exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: {
      batchNum: '308RY237WE00001',
      flowCode: '53BBD507C7C8904C84E691624FF3527F',
      businessType: 'HTSC_SR_TYPE',
      workFlowName: '批量佣金调整审批流程',
      nextProcessLogin: '004832',
      prodCode: 'SP0472/MOT服务',
      status: '已完成',
      divisionId: '',
      divisionName: '南京分公司长江路营业部',
      createdBy: '001654321',
      lastUpdBy: '001654321',
      createdByName: '李四',
      createdByLogin: '002332',
      created: '20170829',
      newCommission: '0.3',
      zqCommission: null,
      stkCommission: null,
      creditCommission: null,
      ddCommission: '6560',
      hCommission: null,
      dzCommission: null,
      coCommission: null,
      stbCommission: null,
      oCommission: null,
      doCommission: '8717',
      hkCommission: null,
      bgCommission: '1.7',
      qCommission: null,
      dqCommission: null,
      opCommission: null,
      dCommission: null,
      comments: '备注内容',
    },
  };
};
