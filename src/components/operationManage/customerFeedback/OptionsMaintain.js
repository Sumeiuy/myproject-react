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
import { Collapse, Popconfirm, Pagination } from 'antd';

import Icon from '../../../components/common/Icon';
import Button from '../../../components/common/Button';
import EditInput from '../../../components/common/editInput';
import withRouter from '../../../decorators/withRouter';
import styles from './optionsMaintain.less';

const Panel = Collapse.Panel;
const deleteTitle = '确认删除这条数据吗？';
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
  onClick(idx = 1) {
    console.warn('点击了按钮');
    this.setState({
      activeKey: String(idx),
    });
  }

  @autobind
  editCallback(value, id) {
    // 调用接口
    console.warn('value', value);
    console.warn('id', id);
  }

  @autobind
  deleteConfirm(parentId = '', childId = '') {
    console.warn('parentId', parentId);
    console.warn('childId', childId);
  }

  @autobind
  onAdd(id) {
    console.warn('点击了新增按钮', id);
    const { data } = this.state;
    const newData = data.map((item) => {
      const newItem = { ...item };
      if (newItem.id === id) {
        newItem.childList.push({ id: '222-333', name: '', edit: true });
      }
      return newItem;
    });
    console.warn('newData', newData);
    this.setState({
      data: newData,
    });
  }

  @autobind
  parentAddHandle() {
    console.warn('点击了添加按钮');
    const { data } = this.state;
    console.warn('data', data);
    const newData = [...data, {
      childList: [],
      id: '',
      name: '',
      edit: true,
      length: 0,
    }];
    console.warn('newData', newData);
    this.setState({
      data: newData,
    });
  }

  render() {
    const { activeKey, data } = this.state;
    return (
      <div className={styles.optionsMaintain}>
        <div className={styles.parentAddBtn}>
          <Button type="primary" onClick={this.parentAddHandle}>
            <Icon type="jia" />反馈类型
          </Button>
        </div>
        <h2 className={styles.title}>请在此维护客户反馈字典，客户反馈由两级内容组成，即反馈大类和反馈子类。</h2>
        <Collapse accordion activeKey={activeKey}>
          {
            data.map((item, index) => {
              const header = (<div className={styles.header}>
                <EditInput
                  value={item.name}
                  id={item.id}
                  edit={item.edit}
                  editCallback={this.editCallback}
                />
                <div className={styles.lengthDiv} onClick={() => this.onClick(index + 1)}>
                  <i className="arrow" />
                  {item.length}项
                </div>
                <div>
                  <Popconfirm
                    placement="bottom"
                    title={deleteTitle}
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => this.deleteConfirm(item.id)}
                  >
                    <Icon type="shanchu" title="删除" />
                  </Popconfirm>
                </div>
              </div>);
              return (<Panel header={header} key={`${index + 1}`}>
                <ul>
                  {
                    item.childList.map((child) => {
                      const btnGroup = (
                        <Popconfirm
                          placement="bottom"
                          title={deleteTitle}
                          okText="确定"
                          cancelText="取消"
                          onConfirm={() => this.deleteConfirm(item.id, child.id)}
                        >
                          <Icon
                            type="shanchu"
                            title="删除"
                          />
                        </Popconfirm>
                        );
                      return (
                        <li key={child.id}>
                          <EditInput
                            value={child.name}
                            id={child.id}
                            btnGroup={btnGroup}
                            edit={child.edit}
                            editCallback={this.editCallback}
                          />
                        </li>
                      );
                    })
                  }
                  <li>
                    <Button onClick={() => this.onAdd(item.id)}>
                      <Icon type="jia" />
                      新增
                    </Button>
                  </li>
                </ul>
              </Panel>);
            })
          }
        </Collapse>
        <Pagination defaultCurrent={1} total={50} />
      </div>
    );
  }
}
