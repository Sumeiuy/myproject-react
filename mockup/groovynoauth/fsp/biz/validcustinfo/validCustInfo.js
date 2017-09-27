/**
 * @description 校验客户是否可以调整
 * @author sunweibin
 */

exports.response = function (req, res) {
  return {
    code: '402',
    msg: '校验客户信息失败',
    resultData: null,
  };
};
