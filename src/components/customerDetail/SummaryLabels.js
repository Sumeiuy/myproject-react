/*
 * @Author: sunweibin
 * @Date: 2018-10-16 09:15:12
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-13 19:34:21
 * @description 新版客户360详情重点标签区域
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import PlaceHolder from '../common/placeholderImage';
import IFWrap from '../common/biz/IfWrap';
import CustLabel from './CustLabel';
import MoreLabelModal from './MoreKeyLabelsModal';

import styles from './summaryLabels.less';
import logable, { logPV } from '../../decorators/logable';

export default class SummaryLabels extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 概要信息中显示的15个标签
    data: PropTypes.array,
    // 更多重点标签
    moreLabelInfo: PropTypes.object,
    // 查询更多重点标签
    queryAllKeyLabels: PropTypes.func.isRequired,
  }

  static defaultProps = {
    data: [],
    moreLabelInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      // 重点标签更多弹出层
      moreLabelsModal: false,
    };
  }

  // 打开更多重点标签弹出层
  @autobind
  @logPV({
    pathname: '/modal/cust360/custDetail/moreLablesModal',
    title: '重点标签-更多',
  })
  handleMoreLabelClick() {
    this.setState({ moreLabelsModal: true });
    // 打开更多标签的弹出层，查询更多的标签
    const { location: { query: { custId } } } = this.props;
    this.props.queryAllKeyLabels({ custId });
  }

  // 关闭更多重点标签弹出层
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '客户匹配标签-关闭'
    }
  })
  handleMoreLabelModalClose() {
    this.setState({ moreLabelsModal: false });
  }

  render() {
    const { data, moreLabelInfo } = this.props;
    const { moreLabelsModal } = this.state;
    return (
      <div className={styles.wrap}>
        <div className={styles.header}>
          <span className={styles.title}>重点匹配标签</span>
          <span className={styles.xq} onClick={this.handleMoreLabelClick}>更多</span>
        </div>
        <div className={styles.body}>
          {
            _.map(data, label => (<CustLabel key={label.id} labelData={label} />))
          }
          <PlaceHolder
            title="暂无重点标签数据"
            isRender={_.isEmpty(data)}
          />
        </div>
        <IFWrap isRender={moreLabelsModal}>
          <MoreLabelModal
            data={moreLabelInfo}
            onClose={this.handleMoreLabelModalClose}
          />
        </IFWrap>
      </div>
    );
  }
}
