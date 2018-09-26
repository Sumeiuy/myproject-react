/**
 * @Author: ouchangzhi
 * @Date: 2018-01-19 13:37:08
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-09-26 11:29:18
 * @description 合格投资者-产品要求点击问号的弹出框
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

import styles from './qualifiedCustModal.less';

export default function QualifiedCustModal(props) {
  // 合格投资者-私募类
  const privateEquity = (
    <div className={styles.content}>
      <p className={styles.item}>
        私募基金的合格投资者是指具备相应风险识别能力和风险承担能力，
        投资于单只私募基金的金额不低于100万元且符合下列相关标准的单位和个人：
      </p>
      <p className={styles.item}>（一）净资产不低于1000万元的单位；</p>
      <p className={styles.item}>（二）金融资产不低于300万元或者最近三年个人年均收入不低于50万元的个人。</p>
      <p className={styles.item}>前款所称金融资产包括银行存款、股票、债券、基金份额、资产管理计划、银行理财产品、信托计划、保险产品、期货权益等。</p>
      <p className={styles.item}>下列投资者视为合格投资者：</p>
      <p className={styles.item}>（一）社会保障基金、企业年金等养老基金，慈善基金等社会公益基金；</p>
      <p className={styles.item}>（二）依法设立并在基金业协会备案的投资计划；</p>
      <p className={styles.item}>（三）投资于所管理私募基金的私募基金管理人及其从业人员；</p>
      <p className={styles.item}>（四）中国证监会规定的其他投资者。</p>
      <p className={styles.item}>
        以合伙企业、契约等非法人形式，通过汇集多数投资者的资金直接或者间接投资于私募基金的，
        私募基金管理人或者私募基金销售机构应当穿透核查最终投资者是否为合格投资者，
        并合并计算投资者人数。但是，符合本条第（一）、（二）、（四）项规定的投资者投资私募基金的，
        不再穿透核查最终投资者是否为合格投资者和合并计算投资者人数。
      </p>
    </div>
  );

  // 合格投资者-信托类
  const trust = (
    <div className={styles.content}>
      <p className={styles.item}>
        参与信托产品的投资者应当属于合格投资者，本产品所称合格投资者，是指符合下列条件之一，能够识别、判断和承担信托计划相应风险的人：
      </p>
      <p className={styles.item}>（一）投资一个信托计划的最低金额不少于100万元人民币的自然人、法人或者依法成立的其他组织；</p>
      <p className={styles.item}>（二）个人或家庭金融资产总计在其认购时超过100万元人民币，且能提供相关财产证明的自然人；</p>
      <p className={styles.item}>
        （三）个人收入在最近3年内每年收入超过20万元人民币或者夫妻双方合计收入在最近3年内每年收入超过30万元人民币，
        且能提供相关收入证明的自然人。
      </p>
    </div>
  );

  // 合格投资者-小集合类
  const smallSet = (
    <div className={styles.content}>
      <p className={styles.item}>
        具备相应风险识别能力和承担所投资集合资产管理计划风险能力且符合下列条件之一的单位和个人：
      </p>
      <p className={styles.item}>（一）个人或者家庭金融资产合计不低于100万元人民币；</p>
      <p className={styles.item}>（二）公司、企业等机构净资产不低于1000万元人民币；</p>
      <p className={styles.item}>依法设立并受监管的各类集合投资产品视为单一合格投资者。</p>
    </div>
  );

  // 收益凭证
  const revenueVoucher = (
    <div className={styles.content}>
      <p className={styles.item}>
      个人投资者的金融资产不低于300万元或者最近三年个人年均收入不低于50 万元，
      机构投资者的净资产不低于1000万元，或为监管机构认可的其他合格投资者。
      </p>
    </div>
  );

  // 资管新规类
  const managementRegulations = (
    <div className={styles.content}>
      <p className={styles.item}>
      资管新规类是指具备相应风险识别能力和风险承担能力，投资于单只资产管理产品不低于一定金额且符合下列条件的自然人和法人或者其他组织。
      </p>
      <p className={styles.item}>（一）具有2年以上投资经历，且满足以下条件之一：家庭金融净资产不低于300万元，家庭金融资产不低于500万元，或者近3年本人年均收入不低于40万元。</p>
      <p className={styles.item}>（二）最近1年末净资产不低于1000万元的法人单位。</p>
      <p className={styles.item}>（三）金融管理部门视为合格投资者的其他情形。</p>
    </div>
  );

  const content = {
    1: smallSet,
    2: privateEquity,
    3: trust,
    5: revenueVoucher,
    6: managementRegulations
  };

  return (
    <Modal
      className={styles.qualifiedCustModal}
      title={props.title}
      visible={props.visible}
      destroyOnClose
      width="1100px"
      footer=" "
      onCancel={props.onQualifiedCustModalHide}
    >
      { content[props.type] }
    </Modal>
  );
}

QualifiedCustModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  type: PropTypes.string,
  title: PropTypes.string,
  onQualifiedCustModalHide: PropTypes.func.isRequired,
};

QualifiedCustModal.defaultProps = {
  type: '',
  title: '',
};
