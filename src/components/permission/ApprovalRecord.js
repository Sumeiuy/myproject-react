import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import InfoTitle from '../common/InfoTitle';
import style from './approvalrecord.less';

export default function ApprovalRecord(props) {
  const info = props.info || [];
  const len = info.length;
  let historyList;
  let currentStepObj;
  if (len === 1) {
    historyList = [];
    [currentStepObj] = info;
  } else if (len > 1) {
    info.reverse();
    [currentStepObj, ...historyList] = info;
    historyList.reverse();
  } else {
    historyList = [];
    currentStepObj = [];
  }
  const mapElementList = () => {
    if (!historyList || _.isEmpty(historyList)) {
      return null;
    }
    return historyList.map((item, index) => {
      const mapElementClass = classnames([style.approvalRecordList, {
        [style.approvalRecordListEven]: index % 2 === 0,
        [style.approvalRecordListOdd]: index % 2 !== 0,
      }]);
      const main = item.isOk ? '同意' : '驳回';
      return (
        <div
          className={mapElementClass}
          key={item.handler}
        >
          <p className={style.arlistContentOne}>
            审批人： {item.handler}于{item.handleTime}，步骤名称：{item.stepName}
          </p>
          <p className={style.arlistContentTwo}>
            {main}：{item.comment}
          </p>
        </div>
      );
    });
  };
  const stepElement = () => {
    const stepElementClass = classnames([style.approvalRecordStep,
      { hide: props.statusType !== 'ready' },
    ]);
    return !currentStepObj || _.isEmpty(currentStepObj) ? (
      <p className={style.notFoundApprovalList}>没有找到相关审批记录</p>
      ) : (
        <div
          className={stepElementClass}
        >
          <span>当前步骤：</span>
          <span style={{ color: '#333' }}>{currentStepObj.stepName}</span>
          <span style={{ marginLeft: 20 }}>当前审批人：</span>
          <span style={{ color: '#333' }}>{currentStepObj.handleName}({currentStepObj.handler})</span>
        </div>
    );
  };
  return (
    <div className={style.approvalRecord}>
      <InfoTitle head={props.head} />
      {stepElement()}
      {mapElementList()}
    </div>
  );
}

ApprovalRecord.propTypes = {
  head: PropTypes.string.isRequired,
  info: PropTypes.array,
  statusType: PropTypes.string.isRequired,
};

ApprovalRecord.defaultProps = {
  info: [],
};
