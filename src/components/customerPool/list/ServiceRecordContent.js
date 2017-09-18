import React, { PropTypes } from 'react';
import ServiceRecordItem from './ServiceRecordItem';

export default function ServiceRecordContent(props) {
  const { item, styles, type } = props;
  if (type === 'Mission') {
    return (
      <div className={styles.serviceContainer} id="serviceContainer" key={item.id}>
        <div className={styles.leftSection}>
          <ServiceRecordItem
            content={item.taskName}
            styles={styles}
            title={'任务名'}
          />
          <ServiceRecordItem
            content={item.taskDesc}
            styles={styles}
            title={'任务描述'}
          />
          <ServiceRecordItem
            content={item.taskType}
            styles={styles}
            title={'任务类型'}
          />
          <ServiceRecordItem
            content={item.handlerType}
            styles={styles}
            title={'执行方式'}
          />
          <ServiceRecordItem
            content={item.handlerTimeLimit}
            styles={styles}
            title={'处理期限'}
          />
        </div>
        <div className={styles.rightSection}>
          <ServiceRecordItem
            content={item.actor}
            styles={styles}
            title={'实施者'}
            type={'right'}
          />
          <ServiceRecordItem
            content={item.serveRecord}
            styles={styles}
            title={'服务记录'}
            type={'right'}
          />
          <ServiceRecordItem
            content={item.custFeedback}
            styles={styles}
            title={'客户反馈'}
            type={'right'}
          />
          <ServiceRecordItem
            content={item.feedbackTime}
            styles={styles}
            title={'反馈时间'}
            type={'right'}
          />
          <ServiceRecordItem
            content={item.workResult}
            styles={styles}
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
          content={item.handlerType}
          styles={styles}
          title={'类型'}
        />
        <ServiceRecordItem
          content={item.activityContent}
          styles={styles}
          title={'活动内容'}
        />
        <ServiceRecordItem
          content={item.actor}
          styles={styles}
          title={'实施者'}
        />
        <ServiceRecordItem
          content={item.serveRecord}
          styles={styles}
          title={'服务记录'}
        />
      </div>
      <div className={styles.rightSection}>
        <ServiceRecordItem
          content={item.custFeedback}
          styles={styles}
          title={'客户反馈'}
          type={'right'}
        />
        <ServiceRecordItem
          content={item.feedbackTime}
          styles={styles}
          title={'反馈时间'}
          type={'right'}
        />
        <ServiceRecordItem
          content={item.workResult}
          styles={styles}
          title={'反馈结果'}
          type={'right'}
        />
      </div>
    </div>
  );
}

ServiceRecordContent.propTypes = {
  item: PropTypes.object,
  styles: PropTypes.object,
  type: PropTypes.string,
};

ServiceRecordContent.defaultProps = {
  item: {},
  styles: {},
  type: 'Mission',
};
