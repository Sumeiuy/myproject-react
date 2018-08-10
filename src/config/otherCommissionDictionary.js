/**
 * @file config/otherCommissionDictionary.js
 * @description 批量佣金调整其他佣金率简写配置项
 * brief 名称简写
 * paramName 为传递参数名称
 * @author sunweibin
 */

const exported = {
  HTSC_ZFARE_RATIO: {
    brief: '债券',
    paramName: 'zqCommission',
    order: 1,
  },

  HTSC_DBFARE_RATIO: {
    brief: '担保股基',
    paramName: 'stkCommission',
    order: 6,
  },

  HTSC_CBFARE_RATIO: {
    brief: '信用股基',
    paramName: 'creditCommission',
    order: 14,
  },

  HTSC_DDFARE_RATIO: {
    brief: '担保品大宗交易',
    paramName: 'ddCommission',
    order: 8,
  },

  HTSC_HFARE_RATIO: {
    brief: '回购',
    paramName: 'hCommission',
    order: 11,
  },

  HTSC_DZFARE_RATIO: {
    brief: '担保债券',
    paramName: 'dzCommission',
    order: 2,
  },

  HTSC_COFARE_RATIO: {
    brief: '信用场内基金',
    paramName: 'coCommission',
    order: 12,
  },

  HTSC_STBFARE_RATIO: {
    brief: '股转',
    paramName: 'stbCommission',
    order: 13,
  },

  HTSC_OFARE_RATIO: {
    brief: '场内基金',
    paramName: 'oCommission',
    order: 9,
  },

  HTSC_DOFARE_RATIO: {
    brief: '担保场内基金',
    paramName: 'doCommission',
    order: 10,
  },

  HTSC_HKFARE_RATIO: {
    brief: '港股通（净佣金）',
    paramName: 'hkCommission',
    order: 15,
  },

  HTSC_BGFARE_RATIO: {
    brief: 'B股',
    paramName: 'bgCommission',
    order: 5,
  },

  HTSC_QFARE_RATIO: {
    brief: '权证',
    paramName: 'qCommission',
    order: 3,
  },

  HTSC_DQFARE_RATIO: {
    brief: '担保权证',
    paramName: 'dqCommission',
    order: 4,
  },

  HTSC_OPTFARE_RATIO: {
    brief: '个股期权',
    paramName: 'opCommission',
    order: 16,
  },

  HTSC_DFARE_RATIO: {
    brief: '大宗交易',
    paramName: 'dCommission',
    order: 7,
  },
};

export default exported;

export const {
  HTSC_ZFARE_RATIO,
  HTSC_DBFARE_RATIO,
  HTSC_CBFARE_RATIO,
  HTSC_DDFARE_RATIO,
  HTSC_HFARE_RATIO,
  HTSC_DZFARE_RATIO,
  HTSC_COFARE_RATIO,
  HTSC_STBFARE_RATIO,
  HTSC_OFARE_RATIO,
  HTSC_DOFARE_RATIO,
  HTSC_HKFARE_RATIO,
  HTSC_BGFARE_RATIO,
  HTSC_QFARE_RATIO,
  HTSC_DQFARE_RATIO,
  HTSC_OPTFARE_RATIO,
  HTSC_DFARE_RATIO,
} = exported;

export const disabledMap = [
  'stkCommission',
  'creditCommission',
];

// 所有的其他佣金费率的参数名
export const allCommissionParamName = [
  'zqCommission',
  'stkCommission',
  'creditCommission',
  'ddCommission',
  'hCommission',
  'dzCommission',
  'coCommission',
  'stbCommission',
  'oCommission',
  'doCommission',
  'hkCommission',
  'bgCommission',
  'qCommission',
  'dqCommission',
  'opCommission',
  'dCommission',
];
