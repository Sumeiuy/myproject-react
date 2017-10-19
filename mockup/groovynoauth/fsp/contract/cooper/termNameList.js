/*
* @Author: XuWenKang
* @Date:   2017-10-09 13:23:40
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-10-10 18:34:55
*/
exports.response = function (req, res) {
    return {
      "code": "0",
      "msg": "OK",
      "resultData": [
        {
          'termName': '条款名称1',
          'termVal': '1',
          'param': [
            {
              'name': '明细1',
              'val': '1',
            },
            {
              'name': '明细2',
              'val': '2',
            },
          ],
        },
        {
          'termName': '条款名称2',
          'termVal': '2',
          'param': [
            {
              'name': '明细1',
              'val': '1',
            },
            {
              'name': '明细2',
              'val': '2',
            },
          ],
        }
      ]
    }
}