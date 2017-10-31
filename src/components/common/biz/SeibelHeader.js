/**
 * @file Pageheader.js
 * 权限申请，合约管理，佣金调整头部筛选
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Select from '../Select';
import CustRange from '../../pageCommon/SeibelCustRange';
import DropDownSelect from '../dropdownSelect';
import Button from '../Button';
import Icon from '../Icon';
import styles from '../../style/jiraLayout.less';
import { hasPermission } from '../../../utils/helper';

//头部筛选filterBox的高度
const filterBoxClientHeight = 32
export default class Pageheader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 页面
    page: PropTypes.string,
    // 子类型
    subtypeOptions: PropTypes.array.isRequired,
    // 状态
    stateOptions: PropTypes.array.isRequired,
    // 新建
    creatSeibelModal: PropTypes.func.isRequired,
    // 操作类型
    needOperate: PropTypes.bool,
    operateOptions: PropTypes.array,
    // 新建权限
    empInfo: PropTypes.object,
    // 页面类型
    pageType: PropTypes.string.isRequired,
    // 部门列表
    custRange: PropTypes.array.isRequired,
    // 获取部门列表
    getCustRange: PropTypes.func.isRequired,
    // 拟稿人列表
    drafterList: PropTypes.array.isRequired,
    // 获取拟稿人列表
    getDrafterList: PropTypes.func.isRequired,
    // 审批人列表
    approvePersonList: PropTypes.array.isRequired,
    // 获取审批人列表
    getApprovePersonList: PropTypes.func.isRequired,
    // 客户列表
    customerList: PropTypes.array.isRequired,
    // 获取客户列表
    getCustomerList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    page: '',
    needOperate: false,
    operateOptions: [],
    empInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      showMore: true,
    };
  }

  componentWillMount() {
    this.props.getCustRange({});
  }

  componentDidUpdate() {
    this.pageCommonHeader = document.querySelector(`.${styles.pageCommonHeader}`);
    this.filterBox = document.querySelector(`.${styles.filterBox}`);
    this.filterMore = document.querySelector(`.${styles.filterMore}`);
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize, false);
  }

  @autobind
  onWindowResize() {
    const filterBoxHeight = this.filterBox.getBoundingClientRect().height;
    if (filterBoxHeight <= filterBoxClientHeight) {
      this.filterMore.classList.remove('filterMoreIcon');
      this.filterMore.classList.add('filterNoneIcon');
    } else {
      this.filterMore.classList.remove('filterNoneIcon');
      this.filterMore.classList.add('filterMoreIcon');
    }
  }

  @autobind
  handleMoreChange() {
    this.setState({
      showMore: !this.state.showMore,
    });
    if (this.state.showMore) {
      this.pageCommonHeader.classList.add('HeaderOverflow');
    } else {
      this.pageCommonHeader.classList.remove('HeaderOverflow');
    }
    this.onWindowResize();
  }

  // 选中客户下拉对象中对应的某个对象
  @autobind
  selectCustItem(item) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        custNumber: item.custNumber,
        isResetPageNum: 'Y',
      },
    });
  }

  // 选中拟稿人/审批人下拉对象中对应的某个对象
  @autobind
  selectItem(name, item) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [name]: item.ptyMngId,
        isResetPageNum: 'Y',
      },
    });
  }

  // 选中部门下拉对象中对应的某个对象
  @autobind
  selectCustRange(obj) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        orgId: obj.orgId,
        isResetPageNum: 'Y',
      },
    });
  }

  // select改变
  @autobind
  handleSelectChange(key, v) {
    this.setState({
      [key]: v,
    });
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [key]: v,
        isResetPageNum: 'Y',
      },
    });
  }

  // 查询客户、拟稿人、审批人公共调接口方法
  @autobind
  toSearch(method, value) {
    method({
      keyword: value,
      type: this.props.pageType,
    });
  }

  render() {
    const {
      getCustomerList,
      getApprovePersonList,
      getDrafterList,
      subtypeOptions,
      stateOptions,
      creatSeibelModal,
      drafterList,
      approvePersonList,
      customerList,
      custRange,
      replace,
      page,
      operateOptions,
      needOperate,
      location: { query: { subType, status, business2 } },
      empInfo,
    } = this.props;

    const ptyMngAll = { ptyMngName: '全部', ptyMngId: '' };

    const customerAllList = !_.isEmpty(customerList) ?
    [{ custName: '全部', custNumber: '' }, ...customerList] : customerList;

    const drafterAllList = !_.isEmpty(drafterList) ?
    [ptyMngAll, ...drafterList] : drafterList;

    const approvePersonAllList = !_.isEmpty(approvePersonList) ?
    [ptyMngAll, ...approvePersonList] : approvePersonList;
    // 新建按钮权限
    let hasCreatePermission = true;
    if (page === 'contractPage') {
      hasCreatePermission = hasPermission(empInfo);
    }
    const operateElement = needOperate ?
      (
        <div className={styles.filterFl}>
          <div className={styles.dropDownSelectBox}>
            <span>操作类型:</span>
            <Select
              name="business2"
              value={business2}
              data={operateOptions}
              onChange={this.handleSelectChange}
              style={{ width: '20%' }}
            />
          </div>
        </div>
      )
    :
      null;
    if (!custRange || !custRange.length) {
      return null;
    }
    return (
      <div className={styles.pageCommonHeader}>
        <div className={styles.filterBox}>
          <div className={styles.filterFl}>
            <div className={styles.dropDownSelectBox}>
              <DropDownSelect
                value="全部"
                placeholder="经纪客户号/客户名称"
                searchList={customerAllList}
                showObjKey="custName"
                objId="custNumber"
                emitSelectItem={this.selectCustItem}
                emitToSearch={value => this.toSearch(getCustomerList, value)}
                name={`${page}-custName`}
              />
            </div>
          </div>
          { /* 操作类型 */ }
          { operateElement }
          <div className={styles.filterFl}>
            子类型:
            <Select
              name="subType"
              value={subType}
              data={subtypeOptions}
              onChange={this.handleSelectChange}
            />
          </div>

          <div className={styles.filterFl}>
            状态:
            <Select
              name="status"
              value={status}
              data={stateOptions}
              onChange={this.handleSelectChange}
            />
          </div>

          <div className={styles.filterFl}>
            拟稿人:
            <div className={styles.dropDownSelectBox}>
              <DropDownSelect
                value="全部"
                placeholder="工号/名称"
                searchList={drafterAllList}
                showObjKey="ptyMngName"
                objId="ptyMngId"
                emitSelectItem={item => this.selectItem('drafterId', item)}
                emitToSearch={value => this.toSearch(getDrafterList, value)}
                name={`${page}-ptyMngName`}
              />
            </div>
          </div>

          <div className={styles.filterFl}>
            部门:
            <CustRange
              style={{ width: '20%' }}
              custRange={custRange}
              location={location}
              replace={replace}
              updateQueryState={this.selectCustRange}
            />
          </div>
          <div className={styles.filterFl}>
            审批人:
            <div className={styles.dropDownSelectBox}>
              <DropDownSelect
                value="全部"
                placeholder="工号/名称"
                searchList={approvePersonAllList}
                showObjKey="ptyMngName"
                objId="ptyMngId"
                emitSelectItem={item => this.selectItem('approvalId', item)}
                emitToSearch={value => this.toSearch(getApprovePersonList, value)}
                name={`${page}-ptyMngName`}
              />
            </div>
          </div>
          {
            this.state.showMore ?
              <div className={styles.filterMore} onClick={this.handleMoreChange}>更多<Icon type="xiangxia" /></div>
            :
              <div className={styles.filterMore} onClick={this.handleMoreChange}>收起<Icon type="xiangshang" /></div>
          }
        </div>
        {
          hasCreatePermission ?
            <Button
              type="primary"
              icon="plus"
              size="small"
              onClick={creatSeibelModal}
            >
              新建
            </Button>
          :
            null
        }
      </div>
    );
  }
}
