/**
 * @Author: hongguangqing
 * @Date: 2017-1-10 10:23:58
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-01-16 09:48:39
 * @description 此处存放通用的数据格式/类型处理的方法
 */

/**
 * 将后端返回的数据翻译成对应的中文
 * @param {Array} arr 是否投顾入岗
 * @param {flag} flag为true转化为中文作为页面展示，flag为false转化为英文作为入参
 */
function convertTgFlag(arr, flag) {
  let newArr = [];
  if (arr && arr.length) {
    newArr = arr.map((item) => {
      let tgFlag;
      if (flag) {
        tgFlag = item.tgFlag === 'Y' ? '是' : '否';
      } else {
        tgFlag = item.tgFlag === '是' ? 'Y' : 'N';
      }
      return {
        ...item,
        tgFlag,
      };
    });
  }
  return newArr;
}

/**
 * 附件数据整合
 */
function handleAttachmentData(develop, other, developAttachment, otherAttachment) {
  const developData = {
    attachmentList: develop,
    title: '开发关系认定书（首次认定时必输）',
    uuid: developAttachment,
  };
  const otherData = {
    attachmentList: other,
    title: '其他',
    uuid: otherAttachment,
  };
  return [developData, otherData];
}

export default {
  convertTgFlag,
  handleAttachmentData,
};
