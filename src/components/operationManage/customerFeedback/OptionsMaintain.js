/*
 * @Description: 客户反馈选项维护
 * @Author: LiuJianShu
 * @Date: 2017-12-25 13:59:04
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-12-26 14:11:13
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
// import _ from 'lodash';
import { Collapse } from 'antd';

import Icon from '../../../components/common/Icon';
import EditInput from '../../../components/common/editInput';
import withRouter from '../../../decorators/withRouter';
import styles from './optionsMaintain.less';

const Panel = Collapse.Panel;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 客户列表
  custList: state.filialeCustTransfer.custList,
});

const mapDispatchToProps = {
  // 获取客户列表
  getCustList: fetchDataFunction(false, 'filialeCustTransfer/getCustList'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class OptionsMaintain extends PureComponent {
  static propTypes = {
    // 获取客户列表
    getCustList: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: '2',
      edit: false,
      data: [
        {
          id: '111',
          name: '一级数据-111',
          length: 3,
          childList: [
            {
              id: '111-111',
              name: '二级数据-111',
            },
            {
              id: '111-222',
              name: '二级数据-222',
            },
          ],
        },
        {
          id: '222',
          name: '一级数据',
          length: 3,
          childList: [
            {
              id: '222-111',
              name: '二级数据-111',
            },
            {
              id: '222-222',
              name: '二级数据-222',
            },
          ],
        },
      ],
    };
  }

  @autobind
  onChange(key) {
    console.warn('key', key);
  }

  @autobind
  onClick(idx = 1) {
    console.warn('点击了按钮');
    this.setState({
      activeKey: String(idx),
    });
  }

  @autobind
  onDelete() {
    console.warn('点击了删除');
  }

  @autobind
  editCallback(value, id) {
    // 调用接口
    console.warn('value', value);
    console.warn('id', id);
    // // TODO - 改递归
    // const { data } = this.state;
    // // 修改后的 data
    // const newData = data.map((item) => {
    //   const newItem = item;
    //   if (newItem.id === id) {
    //     newItem.name = value;
    //   } else {
    //     newItem.childList.map((child) => {
    //       const newChild = child;
    //       if (newChild.id === id) {
    //         newChild.name = value;
    //       }
    //       return newChild;
    //     });
    //   }
    //   return newItem;
    // });
    // console.warn('newData', newData);
    // this.setState({
    //   data: newData,
    // });
  }

  render() {
    const { activeKey, data, edit } = this.state;
    return (
      <div className={styles.optionsMaintain}>
        <h2>请在此维护客户反馈字典，客户反馈由两级内容组成，即反馈大类和反馈子类。</h2>
        <Collapse accordion onChange={this.onChange} activeKey={activeKey}>
          {
            data.map((item, index) => {
              const header = (<div className={styles.header}>
                <EditInput
                  value={item.name}
                  id={item.id}
                  edit={edit}
                  editCallback={this.editCallback}
                />
                <div onClick={() => this.onClick(index + 1)}>{item.length}项</div>
                <div><Icon type="shanchu" title="删除" /></div>
              </div>);
              return (<Panel header={header} key={`${index + 1}`}>
                <ul>
                  {
                    item.childList.map(child => (<li key={child.id}>
                      <EditInput
                        value={child.name}
                        id={child.id}
                        edit={edit}
                        editCallback={this.editCallback}
                      />
                    </li>))
                  }
                </ul>
              </Panel>);
            })
          }
        </Collapse>
      </div>
    );
  }
}
