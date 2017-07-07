import ZHUNICODE from './unicode';

const { REN, HU, PERCENT, PERMILLAGE, CI } = ZHUNICODE;

const iconTypeMap = {
  gjPurRake: 'zichan',
  kh: 'kehu-copy',
  tg: 'tuoguan',
  per: 'xinyonghucanyuzhanbi',
  platformCustNumM: 'renyuan',
  // 实际使用
  tgInNum: 'renyuan',
  newSignCustNum: 'renyuan',
  currSignCustAset: 'zichan',
  currSignCustNum: 'renyuan',
  totAset: 'zichan',
  motCompletePercent: 'xinyonghucanyuzhanbi',
  serviceCompPercent: 'xinyonghucanyuzhanbi',
  infoCompPercent: 'xinyonghucanyuzhanbi',
  feeConfigPercent: 'xinyonghucanyuzhanbi',
  gjAvgPercent: 'xinyonghucanyuzhanbi',
  purRake: 'zichan',
  purInteIncome: 'zichan',
  prdtPurFee: 'zichan',
  tgNum: 'renyuan',
  custNum: 'renyuan',
  signCustPercent: 'xinyonghucanyuzhanbi',
  signPurPercent: 'xinyonghucanyuzhanbi',
  effSignCustNum: 'renyuan',
  accountFee: 'zichan',
  newCustInAset: 'zichan',
  platformUsedPercent: 'xinyonghucanyuzhanbi',
  netIncome: 'zichan',
  configRiskNum: 'renyuan',
  riskPreferEffRate: 'xinyonghucanyuzhanbi',
  emailEffRate: 'xinyonghucanyuzhanbi',
  mobileEffRate: 'xinyonghucanyuzhanbi',
  addressEffRate: 'xinyonghucanyuzhanbi',
  configReportNum: 'xinyonghucanyuzhanbi',
  prdtTranAmt: 'xinyonghucanyuzhanbi',
  hignCustInfoCompletePercent: 'xinyonghucanyuzhanbi',

  getIcon(unit) {
    if (unit === PERCENT || unit === PERMILLAGE) {
      return 'xinyonghucanyuzhanbi';
    } else if (unit === HU || unit === REN || unit === CI) {
      return 'renyuan';
    }
    return 'zichan';
  },
};

export default iconTypeMap;
