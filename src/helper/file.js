/**
 * @Author: sunweibin
 * @Date: 2018-05-10 16:33:37
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-09-26 14:56:53
 * @description 用于上传或者其他与文件类型判断相关的函数集合
 */

const FileType = {
  // 在 mac 系统下 .csv 文件的 mime 类型
  csv: 'text/csv',
  // 后缀为 .csv|.xls 的文件，在 windows 下 .csv 文件也是这个 mime
  xls: 'application/vnd.ms-excel',
  // 后缀为 .xlsx 的文件
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // 后缀为 .xlsm 的文件
  xlsm: 'application/vnd.ms-excel.sheet.macroEnabled.12',
  // 后缀为 .doc 的word文件
  doc: 'application/msword',
  // 后缀为 .docx 的word文件
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // 后缀为 .jpe .jpeg .jpg 的图片
  jpg: 'image/jpeg',
};

const file = {
  /**
   * 判断文件是否是Excel相关的文件，如后缀名为：.csv|.xls|.xlsx
   * @param {String} type 文件类型的字符串
   * @return {Boolean} 是否是Excel相关文件
   */
  isExcel(type) {
    return type === FileType.xls || type === FileType.xlsx || type === FileType.csv;
  },
};

export default file;

export const {
  isExcel,
} = file;
