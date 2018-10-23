/**
 * @description 通用提示函数
 * @author zhangjun
 */
import { Modal } from 'antd';

export default function (params) {
  const {
    // 确认框标题
    title = '系统提示',
    // 确认框内容,自定义的
    content = '',
    // 确认框类型，提示信息(info)，成功提示(success)，错误提示(error),警告提示(warning)
    type = 'info',
    // 确认框确认按钮调用
    onOk = () => {},
    // 确认按钮文本
    okText = '确认',
  } = params;


  Modal[type]({
    title,
    content,
    okText,
    onOk,
  });
}
