import React, { PropTypes } from 'react';
import ServiceRecordItem from './ServiceRecordItem';
import styles from './createCollapse.less';

export default function ServiceRecordContent(props) {
  const { item, executeTypes } = props;
  const { taskType = '', type = '' } = item;
  // 包含MOT则为MOT任务服务记录
  if (taskType.indexOf('MOT') !== -1) {
    return (
      <div className={styles.serviceContainer} id="serviceContainer" key={item.id}>
        <div className={styles.leftSection}>
          <ServiceRecordItem
            content={item.actor}
            title={'实施者'}
          />
          <ServiceRecordItem
            content={item.custFeedback}
            title={'客户反馈'}
          />
          <ServiceRecordItem
            content={item.feedbackTime}
            title={'反馈时间'}
          />
          <ServiceRecordItem
            content={item.serveStatus}
            title={'服务状态'}
          />
        </div>
        <div className={styles.rightSection}>
          <ServiceRecordItem
            content={item.taskDesc}
            title={'任务描述'}
            type={'right'}
          />
          <ServiceRecordItem
            content={`${type || taskType}${`-${item.activityContent}`}`}
            title={'任务类型'}
            type={'right'}
          />
          <ServiceRecordItem
            content={item.handlerType}
            title={'执行类型'}
            executeTypes={executeTypes}
            type={'right'}
          />
          <ServiceRecordItem
            content={item.handlerTimeLimit}
            title={'处理期限'}
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
          content={item.actor}
          title={'实施者'}
        />
        <ServiceRecordItem
          content={item.custFeedback}
          title={'客户反馈'}
        />
        <ServiceRecordItem
          content={item.feedbackTime}
          title={'反馈时间'}
        />
        <ServiceRecordItem
          content={item.serveStatus}
          title={'服务状态'}
        />
      </div>
      {
        (taskType.indexOf('MOT') === -1 && taskType.indexOf('OCRM') !== -1) ?
          <div className={styles.rightSection}>
            <ServiceRecordItem
              content={`${type || taskType}${`-${item.activityContent}`}`}
              title={'任务类型'}
              type={'right'}
            />
          </div> : null
      }
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
