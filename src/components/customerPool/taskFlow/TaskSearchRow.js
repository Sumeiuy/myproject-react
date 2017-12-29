/**
 * @file components/customerPool/list/QuickMenu.js
 *  客户列表项中的快捷菜单
 * @author wangjunjun
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import { Radio, Modal, Button, Icon } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { emp } from '../../../helper';
import Loading from '../../../layouts/Loading';
import GroupTable from '../groupManage/GroupTable';
import styles from './taskSearchRow.less';
import tableStyles from '../groupManage/groupTable.less';
import Clickable from '../../../components/common/Clickable';


const RadioGroup = Radio.Group;
const INITIAL_PAGE_NUM = 1;
const INITIAL_PAGE_SIZE = 10;

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
    isHasAuthorize: PropTypes.bool.isRequired,
  }
  static defaultProps = {
    condition: '',
    orgId: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      curPageNum: INITIAL_PAGE_NUM,
      pageSize: INITIAL_PAGE_SIZE,
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
      cust_type: item.cust_type === 'N' ? '高净值' : '零售',
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

  /**
   * 查询标签下客户
   * @param {*} labelId 标签Id
   * @param {*} curPageNum 当前页
   * @param {*} pageSize 当前页条目
   */
  queryPeopleOfLabel(labelId, curPageNum, pageSize) {
    const { isHasAuthorize, orgId, getLabelPeople } = this.props;
    let postBody = {
      labelId,
      curPageNum,
      pageSize,
    };
    if (isHasAuthorize) {
      postBody = {
        ...postBody,
        orgId,
      };
    } else {
      postBody = {
        ...postBody,
        ptyMngId: emp.getId(),
      };
    }

    getLabelPeople({
      ...postBody,
    });
  }

  @autobind
  handleSeeCust(value = {}) {
    this.queryPeopleOfLabel(value.labelMapping, INITIAL_PAGE_NUM, INITIAL_PAGE_SIZE);

    this.setState({
      title: value.labelName,
      totalCustNums: value.customNum,
      labelId: value.labelMapping,
      curPageNum: INITIAL_PAGE_NUM,
      pageSize: INITIAL_PAGE_SIZE,
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
    const { labelId } = this.state;
    this.queryPeopleOfLabel(labelId, INITIAL_PAGE_NUM, changedPageSize);

    this.setState({
      curPageNum: INITIAL_PAGE_NUM,
      pageSize: changedPageSize,
    });
  }

  @autobind
  handlePageChange(nextPage, currentPageSize) {
    const { labelId } = this.state;
    this.queryPeopleOfLabel(labelId, nextPage, currentPageSize);

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
          newDesc = _.isEmpty(newDesc) ? '--' : newDesc.replace(condition, `<span>${condition}</span>`);
          newTitle = _.isEmpty(newTitle) ? '--' : newTitle.replace(condition, `<span>${condition}</span>`);
        }
        return (
          <div className={styles.divRows} key={item.id || item.labelMapping}>
            <Radio
              value={item.id}
              key={item.tagNumId || item.labelMapping}
            >
              <span
                className={styles.title}
                dangerouslySetInnerHTML={{ __html: newTitle }} // eslint-disable-line
              />
              <Clickable
                onClick={() => this.handleSeeCust(item)}
                eventName="/click/taskSearchRow/checkCust"
              >
                <Button className={styles.seeCust}>查看客户</Button>
              </Clickable>
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
      curPageNum = INITIAL_PAGE_NUM,
      pageSize = INITIAL_PAGE_SIZE,
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
                  <Clickable
                    onClick={this.handleCancel}
                    eventName="/click/taskSearchRow/close"
                  >
                    <Button key="back" size="large">关闭</Button>
                  </Clickable>,
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
