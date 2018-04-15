/**
 * @Descripter: 用户信息审批
 * @Author: K0170179
 * @Date: 2018/4/14
 */

import React, { PureComponent } from 'react';
import { Divider, List, Tag, Form, Input, Button } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import styles from './userInfoApproval.less';
import withRouter from '../../decorators/withRouter';

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
  queryApprovalInfo: 'userCenter/queryApprovalInfo',
  approvalEmpInfo: 'userCenter/approvalEmpInfo',
};

const mapStateToProps = state => ({
  approvalInfo: state.userCenter.approvalInfo,
});

const mapDispatchToProps = {
  queryApprovalInfo: fetchDataFunction(true, effects.queryApprovalInfo),
  approvalEmpInfo: fetchDataFunction(true, effects.approvalEmpInfo),
};

@connect(mapStateToProps, mapDispatchToProps)
@Form.create()
@withRouter
export default class PersonalInfoApproval extends PureComponent {
  static propTypes = {
    approvalInfo: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    queryApprovalInfo: PropTypes.func.isRequired,
    approvalEmpInfo: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { queryApprovalInfo } = this.props;
    queryApprovalInfo();
  }

  @autobind
  handleApproval(operate) {
    const {
      location: {
        query: {
          flowId,
        },
      },
      approvalEmpInfo,
    } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        approvalEmpInfo({
          ...values,
          operate,
          flowId,
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
        desc: '职业证书编号',
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
    const { approvalInfo } = this.props;
    const { flowInfos = [], flowButtons = [] } = approvalInfo;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    return (
      <div className={styles.infoApprovalWrap}>
        <div className={styles.header}>
          张三丰的审批
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
                        <div className={styles.infoLabel}>{item.desc}:</div>
                        {
                          labelDesc.length ?
                          labelDesc
                            .map(label => <Tag color="gold" key={label.id}>{label.name}</Tag>) :
                            (<div className={styles.infoDesc}>--</div>)
                        }
                      </div>
                    );
                  }
                  return (
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>{item.desc}:</div>
                      <div className={styles.infoDesc}>{approvalInfo[item.id] || '--'}</div>
                    </div>
                  );
                }}
              />
            </div>
          </div>
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
                  {getFieldDecorator('applyingDescription', {
                    rules: [{ required: true, message: '请填写审批意见' }],
                  })(
                    <TextArea placeholder="请填写审批意见" autosize={{ minRows: 4, maxRows: 6 }} />,
                  )}
                </FormItem>
              </Form>
            </div>
          </div>
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
                      <div>审批人： {item.approver || '--'}于{item.date || '--'}，步骤名称：{item.flowName || '--'}</div>
                      <div>
                        <div className={styles.approverResult}>{item.approverResult || '--'}：</div>
                        <div className={styles.approverDesc}>{item.approverDesc || '--'}</div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className={styles.btnGroup}>
            {
              flowButtons.map(item => (
                <Button
                  size="large"
                  type={item.operate === BTN_ADOPT_STATE ? 'primary' : ''}
                  onClick={() => { this.handleApproval(item.operate); }}
                >{item.btnName}</Button>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}
