/**
 * @Descripter: 服务进度和已服务客户反馈
 * @Author: K0170179
 * @Date: 2018/5/23
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import './serviceResultLayout.less';
import MissionProgress from '../managerView/MissionProgress';
import CustFeedback from '../managerView/CustFeedback';

const COLLAPSE_WIDTH = 672;
const MARGIN_LEFT = 16;

export default class ServiceResult extends PureComponent {
  static propTypes = {
    missionImplementationProgress: PropTypes.object.isRequired,
    custFeedback: PropTypes.array.isRequired,
    onPreviewCustDetail: PropTypes.func,
  }

  static defaultProps = {
    onPreviewCustDetail: () => {},
  }

  static contextTypes = {
    dict: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      forceRender: true,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    // fsp侧边菜单折叠按钮click事件处理
    window.onFspSidebarbtn(this.onResize);
  }


  /**
   * 卸载事件监听
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    window.offFspSidebarbtn(this.onResize);
  }

  /**
   * 为了解决flex-box布局在发生折叠时，两个相邻box之间的原有间距需要取消
   * 不然会产生对齐bug
   * 监听resize事件，为了性能考虑，只当flex容器宽度在设定的间断点左右跳跃时，才触发重新render
   */
  @autobind
  onResize() {
    const contentWidth = this.contentWrapRef && this.contentWrapRef.clientWidth;
    if (this.memeoryWidth) {
      if (this.memeoryWidth < COLLAPSE_WIDTH < contentWidth
        || contentWidth < COLLAPSE_WIDTH < this.memeoryWidth) {
        this.setState({
          forceRender: !this.state.forceRender,
        });
      }
    } else {
      this.setState({
        forceRender: !this.state.forceRender,
      });
    }
    this.memeoryWidth = contentWidth;
  }

  render() {
    const { dict: { missionProgressStatus } } = this.context;
    const { missionImplementationProgress, custFeedback, onPreviewCustDetail } = this.props;
    /**
     * 下面三个变量是为了解决flex-box布局在发生折叠时，两个相邻box之间的原有间距需要取消
     * 不然会产生对齐bug
     * 这里一旦取消box之间的间距，需要考虑到flex的重新伸缩性问题
     */
    const contentWidth = this.contentElem && this.contentElem.clientWidth;
    const shouldnoMargin = (contentWidth && contentWidth < COLLAPSE_WIDTH);
    const shouldForceCollapse = shouldnoMargin && contentWidth > COLLAPSE_WIDTH - MARGIN_LEFT;

    return (
      <div className="serviceResultContent" ref={(ref) => { this.contentElem = ref; }}>
        <div
          className={classNames({
            leftContent: true,
            noMargin: shouldnoMargin,
            forceCollapse: shouldForceCollapse,
          })}
        >
          <MissionProgress
            missionImplementationProgress={missionImplementationProgress}
            onPreviewCustDetail={onPreviewCustDetail}
            missionProgressStatusDic={missionProgressStatus}
          />
        </div>
        <div className="rightContent">
          <CustFeedback
            onPreviewCustDetail={onPreviewCustDetail}
            custFeedback={custFeedback}
          />
        </div>
      </div>
    );
  }
}
