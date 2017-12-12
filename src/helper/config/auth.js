/**
 * @Author: sunweibin
 * @Date: 2017-11-22 15:24:07
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-12-12 11:06:10
 * @description 此处存放权限所依据的职责ID集合
 */
import duty from './duty';

const auth = {
  /**
   * 服务订购中的新建申请需要的各项职责集合
   */
  commission: {
    /**
     * 批量佣金调整申请需要的职责
     */
    batch: [duty.htsc_plyjsz],
    /**
     * 单佣金调整的权限-1,此种权限需要必须是:岗位为服务岗
     */
    single_1: [duty.htsc_zhfw_yybzxg, duty.htsc_yybfwg],
    /**
     * 单佣金调整的权限-2
     */
    single_2: [duty.htsc_hlwfwjl],
    /**
     * 资讯订阅申请需要的职责
     */
    subscribe: [duty.htsc_zhfw_yybzxg, duty.htsc_yybfwg, duty.htsc_fwjl, duty.htsc_htggst],
    /**
     * 资讯退订申请需要的职责
     */
    unsubscribe: [duty.htsc_zhfw_yybzxg, duty.htsc_yybfwg, duty.htsc_fwjl, duty.htsc_htggst],
  },
};

export default auth;
