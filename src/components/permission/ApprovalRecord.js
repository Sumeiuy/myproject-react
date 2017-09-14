import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import InfoTitle from '../common/InfoTitle';
import style from './approvalrecord.less';

export default function ApprovalRecord(props) {
  const mapElementList = props.info.map((item, index) => {
    const idx = `approvalrecord-${index}`;
    const mapElementClass = classnames([style.approvalRecordList, {
      [style.approvalRecordListEven]: index % 2 === 0,
      [style.approvalRecordListOdd]: index % 2 !== 0,
    }]);
    const main = item.isOk ? '同意' : '驳回';
    return (
      <div
        className={mapElementClass}
        key={idx}
      >
        <p className={style.arlistContentOne}>
          审批人： {item.beginTime}，步骤名称：{item.stepName}
        </p>
        <p className={style.arlistContentTwo}>
          {main}：{item.suggestion}
        </p>
      </div>
    );
  });
  const stepElement = () => {
    const stepElementClass = classnames([style.approvalRecordStep,
      { hide: props.statusType !== 'ready' },
    ]);
    return (
      <div
        className={stepElementClass}
      >
        <span>当前步骤：</span>
        <span style={{ color: '#333' }}>分公司负责人审批</span>
        <span style={{ marginLeft: 20 }}>当前审批人：</span>
        <span style={{ color: '#333' }}>沈旭祥(123456789)</span>
      </div>
    );
  };
  return (
    <div className={style.approvalRecord}>
      <InfoTitle head={props.head} />
      {stepElement()}
      {mapElementList}
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
