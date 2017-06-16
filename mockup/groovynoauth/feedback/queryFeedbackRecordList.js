exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "recordList": [
        {
          code: '1232112',
          contentlist: [
            '将 问题标签 由“使用方法”修改为“改进建议”',
            '将 状态 由“解决中”修改为“关闭”',
            '将 处理意见 添加为“该意见与业务确认完成，可以关闭。”',
          ],
          userName: '王强',
          userNum: '1001',
          date: '2017-02-23',
          department: '信息技术部',
        },
        {
          code: '1232112',
          contentlist: [
            '将 问题标签 由“使用方法”修改为“改进建议”',
            '将 经办人 由“王溪”修改为“张大轩”',
            '将 处理意见 添加为“该意见与业务确认完成，可以关闭。”',
            '上传了附件《用户问题反馈确认表.doc》',
          ],
          userName: '王强',
          userNum: '1001',
          date: '2017-02-23',
          department: '信息技术部',
        },
        {
          code: '1232112',
          contentlist: [
            '上传了附件《用户问题反馈确认表.doc》',
          ],
          userName: '王强',
          userNum: '1001',
          date: '2017-02-23',
          department: '信息技术部',
        },
      ],
    },
  };
}