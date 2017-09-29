/**
 * 统计周期
*/
exports.response = function (req, res) {
  return {
    "code":"0",
    "msg":"OK",
    "resultData":{
      "workResult":[
        {
            "key":"HGXQ",
            "value":"很感兴趣"
        },
        {
            "key":"Address Error",
            "value":"地址错误"
        },
        {
            "key":"HTSC Cancellation",
            "value":"已销户"
        },
        {
            "key":"TDBMQ",
            "value":"态度不明确"
        },
        {
            "key":"HTSC Account",
            "value":"机构客户"
        },
        {
            "key":"HTSC Invalid Phone",
            "value":"无效电话（停机、空号等）"
        },
        {
            "key":"HTSC Power Off",
            "value":"已关机"
        },
        {
            "key":"BJFG",
            "value":"比较反感"
        },
        {
            "key":"Illegal Visit",
            "value":"不合规回访"
        },
        {
            "key":"Customer Decline",
            "value":"客户拒绝"
        },
        {
            "key":"HTSC Partly Completed",
            "value":"部分完成"
        },
        {
            "key":"Phone Error",
            "value":"电话有误"
        },
        {
            "key":"YYJYBGT",
            "value":"愿意进一步沟通"
        },
        {
            "key":"QRCJ",
            "value":"确认参加"
        },
        {
            "key":"HTSC Other Speaking",
            "value":"非本人接听"
        },
        {
            "key":"HTSC No One Risk Tip",
            "value":"没有专人讲解合同内容和揭示风险"
        },
        {
            "key":"HTSC Booking",
            "value":"预约下次"
        },
        {
          "key":"HTSC Non-Resident Account",
          "value":"境外户"
        },
        {
          "key":"HTSC Complete",
          "value":"完整完成"
        },
        {
          "key":"HTSC No Answer",
          "value":"无人接听（或无法接通）"
        },
        {
          "key":"HTSC Abnormal Desc",
          "value":"异常情况说明"
        },
        {
          "key":"HTSC Comments",
          "value":"备注"
        }
      ],
      "custRiskBearing":[
        {
            "key":"",
            "value":"不限"
        },
        {
            "key":"704010",
            "value":"激进型"
        },
        {
            "key":"704040",
            "value":"保守型（最低类别）"
        },
        {
            "key":"704030",
            "value":"保守型"
        },
        {
            "key":"704020",
            "value":"稳健型"
        },
        {
            "key":"704025",
            "value":"谨慎型"
        },
        {
            "key":"704015",
            "value":"积极型"
        }
      ],
      "serveType":[
        {
            "key":"Cancellation Tracking",
            "value":"销户跟踪"
        },
        {
            "key":"Sales Action",
            "value":"销售活动"
        },
        {
            "key":"Complaints Dealing",
            "value":"投诉处理"
        },
        {
            "key":"Diff Confirm",
            "value":"异动确认"
        },
        {
            "key":"Customer Infor Verify",
            "value":"客户信息核实"
        },
        {
            "key":"General",
            "value":"常规"
        },
        {
            "key":"Campaign Action",
            "value":"服务营销"
        },
        {
            "key":"TG New Customer Visit",
            "value":"投顾新客户回访"
        },
        {
            "key":"Margin Trading",
            "value":"新开融资融券客户回访"
        },
        {
            "key":"Investment Bank Account",
            "value":"投行活动"
        },
        {
            "key":"Trust Products Sale",
            "value":"信托产品销售回访"
        },
        {
            "key":"Warm Care",
            "value":"温馨关怀"
        },
        {
            "key":"System Alert",
            "value":"通知提醒"
        },
        {
            "key":"Resp",
            "value":"体征服务回访"
        },
        {
            "key":"Old Customer Visit",
            "value":"存量客户回访"
        },
        {
            "key":"Fins Su",
            "value":"理财建议"
        },
        {
            "key":"MOT Action",
            "value":"MOT服务记录"
        },
        {
            "key":"New Customer Visit",
            "value":"新客户回访"
        },
        {
            "key":"TG Exists Custotmer Visit",
            "value":"投顾存量客户回访"
        }
      ],
      "executeTypes":[
        {
            "key":"Chance",
            "value":"选做"
        },
        {
            "key":"Mission",
            "value":"必做"
        }
      ],
      "custBusinessType":[
        {
            "key":"",
            "value":"不限"
        },
        {
            "key":"817270",
            "value":"个股期权"
        },
        {
            "key":"817260",
            "value":"新三板"
        },
        {
            "key":"817030",
            "value":"融资融券"
        },
        {
            "key":"817450",
            "value":"IPO网下配售"
        },
        {
            "key":"817440",
            "value":"深港通"
        },
        {
            "key":"817170",
            "value":"涨乐财富通"
        },
        {
            "key":"817200",
            "value":"沪港通"
        },
        {
            "key":"817460",
            "value":"开通沪市分级基金"
        },
        {
            "key":"817470",
            "value":"开通深市分级基金"
        },
        {
            "key":"817240",
            "value":"OTC柜台业务"
        },
        {
            "key":"817010",
            "value":"创业板"
        },
        {
            "key":"817050",
            "value":"天天发"
        }
      ],
      "serveWay":[
        {
            "key":"HTSC Phone",
            "value":"电话"
        },
        {
            "key":"HTSC Email",
            "value":"邮件"
        },
        {
            "key":"HTSC SMS",
            "value":"短信"
        },
        {
            "key":"wx",
            "value":"微信"
        },
        {
            "key":"Interview",
            "value":"面谈"
        },
        {
            "key":"HTSC Other",
            "value":"其他"
        }
      ],
      "taskDescs":[
        {
            "userType":"businessCustPool",
            "defaultTaskType":"businessRecommend",
            "taskName":null,
            "taskDesc":"用户已达到办理#{可开通业务列表}业务的条件，请联系客户办理相关业务。注意提醒客户准备业务办理必须的文件。",
            "defaultExecuteType":"Mission"
        },
        {
            "userType":"performanceBusinessOpenCustPool",
            "defaultTaskType":"stockCustVisit",
            "taskName":null,
            "taskDesc":"用户在#{开户日}开户，建议跟踪服务了解客户是否有问题需要解决。
注：如果客户状态为流失，则：用户在#{流失日}流失，建议跟踪服务了解客户是否有问题需要解决。",
            "defaultExecuteType":"Chance"
        },
        {
            "userType":"performanceIncrementCustPool",
            "defaultTaskType":"newCustVisit",
            "taskName":null,
            "taskDesc":"用户在2周内办理了#{14日内开通的业务}业务，建议跟踪服务了解客户是否有问题需要解决。",
            "defaultExecuteType":"Chance"
        },
        {
            "userType":"performanceBusinessOpenCustPool",
            "defaultTaskType":null,
            "taskName":null,
            "taskDesc":"",
            "defaultExecuteType":"Chance"
        }
      ],
      "kPIDateScopeType":[
        {
            "key":"518003",
            "value":"本月"
        },
        {
            "key":"518004",
            "value":"本季"
        },
        {
            "key":"518005",
            "value":"本年"
        }
      ],
      "serviceTypeTree":[
        {
            "key":"Cancellation Tracking",
            "value":"销户跟踪",
            "children":[
                {
                    "key":"213779",
                    "value":"其他L",
                    "children":null
                },
                {
                    "key":"213772",
                    "value":"新产品介绍",
                    "children":null
                },
                {
                    "key":"213773",
                    "value":"回访问卷L",
                    "children":null
                },
                {
                    "key":"213770",
                    "value":"销户行为确认",
                    "children":null
                },
                {
                    "key":"213771",
                    "value":"近期情况问询",
                    "children":null
                }
            ]
        },
        {
            "key":"Sales Action",
            "value":"销售活动",
            "children":[
                {
                    "key":"10001",
                    "value":"一般活动",
                    "children":null
                },
                {
                    "key":"10002",
                    "value":"领导拜访",
                    "children":null
                },
                {
                    "key":"10005",
                    "value":"电话会议",
                    "children":null
                },
                {
                    "key":"10006",
                    "value":"专家路演",
                    "children":null
                },
                {
                    "key":"10003",
                    "value":"会议申请",
                    "children":null
                },
                {
                    "key":"10004",
                    "value":"会议管理",
                    "children":null
                },
                {
                    "key":"10007",
                    "value":"路演活动",
                    "children":null
                },
                {
                    "key":"10008",
                    "value":"其它活动",
                    "children":null
                }
            ]
        },
        {
            "key":"Complaints Dealing",
            "value":"投诉处理",
            "children":[
                {
                    "key":"213739",
                    "value":"其他C",
                    "children":null
                },
                {
                    "key":"213731",
                    "value":"进展跟踪",
                    "children":null
                },
                {
                    "key":"213730",
                    "value":"事由调查",
                    "children":null
                },
                {
                    "key":"213309",
                    "value":"客户满意度调查",
                    "children":null
                },
                {
                    "key":"213732",
                    "value":"结果确认",
                    "children":null
                }
            ]
        },
        {
            "key":"Diff Confirm",
            "value":"异动确认",
            "children":[
                {
                    "key":"617010",
                    "value":"资金往来异动",
                    "children":null
                },
                {
                    "key":"TG2137",
                    "value":"操作异动",
                    "children":null
                },
                {
                    "key":"617080",
                    "value":"受限流通股异动",
                    "children":null
                },
                {
                    "key":"213760",
                    "value":"股票异常交易",
                    "children":null
                },
                {
                    "key":"213761",
                    "value":"基金交易异动",
                    "children":null
                },
                {
                    "key":"213762",
                    "value":"账户信息变更",
                    "children":null
                },
                {
                    "key":"213769",
                    "value":"其他A",
                    "children":null
                },
                {
                    "key":"213020",
                    "value":"客户流失预警",
                    "children":null
                }
            ]
        },
        {
            "key":"Customer Infor Verify",
            "value":"客户信息核实",
            "children":[
                {
                    "key":"Phone Infor Verify",
                    "value":"电话信息核实",
                    "children":null
                }
            ]
        },
        {
            "key":"General",
            "value":"常规",
            "children":[
                {
                    "key":"213314",
                    "value":"业务合作",
                    "children":null
                },
                {
                    "key":"213201",
                    "value":"积分活动",
                    "children":null
                },
                {
                    "key":"Campaign Launch",
                    "value":"营销活动执行",
                    "children":null
                },
                {
                    "key":"213490",
                    "value":"渠道维护",
                    "children":null
                },
                {
                    "key":"Stage Execution",
                    "value":"阶段处理",
                    "children":null
                },
                {
                    "key":"Campaign Load",
                    "value":"营销活动加载",
                    "children":null
                },
                {
                    "key":"213480",
                    "value":"渠道拜访",
                    "children":null
                },
                {
                    "key":"213999",
                    "value":"其他",
                    "children":null
                },
                {
                    "key":"213202",
                    "value":"场地维护",
                    "children":null
                }
            ]
        },
        {
            "key":"Campaign Action",
            "value":"服务营销",
            "children":[
                {
                    "key":"213402",
                    "value":"其他理财产品推荐",
                    "children":null
                },
                {
                    "key":"213403",
                    "value":"积分服务产品推荐",
                    "children":null
                },
                {
                    "key":"213401",
                    "value":"紫金系列理财产品推荐",
                    "children":null
                },
                {
                    "key":"213406",
                    "value":"存量客户盘活",
                    "children":null
                },
                {
                    "key":"213407",
                    "value":"转介绍",
                    "children":null
                },
                {
                    "key":"213404",
                    "value":"其他服务产品推荐",
                    "children":null
                },
                {
                    "key":"213405",
                    "value":"紫金大讲堂",
                    "children":null
                },
                {
                    "key":"213310",
                    "value":"问卷调查",
                    "children":null
                },
                {
                    "key":"213305",
                    "value":"客户信息更新",
                    "children":null
                },
                {
                    "key":"CF0001",
                    "value":"研究服务",
                    "children":null
                },
                {
                    "key":"CF0002",
                    "value":"固定收益产品",
                    "children":null
                },
                {
                    "key":"213304",
                    "value":"新业务介绍",
                    "children":null
                },
                {
                    "key":"CF0003",
                    "value":"权益类产品",
                    "children":null
                },
                {
                    "key":"CF0004",
                    "value":"定增产品",
                    "children":null
                },
                {
                    "key":"CF0005",
                    "value":"股权产品",
                    "children":null
                },
                {
                    "key":"CF0006",
                    "value":"股权项目",
                    "children":null
                },
                {
                    "key":"CF0007",
                    "value":"海外投资",
                    "children":null
                },
                {
                    "key":"CF0008",
                    "value":"网下打新",
                    "children":null
                },
                {
                    "key":"CF0009",
                    "value":"留学移民",
                    "children":null
                },
                {
                    "key":"TG1800",
                    "value":"首笔交易分析",
                    "children":null
                },
                {
                    "key":"TG1700",
                    "value":"潜在客户服务",
                    "children":null
                },
                {
                    "key":"213106",
                    "value":"佣金洽谈",
                    "children":null
                },
                {
                    "key":"CF0013",
                    "value":"财富下午茶活动",
                    "children":null
                },
                {
                    "key":"213105",
                    "value":"投资建议",
                    "children":null
                },
                {
                    "key":"CF0012",
                    "value":"股权架构",
                    "children":null
                },
                {
                    "key":"213103",
                    "value":"客户挽留",
                    "children":null
                },
                {
                    "key":"CF0011",
                    "value":"减持避税",
                    "children":null
                },
                {
                    "key":"CF0010",
                    "value":"家族信托",
                    "children":null
                },
                {
                    "key":"213414",
                    "value":"其他Y",
                    "children":null
                },
                {
                    "key":"TG1900",
                    "value":"首月无资金",
                    "children":null
                }
            ]
        },
        {
            "key":"TG New Customer Visit",
            "value":"投顾新客户回访",
            "children":[
                {
                    "key":"213789",
                    "value":"其他I",
                    "children":null
                }
            ]
        },
        {
            "key":"Margin Trading",
            "value":"新开融资融券客户回访",
            "children":[
                {
                    "key":"213766",
                    "value":"移动端开户回访",
                    "children":null
                },
                {
                    "key":"213758",
                    "value":"再次回访M",
                    "children":null
                }
            ]
        },
        {
            "key":"Investment Bank Account",
            "value":"投行活动",
            "children":[
                {
                    "key":"213530",
                    "value":"电话联系T",
                    "children":null
                },
                {
                    "key":"213520",
                    "value":"会议组织",
                    "children":null
                },
                {
                    "key":"213510",
                    "value":"礼品赠送",
                    "children":null
                },
                {
                    "key":"213550",
                    "value":"问题研讨会",
                    "children":null
                },
                {
                    "key":"213600",
                    "value":"投行项目",
                    "children":null
                },
                {
                    "key":"213560",
                    "value":"业务合作T",
                    "children":null
                },
                {
                    "key":"213570",
                    "value":"其他T",
                    "children":null
                },
                {
                    "key":"213540",
                    "value":"走访T",
                    "children":null
                }
            ]
        },
        {
            "key":"Trust Products Sale",
            "value":"信托产品销售回访",
            "children":[
                {
                    "key":"213764",
                    "value":"信托回访",
                    "children":null
                },
                {
                    "key":"213763",
                    "value":"再次回访X",
                    "children":null
                }
            ]
        },
        {
            "key":"Warm Care",
            "value":"温馨关怀",
            "children":[
                {
                    "key":"213740",
                    "value":"节日问候",
                    "children":null
                },
                {
                    "key":"213888",
                    "value":"生日祝贺",
                    "children":null
                },
                {
                    "key":"213749",
                    "value":"其他W",
                    "children":null
                },
                {
                    "key":"213408",
                    "value":"联谊活动",
                    "children":null
                },
                {
                    "key":"213742",
                    "value":"司庆答谢",
                    "children":null
                },
                {
                    "key":"213741",
                    "value":"情感交流",
                    "children":null
                }
            ]
        },
        {
            "key":"System Alert",
            "value":"通知提醒",
            "children":[
                {
                    "key":"OTCOpen",
                    "value":"OTC开户回访问卷",
                    "children":null
                },
                {
                    "key":"TG0400",
                    "value":"资产未达标",
                    "children":null
                },
                {
                    "key":"TG0500",
                    "value":"配置异常",
                    "children":null
                },
                {
                    "key":"213753",
                    "value":"风险评估",
                    "children":null
                },
                {
                    "key":"213752",
                    "value":"证件到期",
                    "children":null
                },
                {
                    "key":"213755",
                    "value":"信用账户评级",
                    "children":null
                },
                {
                    "key":"213754",
                    "value":"市场活动协议预警",
                    "children":null
                },
                {
                    "key":"213757",
                    "value":"银行理财产品风险评估",
                    "children":null
                },
                {
                    "key":"213030",
                    "value":"客户升降级告知",
                    "children":null
                },
                {
                    "key":"213756",
                    "value":"理财评估",
                    "children":null
                },
                {
                    "key":"213307",
                    "value":"中签、配股、增发提醒",
                    "children":null
                },
                {
                    "key":"213101",
                    "value":"评级短信提醒",
                    "children":null
                },
                {
                    "key":"213427",
                    "value":"其他S",
                    "children":null
                },
                {
                    "key":"TREAssess",
                    "value":"泰融e风险评估",
                    "children":null
                },
                {
                    "key":"213997",
                    "value":"损益告警",
                    "children":null
                },
                {
                    "key":"213887",
                    "value":"权证到期",
                    "children":null
                },
                {
                    "key":"213886",
                    "value":"权证行权",
                    "children":null
                },
                {
                    "key":"213889",
                    "value":"洗钱风险审核",
                    "children":null
                },
                {
                    "key":"213765",
                    "value":"信用风险处置",
                    "children":null
                },
                {
                    "key":"213040",
                    "value":"产品订购",
                    "children":null
                },
                {
                    "key":"213767",
                    "value":"贵金属延期交收业务风险评估",
                    "children":null
                },
                {
                    "key":"213750",
                    "value":"重大事项公告",
                    "children":null
                },
                {
                    "key":"213751",
                    "value":"重要活动",
                    "children":null
                },
                {
                    "key":"213890",
                    "value":"洗钱风险按日日常监控",
                    "children":null
                },
                {
                    "key":"213893",
                    "value":"短信服务",
                    "children":null
                },
                {
                    "key":"213894",
                    "value":"软件产品到期提醒",
                    "children":null
                },
                {
                    "key":"213891",
                    "value":"洗钱风险按周日常监控",
                    "children":null
                },
                {
                    "key":"TG0300",
                    "value":"服务关系确认",
                    "children":null
                },
                {
                    "key":"213892",
                    "value":"洗钱风险年度审核",
                    "children":null
                }
            ]
        },
        {
            "key":"Resp",
            "value":"体征服务回访",
            "children":[
                {
                    "key":"Resp Massage",
                    "value":"体征服务",
                    "children":null
                }
            ]
        },
        {
            "key":"Old Customer Visit",
            "value":"存量客户回访",
            "children":[
                {
                    "key":"213721",
                    "value":"账户诊断回访",
                    "children":null
                },
                {
                    "key":"213720",
                    "value":"回访问卷O",
                    "children":null
                },
                {
                    "key":"TG0100",
                    "value":"风险、投资需求更新",
                    "children":null
                },
                {
                    "key":"TG0110",
                    "value":"退出回访",
                    "children":null
                },
                {
                    "key":"213729",
                    "value":"其他O",
                    "children":null
                },
                {
                    "key":"213728",
                    "value":"风险排查",
                    "children":null
                }
            ]
        },
        {
            "key":"Fins Su",
            "value":"理财建议",
            "children":[
                {
                    "key":"TG1400",
                    "value":"资讯异动",
                    "children":null
                },
                {
                    "key":"TG1300",
                    "value":"重仓点评",
                    "children":null
                },
                {
                    "key":"TG1600",
                    "value":"首份投资建议书推送",
                    "children":null
                },
                {
                    "key":"TG1100",
                    "value":"投资建议书",
                    "children":null
                },
                {
                    "key":"TG1500",
                    "value":"产品调整",
                    "children":null
                }
            ]
        },
        {
            "key":"MOT Action",
            "value":"MOT服务记录",
            "children":[
                {
                    "key":"MOT Action",
                    "value":"MOT服务记录",
                    "children":null
                }
            ]
        },
        {
            "key":"New Customer Visit",
            "value":"新客户回访",
            "children":[
                {
                    "key":"213885",
                    "value":"回访问卷N",
                    "children":null
                },
                {
                    "key":"213717",
                    "value":"再次回访",
                    "children":null
                },
                {
                    "key":"213718",
                    "value":"新开信用账户回访",
                    "children":null
                },
                {
                    "key":"213719",
                    "value":"其他N",
                    "children":null
                }
            ]
        },
        {
            "key":"TG Exists Custotmer Visit",
            "value":"投顾存量客户回访",
            "children":[
                {
                    "key":"213799",
                    "value":"其他J",
                    "children":null
                }
            ]
        }
      ],
      "taskTypes":[
        {
            "key":"other",
            "value":"其他",
            "defaultExecuteType":"Chance"
        },
        {
            "key":"stockCustVisit",
            "value":"存量客户回访",
            "defaultExecuteType":"Chance"
        },
        {
            "key":"businessRecommend",
            "value":"业务推荐",
            "defaultExecuteType":"Mission"
        },
        {
            "key":"newCustVisit",
            "value":"新客户回访",
            "defaultExecuteType":"Chance"
        }
      ],
      "custNature":[
        {
            "key":"",
            "value":"不限"
        },
        {
            "key":"F",
            "value":"产品"
        },
        {
            "key":"P",
            "value":"个人"
        },
        {
            "key":"O",
            "value":"机构"
        }
      ],
      "custType":[
        {
            "key":"",
            "value":"不限"
        },
        {
            "key":"N",
            "value":"零售客户"
        },
        {
            "key":"Y",
            "value":"高净值"
        }
      ]
    }
  }
}
