/**
 * @Author: sunweibin
 * @Date: 2018-08-13 09:41:43
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-09-06 15:05:50
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import HtFilter, { MoreFilter } from '../htFilter';
import Button from '../Button';
import styles from '../../style/jiraLayout.less';
import contractHelper from '../../../helper/page/contract';
import { permission } from '../../../helper';
import { seibelConfig } from '../../../config';
import config from '../../telephoneNumberManage/config';
import logable from '../../../decorators/logable';

const {
  contract: { pageType: contractPageType },
  channelsTypeProtocol: { pageType: channelsPageType },
} = seibelConfig;
const { telephoneNumApply: { pageType: phoneApplyPageType } } = config;

// 头部筛选filterBox的高度
const dateFormat = 'YYYY/MM/DD';
// 当前时间
const DEFAULT_VALUE = '';

export default class Pageheader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 页面
    page: PropTypes.string,
    // 子类型
    subtypeOptions: PropTypes.array,
    // 状态
    stateOptions: PropTypes.array.isRequired,
    // 新建
    creatSeibelModal: PropTypes.func.isRequired,
    // 操作类型
    operateOptions: PropTypes.array,
    // 页面类型
    pageType: PropTypes.string,
    // 部门列表
    custRange: PropTypes.array.isRequired,
    // 获取部门列表
    getCustRange: PropTypes.func.isRequired,
    // 拟稿人列表
    drafterList: PropTypes.array.isRequired,
    // 获取拟稿人列表
    getDrafterList: PropTypes.func.isRequired,
    // 已申请服务经理
    ptyMngList: PropTypes.array.isRequired,
    // 获取已申请的服务经理
    getPtyMngList: PropTypes.func.isRequired,
    // 审批人列表
    approvePersonList: PropTypes.array.isRequired,
    // 获取审批人列表
    getApprovePersonList: PropTypes.func.isRequired,
    // 客户列表
    customerList: PropTypes.array.isRequired,
    // 获取客户列表
    getCustomerList: PropTypes.func.isRequired,
    // 新的客户列表
    newCustomerList: PropTypes.array.isRequired,
    // 获取新的客户列表
    getNewCustomerList: PropTypes.func.isRequired,
    // 筛选后调用的Function
    filterCallback: PropTypes.func,
    // 提供由用户来判断是否需要显示新建按钮
    isShowCreateBtn: PropTypes.func,
    // 新建申请按钮的文字
    applyBtnText: PropTypes.string,
    // 是否调用新的客户列表接口，若为true，则使用新的获取客户列表接口，为false，则使用原来的获取客户列表接口，默认为false
    isUseNewCustList: PropTypes.bool,
    // 是否在初始化的时候调用查询部门组织机构的接口
    isCallCustRangeApi: PropTypes.bool,
    // 初始状态需要展示的过滤条件
    basicFilters: PropTypes.array.isRequired,
    // 更多中的过滤条件
    moreFilters: PropTypes.array,
    // 更多中的匹配数据
    moreFilterData: PropTypes.array,
  }

  static contextTypes = {
    empInfo: PropTypes.object,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {
    page: '',
    operateOptions: [],
    empInfo: {},
    subtypeOptions: [],
    filterCallback: _.noop,
    isShowCreateBtn: () => true,
    isUseNewCustList: false,
    moreFilters: [],
    moreFilterData: [],
    isCallCustRangeApi: true,
    applyBtnText: '新建',
    pageType: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      // 需要显示的出来的更多里的过滤条件
      moreFilterList: [],
    };
  }

  componentDidMount() {
    const { isCallCustRangeApi } = this.props;
    // 因为有些申请页面的筛选不需要查询部门组织机构，所以增加此处判断
    if (isCallCustRangeApi) {
      this.props.getCustRange({
        type: this.props.pageType,
      });
    }
  }

  @autobind
  getCalendarContainer() {
    return this.pageCommonHeader;
  }

  @autobind
  filterBoxRef(input) {
    this.filterBox = input;
  }

  @autobind
  filterMoreRef(input) {
    this.filterMore = input;
  }

  // 选中客户下拉对象中对应的某个对象
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户',
      value: '$args[0].value.custName',
    },
  })
  selectCustItem(item) {
    const { value: { custNumber, custName } } = item;
    const { filterCallback } = this.props;
    filterCallback({
      custNumber,
      custName,
    });
  }

  // 选中拟稿人/审批人下拉对象中对应的某个对象
  @autobind
  selectItem(name, item) {
    const { filterCallback } = this.props;
    const { ptyMngId, ptyMngName } = item;
    let params = {};
    switch (name) {
      case 'ptyMngId':
        params = {
          ptyMngId,
          ptyMngName,
        };
        break;
      case 'drafterId':
        params = {
          drafterId: ptyMngId,
          drafterName: ptyMngName,
        };
        break;
      case 'approvalId':
        params = {
          approvalId: ptyMngId,
          approvalName: ptyMngName,
        };
        break;
      default:
        break;
    }
    filterCallback(params);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '服务经理',
      value: '$args[1].value.ptyMngName',
    },
  })
  handleManagerSelect(name, item) {
    const { value } = item;
    this.selectItem(name, value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '拟稿人',
      value: '$args[1].value.ptyMngName',
    },
  })
  handleDrafterSelect(name, item) {
    const { value } = item;
    this.selectItem(name, value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '审批人',
      value: '$args[1].value.ptyMngName',
    },
  })
  handleApproverSelect(name, item) {
    const { value } = item;
    this.selectItem(name, value);
  }

  // 选中部门下拉对象中对应的某个对象
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '部门',
      value: '$args[0]',
    },
  })
  selectCustRange(value) {
    const { filterCallback } = this.props;
    filterCallback({
      orgId: value,
    });
  }

  // select改变
  @autobind
  handleSelectChange(key, v) {
    this.setState({
      [key]: v,
    });
    const { filterCallback } = this.props;
    filterCallback({
      [key]: v,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '操作类型',
      value: '$args[0].value.value',
    },
  })
  handleOperateTypeChange(option) {
    const { id, value: { value } } = option;
    this.handleSelectChange(id, value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '子类型',
      value: '$args[0].value.value',
    },
  })
  handleSubtypeChange(option) {
    const { id, value: { value } } = option;
    this.handleSelectChange(id, value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '状态',
      value: '$args[0].value.value',
    },
  })
  handleStatusChange(option) {
    const { id, value: { value } } = option;
    this.handleSelectChange(id, value);
  }

  @autobind
  handleCreate() {
    this.props.creatSeibelModal();
  }

  // 查询客户、拟稿人、审批人公共调接口方法
  @autobind
  toSearch(method, value) {
    method({
      keyword: value,
      type: this.props.pageType,
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '查询客户',
      value: '$args[0]',
    },
  })
  handleCustSearch(value) {
    const {
      pageType,
      isUseNewCustList,
      getCustomerList,
      getNewCustomerList,
    } = this.props;
    const params = {
      keyword: value,
      type: pageType,
    };
    if (isUseNewCustList) {
      getNewCustomerList(params);
    } else {
      getCustomerList(params);
    }
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '查询服务经理',
      value: '$args[0]',
    },
  })
  handleManagerSearch(value) {
    this.props.getPtyMngList({
      keyword: value,
      type: this.props.pageType,
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '查询拟稿人',
      value: '$args[0]',
    },
  })
  handleDrafterSearch(value) {
    this.props.getDrafterList({
      keyword: value,
      type: this.props.pageType,
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '查询审批人',
      value: '$args[0]',
    },
  })
  handleApproverSearch(value) {
    this.props.getApprovePersonList({
      keyword: value,
      type: this.props.pageType,
    });
  }


  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '申请时间',
      min: (instance, args) => moment(args[0].value[0]).format(dateFormat),
      max: (instance, args) => moment(args[0].value[1]).format(dateFormat),
    },
  })
  handleCreateDateChange(date) {
    const { value } = date;
    const startDate = value[0];
    const endDate = value[1];
    if (startDate && endDate) {
      this.props.filterCallback({
        createTime: value[0],
        createTimeTo: value[1],
      });
    }
  }

  // 获取客户列表
  @autobind
  getCustList() {
    const {
      customerList,
      newCustomerList,
      isUseNewCustList,
    } = this.props;
    return isUseNewCustList ? newCustomerList : customerList;
  }

  // 只能选择今天之前的时间
  @autobind
  setDisableRange(date) {
    const dateFormatStr = date.format('YYYY-MM-DD');
    return moment(dateFormatStr) > moment();
  }

  // 获取部门
  @autobind
  transformCustRangeData(list) {
    return list.map((item) => {
      const obj = {
        label: item.name,
        value: item.id,
        key: item.id,
      };
      if (item.children && item.children.length) {
        obj.children = this.transformCustRangeData(item.children);
      }
      return obj;
    });
  }

  @autobind
  getFilterData(filter) {
    const { filterId } = filter.props;
    const {
      subtypeOptions,
      stateOptions,
      drafterList,
      approvePersonList,
      custRange,
      operateOptions,
      ptyMngList,
    } = this.props;
    const custList = this.getCustList();
    // 部门增加不限
    let treeCustRange = [];
    if (custRange.length) {
      treeCustRange = this.transformCustRangeData(custRange);
    }
    treeCustRange = [
      {
        label: '不限',
        value: '',
        key: 0,
      },
      ...treeCustRange,
    ];
    switch (filterId) {
      case 'customer':
        return _.isEmpty(custList) ? [] : custList;
      case 'serviceManager':
        return ptyMngList;
      case 'business2':
        return operateOptions;
      case 'subType':
        return subtypeOptions;
      case 'status':
        return stateOptions;
      case 'drafter':
        return drafterList;
      case 'department':
        return treeCustRange;
      case 'approver':
        return approvePersonList;
      default:
        return [];
    }
  }

  @autobind
  getFilterValue(filter) {
    const { filterId } = filter.props;
    const {
      location: {
        query: {
          custNumber,
          custName,
          drafterId,
          drafterName,
          approvalId,
          approvalName,
          ptyMngId,
          ptyMngName,
          orgId,
          subType,
          status,
          business2,
          createTime,
          createTimeTo,
        },
      },
    } = this.props;
    // 时间组件的回填
    const startTime = createTime ? moment(createTime, dateFormat) : null;
    const endTime = createTimeTo ? moment(createTimeTo, dateFormat) : null;
    const customer = custNumber ? [custNumber, custName] : ['', ''];
    const serviceManager = ptyMngId ? [ptyMngId, ptyMngName] : ['', ''];
    const drafter = drafterId ? [drafterId, drafterName] : ['', ''];
    const approval = approvalId ? [approvalId, approvalName] : ['', ''];
    switch (filterId) {
      case 'customer':
        return customer;
      case 'serviceManager':
        return serviceManager;
      case 'business2':
        return business2;
      case 'subType':
        return subType;
      case 'status':
        return status;
      case 'drafter':
        return drafter;
      case 'department':
        return orgId || DEFAULT_VALUE;
      case 'approver':
        return approval;
      case 'applyTime':
        return [startTime, endTime];
      default:
        return '';
    }
  }

  @autobind
  getFilterOnChange(filter) {
    const { filterId } = filter.props;
    switch (filterId) {
      case 'customer':
        return this.selectCustItem;
      case 'serviceManager':
        return item => this.handleManagerSelect('ptyMngId', item);
      case 'business2':
        return this.handleOperateTypeChange;
      case 'subType':
        return this.handleSubtypeChange;
      case 'status':
        return this.handleStatusChange;
      case 'drafter':
        return item => this.handleDrafterSelect('drafterId', item);
      case 'department':
        return this.selectCustRange;
      case 'approver':
        return item => this.handleApproverSelect('approvalId', item);
      case 'applyTime':
        return this.handleCreateDateChange;
      default:
        return () => {};
    }
  }

  // 更多里面选中的过滤条件
  @autobind
  selectMoreFilter() {
    const {
      location: {
        query,
      },
      moreFilters,
    } = this.props;
    return _.map(moreFilters, (itemFilter) => {
      const hasFilterItem = _.every(itemFilter.filterOption, item => _.hasIn(query, item));
      if (hasFilterItem) {
        return itemFilter.props.key;
      }
      return null;
    });
  }

  @autobind
  moreFilterChange(obj) {
    const {
      location: {
        pathname,
        query,
      },
      moreFilters,
    } = this.props;
    const { moreFilterList } = this.state;
    const { replace } = this.context;
    const { isDeleteFilterFromLocation, id } = obj;
    const currentFilterItem = _.filter(moreFilters, item => item.props.key === id)[0];
    const filterOption = currentFilterItem && currentFilterItem.filterOption;
    let finalQuery = query;
    if (isDeleteFilterFromLocation && currentFilterItem) {
      finalQuery = _.omit(query, filterOption);
    } else {
      // ['a','b'] => {a:'', b: ''}
      const filterMap = _.reduce(filterOption,
        (filterQuery, itemQuery) => ({ ...filterQuery, [itemQuery]: '' }), {});
      finalQuery = _.merge(query, filterMap);
      const list = moreFilterList;
      if (_.indexOf(list, id) > -1) {
        _.pull(list, id);
      } else {
        list.push(id);
      }
      this.setState({ moreFilterList: list });
    }
    replace({
      pathname,
      query: finalQuery,
    });
  }

  @autobind
  getFilterOnClose(filter) {
    const { key } = filter.props;
    const { moreFilterList } = this.state;
    this.moreFilterChange({ id: key, isDeleteFilterFromLocation: true });
    this.setState({ moreFilterList: _.pull(moreFilterList, key) });
  }

  // 根据类型，渲染更多的过滤组件
  @autobind
  getMoreFilterElement(filter) {
    const { filterId } = filter.props;
    return filterId ?
      <HtFilter
        className={styles.filterFl}
        data={this.getFilterData(filter)}
        value={this.getFilterValue(filter)}
        onChange={this.getFilterOnChange(filter)}
        onInputChange={this[filter.props.handleInputChange]}
        onClose={() => this.getFilterOnClose(filter)}
        isCloseable
        {...filter.props}
      /> : null;
  }

  @autobind
  getMoreFilters(key) {
    const { moreFilters } = this.props;
    const filterItem = _.find(moreFilters, item => (item.props.key === key));
    return filterItem ? this.getMoreFilterElement(filterItem) : null;
  }

  @autobind
  pageCommonHeaderRef(input) {
    this.pageCommonHeader = input;
  }

  render() {
    const {
      applyBtnText,
      pageType,
      basicFilters,
      moreFilterData,
    } = this.props;
    let { moreFilterList } = this.state;
    const { empInfo } = this.context;
    moreFilterList = this.selectMoreFilter();
    // 新建按钮权限
    let hasCreatePermission = true;
    // 如果是合作合约页面
    if (pageType === contractPageType) {
      hasCreatePermission = contractHelper.hasPermission(empInfo);
    } else if (pageType === channelsPageType) {
      // 如果是通道类协议页面
      hasCreatePermission = permission.hasPermissionOfProtocolCreate(empInfo);
    } else if (pageType === phoneApplyPageType) {
      hasCreatePermission = permission.hasPermissionOfPhoneApplyCreate(empInfo);
    } else {
      // 此处,通用的判断是否需要隐藏新建按钮
      hasCreatePermission = this.props.isShowCreateBtn();
    }
    return (
      <div className={styles.pageCommonHeader} ref={this.pageCommonHeaderRef}>
        <div className={styles.filterBox} ref={this.filterBoxRef}>
          <div className={styles.filter}>
            {
              _.map(basicFilters, filter => (
                  !_.isEmpty(filter.props) ?
                  (
                    <HtFilter
                      key={filter.props.filterId}
                      className={styles.filterFl}
                      data={this.getFilterData(filter)}
                      value={this.getFilterValue(filter)}
                      onChange={this.getFilterOnChange(filter)}
                      onInputChange={this[filter.props.handleInputChange]}
                      {...filter.props}
                    />
                  ) : null
                ),
              )
            }
            {
              _.map(
                moreFilterList,
                  key => this.getMoreFilters(key))
            }

          </div>
          <div className={styles.moreFilterBtn}>
            {
              moreFilterData.length ?
                <MoreFilter
                  value={this.selectMoreFilter()}
                  className={styles.filterFl}
                  data={moreFilterData}
                  onChange={this.moreFilterChange}
                />
                : null
              }
          </div>
        </div>
        {
          hasCreatePermission ?
            <Button
              type="primary"
              icon="plus"
              size="small"
              onClick={this.handleCreate}
            >
              {applyBtnText}
            </Button>
            :
            null
        }
      </div>
    );
  }
}
