/**
 * @file config/constants.js
 *  一些系统常量定义
 * @author maoquan(maoquan@htsc.com)
 */

const exported = {
  container: '.react-app',
  logoText: '华泰证券',
  version: '1.6.2',
  boardId: 1,
  boardType: 'TYPE_TGJX',
  historyBoardId: 3,
  historyBoardType: 'TYPE_LSDB_TGJX',
  apiPrefix: '/fspa/mcrm/api',
  fspPrefix: '/fsp',
  inHTSCDomain: window.location.hostname.indexOf('htsc.com.cn') > -1,

 // 经总的level值
  jingZongLevel: '1',

 // 分公司的level值
  filialeLevel: '2',

 // 汇总方式（汇报关系）
  hbgxSummaryType: 'hbgx',

 // 汇总方式（绩效视图）
  jxstSummaryType: 'jxst',

 // 是否打开本地缓存
  enableSessionStorage: false,
};

export default exported;

export const {
 container,
 logoText,
 version,
 boardId,
 boardType,
 historyBoardId,
 historyBoardType,
 apiPrefix,
 fspPrefix,
 inHTSCDomain,
 jingZongLevel,
 filialeLevel,
 hbgxSummaryType,
 jxstSummaryType,
 enableSessionStorage,
} = exported;
