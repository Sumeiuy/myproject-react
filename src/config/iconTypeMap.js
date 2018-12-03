import ZHUNICODE from './unicode';

const {
  REN, HU, PERCENT, PERMILLAGE, CI, GE
} = ZHUNICODE;

const iconTypeMap = {

  getIcon(unit) {
    if (unit === PERCENT || unit === PERMILLAGE) {
      return 'bilv';
    } if (unit === HU || unit === REN) {
      return 'kehu';
    } if (unit === GE || unit === CI) {
      return 'ge';
    }
    return 'yuan';
  },

  getCoreIcon(unit) {
    if (unit === PERCENT || unit === PERMILLAGE) {
      return 'pie';
    } if (unit === HU || unit === REN) {
      return 'ren';
    } if (unit === GE || unit === CI) {
      return 'shuju';
    }
    return 'money';
  },

  getCoreIconColor(unit) {
    if (unit === PERCENT || unit === PERMILLAGE) {
      return '#756fb8';
    } if (unit === HU || unit === REN) {
      return '#5d95f3';
    } if (unit === GE || unit === CI) {
      return '#ffa32c';
    }
    return '#38d8e8';
  },

  getCoreIconSize(unit) {
    if (unit === HU || unit === REN) {
      return '26px';
    }
    return '27px';
  },
};

export default iconTypeMap;

export const {
  getIcon,
  getCoreIcon,
  getCoreIconColor,
  getCoreIconSize,
} = iconTypeMap;
