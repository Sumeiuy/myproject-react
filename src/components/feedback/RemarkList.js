/**
 * @file components/feedback/RemarkList.js
 *  处理记录
 * @author yangquanjian
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import _ from 'lodash';

import { request } from '../../config';
import Icon from '../common/Icon';
import './remarkList.less';

const EMPTY_LIST = [];
export default class RemarkList extends PureComponent {
  static propTypes = {
    remarkList: PropTypes.array.isRequired,
    wrapperClass: PropTypes.string,
    category: PropTypes.string,
  }

  static defaultProps = {
    wrapperClass: '',
    category: 'admin',
  }

  constructor(props) {
    super(props);
    const { remarkList = EMPTY_LIST } = props;
    this.state = {
      dataSource: remarkList,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { remarkList: nextList = EMPTY_LIST } = nextProps;
    const { remarkList: prevList = EMPTY_LIST } = this.props;
    if (nextList !== prevList) {
      this.setState({
        dataSource: nextList,
      });
    }
  }

  @autobind
  constructTableColumns() {
    const columns = [{
      dataIndex: 'title.description',
      width: '100%',
      render: (text, record) => {
        const { category } = this.props;
        const { attachModelList = [] } = record;
        const hasAttachment = category !== 'admin' && !_.isEmpty(attachModelList);

        // 当前行记录
        return (
          <div className="item">
            <div className="wrap">
              <div className="info_dv">
                <span>{record.title}</span>
              </div>
              <pre className="txt">
                {record.description}
              </pre>
              {
                hasAttachment ? (
                  <div className={'attachContainer'}>
                    {this.renderAttachmentList(attachModelList)}
                  </div>
                ) : null
              }
            </div>
          </div>
        );
      },
    }];
    return columns;
  }

  renderAttachmentList(list) {
    return (
      _.map(
        list,
        item => (
          <div className="attachItem">
            <a href={`${request.prefix}/file/${item.attachUrl}`}>
              <Icon type={'kehu1'} />{`${item.attachName}`}
            </a>
          </div>
        ),
      )
    );
  }

  render() {
    const columns = this.constructTableColumns();
    const { wrapperClass } = this.props;
    return (
      <Table
        rowKey={'id'}
        className={`record_list ${wrapperClass}`}
        columns={columns}
        dataSource={this.state.dataSource}
        showHeader={false}
        pagination={false}
        bordered={false}
      />
    );
  }
}
