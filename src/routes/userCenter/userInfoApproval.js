/**
 * @Descripter: 用户信息审批
 * @Author: K0170179
 * @Date: 2018/4/14
 */

import React, { PureComponent } from 'react';
import {
  Divider, List, Tag, Form, Input, Button
} from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import styles from './userInfoApproval.less';
import withRouter from '../../decorators/withRouter';
import logable from '../../decorators/logable';
import { closeRctTab } from '../../utils';

// 标签项的标识
const LABELS = 'labels';
// 通过的按钮id
const BTN_ADOPT_STATE = 'trueOver';
const { TextArea } = Input;
const FormItem = Form.Item;

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const effects = {
  queryApprovingEmpInfo: 'userCenter/queryApprovingEmpInfo',
  approveEmpInfo: 'userCenter/approveEmpInfo',
};

const mapStateToProps = state => ({
  approvalInfo: state.userCenter.approvalInfo,
});

const mapDispatchToProps = {
  queryApprovingEmpInfo: fetchDataFunction(true, effects.queryApprovingEmpInfo),
  approveEmpInfo: fetchDataFunction(true, effects.approveEmpInfo),
};

@connect(mapStateToProps, mapDispatchToProps)
@Form.create()
@withRouter
export default class PersonalInfoApproval extends PureComponent {
  static propTypes = {
    approvalInfo: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    queryApprovingEmpInfo: PropTypes.func.isRequired,
    approveEmpInfo: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      queryApprovingEmpInfo,
      location: {
        query: {
          flowId,
        },
      },
    } = this.props;
    queryApprovingEmpInfo({ flowId });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确认' } })
  handleApproval(operate) {
    const {
      location: {
        query: {
          flowId,
        },
      },
      approveEmpInfo,
      approvalInfo: {
        flowInfos = [],
      },
    } = this.props;
    const approver = flowInfos[0].approver;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        approveEmpInfo({
          ...values,
          btn: operate,
          flowId,
          approver,
        }).then(() => {
          closeRctTab({
            id: 'USER_CENTER_BACKLOG_FLOW',
          });
        });
      }
    });
  }

  getInfoMapping() {
    return ([
      {
        id: 'name',
        desc: '姓名',
      },
      {
        id: 'age',
        desc: '年龄',
      },
      {
        id: 'phoneNum',
        desc: '联系电话',
      },
      {
        id: 'occupationCertificateNo',
        desc: '执业证书编号',
      },
      {
        id: 'applyingDescription',
        desc: '个人介绍',
      },
      {
        id: 'labels',
        desc: '个人标签',
      },
    ]);
  }

  render() {
    const {
      approvalInfo,
      location: {
        query: {
          remind,
        },
      },
    } = this.props;
    const { flowInfos = [], flowButtons = [] } = approvalInfo;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    return (
      <div className={styles.infoApprovalWrap}>
        <div className={styles.header}>
          {approvalInfo.name || '--'}
的审批
        </div>
        <Divider className={styles.titleDivider} />
        <div className={styles.body}>
          <div className={styles.item}>
            <div className={styles.title}>
              <Divider type="vertical" className={styles.itemDivider} />
              基本信息
            </div>
            <div className={styles.info}>
              <List
                size="small"
                dataSource={this.getInfoMapping()}
                renderItem={(item) => {
                  if (item.id === LABELS) {
                    const labelDesc = approvalInfo[item.id] || [];
                    return (
                      <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>
                          {item.desc}
:
                        </div>
                        {
                          labelDesc.length
                            ? labelDesc
                              .map(label => <Tag color="gold" key={label.id}>{label.name}</Tag>)
                            : (<div className={styles.infoDesc}>暂未设置标签</div>)
                        }
                      </div>
                    );
                  }
                  return (
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>
                        {item.desc}
:
                      </div>
                      <div className={styles.infoDesc}>{approvalInfo[item.id] || '--'}</div>
                    </div>
                  );
                }}
              />
            </div>
          </div>
          {
            // 判断入口，如果是从消息提醒入口进入的则不显示
            remind ? null
              : (
                <span>
                  <Divider className={styles.titleDivider} />
                  <div className={styles.item}>
                    <div className={styles.title}>
                      <Divider type="vertical" className={styles.itemDivider} />
                      审批信息
                    </div>
                    <div className={styles.approvalDesc}>
                      <Form>
                        <FormItem
                          {...formItemLayout}
                          label="审批意见"
                        >
                          {getFieldDecorator('approveDesc', {
                            rules: [{ required: true, message: '请填写审批意见' }],
                          })(
                            <TextArea placeholder="请填写审批意见" autosize={{ minRows: 4, maxRows: 6 }} />,
                          )}
                        </FormItem>
                      </Form>
                    </div>
                  </div>
                </span>
              )
          }
          <Divider className={styles.titleDivider} />
          <div className={styles.item}>
            <div className={styles.title}>
              <Divider type="vertical" className={styles.itemDivider} />
              审批记录
            </div>
            <div className={styles.approvalRecord}>
              {
                flowInfos.map((item, index) => {
                  const uniqueId = item.date + index;
                  return (
                    <div key={uniqueId} className={styles.recordItem}>
                      <div>
审批人：
                        {item.approver || '--'}
于
                        {item.date || '--'}
，步骤名称：
                        {item.flowName || '--'}
                      </div>
                      <div>
                        <div className={styles.approverDesc}>{item.approverDesc || '--'}</div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
          {
            // 判断入口，如果是从消息提醒入口进入的则不显示
            remind ? null
              : (
                <div className={styles.btnGroup}>
                  {
                    flowButtons.map(item => (
                      <Button
                        key={item.flowBtnId}
                        size="large"
                        type={item.operate === BTN_ADOPT_STATE ? 'primary' : ''}
                        onClick={() => { this.handleApproval(item.operate); }}
                      >
                        {item.btnName}
                      </Button>
                    ))
                  }
                </div>
              )
          }
        </div>
      </div>
    );
  }
}
