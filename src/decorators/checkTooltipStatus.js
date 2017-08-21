export default {};

// 检测网络状态
export const checkTooltipStatus = (target, name, descriptor) => {
  const origin = descriptor.value;

  return {
    ...descriptor,
    value(...args) {
      const { isShowTooltip } = this.state;
      if (!isShowTooltip) {
        this.setState({
          isShowTooltip: !isShowTooltip,
        });
      }
      origin.apply(this, args);
    },
  };
};
