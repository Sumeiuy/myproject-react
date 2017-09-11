exports.response = function (req, res) {
    return {
        "code": "0",
        "msg": "OK",
        "resultData": {
            pageSize: null,
            curPageNum: null,
            totalPageNum: 2,
            totalRecordNum: 4,
            custGroupDTOList: [
                {
                    "groupId": "001",
                    "groupName": "test",
                    "relatCust": 0,
                    "createdTm": "2017-02-02 00:00:00",
                    "createLogin": null,
                    "xComments": "这是test"
                },
                {
                    "groupId": "001",
                    "groupName": "test",
                    "relatCust": 0,
                    "createdTm": "2017-02-02 00:00:00",
                    "createLogin": null,
                    "xComments": "这是test"
                },
                {
                    "groupId": "001",
                    "groupName": "test",
                    "relatCust": 0,
                    "createdTm": "2017-02-02 00:00:00",
                    "createLogin": null,
                    "xComments": "这是test"
                }
            ]
        }
    }
}