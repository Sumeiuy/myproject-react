/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-27 17:16:48
 * @Last Modified by:   xuxiaoqin
 * @Last Modified time: 2017-10-27 17:16:48
 * 检查搜索框中是否包含特殊字符
 */

import { message } from 'antd';

export default {};

export const checkSpecialCharacter = (target, name, descriptor) => {
  const origin = descriptor.value;

  return {
    ...descriptor,
    value(...args) {
      const [searchValue = ''] = args || [];
      if (searchValue.indexOf('%') > -1 || searchValue.indexOf('_') > -1) {
        message.error('搜索内容不要包含特殊字符');
        return false;
      }
      origin.apply(this, args);
      return true;
    },
  };
};
