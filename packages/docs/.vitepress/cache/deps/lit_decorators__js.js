import {
  defaultConverter,
  notEqual
} from "./chunk-HP7J5F2K.js";
import "./chunk-Y2F7D3TJ.js";

// ../lunchboxjs/node_modules/@lit/reactive-element/development/decorators/custom-element.js
var customElement = (tagName) => (classOrTarget, context) => {
  if (context !== void 0) {
    context.addInitializer(() => {
      customElements.define(tagName, classOrTarget);
    });
  } else {
    customElements.define(tagName, classOrTarget);
  }
};

// ../lunchboxjs/node_modules/@lit/reactive-element/development/decorators/property.js
var DEV_MODE = true;
var issueWarning;
if (DEV_MODE) {
  const issuedWarnings = globalThis.litIssuedWarnings ?? (globalThis.litIssuedWarnings = /* @__PURE__ */ new Set());
  issueWarning = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
}
var legacyProperty = (options, proto, name) => {
  const hasOwnProperty = proto.hasOwnProperty(name);
  proto.constructor.createProperty(name, hasOwnProperty ? { ...options, wrapped: true } : options);
  return hasOwnProperty ? Object.getOwnPropertyDescriptor(proto, name) : void 0;
};
var defaultPropertyDeclaration = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual
};
var standardProperty = (options = defaultPropertyDeclaration, target, context) => {
  const { kind, metadata } = context;
  if (DEV_MODE && metadata == null) {
    issueWarning("missing-class-metadata", `The class ${target} is missing decorator metadata. This could mean that you're using a compiler that supports decorators but doesn't support decorator metadata, such as TypeScript 5.1. Please update your compiler.`);
  }
  let properties = globalThis.litPropertyMetadata.get(metadata);
  if (properties === void 0) {
    globalThis.litPropertyMetadata.set(metadata, properties = /* @__PURE__ */ new Map());
  }
  properties.set(context.name, options);
  if (kind === "accessor") {
    const { name } = context;
    return {
      set(v) {
        const oldValue = target.get.call(this);
        target.set.call(this, v);
        this.requestUpdate(name, oldValue, options);
      },
      init(v) {
        if (v !== void 0) {
          this._$changeProperty(name, void 0, options);
        }
        return v;
      }
    };
  } else if (kind === "setter") {
    const { name } = context;
    return function(value) {
      const oldValue = this[name];
      target.call(this, value);
      this.requestUpdate(name, oldValue, options);
    };
  }
  throw new Error(`Unsupported decorator location: ${kind}`);
};
function property(options) {
  return (protoOrTarget, nameOrContext) => {
    return typeof nameOrContext === "object" ? standardProperty(options, protoOrTarget, nameOrContext) : legacyProperty(options, protoOrTarget, nameOrContext);
  };
}

// ../lunchboxjs/node_modules/@lit/reactive-element/development/decorators/state.js
function state(options) {
  return property({
    ...options,
    // Add both `state` and `attribute` because we found a third party
    // controller that is keying off of PropertyOptions.state to determine
    // whether a field is a private internal property or not.
    state: true,
    attribute: false
  });
}

// ../lunchboxjs/node_modules/@lit/reactive-element/development/decorators/event-options.js
function eventOptions(options) {
  return (protoOrValue, nameOrContext) => {
    const method = typeof protoOrValue === "function" ? protoOrValue : protoOrValue[nameOrContext];
    Object.assign(method, options);
  };
}

// ../lunchboxjs/node_modules/@lit/reactive-element/development/decorators/base.js
var desc = (obj, name, descriptor) => {
  descriptor.configurable = true;
  descriptor.enumerable = true;
  if (
    // We check for Reflect.decorate each time, in case the zombiefill
    // is applied via lazy loading some Angular code.
    Reflect.decorate && typeof name !== "object"
  ) {
    Object.defineProperty(obj, name, descriptor);
  }
  return descriptor;
};

// ../lunchboxjs/node_modules/@lit/reactive-element/development/decorators/query.js
var DEV_MODE2 = true;
var issueWarning2;
if (DEV_MODE2) {
  const issuedWarnings = globalThis.litIssuedWarnings ?? (globalThis.litIssuedWarnings = /* @__PURE__ */ new Set());
  issueWarning2 = (code, warning) => {
    warning += code ? ` See https://lit.dev/msg/${code} for more information.` : "";
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
}
function query(selector, cache) {
  return (protoOrTarget, nameOrContext, descriptor) => {
    const doQuery = (el) => {
      var _a;
      const result = ((_a = el.renderRoot) == null ? void 0 : _a.querySelector(selector)) ?? null;
      if (DEV_MODE2 && result === null && cache && !el.hasUpdated) {
        const name = typeof nameOrContext === "object" ? nameOrContext.name : nameOrContext;
        issueWarning2("", `@query'd field ${JSON.stringify(String(name))} with the 'cache' flag set for selector '${selector}' has been accessed before the first update and returned null. This is expected if the renderRoot tree has not been provided beforehand (e.g. via Declarative Shadow DOM). Therefore the value hasn't been cached.`);
      }
      return result;
    };
    if (cache) {
      const { get, set } = typeof nameOrContext === "object" ? protoOrTarget : descriptor ?? (() => {
        const key = DEV_MODE2 ? Symbol(`${String(nameOrContext)} (@query() cache)`) : Symbol();
        return {
          get() {
            return this[key];
          },
          set(v) {
            this[key] = v;
          }
        };
      })();
      return desc(protoOrTarget, nameOrContext, {
        get() {
          let result = get.call(this);
          if (result === void 0) {
            result = doQuery(this);
            if (result !== null || this.hasUpdated) {
              set.call(this, result);
            }
          }
          return result;
        }
      });
    } else {
      return desc(protoOrTarget, nameOrContext, {
        get() {
          return doQuery(this);
        }
      });
    }
  };
}

// ../lunchboxjs/node_modules/@lit/reactive-element/development/decorators/query-all.js
var fragment;
function queryAll(selector) {
  return (obj, name) => {
    return desc(obj, name, {
      get() {
        const container = this.renderRoot ?? (fragment ?? (fragment = document.createDocumentFragment()));
        return container.querySelectorAll(selector);
      }
    });
  };
}

// ../lunchboxjs/node_modules/@lit/reactive-element/development/decorators/query-async.js
function queryAsync(selector) {
  return (obj, name) => {
    return desc(obj, name, {
      async get() {
        var _a;
        await this.updateComplete;
        return ((_a = this.renderRoot) == null ? void 0 : _a.querySelector(selector)) ?? null;
      }
    });
  };
}

// ../lunchboxjs/node_modules/@lit/reactive-element/development/decorators/query-assigned-elements.js
function queryAssignedElements(options) {
  return (obj, name) => {
    const { slot, selector } = options ?? {};
    const slotSelector = `slot${slot ? `[name=${slot}]` : ":not([name])"}`;
    return desc(obj, name, {
      get() {
        var _a;
        const slotEl = (_a = this.renderRoot) == null ? void 0 : _a.querySelector(slotSelector);
        const elements = (slotEl == null ? void 0 : slotEl.assignedElements(options)) ?? [];
        return selector === void 0 ? elements : elements.filter((node) => node.matches(selector));
      }
    });
  };
}

// ../lunchboxjs/node_modules/@lit/reactive-element/development/decorators/query-assigned-nodes.js
function queryAssignedNodes(options) {
  return (obj, name) => {
    const { slot } = options ?? {};
    const slotSelector = `slot${slot ? `[name=${slot}]` : ":not([name])"}`;
    return desc(obj, name, {
      get() {
        var _a;
        const slotEl = (_a = this.renderRoot) == null ? void 0 : _a.querySelector(slotSelector);
        return (slotEl == null ? void 0 : slotEl.assignedNodes(options)) ?? [];
      }
    });
  };
}
export {
  customElement,
  eventOptions,
  property,
  query,
  queryAll,
  queryAssignedElements,
  queryAssignedNodes,
  queryAsync,
  standardProperty,
  state
};
/*! Bundled license information:

@lit/reactive-element/development/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=lit_decorators__js.js.map
