import React from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import { Route } from 'dva/router';
import { parse, stringify } from 'query-string';

/**
 * A public higher-order component to access the imperative API
 */
const withRouter = (Component) => {
  const C = (props) => {
    const { wrappedComponentRef, replace, push, ...remainingProps } = props;

    function hackReplace(args) {
      const params = {
        search: `?${stringify(args.query)}`,
        ...args,
      };
      return replace(params);
    }

    function hackPush(args) {
      // TODO 针对相同的地址，不切换
      if (typeof args === 'string') {
        return push(args);
      }
      const params = {
        search: `?${stringify(args.query)}`,
        ...args,
      };
      return push(params);
    }

    return (
      <Route
        render={({ history, location, match }) => {
          const routeComponentProps = {
            history,
            match,
            location: {
              ...location,
              query: parse(location.search),
            },
          };
          return (
            <Component
              {...remainingProps}
              replace={hackReplace}
              push={hackPush}
              {...routeComponentProps}
              ref={wrappedComponentRef}
            />
          );
        }}
      />
    );
  };

  C.displayName = `withRouter(${Component.displayName || Component.name})`;
  C.WrappedComponent = Component;
  C.propTypes = {
    wrappedComponentRef: PropTypes.func,
    replace: PropTypes.func,
    push: PropTypes.func,
  };
  C.defaultProps = {
    wrappedComponentRef: () => {},
    replace: () => {},
    push: () => {},
  };

  return hoistStatics(C, Component);
};

export default withRouter;
