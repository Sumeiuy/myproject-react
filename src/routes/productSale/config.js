const KEYFIRSTPUBLICOFFERING = '/sysOperate/platformParameterSetting/productSale/keyFirstPublicOffering';
const FILIALEANNUALTARGET = '/sysOperate/platformParameterSetting/productSale/filialeAnnualTarget';
const IFRAMEPATH = '/acrmbi/login?iv-user=001750&menuId=';

export default {
  iframe: [
    {
      path: KEYFIRSTPUBLICOFFERING,
      name: '重点首发公募',
      iframePath: `${IFRAMEPATH}01064`,
    }, {
      path: FILIALEANNUALTARGET,
      name: '分公司年度目标',
      iframePath: `${IFRAMEPATH}01065`,
    },
  ],
};
