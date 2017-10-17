/**
 * @file components/advisory/AdvisoryDetail.js
 *  咨询订阅详情
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import CommonUpload from '../common/biz/CommonUpload';
import ApproveList from '../common/approveList';
import CommonTable from '../common/biz/CommonTable';
import styles from './advisoryDetail.less';

// 客户信息表表头
const custTitleList = [
  {
    dataIndex: 'custNum',
    key: 'custNum',
    title: '经纪客户号',
  },
  {
    dataIndex: 'custName',
    key: 'custName',
    title: '客户名称',
  },
  {
    dataIndex: 'custLevel',
    key: 'custLevel',
    title: '客户等级',
  },
  {
    dataIndex: 'openDivisinoName',
    key: 'openDivisinoName',
    title: '开户营业部',
  },
  {
    dataIndex: 'serManager',
    key: 'serManager',
    title: '服务经理',
  },
];

// 产品选择表表头
const proTitleList = [
  {
    dataIndex: 'prodCode',
    key: 'prodCode',
    title: '产品代码',
  },
  {
    dataIndex: 'aliasName',
    key: 'aliasName',
    title: '产品名称',
  },
  {
    dataIndex: 'riskMatch',
    key: 'riskMatch',
    title: '风险是否匹配',
  },
  {
    dataIndex: 'termMatch',
    key: 'termMatch',
    title: '期限是否匹配',
  },
  {
    dataIndex: 'prodMatch',
    key: 'prodMatch',
    title: '投资品种是否匹配',
  },
  {
    dataIndex: 'agrType',
    key: 'agrType',
    title: '签署确认书类型',
  },
];

export default class AdvisoryDetail extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  @autobind
  createCustList(data) {
    const {
      custNum,
      custName,
      custLevel,
      openDivisinoName,
      serviceManager,
      serviceManagerLogin,
    } = data;
    return [{
      custNum,
      custName,
      custLevel,
      openDivisinoName,
      serManager: `${serviceManager}(${serviceManagerLogin})`,
    }];
  }

  @autobind
  convertNY2ZN(v) {
    return v === 'N' ? '否' : '是';
  }

  @autobind
  changeProductJson(product) {
    const { riskMatch, termMatch, prodMatch, prodCode, aliasName, agrType } = product;
    return {
      prodCode,
      aliasName,
      agrType,
      riskMatch: this.convertNY2ZN(riskMatch),
      termMatch: this.convertNY2ZN(termMatch),
      prodMatch: this.convertNY2ZN(prodMatch),
    };
  }

  @autobind
  createProList(data) {
    const newProductLiet = data.map((product) => {
      const { subItem } = product;
      const newProduct = this.changeProductJson(product);
      let children = null;
      if (!_.isEmpty(subItem)) {
        // 存在子产品
        children = subItem.map(this.changeProductJson);
        return { ...newProduct, children };
      }
      return newProduct;
    });
    return newProductLiet;
  }


  render() {
    const { data: { base, attachmentList, approvalHistory } } = this.props;
    if (_.isEmpty(base)) return null;
    const {
      orderId,
      operationType,
      comments,
      divisionName,
      createdByName,
      createdByLogin,
      created,
      status,
      item,
    } = base;
    const custList = this.createCustList(base);
    const proList = this.createProList(item);
    const bugTitle = `编号${orderId}`;
    const drafter = `${divisionName} - ${createdByName} (${createdByLogin})`;

    return (
      <div className={styles.detailBox}>
        <div className={styles.inner}>
          <h1 className={styles.bugTitle}>{bugTitle}</h1>
          <div id="detailModule" className={styles.module}>
            <InfoTitle head="基本信息" />
            <div className={styles.modContent}>
              <ul className={styles.propertyList}>
                <li className={styles.item}>
                  <InfoItem label="子类型" value={operationType} />
                </li>
                <li className={styles.item}>
                  <InfoItem label="备注" value={comments} />
                </li>
              </ul>
            </div>
          </div>
          <div id="nginformation_module" className={styles.module}>
            <InfoTitle head="拟稿信息" />
            <div className={styles.modContent}>
              <ul className={styles.propertyList}>
                <li className={styles.item}>
                  <InfoItem label="拟稿人" value={drafter} />
                </li>
                <li className={styles.item}>
                  <InfoItem label="提请时间" value={created} />
                </li>
                <li className={styles.item}>
                  <InfoItem label="状态" value={status} />
                </li>
              </ul>
            </div>
          </div>
          <div id="customer_module" className={styles.module}>
            <InfoTitle head="客户信息" />
            <div className={styles.modContent}>
              <CommonTable
                data={custList}
                titleList={custTitleList}
              />
            </div>
          </div>
          <div id="productSelectionmodal" className={styles.module}>
            <InfoTitle head="产品选择" />
            <div className={styles.modContent}>
              <CommonTable
                data={proList}
                titleList={proTitleList}
                pagination={{
                  pageSize: 5,
                }}
              />
            </div>
          </div>
          <div id="enclosure" className={styles.module}>
            <InfoTitle head="附件" />
            <CommonUpload
              attachmentList={attachmentList}
            />
          </div>
          <div id="approvalRecord" className={styles.module}>
            <InfoTitle head="审批记录" />
            <ApproveList
              data={approvalHistory}
              nowStep={{
                stepName: '营业部负责人审核',
                handleName: '鲍佳佳',
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

