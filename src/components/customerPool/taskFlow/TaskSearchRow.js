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
import GroupTable from '../groupManage/GroupTable';
import styles from './taskSearchRow.less';


const RadioGroup = Radio.Group;
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
      curPageSize: 10,
      totalRecordNum: 0,
      seeCustId: '',
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
    console.log(1);
    console.log(value);
    const { getLabelPeople } = this.props;
    const { curPageNum, pageSize } = this.state;
    getLabelPeople({
      labelId: value,
      curPageNum,
      pageSize,
    });
    this.setState({
      visible: true,
      seeCustId: value,
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
    // 替换当前页码和分页条目
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
      pageSize: currentPageSize,
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
            <a className={styles.seeCust} onClick={() => this.handleSeeCust(item.id)}>查看客户</a>
          </div>
        );
      });
  }

  render() {
    const {
      curPageNum,
      curPageSize,
      totalRecordNum,
      visible,
    } = this.state;
    const { peopleOfLabelData, currentSelectLabel } = this.props;

    return (
      <div className={styles.matchArea}>
        <RadioGroup name="radiogroup" onChange={this.change} defaultValue={currentSelectLabel}>
          {
            this.renderRadioSection()
          }
        </RadioGroup>
        <div className={styles.seeCust}>
          <Modal
            visible={visible}
            title={`满足标签为‘客户画像’的共有${peopleOfLabelData.totalCount}位`}
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
                curPageSize,
                totalRecordNum,
              }}
              tableClass={styles.labelCustTable}
              onSizeChange={this.handleShowSizeChange}
              onPageChange={this.handlePageChange}
              listData={peopleOfLabelData.eleContents}
              titleColumn={renderColumnTitle}
              isFirstColumnLink={false}
            />
          </Modal>
        </div>
      </div>

    );
  }
}
