/**
 * @file config/otherCommissionDictionary.js
 * @description 批量佣金调整其他佣金率简写配置项
 * brief 名称简写
 * paramName 为传递参数名称
 * @author sunweibin
 */

export default {
  HTSC_ZFARE_RATIO: {
    brief: '债券',
    paramName: 'zqCommission',
  },
  HTSC_DBFARE_RATIO: {
    brief: '担保股基',
    paramName: 'stkCommission',
  },
  HTSC_CBFARE_RATIO: {
    brief: '信用股基',
    paramName: 'creditCommission',
  },
  HTSC_DDFARE_RATIO: {
    brief: '担保品大宗交易',
    paramName: 'ddCommission',
  },
  HTSC_HFARE_RATIO: {
    brief: '回购',
    paramName: 'hCommission',
  },
  HTSC_DZFARE_RATIO: {
    brief: '担保债券',
    paramName: 'dzCommission',
  },
  HTSC_COFARE_RATIO: {
    brief: '信用场内基金',
    paramName: 'coCommission',
  },
  HTSC_STBFARE_RATIO: {
    brief: '股转',
    paramName: 'stbCommission',
  },
  HTSC_OFARE_RATIO: {
    brief: '场内基金',
    paramName: 'oCommission',
  },
  HTSC_DOFARE_RATIO: {
    brief: '担保场内基金',
    paramName: 'doCommission',
  },
  HTSC_HKFARE_RATIO: {
    brief: '港股通（净佣金）',
    paramName: 'hkCommission',
  },
  HTSC_BGFARE_RATIO: {
    brief: 'B股',
    paramName: 'bgCommission',
  },
  HTSC_QFARE_RATIO: {
    brief: '权证',
    paramName: 'qCommission',
  },
  HTSC_DQFARE_RATIO: {
    brief: '担保权证',
    paramName: 'dqCommission',
  },
  HTSC_OPTFARE_RATIO: {
    brief: '个股期权',
    paramName: 'opCommission',
  },
  HTSC_DFARE_RATIO: {
    brief: '大宗交易',
    paramName: 'dCommission',
  },
};

export const disabledMap = [
  'stkCommission',
  'creditCommission',
];
