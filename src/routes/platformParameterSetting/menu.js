/**
 * @Descripter: 用户参数设置菜单配置
 * @Author: K0170179
 * @Date: 2018/4/15
 */
import duty from '../../helper/config/duty';
import { env } from '../../helper';
// 推荐标签菜单
const recommendedLabelMenu = {
  name: '推荐标签',
  path: '/recommendedLabel',
};
// 活动栏目菜单
const activityColumnMenu = {
  name: '活动栏目',
  path: '/activityColumn',
};
// 首页内容菜单, 只有新菜单才展示活动栏目
let contentOperateMenu = [];
if (env.isInFsp()) {
  contentOperateMenu = [recommendedLabelMenu];
} else {
  contentOperateMenu = [recommendedLabelMenu, activityColumnMenu];
}
const menu = [
  {
    name: '任务管理',
    path: '/taskOperation',
    permission: duty.HTSC_HQ_XTGL,
    children: [
      {
        name: '客户反馈选项',
        path: '/customerFeedback',
      },
      {
        name: '任务问卷调查',
        path: '/taskFeedback',
      },
      {
        name: '投资建议模板',
        path: '/investmentAdvice',
      },
    ],
  },
  {
    name: '用户中心',
    path: '/labelManager',
    permission: duty.HTSC_HQ_XTGL,
    children: '个人标签',
  },
  {
    name: '首页内容',
    path: '/contentOperate',
    permission: duty.HTSC_HQ_XTGL,
    children: contentOperateMenu,
  },
  {
    name: '客户标签',
    path: '/customerLabel',
    permission: duty.HTSC_BMXTGLY,
  },
  {
    name: '产品销售',
    path: '/productSale',
    permission: duty.HTSC_HQ_XTGL,
    children: [
      {
        name: '重点首发公募',
        path: '/keyFirstPublicOffering',
      },
      {
        name: '分公司年度目标',
        path: '/filialeAnnualTarget',
      },
    ],
  },
];

export default menu;
