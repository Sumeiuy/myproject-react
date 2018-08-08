/*
 * @Description: 操作fsp相关方法
 * @Author: XiaZhiQiang
 * @Date: 2018/1/31 18:18
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-30 10:56:40
 */
import { fspContainer } from '../config';
import env from './env';

const fsp = {
  /**
   * 操作fsp返回顶部
   * @author XiaZhiQiang
   * @returns {void}
   */
  scrollToTop() {
    const fspBody = document.querySelector(fspContainer.container);
    if (fspBody) {
      fspBody.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
    }
  },
  /**
   * 判断fsp左侧菜单是否被折叠
   */
  isFSPLeftMenuFold() {
    if (env.isInFsp()) {
      const fspLeftMenu = document.querySelector(fspContainer.workspaceSidebar);
      return fspLeftMenu.style.display === 'none';
    }
    return true;
  },
};

export default fsp;
