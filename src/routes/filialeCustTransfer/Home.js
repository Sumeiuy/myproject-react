/*eslint-disable */
/*
 * @Description: 分公司客户划转 home 页面
 * @Author: XuWenKang
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-11-30 14:34:44
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import { message } from 'antd';
import _ from 'lodash';

import { emp } from '../../helper';
import InfoForm from '../../components/common/infoForm';
import DropDownSelect from '../../components/common/dropdownSelect';
import CommonTable from '../../components/common/biz/CommonTable';
import { seibelConfig } from '../../config';
import Barable from '../../decorators/selfBar';

import styles from './home.less';


const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const { filialeCustTransfer: { titleList } } = seibelConfig;
// 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: 220,
  height: 32,
  border: '1px solid #d9d9d9',
};
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 查询左侧列表
  seibleList: state.app.seibleList,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getSeibleList: fetchDataFunction(true, 'app/getSeibleList'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class Contract extends PureComponent {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {

  }


  render() {
    return (
      <div className={styles.filialeCustTransferWrapper} >
        <div className={styles.filialeCustTransferBox} >
          <h3 className={styles.title}>分公司客户划转</h3>
          <div className={styles.selectBox}>
            <div className={styles.selectLeft}>
              <InfoForm label="选择客户" required>
                <DropDownSelect
                  placeholder="选择客户"
                  showObjKey="custName"
                  objId="brokerNumber"
                  value=''
                  searchList={EMPTY_LIST}
                  emitSelectItem={this.handleSelectClient}
                  emitToSearch={this.handleSearchClient}
                  boxStyle={dropDownSelectBoxStyle}
                  ref={ref => this.selectCustComponent = ref}
                />
              </InfoForm>
            </div>
            <div className={styles.selectRight}>
              <InfoForm label="选择新服务经理" required>
                <DropDownSelect
                  placeholder="选择新服务经理"
                  showObjKey="custName"
                  objId="brokerNumber"
                  value=''
                  searchList={EMPTY_LIST}
                  emitSelectItem={this.handleSelectClient}
                  emitToSearch={this.handleSearchClient}
                  boxStyle={dropDownSelectBoxStyle}
                  ref={ref => this.selectCustComponent = ref}
                />
              </InfoForm>
            </div>
          </div>
          <CommonTable
            data={EMPTY_LIST}
            titleList={titleList}
          />
        </div>
      </div>
    );
  }
}
/*eslint-disable */