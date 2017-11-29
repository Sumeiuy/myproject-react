import React, { PropTypes } from 'react';
import _ from 'lodash';
import ServiceRecordItem from './ServiceRecordItem';
import styles from './createCollapse.less';

export default function ServiceRecordContent(props) {
  const { item, executeTypes, filesList } = props;
  const { subtypeCd = '' } = item;
  const isShowChild = _.isEmpty(item.uuid); // 默认有文件名这个字段


  // 包含MOT服务记录则为MOT任务服务记录
  if (!_.isEmpty(subtypeCd)) {
    if (subtypeCd.indexOf('MOT服务记录') !== -1) {
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
            {!isShowChild ?
              <ServiceRecordItem
                content={item.custFeedback}
                title={'附件'}
                filesList={filesList}
                isShowChild={isShowChild}
              /> :
              null
            }
          </div>
          <div className={styles.rightSection}>
            <ServiceRecordItem
              content={item.taskDesc}
              title={'任务描述'}
              type={'right'}
            />
            <ServiceRecordItem
              content={`${item.taskType}`}
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
        {!isShowChild ?
          <ServiceRecordItem
            content={item.custFeedback}
            title={'附件'}
            isShowChild={isShowChild}
            filesList={filesList}
          /> :
          null
        }
      </div>
      {
        !_.isEmpty(subtypeCd) ?
          // 不是MOT任务，但是是从OCRM来的
          <div className={styles.rightSection}>
            <ServiceRecordItem
              content={item.taskType}
              title={'任务类型'}
              type={'right'}
            />
          </div> :
          // MOT系统来的，短信、呼叫中心
          null
      }
    </div>
  );
}

ServiceRecordContent.propTypes = {
  item: PropTypes.object,
  type: PropTypes.string,
  executeTypes: PropTypes.array,
  filesList: PropTypes.array,
};

ServiceRecordContent.defaultProps = {
  item: {},
  type: '',
  executeTypes: [],
  filesList: [],
};
