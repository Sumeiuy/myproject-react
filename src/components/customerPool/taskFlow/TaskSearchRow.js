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
// const orgId = window.forReactPosition.orgId;
const orgId = 'ZZ001041051';
// const EMPTY_LIST = [];

const renderColumnTitle = [{
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
export default class TaskSearchRow extends PureComponent {

  static propTypes = {
    circlePeopleData: PropTypes.array.isRequired,
    condition: PropTypes.string,
    peopleOfLabelData: PropTypes.object.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    currentSelectLabel: PropTypes.string.isRequired,
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
      totalCustNums: 0,
      labelId: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    const { peopleOfLabelData } = nextProps;
    this.setState({
      totalRecordNum: peopleOfLabelData.totalCount,
    });
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
    console.log(value);
    getLabelPeople({
      labelId: value.id,
      curPageNum,
      pageSize,
      orgId,
      ptyMngId: helper.getEmpId(),
    });
    this.setState({
      visible: true,
      // totalRecordNum: value.customNum,
      totalCustNums: value.customNum,
      labelId: value.id,
    });
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
    const { labelId } = this.state;
    getLabelPeople({
      curPageNum: 1,
      pageSize: changedPageSize,
      orgId,
      ptyMngId: helper.getEmpId(),
      labelId,
    });
    this.setState({
      curPageNum: 1,
      pageSize: changedPageSize,
    });
  }

  @autobind
  handlePageChange(nextPage, currentPageSize) {
    console.log('nextPage---', nextPage, 'currentPageSize---', currentPageSize);
    const { getLabelPeople } = this.props;
    const { labelId, pageSize } = this.state;
    getLabelPeople({
      curPageNum: nextPage,
      pageSize,
      orgId,
      ptyMngId: helper.getEmpId(),
      labelId,
    });
    this.setState({
      curPageNum: nextPage,
    });
  }

  @autobind
  renderRadioSection() {
    const { condition, circlePeopleData } = this.props;
    return _.map(circlePeopleData,
      (item) => {
        let newDesc = item.labelDesc;
        if (!_.isEmpty(condition)) {
          newDesc = newDesc.replace(condition, `<span>${condition}</span>`);
        }

        return (
          <div className={styles.divRows} key={item.id}>
            <Radio
              value={item.id}
              key={item.tagNumId}
            >
              <span className={styles.title}>{item.labelName}</span>
            </Radio>
            <h4 className={styles.titExp}>瞄准镜标签，共有
                <span>{item.customNum}</span>客户。创建时间{item.createDate}，创建人：{item.createrName}
            </h4>
            <h4
              dangerouslySetInnerHTML={{ __html: newDesc }} // eslint-disable-line
            />
            <a className={styles.seeCust} onClick={() => this.handleSeeCust(item)}>查看客户</a>
          </div>
        );
      });
  }

  render() {
    const {
      curPageNum = 1,
      pageSize = 10,
      totalRecordNum = 0,
      visible,
      totalCustNums,
    } = this.state;

    const { peopleOfLabelData, currentSelectLabel, condition } = this.props;
    console.log(condition);
    return (
      <div className={styles.divContent}>
        <RadioGroup name="radiogroup" onChange={this.change} defaultValue={currentSelectLabel}>
          {
            this.renderRadioSection()
          }
        </RadioGroup>
        <div className={styles.seeCust}>
          <Modal
            visible={visible}
            title={`满足标签为 ${condition} 的共有${totalCustNums}位`}
            onOk={this.handleOk}
            maskClosable={false}
            onCancel={this.handleCancel}
            closable={false}
            footer={[
              <Button key="back" size="large" onClick={this.handleCancel}>关闭</Button>,
            ]}
            width={700}
          >
            <GroupTable
              pageData={{
                curPageNum,
                pageSize,
                totalRecordNum,
              }}
              tableClass={
                classnames({
                  [styles.labelCustTable]: true,
                  [tableStyles.groupTable]: true,
                })
              }
              isFixedTitle
              scrollY={400}
              onSizeChange={this.handleShowSizeChange}
              onPageChange={this.handlePageChange}
              listData={peopleOfLabelData.userObjectFormList}
              titleColumn={renderColumnTitle}
              isFirstColumnLink={false}
            />
          </Modal>
        </div>
      </div>

    );
  }
}
