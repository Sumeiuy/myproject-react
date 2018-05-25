/**
 * @fileOverview components/customerPool/PerformerViewDetail.js
 * @author wangjunjun
 * @description 执行者视图右侧详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ServiceResult from './serviceResult/ServiceResult';

export default class PerformerViewDetail extends PureComponent {
  static propTypes = {
    isFold: PropTypes.bool,
    serviceProgress: PropTypes.object.isRequired,
    custFeedBack: PropTypes.array.isRequired,
    custDetail: PropTypes.object.isRequired,
    queryExecutorFeedBack: PropTypes.func.isRequired,
    queryExecutorFlowStatus: PropTypes.func.isRequired,
    queryExecutorDetail: PropTypes.func.isRequired,
    currentId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    isFold: false,
  }

  render() {
    const { isFold,
      serviceProgress,
      custFeedBack,
      currentId,
      queryExecutorFeedBack,
      queryExecutorDetail,
      custDetail,
      queryExecutorFlowStatus } = this.props;
    return (
      <div>
        <ServiceResult
          isFold={isFold}
          currentId={currentId}
          serviceProgress={serviceProgress}
          custFeedBack={custFeedBack}
          custDetail={custDetail}
          queryExecutorFeedBack={queryExecutorFeedBack}
          queryExecutorFlowStatus={queryExecutorFlowStatus}
          queryExecutorDetail={queryExecutorDetail}
        />
      </div>
    );
  }
}
