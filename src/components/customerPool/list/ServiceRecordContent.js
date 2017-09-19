import React, { PropTypes } from 'react';
import ServiceRecordItem from './ServiceRecordItem';
import styles from './createCollapse.less';

export default function ServiceRecordContent(props) {
  const { item, type, executeTypes } = props;
  // 包含MOT则为MOT任务服务记录
  if (type.indexOf('MOT') !== -1) {
    return (
      <div className={styles.serviceContainer} id="serviceContainer" key={item.id}>
        <div className={styles.leftSection}>
          <ServiceRecordItem
            content={item.taskName}
            title={'任务名'}
          />
          <ServiceRecordItem
            content={item.taskDesc}
            title={'任务描述'}
          />
          <ServiceRecordItem
            content={item.taskType}
            title={'任务类型'}
          />
          <ServiceRecordItem
            content={item.handlerType}
            title={'执行方式'}
            executeTypes={executeTypes}
          />
          <ServiceRecordItem
            content={item.handlerTimeLimit}
            title={'处理期限'}
          />
        </div>
        <div className={styles.rightSection}>
          <ServiceRecordItem
            content={item.actor}
            title={'实施者'}
            type={'right'}
          />
          <ServiceRecordItem
            content={item.serveRecord}
            title={'服务记录'}
            type={'right'}
          />
          <ServiceRecordItem
            content={item.custFeedback}
            title={'客户反馈'}
            type={'right'}
          />
          <ServiceRecordItem
            content={item.feedbackTime}
            title={'反馈时间'}
            type={'right'}
          />
          <ServiceRecordItem
            content={item.workResult}
            title={'反馈结果'}
            type={'right'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.serviceContainer} id="serviceContainer">
      <div className={styles.leftSection}>
        <ServiceRecordItem
          content={item.taskType}
          title={'类型'}
        />
        <ServiceRecordItem
          content={item.activityContent}
          title={'活动内容'}
        />
        <ServiceRecordItem
          content={item.actor}
          title={'实施者'}
        />
        <ServiceRecordItem
          content={item.serveRecord}
          title={'服务记录'}
        />
      </div>
      <div className={styles.rightSection}>
        <ServiceRecordItem
          content={item.custFeedback}
          title={'客户反馈'}
          type={'right'}
        />
        <ServiceRecordItem
          content={item.feedbackTime}
          title={'反馈时间'}
          type={'right'}
        />
        <ServiceRecordItem
          content={item.workResult}
          title={'反馈结果'}
          type={'right'}
        />
      </div>
    </div>
  );
}

ServiceRecordContent.propTypes = {
  item: PropTypes.object,
  type: PropTypes.string,
  executeTypes: PropTypes.array,
};

ServiceRecordContent.defaultProps = {
  item: {},
  type: '',
  executeTypes: [],
};
