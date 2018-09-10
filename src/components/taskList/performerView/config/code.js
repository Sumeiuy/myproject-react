/**
 * @Author: sunweibin
 * @Date: 2018-04-13 16:02:48
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-13 16:07:28
 * @description 服务方式的code
 */

// 涨乐财富通的服务方式的Code
const HTSC_SERVE_WAY_ZHANGLE_CAIFUTONG_CODE = 'ZLFins';

// 服务方式是否涨乐财富通
function isZhangle(code) {
  return code === HTSC_SERVE_WAY_ZHANGLE_CAIFUTONG_CODE;
}

const exported = {
  serveWay: {
    isZhangle,
  },
};

export default exported;

export const {
  serveWay,
} = exported;
