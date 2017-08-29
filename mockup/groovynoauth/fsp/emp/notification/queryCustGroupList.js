exports.response = function (req, res) {
    return {
        "code":"0",
        "msg":"OK",
        "resultData":{
            curPageNum:null,
            pageSize:null,
            totalPageNum:2,
            totalRecordNum:4,
            custGroupDtoList:[
                {
                    "groupId":"1",
                    "groupName":"test",
                    "xComments":"这是test",
                    "createdTm":"2017-02-02"
                },
                {
                    "groupId":"2",
                    "groupName":"test",
                    "xComments":"这是test",
                    "createdTm":"2017-02-02"
                },
                {
                    "groupId":"3",
                    "groupName":"test",
                    "xComments":"这是test",
                    "createdTm":"2017-02-02"
                }
            ]
        }
    }

}