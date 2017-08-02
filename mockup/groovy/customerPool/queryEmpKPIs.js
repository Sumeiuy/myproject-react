/**
 * 绩效指标
*/
exports.response = function (req, res) {
  return {
  "code": "0",
  "msg": "OK",
  "resultData": {
      "cftCust":"10",
      "dateType":"518005",
      "finaTranAmt":"0",
      "fundTranAmt":"1000",
      "hkCust":"1",
      "newProdCust":"9",
      "optCust":"0",
      "otcTranAmt":"0",
      "privateTranAmt":"0",
      "purAddCust":"0",
      "purAddCustaset":"0",
      "purAddHighprodcust":"-9",
      "purAddNoretailcust":"29",
      "purRakeGjpdt":"0",
      "rzrqCust":"1",
      "staId":"002332",
      "staType":"1",
      "tranAmtBasicpdt":"0",
      "tranAmtTotpdt":"0",
      "ttfCust":"4",
          "motOkMnt":"1",
          "motTotMnt":"1",
          "taskCust":"1",
          "totCust":"1"
    }
  }
}
/**
 * 客户指标（客户数）：
purAddCust：净新增有效户数
purAddNoretailcust:净新增非零售客户数
purAddHighprodcust:净新增高端产品户数
newProdCust:新增产品客户数
业务办理（累计开通客户数）：
ttfCust：天天发开通客户数
optCust:期权开通客户数
cftCust:涨乐财富通开通客户数
hkCust:港股通开通客户数
rzrqCust:融资融券开通客户数
交易量（资产及交易指标）
purAddCustaset：净新增客户资产
tranAmtBasicpdt：累计基础交易量
tranAmtTotpdt：累计综合交易量
purRakeGjpdt：股基累计净佣金
*/