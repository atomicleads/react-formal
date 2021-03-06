"use strict";

exports.__esModule = true;
exports.default = void 0;

var _topeka = require("topeka");

var _omit = _interopRequireDefault(require("lodash/omit"));

var _pick = _interopRequireDefault(require("lodash/pick"));

var _propertyExpr = _interopRequireDefault(require("property-expr"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _uncontrollable = _interopRequireDefault(require("uncontrollable"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _warning = _interopRequireDefault(require("warning"));

var _elementType = _interopRequireDefault(require("prop-types-extra/lib/elementType"));

var _reach = _interopRequireDefault(require("yup/lib/util/reach"));

var _shallowequal = _interopRequireDefault(require("shallowequal"));

var _errorManager = _interopRequireDefault(require("./errorManager"));

var _errToJSON = _interopRequireDefault(require("./utils/errToJSON"));

var ErrorUtils = _interopRequireWildcard(require("./utils/ErrorUtils"));

var _Contexts = require("./Contexts");

var _yup = require("yup");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var batchedUpdates = _reactDom.default.unstable_batchedUpdates || function (fn) {
  return fn();
};

var BindingContext = _topeka.BindingContext.ControlledComponent;

var done = function done(e) {
  return setTimeout(function () {
    throw e;
  });
};

var isValidationError = function isValidationError(err) {
  return err && err.name === 'ValidationError';
};

var YUP_OPTIONS = ['context', 'stripUnknown', 'recursive', 'abortEarly', 'strict'];

var getter = function getter(path, model) {
  return path ? _propertyExpr.default.getter(path, true)(model || {}) : model;
};

var setter = BindingContext.defaultProps.setter;
/**
 * Form component renders a `value` to be updated and validated by child Fields.
 * Forms can be thought of as `<input/>`s for complex values, or models. A Form aggregates
 * a bunch of smaller inputs, each in charge of updating a small part of the overall model.
 * The Form will integrate and validate each change and fire a single unified `onChange` with the new `value`.
 *
 * Validation errors can be displayed anywhere inside a Form with Message Components.
 *
 * ```jsx { "editable": true }
 * var defaultStr = yup.string().default('')
 *
 * var customerSchema = yup
 *   .object({
 *     name: yup.object({
 *       first: defaultStr
 *         .required('please enter a first name'),
 *
 *       last: defaultStr
 *         .required('please enter a surname'),
 *     }),
 *
 *     dateOfBirth: yup.date()
 *       .max(new Date(), "Are you a time traveler?!"),
 *
 *     colorId: yup.number()
 *       .nullable()
 *       .required('Please select a dank color')
 *   });
 *
 * render(
 *   <Form
 *     schema={customerSchema}
 *     defaultValue={customerSchema.default()}
 *   >
 *     <div>
 *       {\/\*'grandchildren' are no problem \*\/}
 *       <label>Name</label>
 *
 *       <Form.Field
 *         name='name.first'
 *         placeholder='First name'
 *       />
 *       <Form.Field
 *         name='name.last'
 *         placeholder='Surname'
 *       />
 *
 *       <Form.Message for={['name.first', 'name.last']} className="validation-error"/>
 *     </div>
 *
 *     <label>Date of Birth</label>
 *     <Form.Field name='dateOfBirth'/>
 *     <Form.Message for='dateOfBirth' className="validation-error"/>
 *
 *     <label>Favorite Color</label>
 *     <Form.Field name='colorId' as='select'>
 *       <option value={null}>Select a color...</option>
 *       <option value={0}>Red</option>
 *       <option value={1}>Yellow</option>
 *       <option value={2}>Blue</option>
 *       <option value={3}>other</option>
 *     </Form.Field>
 *     <Form.Message for='colorId' className="validation-error"/>
 *
 *   <Form.Submit type='submit'>
 *     Submit
 *   </Form.Submit>
 * </Form>)
 * ```
 */

var Form =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(Form, _React$PureComponent);

  function Form(_props, _context) {
    var _this;

    _this = _React$PureComponent.call(this, _props, _context) || this;

    _this.getSchemaForPath = function (path, props) {
      if (props === void 0) {
        props = _this.props;
      }

      var _props2 = props,
          schema = _props2.schema,
          value = _props2.value,
          context = _props2.context;
      return schema && path && (0, _reach.default)(schema, path, value, context);
    };

    _this.handleChange = function (model, paths) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          onTouch = _this$props.onTouch,
          touched = _this$props.touched;
      var nextTouched = touched;
      onChange(model, paths);
      paths.forEach(function (path) {
        var _extends2;

        if (touched && touched[path]) return;
        if (nextTouched === touched) nextTouched = _extends({}, touched, (_extends2 = {}, _extends2[path] = true, _extends2));else nextTouched[path] = true;
      });
      if (nextTouched !== touched) onTouch(nextTouched, paths);
    };

    _this.handleValidationRequest = function (fields, type, args) {
      var _this$props2 = _this.props,
          noValidate = _this$props2.noValidate,
          delay = _this$props2.delay;
      fields = [].concat(fields);
      if (noValidate) return;

      _this.notify('onValidate', {
        type: type,
        fields: fields,
        args: args
      });

      _this.enqueue(fields);

      if (type !== 'onChange') _this.flush(delay);
    };

    _this.handleFieldError = function (name, fieldErrors) {
      var errors = _this.props.errors;

      _this.handleError(_extends(ErrorUtils.remove(errors, name), fieldErrors));
    };

    _this.handleError = function (errors) {
      _this.notify('onError', errors);
    };

    _this.handleSubmitSuccess = function (validatedValue) {
      var submitForm = _this.props.submitForm;

      _this.notify('onSubmit', validatedValue);

      return Promise.resolve(submitForm && submitForm(validatedValue)).then(function () {
        _this.setSubmitting(false);

        _this.updateFormState(function (s) {
          return {
            submits: _extends({}, s.submits, {
              submitCount: s.submits.submitCount + 1,
              submitAttempts: s.submits.submitAttempts + 1
            })
          };
        });

        _this.notify('onSubmitFinished');
      }, function (err) {
        _this.setSubmitting(false);

        _this.notify('onSubmitFinished', err);

        throw err;
      });
    };

    _this.handleSubmitError = function (err) {
      if (!isValidationError(err)) throw err;
      var errors = (0, _errToJSON.default)(err);
      maybeWarn(_this.props.debug, errors, 'onSubmit');

      _this.updateFormState(function (s) {
        return {
          submits: _extends({}, s.submits, {
            submitAttempts: s.submits.submitAttempts + 1
          })
        };
      });

      _this.notify('onError', errors);

      _this.notify('onInvalidSubmit', errors);

      _this.setSubmitting(false);
    };

    _this.handleSubmit = function (e) {
      if (e && e.preventDefault) e.preventDefault();
      clearTimeout(_this.submitTimer);
      _this.submitTimer = setTimeout(function () {
        return _this.submit().catch(done);
      }, 0);
    };

    _this.updateFormState = function (fn) {
      batchedUpdates(function () {
        if (_this.unmounted) return;

        _this.setState(function (_ref) {
          var formState = _ref.formState;
          var nextFormState = fn(formState); // TODO: optimize the nullish case

          return nextFormState !== formState && nextFormState !== null ? {
            formState: _extends({}, formState, nextFormState)
          } : null;
        });
      });
    };

    _this.submit = function () {
      var _this$props3 = _this.props,
          schema = _this$props3.schema,
          noValidate = _this$props3.noValidate,
          value = _this$props3.value,
          onSubmitFinished = _this$props3.onSubmitFinished,
          errors = _this$props3.errors,
          options = _objectWithoutPropertiesLoose(_this$props3, ["schema", "noValidate", "value", "onSubmitFinished", "errors"]);

      if (_this._submitting) {
        return Promise.resolve(false);
      }

      options.abortEarly = false;
      options.strict = false;

      _this.notify('onBeforeSubmit', {
        value: value,
        errors: errors
      });

      _this.setSubmitting(true);

      return (noValidate ? Promise.resolve(true) : schema.validate(value, options)). // no catch, we aren't interested in errors from onSubmit handlers
      then(_this.handleSubmitSuccess, _this.handleSubmitError).then(onSubmitFinished);
    };

    _this.debug = function () {
      var _console;

      if (!_this.props.__debugName) return;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_console = console).log.apply(_console, ['Form:', _this.props.__debugName].concat(args)); // eslint-disable-line

    };

    _this.validatePath =
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(path, _ref2) {
        var props, options, abortEarly, value, schema, noPathRe, match, fieldName, _i;

        return regeneratorRuntime.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                props = _ref2.props;
                options = (0, _pick.default)(props, YUP_OPTIONS);
                abortEarly = options.abortEarly == null ? false : options.abortEarly;
                value = props.value, schema = props.schema;
                _context2.prev = 4;
                _context2.next = 7;
                return schema.validateAt(path, value, _extends({}, options, {
                  abortEarly: abortEarly
                }));

              case 7:
                _context2.next = 25;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](4);

                if (!(_context2.t0 instanceof _yup.ValidationError)) {
                  _context2.next = 13;
                  break;
                }

                return _context2.abrupt("return", _context2.t0);

              case 13:
                noPathRe = /The schema does not contain the path: ([\w\._-]+)\./;
                match = noPathRe.exec(_context2.t0.toString());

                if (!(match != null)) {
                  _context2.next = 24;
                  break;
                }

                fieldName = match[1];
                _context2.t1 = regeneratorRuntime.keys(_this.props.touched);

              case 18:
                if ((_context2.t2 = _context2.t1()).done) {
                  _context2.next = 24;
                  break;
                }

                _i = _context2.t2.value;

                if (!(fieldName === _i)) {
                  _context2.next = 22;
                  break;
                }

                return _context2.abrupt("return");

              case 22:
                _context2.next = 18;
                break;

              case 24:
                return _context2.abrupt("return", _context2.t0);

              case 25:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee, this, [[4, 9]]);
      }));

      return function (_x, _x2) {
        return _ref3.apply(this, arguments);
      };
    }();

    _this.queue = [];
    _this.errors = (0, _errorManager.default)(_this.validatePath);
    _this.formActions = {
      onSubmit: _this.handleSubmit,
      onValidate: _this.handleValidationRequest,
      onFieldError: _this.handleFieldError,
      getSchemaForPath: _this.getSchemaForPath
    };
    _this.state = {
      formState: {
        submits: {
          submitCount: 0,
          submitAttempts: 0,
          submitting: false
        },
        value: _this.props.value,
        errors: _this.props.errors,
        touched: _this.props.touched
      }
    };
    return _this;
  }

  Form.getDerivedStateFromProps = function getDerivedStateFromProps(_ref4, _ref5) {
    var value = _ref4.value,
        touched = _ref4.touched,
        errors = _ref4.errors;
    var formState = _ref5.formState;
    if (value !== formState.value || touched !== formState.touched || !(0, _shallowequal.default)(formState.errors, errors)) return {
      formState: _extends({}, formState, {
        errors: errors,
        touched: touched,
        value: value
      })
    };
    return null;
  };

  var _proto = Form.prototype;

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this$props4 = this.props,
        errors = _this$props4.errors,
        delay = _this$props4.delay,
        schema = _this$props4.schema;
    var schemaChanged = schema !== prevProps.schema;

    if (schemaChanged && errors) {
      this.enqueue(Object.keys(errors));
    }

    this.flush(delay);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.unmounted = true;
    clearTimeout(this.submitTimer);
    clearTimeout(this.validationTimer);
  };

  _proto.collectErrors = function collectErrors(fields, props) {
    if (props === void 0) {
      props = this.props;
    }

    try {
      return this.errors.collect(fields, props.errors, {
        props: props
      });
    } catch (e) {
      console.log("collectErrrorsEx", e);
    }
  };

  _proto.enqueue = function enqueue(fields) {
    this.queue = this.queue.concat(fields);
  };

  _proto.flush = function flush(delay) {
    var _this2 = this;

    clearTimeout(this.validationTimer);
    this.validationTimer = setTimeout(function () {
      var fields = _this2.queue;
      var props = _this2.props;
      if (!fields.length) return;
      _this2.queue = [];

      _this2.collectErrors(fields, _this2.props).then(function (errors) {
        if (errors !== _this2.props.errors) {
          maybeWarn(props.debug, errors, 'field validation');

          _this2.notify('onError', errors);
        }
      }).catch(done);
    }, delay);
  };

  _proto.setSubmitting = function setSubmitting(submitting) {
    if (this.unmounted) return; // this state is duplicated locally because it can take longer for the
    // submit state to flush than a user can re-submit which we don't want

    this._submitting = submitting;
    this.updateFormState(function (s) {
      return s.submits.submitting !== submitting ? {
        submits: _extends({}, s.submits, {
          submitting: submitting
        })
      } : null;
    });
  };

  _proto.notify = function notify(event) {
    var _this$props5;

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    if (this.props[event]) (_this$props5 = this.props)[event].apply(_this$props5, args);
  };

  _proto.validate = function validate(fields) {
    return this.collectErrors(fields);
  };

  _proto.render = function render() {
    var _this$props6 = this.props,
        children = _this$props6.children,
        value = _this$props6.value,
        getter = _this$props6.getter,
        setter = _this$props6.setter,
        Element = _this$props6.as,
        _ = _this$props6.onChange,
        _1 = _this$props6.onTouch,
        _2 = _this$props6.touched;
    var props = (0, _omit.default)(this.props, YUP_OPTIONS.concat(Object.keys(Form.propTypes), ['onTouch']));
    delete props.__debugName;
    if (Element === 'form') props.noValidate = true; // disable html5 validation

    props.onSubmit = this.handleSubmit;

    if (Element === null || Element === false) {
      children = _react.default.cloneElement(_react.default.Children.only(children), props);
    } else {
      children = _react.default.createElement(Element, props, children);
    }

    return _react.default.createElement(BindingContext, {
      value: value,
      getter: getter,
      setter: setter,
      onChange: this.handleChange
    }, _react.default.createElement(_Contexts.FormActionsContext.Provider, {
      value: this.formActions
    }, _react.default.createElement(_Contexts.FormDataContext.Provider, {
      value: this.state.formState
    }, children)));
  };

  return Form;
}(_react.default.PureComponent);

Form.propTypes = {
  /**
   * Form value object, can be left [uncontrolled](/controllables);
   * use the `defaultValue` prop to initialize an uncontrolled form.
   */
  value: _propTypes.default.object,

  /**
   * Callback that is called when the `value` prop changes.
   *
   * ```js
   * function(
   *   value: object,
   *   updatedPaths: array<string>
   * )
   * ```
   */
  onChange: _propTypes.default.func,

  /**
   * An object hash of field errors for the form. The object should be keyed with paths
   * with the values being an array of errors or message objects. Errors can be
   * left [uncontrolled](/controllables) (use `defaultErrors` to set an initial value)
   * or managed along with the `onError` callback. You can use any object shape you'd like for
   * errors, as long as you provide the Form.Message component an `extract` prop that
   * understands how to pull out the strings message. By default it understands strings and objects
   * with a `'message'` property.
   *
   * ```js
   * <Form errors={{
   *  "name.first": [
   *    'First names are required',
   *    {
   *    	message: "Names must be at least 2 characters long",
   *    	type: 'min'
   *    }
   *  ],
   * }}/>
   * ```
   */
  errors: _propTypes.default.object,

  /**
   * Callback that is called when a validation error occurs. It is called with an `errors` object
   *
   * ```jsx { "editable": true }
   * class Example extends React.Component {
   *   constructor(props) {
   *     this.state = { errors: {} }
   *   }
   *   render() {
   *     return (
   *       <Form
   *         schema={modelSchema}
   *         defaultValue={modelSchema.default()}
   *         errors={this.state.errors}
   *         onError={errors => {
   *           if( errors.dateOfBirth )
   *             errors.dateOfBirth = 'hijacked!'
   *           this.setState({ errors })
   *       }}>
   *
   *         <Form.Field name='dateOfBirth'/>
   *         <Form.Message for='dateOfBirth'/>
   *
   *         <Form.Submit type='submit'>Submit</Form.Submit>
   *       </Form>
   *     )
   *   }
   * }
   *
   * render(<Example />)
   * ```
   */
  onError: _propTypes.default.func,

  /**
   * Callback that is called whenever a validation is triggered.
   * It is called _before_ the validation is actually run.
   * ```js
   * function onValidate(event){
   *   let { type, fields, args } = event
   * }
   * ```
   */
  onValidate: _propTypes.default.func,

  /**
   * Callback that is fired in response to a submit, _before validation runs.
   *
   * ```js
   * function onSubmit(formValue){
   *   // do something with valid value
   * }
   * ```
   */
  onBeforeSubmit: _propTypes.default.func,

  /**
   * Callback that is fired in response to a submit, after validation runs for the entire form.
   *
   * ```js
   * function onSubmit(formValue){
   *   // do something with valid value
   * }
   * ```
   */
  onSubmit: _propTypes.default.func,
  onSubmitFinished: _propTypes.default.func,

  /* */
  submitForm: _propTypes.default.func,

  /**
   * Callback that is fired when the native onSubmit event is triggered. Only relevant when
   * the `component` prop renders a `<form/>` tag. onInvalidSubmit will trigger only if the form is invalid.
   *
   * ```js
   * function onInvalidSubmit(errors){
   *   // do something with errors
   * }
   * ```
   */
  onInvalidSubmit: _propTypes.default.func,

  /**
   * A value getter function. `getter` is called with `path` and `value` and
   * should return the plain **javascript** value at the path.
   *
   * ```ts
   * function(
   *  path: string,
   *  value: any,
   * ): Object
   * ```
   */
  getter: _propTypes.default.func,

  /**
   * A value setter function. `setter` is called with `path`, the form `value` and the path `value`.
   * The `setter` must return updated form `value`, which allows you to leave the original value unmutated.
   *
   * The default implementation uses the [react immutability helpers](http://facebook.github.io/react/docs/update.html),
   * letting you treat the form `value` as immutable.
   * ```js
   * function(
   *  path: string,
   *  formValue: object,
   *  pathValue: any
   * ) -> object
   * ```
   */
  setter: _propTypes.default.func,

  /**
   * Time in milliseconds that validations should be debounced. Reduces the amount of validation calls
   * made at the expense of a slight delay. Helpful for performance.
   */
  delay: _propTypes.default.number,

  /**
   * Validations will be strict, making no attempt to coarce input values to the appropriate type.
   */
  strict: _propTypes.default.bool,

  /**
   * Turns off input validation for the Form, value updates will continue to work.
   */
  noValidate: _propTypes.default.bool,

  /**
   * A tag name or Component class the Form should render.
   *
   * If `null` are `false` the form will simply render it's child. In
   * this instance there must only be one child.
   */
  as: _propTypes.default.oneOfType([_elementType.default, _propTypes.default.oneOf([null, false])]),

  /**
   * A Yup schema  that validates the Form `value` prop. Used to validate the form input values
   * For more information about the yup api check out: https://github.com/jquense/yup/blob/master/README.md
   * @type {YupSchema}
   */
  schema: function schema(props, name, componentName) {
    var _PropTypes$any;

    for (var _len3 = arguments.length, args = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
      args[_key3 - 3] = arguments[_key3];
    }

    var err = !props.noValidate && (_PropTypes$any = _propTypes.default.any).isRequired.apply(_PropTypes$any, [props, name, componentName].concat(args));

    if (props[name]) {
      var schema = props[name];
      if (!schema.__isYupSchema__ && !(schema.resolve && schema.validate)) err = new Error('`schema` must be a proper yup schema: (' + componentName + ')');
    }

    return err;
  },

  /**
   * yup schema context
   */
  context: _propTypes.default.object,

  /**
   * toggle debug mode, which `console.warn`s validation errors
   */
  debug: _propTypes.default.bool
};
Form.defaultProps = _extends({}, BindingContext.defaultProps, {
  as: 'form',
  strict: false,
  delay: 300,
  errors: ErrorUtils.EMPTY_ERRORS,
  touched: {},
  getter: getter,
  setter: setter
});

function maybeWarn(debug, errors, target) {
  if (!debug) return;

  if (process.env.NODE_ENV !== 'production') {
    var keys = Object.keys(errors);
    process.env.NODE_ENV !== "production" ? (0, _warning.default)(!keys.length, "[react-formal] (" + target + ") invalid fields: " + keys.join(', ')) : void 0;
  }
}

var ControlledForm = (0, _uncontrollable.default)(Form, {
  value: 'onChange',
  errors: 'onError',
  touched: 'onTouch'
});
ControlledForm.getter = getter;
ControlledForm.setter = setter;
var _default = ControlledForm;
exports.default = _default;
module.exports = exports["default"];