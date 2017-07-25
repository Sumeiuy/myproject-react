exports.response = function (req, res) {
    if(req.query.currentPage == '1') {
        return {
            "code": "0",
            "msg": "OK",
            "data": {
                "todolist": [
                    {
                        "id": 1,
                        "subject": '41投顾协议签约流程',
                        "stepName": "修改或终止流程",
                        "originator": "002332",
                        "originatorName": "鹿晗",
                        "applyDate": "2017/07/18 19:09:46",
                        
                    },
                    {
                        "id": 2,
                        "subject": '41投顾协议签约流程2',
                        "stepName": "修改或终止流程",
                        "originator": "002332",
                        "originatorName": "鹿晗",
                        "applyDate": "2017/07/18 19:09:46",
                        
                    },
                    {
                        "id": 3,
                        "subject": '41投顾协议签约流程3',
                        "stepName": "修改或终止流程",
                        "originator": "002332",
                        "originatorName": "鹿晗",
                        "applyDate": "2017/07/18 19:09:46",
                        
                    },
                    {
                        "id": 4,
                        "subject": '1-DF-7620投顾协议服务计划变更流程666',
                        "stepName": "修改或终止流程",
                        "originator": "002332",
                        "originatorName": "鹿晗",
                        "applyDate": "2017/07/18 19:09:46",
                        
                    },
                    {
                        "id": 5,
                        "subject": '张家港保税区津梁国际贸易公司的资产配置流程566',
                        "stepName": "修改或终止流程",
                        "originator": "002332",
                        "originatorName": "鹿晗",
                        "applyDate": "2017/07/18 19:09:46",
                        
                    },
                    {
                        "id": 6,
                        "subject": '订购: 1-42FOKNI: 紫金高速通道54',
                        "stepName": "修改或终止流程",
                        "originator": "002332",
                        "originatorName": "鹿晗",
                        "applyDate": "2017/07/18 19:09:46",
                        
                    },
                    {
                        "id": 7,
                        "subject": '1-15KWDRO的资产配置流程45',
                        "stepName": "修改或终止流程",
                        "originator": "002332",
                        "originatorName": "鹿晗",
                        "applyDate": "2017/07/18 19:09:46",
                        
                    },
                    {
                        "id": 8,
                        "subject": '1-DF-7620投顾协议服务计划变更流程44',
                        "stepName": "修改或终止流程",
                        "originator": "002332",
                        "originatorName": "鹿晗",
                        "applyDate": "2017/07/18 19:09:46",
                        
                    },
                    {
                        "id": 9,
                        "subject": '张家港保税区津梁国际贸易公司的资产配置流程33',
                        "stepName": "修改或终止流程",
                        "originator": "002332",
                        "originatorName": "鹿晗",
                        "applyDate": "2017/07/18 19:09:46",
                        
                    },
                    {
                        "id": 10,
                        "subject": '订购: 1-42FOKNI: 紫金高速通道22',
                        "stepName": "修改或终止流程",
                        "originator": "002332",
                        "originatorName": "鹿晗",
                        "applyDate": "2017/07/18 19:09:46",
                        
                    }
                ],
                "page": {
                    "pageSize": 10,
                    "curPageNum": 1,
                    "totalPageNum": 2,
                    "totalRecordNum": 12
                }
            }
        };
    } else {
        return {
            "code": "0",
            "msg": "OK",
            "data": {
                "todolist": [
                    {
                        "id": 11,
                        "subject": '订购: 1-42FOKNI: 紫金高速通道22',
                        "stepName": "修改或终止流程",
                        "originator": "002332",
                        "originatorName": "鹿晗",
                        "applyDate": "2017/07/18 19:09:46",
                        
                    },
                    {
                        "id": 12,
                        "subject": '1-15KWDRO的资产配置流程11',
                        "stepName": "修改或终止流程",
                        "originator": "002332",
                        "originatorName": "鹿晗",
                        "applyDate": "2017/07/18 19:09:46",
                        
                    }
                ],
                "page": {
                    "pageSize": 10,
                    "curPageNum": 2,
                    "totalPageNum": 2,
                    "totalRecordNum": 12
                }
            }
        };
    }
    
}