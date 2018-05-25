/**
 * @Descripter: 客户列表页来源描述
 * @Author: K0170179
 * @Date: 2018/5/8
 */

/**
 * type: 过滤器id
 * name: 过滤器名称
 * filterSource: 没有这个参数则为必显，有的话判断与客户列表来源匹配
 * @type {*[]}
 */
const FILTER_LIST = [
  {
    type: 'CUST_NATURE',
    name: '客户性质',
  },
  {
    type: 'CUST_TYPE',
    name: '客户类型',
  },
  {
    type: 'RISK_GRADE',
    name: '分险等级',
  },
  {
    type: 'OPENED_BUSINESS',
    name: '已开通业务',
  },
  {
    type: 'ALLOW_OPEN_BUSINESS',
    name: '可开通业务',
    filterSource: ['numOfCustOpened', 'business', 'sightingTelescope'],
  },
  /**
   * @desc: 开通业务下钻回显字段
   * bname：开通业务名称
   * cycleSelect：季节对应id
   * orgId: 开通业务模块组织对应id与我的客户msm
   */
  {
    type: 'OPEN_BUSINESS',
    name: '开通业务',
    filterSource: ['numOfCustOpened'],
  },
  /**
   * @desc: 客户标签下钻回显字段
   * labelDesc 标签描述
   * labelMapping 标签id
   * labelName 标签名
   */
  {
    type: 'CUSTOMER_LABEL',
    name: '客户标签',
    filterSource: ['sightingTelescope', 'tag', { source: 'association', type: 'LABEL' }],
  },
  // 客户标签子标签
  {
    type: 'CUSTOMER_LABEL_CHILD',
    name: '子标签',
    filterSource: ['sightingTelescope'],
  },
  /**
   * @desc: 持仓产品下钻回显字段
   * labelDesc: 持仓产品描述
   * labelMapping: 持仓产品id
   * labelName: 持仓产品名称（持仓产品code）
   */
  {
    type: 'HOLDING_PRODUCT',
    name: '持仓产品',
    filterSource: [{ source: 'association', type: 'PRODUCT' }],
  },
];

const SOURCE = [
  /**
   * @sourceName: 来源于首页‘潜在业务客户’
   */
  {
    sourceName: 'business',
  },
  /**
   * @sourceName: 来源于首页搜索框首页模糊搜索
   */
  {
    sourceName: 'search',
  },
  /**
   * @sourceName: 来源于首页搜索联想词（非）
   */
  {
    sourceName: 'association',
  },
  /**
   * @sourceName: 首页瞄准镜标签(来源于热词->瞄准镜标签、精准搜索->瞄准镜标签)
   */
  {
    sourceName: 'sightingTelescope',
  },
  /**
   * @sourceName: 来源于首页热词->非瞄准镜标签
   */
  {
    sourceName: 'tag',
  },
  /**
   * @sourceName: 来源于首页业务开通
   */
  {
    sourceName: 'numOfCustOpened',
  },
  /**
   * @sourceName: 来源于首页新增客户
   */
  {
    sourceName: 'custIndicator',
  },
  /**
   * @sourceName: 来源于收益凭证
   */
  {
    sourceName: 'external',
  },
];

export default {
  FILTER_LIST,
  SOURCE,
};
