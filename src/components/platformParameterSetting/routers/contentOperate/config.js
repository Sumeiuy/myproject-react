/**
  * @desc：全量匹配文本中的URL
  * 至汉字、空格 结束
*/
const  urlRegExp = /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)(:\d+)?((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[-+=&;%@.\w/?_]*))?)/;
// 文件上传类型
const acceptType = 'image/png, image/jpeg';
export {
  urlRegExp,
  acceptType
};
