/**
 * 员工职责与职位
*/
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "empPostnDTOList": [
        {
          "id": "1-42A8XNG",
          "rowId": "1-OXZ5",
          "login": "002332",
          "loginName": "王华",
          "postnId": "1-3S0Z4",
          "postnName": "南京长江路证券营业部服务岗",
          "isMainPostn": true,
          "orgId": "ZZ001041051",
          "orgName": "南京长江路证券营业部"
        },
        {
          "id": "1-42FTX91",
          "rowId": "1-OXZ5",
          "login": "002332",
          "loginName": "王华",
          "postnId": "1-42FTX90",
          "postnName": "战略发展部",
          "isMainPostn": false,
          "orgId": "ZZ323426",
          "orgName": "战略发展部"
        },
        {
          "id": "1-42A7ZFO",
          "rowId": "1-OXZ5",
          "login": "002332",
          "loginName": "王华",
          "postnId": "1-5XND",
          "postnName": "南京长江路证券营业部",
          "isMainPostn": false,
          "orgId": "ZZ001041051",
          "orgName": "南京长江路证券营业部"
        },
        {
          "id": "1-OXZ9",
          "rowId": "1-OXZ5",
          "login": "002332",
          "loginName": "王华",
          "postnId": "1-OXZ8",
          "postnName": "HTSC002332",
          "isMainPostn": false,
          "orgId": "ZZ001041051",
          "orgName": "南京长江路证券营业部"
        }
      ],
      "empRespDTOList": [
        {
          "lastName": null,
          "loginName": null,
          "respId": "0-30",
          "respName": "Siebel Administrator"
        },
        {
          "lastName": null,
          "loginName": null,
          "respId": "1-12T3QJZ",
          "respName": "HTSC 融资融券业务管理层"
        },
        {
          "lastName": null,
          "loginName": null,
          "respId": "1-FCQM-7",
          "respName": "HTSC 理财-总部执行岗"
        }
      ]
    }
  }
}
