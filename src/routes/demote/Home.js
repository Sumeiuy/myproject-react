/*
 * @Description: 降级客户处理页面
 * @Author: LiuJianShu
 * @Date: 2017-12-06 14:45:44
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-03 09:13:22
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';

import Button from '../../components/common/Button';
import CommonTable from '../../components/common/biz/CommonTable';
import Barable from '../../decorators/selfBar';
import { time, env, dom } from '../../helper';
import withRouter from '../../decorators/withRouter';
import config from './config';
import styles from './home.less';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});
const mapStateToProps = state => ({
  custList: state.demote.custList,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
// 获取左侧列表
  getCustList: fetchDataFunction(true, 'demote/getCustList'),
  // 获取客户列表
  updateCust: fetchDataFunction(true, 'demote/updateCust'),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class Demote extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    getCustList: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
    updateCust: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    // 从 sessionStorage 中找此字段判断是否成功提交过，供前端判断是否显示数据用
    const clicked = sessionStorage.getItem('demoteClicked') || false;
    this.state = {
      currentPage: 1,
      pageSize: 10,
      data: [],
      clicked,
    };
  }

  componentDidMount() {
    const { getCustList } = this.props;
    getCustList({});
    // 监听window.onResize事件
    this.registerWindowResize();
    this.setContentHeight();
  }

  componentWillReceiveProps(nextProps) {
    const { custList: preCL } = this.props;
    const { custList: nextCL } = nextProps;
    if (preCL !== nextCL) {
      this.setState({
        data: nextCL,
      });
    }
  }

  componentWillUnmount() {
    this.cancelWindowResize();
  }

  // Resize事件
  @autobind
  onResizeChange() {
    this.setContentHeight();
  }

  @autobind
  onChange(page, pageSize) {
    this.setState({
      currentPage: page,
      pageSize,
    });
  }

  @autobind
  onSubmit() {
    const { location: { query: { notifiId } }, updateCust } = this.props;
    const { data } = this.state;
    const checkedData = _.filter(data, o => !o.checked);
    const result = checkedData.map(item => item.econNum);
    const payload = {
      cust: result,
      notifiId,
      time: data[0].time,
    };
    updateCust(payload).then(() => {
      message.success('操作成功');
      // 设置 sessionStorage ，以此字段判断是否成功提交过，供前端判断是否显示数据用
      sessionStorage.setItem('demoteClicked', true);
      this.setState({
        clicked: true,
      });
    });
  }

  @autobind
  setContentHeight() {
    // 次变量用来判断是否在FSP系统中
    let viewHeight = document.documentElement.clientHeight;
    if (env.isIE()) {
      viewHeight -= 10;
    }
    // 因为页面在开发过程中并不存在于FSP系统中，而在生产环境下是需要将本页面嵌入到FSP系统中
    // 需要给改容器设置高度，以防止页面出现滚动
    // FSP头部Tab的高度
    const fspTabHeight = 55;

    // 设置系统容器高度
    let pch = viewHeight;
    if (env.isInFsp()) {
      pch = viewHeight - fspTabHeight;
    }
    const pageContainer = document.querySelector(config.container);
    const pageContent = document.querySelector(config.content);
    const childDiv = pageContent.querySelector('div');
    dom.setStyle(pageContainer, 'height', `${pch}px`);
    dom.setStyle(pageContent, 'height', '100%');
    dom.setStyle(childDiv, 'height', '100%');
  }

  // 注册window的resize事件
  @autobind
  registerWindowResize() {
    window.addEventListener('resize', this.onResizeChange, false);
  }

  // 注销window的resize事件
  @autobind
  cancelWindowResize() {
    window.removeEventListener('resize', this.onResizeChange, false);
    const pageContainer = document.querySelector(config.container);
    const pageContent = document.querySelector(config.content);
    const childDiv = pageContent.querySelector('div');
    dom.setStyle(pageContainer, 'height', 'auto');
    dom.setStyle(pageContent, 'height', 'auto');
    dom.setStyle(childDiv, 'height', 'auto');
  }

  // 切换表格的 switch 事件
  @autobind
  checkTableData(checked, record, index) {
    const { data, currentPage, pageSize } = this.state;
    const newData = [...data];
    const idx = ((currentPage - 1) * pageSize) + index;
    newData[idx] = {
      ...newData[idx],
      checked,
    };
    this.setState({
      data: newData,
    });
  }

  render() {
    const operation = {
      column: {
        key: 'switch',
        title: '是否划转',
      },
      operate: this.checkTableData,
    };
    const { data, clicked } = this.state;
    const noData = _.isEmpty(data);
    const date = noData ? '' : moment(time.format(data[0].endDate));
    if (noData || clicked) {
      return (
        <div className={styles.demoteWrapper}>
          <h2>您的划转操作正在进行中或者您暂时没有可以划转为零售的客户。</h2>
        </div>
      );
    }
    return (
      <div className={styles.demoteWrapper}>
        <h2 className={styles.title}>
          <span>提醒：</span>
          <span>{date.year()}年度，您名下有以下客户将降级划转为零售客户，请确认！<br />
            超过{date.format('YYYY年MM月DD日')}，未做确认，系统将自动划转！</span>
        </h2>
        <CommonTable
          data={data}
          titleList={config.titleList}
          operation={operation}
          pagination={{
            size: 'small',
            total: data.length,
            defaultPageSize: 10,
            current: this.state.currentPage,
            onChange: this.onChange,
            onShowSizeChange: this.onChange,
            showSizeChanger: true,
          }}
        />
        <div className={styles.btnDiv}>
          <Button
            type="primary"
            onClick={this.onSubmit}
          >
            提交
          </Button>
        </div>
      </div>
    );
  }
}
