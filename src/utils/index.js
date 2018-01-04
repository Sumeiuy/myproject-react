import apiCreator from './apiCreator';
import request from './request';
import sagaEffects from './sagaEffects';
import { dispatchTabPane,
          openRctTab,
          openFspTab,
          openInTab,
          closeRctTab,
          closeFspTab,
          removeTab,
          navToTab,
          navTo,
          linkTo } from './controlPane';

import initFspMethod from './initFspMethod';
import fspGlobal from './fspGlobal';
import permission from './permission';

export default {
  apiCreator,
  request,
  sagaEffects,
  initFspMethod,
  fspGlobal,
  permission,
  dispatchTabPane,
  openRctTab,
  openFspTab,
  closeRctTab,
  closeFspTab,
  removeTab,
  openInTab,
  navToTab,
  navTo,
  linkTo,
};
