/**
 * @file components/customerPool/list/QuickMenu.js
 *  客户列表项中的快捷菜单
 * @author wangjunjun
 */
import React, { PropTypes, PureComponent } from 'react';
// import { autobind } from 'core-decorators';
import { Radio, Modal, Button, Icon } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { helper } from '../../../utils';
import Loading from '../../../layouts/Loading';
import GroupTable from '../groupManage/GroupTable';
import styles from './taskSearchRow.less';
import tableStyles from '../groupManage/groupTable.less';


const RadioGroup = Radio.Group;

const renderColumnTitle = [{
  key: 'brok_id',
  value: '经纪客户号',
},
{
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
    orgId: PropTypes.string,
    isLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  static defaultProps = {
    condition: '',
    orgId: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      curPageNum: 1,
      pageSize: 10,
      totalRecordNum: 0,
      totalCustNums: 0,
      labelId: '',
      visible: false,
      isLoadingEnd: true,
      title: '',
      custTableData: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { peopleOfLabelData, visible } = nextProps;
    const { userObjectFormList = [] } = peopleOfLabelData || {};
    const list = _.map(userObjectFormList, item => ({
      ...item,
      cust_type: item.cust_type === 'Y' ? '高净值' : '零售',
    }));
    this.setState({
      totalRecordNum: _.isEmpty(peopleOfLabelData) ? 0 : peopleOfLabelData.totalCount,
      custTableData: list,
      visible,
    });
  }

  @autobind
  change(e) {
    const { onChange } = this.props;
    onChange(e.target.value);
  }

  @autobind
  handleSeeCust(value) {
    const { getLabelPeople, orgId } = this.props;
    console.log(value);
    getLabelPeople({
      labelId: value.labelMapping,
      curPageNum: 1,
      pageSize: 10,
      orgId,
      ptyMngId: helper.getEmpId(),
    });
    this.setState({
      title: value.labelName,
      totalCustNums: value.customNum,
      labelId: value.labelMapping,
      curPageNum: 1,
      pageSize: 10,
    });
  }

  @autobind
  handleCancel() {
    const { onCancel } = this.props;
    this.setState({ visible: false });
    onCancel();
  }

  // 表格信息
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    console.log('currentPageNum--', currentPageNum, 'changedPageSize--', changedPageSize);
    const { getLabelPeople, orgId } = this.props;
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
    const { getLabelPeople, orgId } = this.props;
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
  // Y为高净值、N为非高净值
  @autobind
  renderRadioSection() {
    const { condition, circlePeopleData } = this.props;
    return _.map(circlePeopleData,
      (item) => {
        let newDesc = item.labelDesc;
        let newTitle = item.labelName;
        if (!_.isEmpty(condition)) {
          newDesc = newDesc.replace(condition, `<span>${condition}</span>`);
          newTitle = newTitle.replace(condition, `<span>${condition}</span>`);
        }

        return (
          <div className={styles.divRows} key={item.id}>
            <Radio
              value={item.id}
              key={item.tagNumId}
            >
              <span
                className={styles.title}
                dangerouslySetInnerHTML={{ __html: newTitle }} // eslint-disable-line
              />
              <Button className={styles.seeCust} onClick={() => this.handleSeeCust(item)}>
                查看客户
              </Button>
            </Radio>
            <h4 className={styles.titExp}>瞄准镜标签，共有
                <span>{item.customNum}</span>客户。创建时间：{item.createDate || '--'}，创建人：{item.createrName || '--'}
            </h4>
            <h4
              dangerouslySetInnerHTML={{ __html: newDesc }} // eslint-disable-line
            />
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
      title,
      custTableData,
    } = this.state;

    const {
      currentSelectLabel,
      isLoadingEnd,
      condition,
    } = this.props;

    if (_.isEmpty(condition)) {
      return null;
    }

    return (
      <div className={styles.divContent}>
        <RadioGroup name="radiogroup" onChange={this.change} defaultValue={currentSelectLabel}>
          {
            this.renderRadioSection()
          }
        </RadioGroup>
        <div className={styles.seeCust}>
          {
            (isLoadingEnd && visible) ?
              <Modal
                visible
                title={`满足标签为 ${title} 的共有${totalCustNums || 0}位`}
                onOk={this.handleOk}
                maskClosable={false}
                onCancel={this.handleCancel}
                closable={false}
                footer={[
                  <Button key="back" size="large" onClick={this.handleCancel}>关闭</Button>,
                ]}
                width={700}
                wrapClassName={styles.labelCustModalContainer}
              >
                {
                  _.isEmpty(custTableData) ?
                    <div className={styles.emptyContent}>
                      <span>
                        <Icon className={styles.emptyIcon} type="frown-o" />
                        暂无数据
                      </span>
                    </div> :
                    <GroupTable
                      pageData={{
                        curPageNum,
                        curPageSize: pageSize,
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
                      listData={custTableData}
                      titleColumn={renderColumnTitle}
                      isFirstColumnLink={false}
                      columnWidth={100}
                    />
                }
              </Modal> : null
          }
        </div>
        {
          <Loading loading={!isLoadingEnd} />
        }
      </div>
    );
  }
}
