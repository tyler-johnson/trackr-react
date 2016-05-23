/* This code was extracted from https://github.com/ultimatejs/tracker-react */

import TrackrOnce from "./trackr-once";
import {Component} from "react";

class TrackrComponent extends Component {
  constructor(...args) {
    super(...args);

    /*
     Overloading the constructors `componentWillUnmount` method to ensure that computations are stopped and a forceUpdate prevented, without overwriting the prototype. This is a potential bug, as of React 14.7 the componentWillUnmount() method does not fire, if the top level component has one. It gets overwritten. This implementation is however similar to what a transpiler would do anyway. GitHub Issue: https://github.com/facebook/react/issues/6162
     */
    if (!this.constructor.prototype._isExtended) {
      this.constructor.prototype._isExtended = true;
      let superComponentWillUnmount = this.constructor.prototype.componentWillUnmount;

      this.constructor.prototype.componentWillUnmount = function (...args) {
        if (superComponentWillUnmount) {
          superComponentWillUnmount.call(this, ...args);
        }

        this._renderComputation.stop();
        this._renderComputation = null;
      };
    }

    this.autorunRender();
  }

  autorunRender() {
    let oldRender = this.render;

    this.render = () => {
      // Simple method we can offer in the `Meteor.Component` API
      return this.autorunOnce('_renderComputation', oldRender);
    };
  }

  autorunOnce(name, dataFunc) {
    return TrackrOnce(name, this, dataFunc, this.forceUpdate);
  }
}

export {TrackrComponent as Component};
