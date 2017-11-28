/**
 * @Author: sunweibin
 * @Date: 2017-11-28 09:53:06
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-28 09:57:37
 * @description 此处存放合作合约使用的辅助方法
 */
import { env } from '../../helper';
import { hasPermissionOfPostion } from '../../utils/permission';

const contract = {
  // 检测合作合约项目，当前用户是否有相应的职责、职位权限
  hasPermission(empInfo) {
    let hasPermissionOnBtn = true;
    if (env.isInFsp()) {
      hasPermissionOnBtn = hasPermissionOfPostion(empInfo);
    }
    return hasPermissionOnBtn;
  },
};

export default contract;
