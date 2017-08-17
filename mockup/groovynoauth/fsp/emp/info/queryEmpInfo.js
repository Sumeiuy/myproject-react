/**
 * 员工职责与职位
*/
exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: {
      empPostnList: [
        {
          id: '1-37HTTEC',
          rowId: '1-FVE6OU',
          login: '006069',
          loginName: '1-FVE6OU',
          postnId: '1-37HTTEB',
          postnName: 'HTSC006069',
          isMainPostn: true,
          orgId: 'ZZ001041',
          orgName: '经纪及财富管理部',
        },
      ],
      empRespList: [
        {
          lastName: '1-FVE6OU',
          loginName: '006069',
          respId: '1-1QEFF',
          respName: 'HTSC 高级分析',
        },
        {
          lastName: '1-FVE6OU',
          loginName: '006069',
          respId: '1-2323Q4X',
          respName: 'HTSC 产品库一般用户',
        },
        {
          lastName: '1-FVE6OU',
          loginName: '006069',
          respId: '1-2323Q6N',
          respName: 'HTSC 知识库一般用户',
        },
        {
          lastName: '1-FVE6OU',
          loginName: '006069',
          respId: '1-243I8T7',
          respName: 'HTSC KPI指标',
        },
        {
          lastName: '1-FVE6OU',
          loginName: '006069',
          respId: '1-3PDQSG5',
          respName: 'HTSC CRM系统需求审核员',
        },
        {
          lastName: '1-FVE6OU',
          loginName: '006069',
          respId: '1-46IDNZI',
          respName: 'HTSC 首页指标查询',
        },
        {
          lastName: '1-FVE6OU',
          loginName: '006069',
          respId: '1-FCQM-2',
          respName: 'HTSC 华泰公共视图',
        },
        {
          lastName: '1-FVE6OU',
          loginName: '006069',
          respId: '1-FCQM-27',
          respName: 'HTSC 营销活动-总部执行岗',
        },
        {
          lastName: '1-FVE6OU',
          loginName: '006069',
          respId: '1-FCQM-41',
          respName: 'HTSC 客户资料(无隐私)-总部管理岗',
        },
      ],
      empInfo: {
        rowId: '1-FVE6OU',
        login: '006069',
        empName: '1-FVE6OU',
        occupation: '经纪及财富管理部',
        occDivnNum: 'ZZ001041',
        empQualification: null,
        empStatus: '在职',
        sex: '女',
        jobTitle: '--、营销队伍管理岗',
        srvRoleCd: '207999',
        overtimeCd: null,
        empNum: '006069',
        hireDt: '2002-08-01 00:00:00',
        terminationDt: null,
        conAsstName: null,
        xEmpFrozenCd: null,
        country: '111156',
        city: null,
        workPhNum: null,
        emailAddr: 'zhangping6069@htsc.com',
        state: null,
        zipcode: null,
        cellPhNum: '18936880697',
        faxPhNum: '025-84457843',
        postnId: '1-37HTTEB',
        empTdbm: null,
        empJb: null,
      },
    },
  };
};
