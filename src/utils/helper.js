/**
 * @file utils/helper.js
 *  常用工具方法
 * @author maoquan(maoquan@htsc.com)
 */

const helper = {

  /**
   * 将{ a: 1, b: 2 } => a=1&b=2
   * @param {object} query
   */
  queryToString(query = {}) {
    const encode = encodeURIComponent;
    return Object.keys(query).map(
      key => (`${encode(key)}=${encode(query[key])}`),
    ).join('&');
  },

  /**
   * 由?a=1&b=2 ==> {a:1, b:2}
   * @param {string} search 一般取自location.search
   */
  getQuery(search) {
    const query = {};
    // 去掉`?`
    const searchString = search.slice(1);
    if (searchString) {
      searchString.split('&').map(
        item => item.split('='),
      ).forEach(
        item => (query[item[0]] = item[1]),
      );
    }
    return query;
  },

  isLocalStorageSupport() {
    const KEY = 'STORAGE_TEST_KEY';
    try {
      localStorage.setItem(KEY, KEY);
      localStorage.removeItem(KEY);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * 获取属性的属性值
   * 针对类似 `a.b.c` 的命名路径，获取最后的 `c` 的属性
   *
   * @param {object} object 要获取值的对象
   * @param {string} name 属性名
   * @return {*}
   */
  getProperty(object, name) {
    const paths = name.split('.');
    let property = object[paths.shift()];

    while (paths.length) {
      if (property === null || property === undefined) {
        return property;
      }
      property = property[paths.shift()];
    }

    return property;
  },


  hasClass(elem, className) {
    return elem.className.indexOf(className) > -1;
  },

  toUnit(str, per) {
    // 分割成数组
    const arr = str.toString().split('.');
    // 取出整数部分长度
    const length = arr[0].length;
    const obj = {};
    // 整数部分大于等于 依据 长度
    if (length >= per) {
      // 按照依据长度取出 依据 数字，超出长度以 0 补足
      const num = arr[0].substr(0, per) + arr[0].substr(per).replace(/\d/g, '0');
      switch (true) {
        case length < 9:
          obj.value = `${num / 10000}`;
          obj.unit = '万';
          break;
        case length >= 9 && length < 13:
          obj.value = `${num / 100000000}`;
          obj.unit = '亿';
          break;
        default:
          obj.value = `${num / 1000000000000}`;
          obj.unit = '万亿';
          break;
      }
      return obj;
    }
    // 计算小数部分长度
    // 如果有小数，小数部分取 依据 长度减整数部分长度
    if (arr[1]) {
      arr[1] = arr[1].substr(0, per - length);
    }
    obj.value = arr.join('.');
    obj.unit = '';
    return obj;
  },

};

export default helper;
