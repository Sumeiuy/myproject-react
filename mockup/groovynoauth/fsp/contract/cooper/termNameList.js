/*
* @Author: XuWenKang
* @Date:   2017-10-09 13:23:40
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-10-09 13:44:58
*/
exports.response = function (req, res) {
    return {
      "code": "0",
      "msg": "OK",
      "resultData": [
        {
          'termName': '条款名称1',
          'termValue': '1',
          'valueList': [
            {
              'name': '明细1',
              'value': '1',
            },
            {
              'name': '明细2',
              'value': '2',
            },
          ],
        },
        {
          'termName': '条款名称2',
          'termValue': '2',
          'valueList': [
            {
              'name': '明细1',
              'value': '1',
            },
            {
              'name': '明细2',
              'value': '2',
            },
          ],
        }
      ]
    }
}