/**
 * @Description: 大类资产配置分析详情
 * @Author: Liujianshu
 * @Date: 2018-06-21 13:26:15
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-06-25 15:53:24
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Layout } from 'antd';

import CommonModal from '../../common/biz/CommonModal';
import { time as timeHelper } from '../../../helper';
import config from '../config';
import styles from './modal.less';

const { dateFormatStr } = config;
const { Header, Content } = Layout;

export default class MajorAssetsDetailModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    modalKey: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
  }

  render() {
    const {
      data: {
        title,
        time,
        categoryName,
        typeName,
        content,
        gradeName,
      },
      visible,
      modalKey,
      closeModal,
    } = this.props;
    // Д 为替换后端返回数据中的换行符而设置，无实际价值
    const newContent = _.isEmpty(content) ? '' : content;
    const newDetail = newContent.replace(/\r\n|\n\t|\t\n|\n/g, 'Д');
    const splitArray = newDetail.split('Д');
    return (
      <CommonModal
        title="大类资产配置分析"
        visible={visible}
        closeModal={() => closeModal(modalKey)}
        size="large"
        okText="关闭"
        showCancelBtn={false}
        modalKey={modalKey}
        wrapClassName={styles.detailModal}
        onOk={() => closeModal(modalKey)}
      >
        <Layout className={styles.detailWrapper}>
          <Header className={styles.header}>
            <h2>{title}</h2>
            <h3>
              <span>
资产大类：
                {categoryName}
              </span>
              <span>
报告类型：
                {typeName}
              </span>
              <span>
评级：
                {gradeName}
              </span>
              <span>
发布日期：
                {timeHelper.format(time, dateFormatStr)}
              </span>
            </h3>
          </Header>
          <Content className={styles.content}>
            {
              content
                ? splitArray.map((item, index) => {
                  const itemKey = `item${index}`;
                  return (
                    <div
                      key={itemKey}
                      className={styles.contentDiv}
                      dangerouslySetInnerHTML={{ __html: _.trim(item) }}
                    />
                  );
                })
                : <div>暂无</div>
            }
          </Content>
        </Layout>
      </CommonModal>
    );
  }
}
