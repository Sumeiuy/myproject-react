/**
 * 绩效指标
*/
exports.response = function (req, res) {
  return {
  "code": "0",
  "msg": "OK",
  "resultData": {
      "cftCust":"40",
      "dateType":"518005",
      "finaTranAmt":"25",
      "fundTranAmt":"18",
      "hkCust":"40",
      "shHkCust":"20",
      "szHkCust":"20",
      "newProdCust":"2500",
      "optCust":"35",
      "otcTranAmt":"18",
      "privateTranAmt":"18",
      "purAddCust":"180",
      "purAddCustaset":"10000033333330",
      "purAddHighprodcust":"1900",
      "purAddNoretailcust":"1800",
      "purRakeGjpdt":"10305023333330",
      "rzrqCust":"50",
      "staId":"002332",
      "staType":"1",
      "tranAmtBasicpdt":"1533333000",
      "tranAmtTotpdt":"13033333300",
      "ttfCust":"50",
      "motOkMnt":"0.45",
      "motTotMnt":"1",
      "taskCust":"0.45",
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