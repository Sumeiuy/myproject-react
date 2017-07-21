import ZHUNICODE from './unicode';

const { REN, HU, PERCENT, PERMILLAGE, CI, GE } = ZHUNICODE;

const iconTypeMap = {

  getIcon(unit) {
    if (unit === PERCENT || unit === PERMILLAGE) {
      return 'bilv';
    } else if (unit === HU || unit === REN) {
      return 'kehu';
    } else if (unit === GE || unit === CI) {
      return 'ge';
    }
    return 'yuan';
  },
};

export default iconTypeMap;
