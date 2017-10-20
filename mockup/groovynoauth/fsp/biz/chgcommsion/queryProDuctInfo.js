/**
 * @description 单佣金调整页面产品查询
 * @author sunweibin
 */

exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: {
      id: '1-xxx',
      prodID: '1-xxx',
      prodCode: 'Wl103',
      prodName: 'xx产品',
      prodRate: '0.3',
      isPackage: 'Y',
      children: [
        {
          id: '1-xsub',
          prodCode: 'Wlsub',
          prodName: 'xx子产品',
        },
      ],
    },
  };
};
