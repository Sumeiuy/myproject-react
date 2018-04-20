/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-22 19:02:56
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-04-20 16:07:41
 * 用于全局捕获的dialog提示框，错误提示目前分为两种，常规的都是message.error，
 * 特定场景下，需要将错误信息友好的提示，利用dialog进行显示
 */

import { Modal } from 'antd';
import errorStyle from './index.less';

const error = Modal.error;

export default function errorDialog(content) {
  error({
    className: errorStyle.globalCapture,
    content,
    okText: '确定',
  });
}
