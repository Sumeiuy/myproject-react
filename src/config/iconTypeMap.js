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
    if (unit === '%' || unit === '\u2030') {
      return 'xinyonghucanyuzhanbi';
    } else if (unit === '户' || unit === '人') {
      return 'renyuan';
    }
    return 'zichan';
  },
};

export default iconTypeMap;
