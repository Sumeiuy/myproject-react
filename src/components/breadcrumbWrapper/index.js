/*
 * @Description: 面包屑包裹组件
 * @Author: 朱飞阳
 * @Date: 2018/7/31 18:18
 * @Last Modified by: 朱飞阳
 * @Last Modified time: 2018-07-31 10:56:40
 */

import env from '../../helper/env';

export default function breadcrumbWrapper(props) {
  return env.isInReact() ? props.children : null;
}
