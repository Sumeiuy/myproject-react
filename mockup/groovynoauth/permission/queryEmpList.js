exports.response = function (req, res) {
  return{
    "code": "0",
    "msg": "OK",
    "resultData": {
      "empInfo": [
        {
        "empId": "001105",
        "empName": "张五"
        },
        {
        "empId": "001104",
        "empName": "张四"
        },
        {
        "empId": "001103",
        "empName": "张三"
        }
      ]
    }
  }
}