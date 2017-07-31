/**
 * 客户范围
*/
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": [
      {
        "label":"我的客户",
        "value":"002332"
      }
    ]
  };
};