/**
 * @file components/customerPool/list/QuickMenu.js
 *  客户列表项中的快捷菜单
 * @author wangjunjun
 */
import React, { PropTypes, PureComponent } from 'react';
// import { autobind } from 'core-decorators';
import { Radio, Modal, Button } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { helper } from '../../../utils';
import GroupTable from '../groupManage/GroupTable';
import styles from './taskSearchRow.less';
import tableStyles from '../groupManage/groupTable.less';


const RadioGroup = Radio.Group;
const orgId = window.orgId;
// const EMPTY_LIST = [];

export default class TaskSearchRow extends PureComponent {

  static propTypes = {
    circlePeopleData: PropTypes.array.isRequired,
    condition: PropTypes.string,
    peopleOfLabelData: PropTypes.array.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }
  static defaultProps = {
    condition: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      curPageNum: 1,
      pageSize: 10,
      totalRecordNum: 0,
      custNum: '',
    };
  }
  componentWillMount() {
    console.log('orgId----', orgId);
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    const { circlePeopleData, condition } = nextProps;
    _.map(circlePeopleData, (item) => {
      const newDesc = item.labelDesc.replace(condition, `<span>${condition}</span>`);
      item.labelDesc = newDesc; // eslint-disable-line
    });
    // console.log(circlePeopleData)
  }
  @autobind
  change(e) {
    const { onChange } = this.props;
    onChange(e.target.value);
  }

  @autobind
  handleSeeCust(value) {
    const { getLabelPeople } = this.props;
    const { curPageNum, pageSize } = this.state;
    getLabelPeople({
      labelId: value.id,
      curPageNum,
      pageSize,
      orgId,
      ptyMngId: helper.getEmpId(),
    });
    this.setState({
      visible: true,
      custNum: value.customNum,
      totalRecordNum: value.customNum,
    });
    console.log('curPageNum--', curPageNum, 'pageSize---', pageSize);
  }

  @autobind
  handleCancel() {
    this.setState({ visible: false });
  }

  // 表格信息
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    console.log('currentPageNum--', currentPageNum, 'changedPageSize--', changedPageSize);
    const { getLabelPeople } = this.props;
    getLabelPeople({
      curPageNum: currentPageNum,
      pageSize: changedPageSize,
    });
  }

  @autobind
  handlePageChange(nextPage, currentPageSize) {
    console.log('nextPage---', nextPage, 'currentPageSize---', currentPageSize);
    const { getLabelPeople } = this.props;
    getLabelPeople({
      curPageNum: nextPage,
    });
  }

  renderColumnTitle() {
    return [{
      key: 'name',
      value: '客户名称',
    },
    {
      key: 'empName',
      value: '服务经理',
    },
    {
      key: 'orgName',
      value: '所在营业部',
    },
    {
      key: 'lever_code',
      value: '客户等级',
    },
    {
      key: 'cust_type',
      value: '客户类型',
    }];
  }

  render() {
    // console.log(this.props);
    const {
      curPageNum,
      pageSize,
      totalRecordNum,
      visible,
      custNum,
    } = this.state;
    const { circlePeopleData, peopleOfLabelData, condition } = this.props;
    const titleColumn = this.renderColumnTitle();
    return (
      <div className={styles.divContent}>
        <RadioGroup name="radiogroup" onChange={this.change}>
          {_.map(circlePeopleData,
            item => <div className={styles.divRows}>
              <Radio value={item.id} key={item.tagNumId}>
                <span className={styles.title}>{item.labelName}</span>
              </Radio>
              <h4 className={styles.titExp}>瞄准镜标签，共有
                <span>{item.customNum}</span>客户。创建时间{item.createDate}，创建人：{item.createrName}
              </h4>
              <h4
                dangerouslySetInnerHTML={{ __html: item.labelDesc }}
              />
              <a className={styles.seeCust} onClick={() => this.handleSeeCust(item)}>查看客户</a>
            </div>)}
        </RadioGroup>
        <div className={styles.seeCust}>
          <Modal
            visible={visible}
            title={`满足标签为 ${condition} 的共有${custNum}位`}
            onOk={this.handleOk}
            maskClosable={false}
            onCancel={this.handleCancel}
            closable={false}
            footer={[
              <Button key="back" size="large" onClick={this.handleCancel}>关闭</Button>,
            ]}
            width={700}
          >
            此处应该有表格
            <GroupTable
              pageData={{
                curPageNum,
                pageSize,
                totalRecordNum,
              }}
              tableClass={
                classnames({
                  [styles.center]: true,
                  [tableStyles.groupTable]: true,
                })
              }
              onSizeChange={this.handleShowSizeChange}
              onPageChange={this.handlePageChange}
              listData={peopleOfLabelData}
              titleColumn={titleColumn}
              isFirstColumnLink={false}
            />
          </Modal>
        </div>
      </div>

    );
  }
}
