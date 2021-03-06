"use strict";

exports.__esModule = true;
exports.default = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _omit = _interopRequireDefault(require("lodash/omit"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _elementType = _interopRequireDefault(require("prop-types-extra/lib/elementType"));

var _topeka = require("topeka");

var _warning = _interopRequireDefault(require("warning"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _shallowequal = _interopRequireDefault(require("shallowequal"));

var _config = _interopRequireDefault(require("./config"));

var _isNativeType = _interopRequireDefault(require("./utils/isNativeType"));

var _ErrorUtils = require("./utils/ErrorUtils");

var _Contexts = require("./Contexts");

var _createEventHandler = _interopRequireDefault(require("./utils/createEventHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function notify(handler, args) {
  handler && handler.apply(void 0, args);
}

function resolveToNativeType(type) {
  if (type === 'boolean') return 'checkbox';
  return (0, _isNativeType.default)(type) ? type : 'text';
}

function getValueProps(type, value, props) {
  if (value == null) value = '';

  switch (type) {
    case 'radio':
    case 'checkbox':
      return {
        value: props.value,
        checked: value
      };

    case 'file':
      return {
        value: ''
      };

    default:
      return {
        value: value
      };
  }
}

function isFilterErrorsEqual(_ref, _ref2) {
  var a = _ref[0];
  var b = _ref2[0];
  var isEqual = (a.errors === b.errors || (0, _shallowequal.default)(a.errors, b.errors)) && a.names === b.names && a.mapErrors === b.mapErrors; // !isEqual && console.log('filter equalg cm ""', a.errors, b.errors)

  return isEqual;
}
/**
 * The Field Component renders a form control and handles input value updates and validations.
 * Changes to the Field value are automatically propagated back up to the containing Form
 * Component.
 *
 * Fields provide a light abstraction over normal input components where values and onChange handlers
 * are take care of for you. Beyond that they just render the input for their type, Fields whille pass along
 * any props and children to the input so you can easily configure new input types.
 *
 * ```jsx { "editable": true }
 * <Form
 *   noValidate
 *   schema={modelSchema}
 *   defaultValue={{
 *     name: { first: 'Sally'},
 *     colorID: 0
 *   }}
 * >
 *     <label htmlFor="example-firstName">Name</label>
 *     <Form.Field
 *       name='name.first'
 *       placeholder='First name'
 *       id="example-firstName"
 *     />
 *     <label htmlFor="example-color">Favorite Color</label>
 *     <Form.Field
 *       as='select'
 *       name='colorId'
 *       id="example-color"
 *     >
 *       <option value={0}>Red</option>
 *       <option value={1}>Yellow</option>
 *       <option value={2}>Blue</option>
 *       <option value={3}>other</option>
 *     </Form.Field>
 *   <Form.Submit type='submit'>Submit</Form.Submit>
 * </Form>
 * ```
 *
 * In addition to injecting Field components with events and the field `value`, a
 * special prop called `meta` is also provided to all Field renderer components. `meta`
 * contains a bunch of helpful context as well some methods for doing advanced field operations.
 *
 * ```ts
 * interface Meta {
 *   value: any;                // the Field Value
 *   valid: boolean;            // Whether the field is currently valid
 *   invalid: boolean;          // inverse of valid
 *   touched: boolean:          // whether the field has been touched yet
 *   errors: ErrorObjectMap;    // the errors for this field and any neted fields
 *   schema?: YupSchema;        // The schema for this field
 *   context: YupSchemaContext; // the yup context object
 *   // onError allows manually _replacing_ errors for the Field `name`
 *   // any existing errors for this path will be removed first
 *   onError(errors: ErrorObjectMap): void
 * }
 * ```
 *
 */


var Field =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(Field, _React$PureComponent);

  function Field() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args)) || this;

    _this.handleFieldError = function (errors) {
      var _this$props = _this.props,
          name = _this$props.name,
          actions = _this$props.actions;
      return actions.onFieldError(name, errors);
    };

    _this.eventHandlers = {};
    _this.getEventHandlers = (0, _createEventHandler.default)(function (event) {
      return function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        notify(_this.props[event], args);
        notify(_this.props.bindingProps[event], args);

        _this.handleValidateField(event, args);
      };
    });
    _this.memoFilterAndMapErrors = (0, _memoizeOne.default)(_ErrorUtils.filterAndMapErrors, isFilterErrorsEqual);
    return _this;
  }

  var _proto = Field.prototype;

  _proto.buildMeta = function buildMeta() {
    var _this$props2 = this.props,
        name = _this$props2.name,
        touched = _this$props2.touched,
        exclusive = _this$props2.exclusive,
        errors = _this$props2.errors,
        actions = _this$props2.actions,
        yupContext = _this$props2.yupContext,
        submits = _this$props2.submits,
        bindingProps = _this$props2.bindingProps,
        _this$props2$errorCla = _this$props2.errorClass,
        errorClass = _this$props2$errorCla === void 0 ? _config.default.errorClass : _this$props2$errorCla;
    var schema;

    try {
      schema = actions.getSchemaForPath && name && actions.getSchemaForPath(name);
    } catch (err) {}
    /* ignore */
    // prettier-ignore


    var meta = _extends({
      schema: schema,
      touched: touched,
      errorClass: errorClass,
      context: yupContext,
      onError: this.handleFieldError
    }, submits);

    var filteredErrors = this.memoFilterAndMapErrors({
      errors: errors,
      names: name,
      mapErrors: !exclusive ? _ErrorUtils.inclusiveMapErrors : undefined
    });
    meta.errors = filteredErrors;
    meta.invalid = !!Object.keys(filteredErrors).length;
    meta.valid = !meta.invalid; // put the original value on meta incase the coerced one differs

    meta.value = bindingProps.value;
    return meta;
  };

  _proto.handleValidateField = function handleValidateField(event, args) {
    var _this$props3 = this.props,
        name = _this$props3.name,
        validates = _this$props3.validates,
        actions = _this$props3.actions,
        noValidate = _this$props3.noValidate;
    if (noValidate || !actions) return;
    var fieldsToValidate = validates != null ? [].concat(validates) : [name];
    actions.onValidate(fieldsToValidate, event, args);
  };

  _proto.render = function render() {
    var _this$props4 = this.props,
        name = _this$props4.name,
        type = _this$props4.type,
        children = _this$props4.children,
        className = _this$props4.className,
        fieldRef = _this$props4.fieldRef,
        noMeta = _this$props4.noMeta,
        noValidate = _this$props4.noValidate,
        noResolveType = _this$props4.noResolveType,
        bindingProps = _this$props4.bindingProps,
        actions = _this$props4.actions,
        Input = _this$props4.as,
        asProps = _this$props4.asProps,
        _this$props4$events = _this$props4.events,
        events = _this$props4$events === void 0 ? _config.default.events : _this$props4$events;
    var meta = this.buildMeta();

    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== "production" ? (0, _warning.default)(!actions || noValidate || !name || meta.schema, "There is no corresponding schema defined for this field: \"" + name + "\" " + "Each Field's `name` prop must be a valid path defined by the parent Form schema") : void 0;
    }

    var resolvedType = type || meta.schema && meta.schema._type;
    meta.resolvedType = resolvedType; // console.log(meta, events(meta))

    var eventHandlers = this.getEventHandlers(typeof events === 'function' ? events(meta) : events);

    var fieldProps = _extends({
      name: name,
      type: type
    }, (0, _omit.default)(this.props, Object.keys(Field.propTypes)), bindingProps, eventHandlers); // ensure that no inputs are left uncontrolled


    var value = bindingProps.value === undefined ? null : bindingProps.value;
    fieldProps.value = value;

    if (!noValidate) {
      fieldProps.className = (0, _classnames.default)(className, meta.invalid && meta.errorClass);
    }

    if (!noMeta) fieldProps.meta = meta;
    if (fieldRef) fieldProps.ref = fieldRef; // Escape hatch for more complex Field types.

    if (typeof children === 'function') {
      fieldProps.type = resolveToNativeType(resolvedType);
      return children(fieldProps);
    } // in the case of a plain input do some schema -> native type mapping


    if (Input === 'input' && !type) {
      fieldProps.type = resolveToNativeType(resolvedType);
    }

    return _react.default.createElement(Input, _extends({}, asProps, fieldProps, getValueProps(fieldProps.type, value, this.props)), children);
  };

  return Field;
}(_react.default.PureComponent);

Field.defaultProps = {
  as: 'input',
  exclusive: false,
  fieldRef: null
};
Field.propTypes = {
  /**
   * The Field name, which should be path corresponding to a specific form `value` path.
   *
   * ```js
   * // given the form value
   * value = {
   *   name: { first: '' }
   *   languages: ['english', 'spanish']
   * }
   *
   * // the path "name.first" would update the "first" property of the form value
   * <Form.Field name='name.first' />
   *
   * // use indexes for paths that cross arrays
   * <Form.Field name='languages[0]' />
   *
   * ```
   */
  name: _propTypes.default.string.isRequired,

  /**
   * The Component Input the form should render. You can sepcify a native element such as 'textbox' or 'select'
   * or provide a Component type class directly. When no type is provided the Field will attempt determine
   * the correct input from the Field's schema. A Field corresponding to a `yup.number()`
   * will render a `type='number'` input by default.
   *
   * ```jsx { "editable": true }
   * <Form noValidate schema={modelSchema}>
   *   Use the schema to determine type
   *   <Form.Field
   *     name='dateOfBirth'
   *     placeholder='date'
   *   />
   *
   *   Override it!
   *   <Form.Field
   *     name='dateOfBirth'
   *     type='time'
   *     placeholder='time only'
   *   />
   *
   *   Use a custom Component
   *   (need native 'datetime' support to see it)
   *   <Form.Field
   *     name='dateOfBirth'
   *     as={MyDateInput}/>
   *
   * </Form>
   * ```
   *
   * Custom Inputs should comply with the basic input api contract: set a value via a `value` prop and
   * broadcast changes to that value via an `onChange` handler.
   */
  as: _propTypes.default.oneOfType([_elementType.default, _propTypes.default.string]),

  /**
   * Event name or array of event names that the Field should trigger a validation.
   * You can also specify a function that receives the Field `meta` object and returns an array of events
   * in order to change validation strategies based on validity.
   */
  events: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string), _propTypes.default.func]),

  /**
   * Customize how the Field value maps to the overall Form `value`.
   * `mapFromValue` can be a a string property name or a function that returns a
   * value for `name`'d path, allowing you to set commuted values from the Field.
   *
   * ```js
   * <Form.Field
   *   name='name'
   *   mapFromValue={fieldValue => fieldValue.first + ' ' + fieldValue.last}
   * />
   * ```
   *
   * You can also provide an object hash, mapping paths of the Form `value`
   * to fields in the field value using a string field name, or a function accessor.
   *
   * ```js { "editable": true }
   * <Form
   *   schema={modelSchema}
   *   defaultValue={modelSchema.default()}
   * >
   *   <label htmlFor="ex-mapToValue-firstName">Name</label>
   *   <Form.Field
   *     name='name.first'
   *     placeholder='First name'
   *     id="ex-mapToValue-firstName"
   *   />
   *
   *   <label htmlFor="ex-mapToValue-dob">Date of Birth</label>
   *   <Form.Field
   *     name='dateOfBirth'
   *     id="ex-mapToValue-dob"
   *     mapFromValue={{
   *       'dateOfBirth': date => date,
   *       'age': date =>
   *         (new Date()).getFullYear() - date.getFullYear()
   *   }}/>
   *
   *   <label htmlFor="ex-mapToValue-age">Age</label>
   *   <Form.Field name='age' id="ex-mapToValue-age"/>
   *
   *   <Form.Submit type='submit'>Submit</Form.Submit>
   * </Form>
   * ```
   */
  mapFromValue: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.string, _propTypes.default.object]),

  /**
   * Map the Form value to the Field value. By default
   * the `name` of the Field is used to extract the relevant
   * property from the Form value.
   *
   * ```js
   * <Form.Field
   *   name='location'
   *   type="dropdownlist"
   *   mapToValue={model=> pick(model, 'location', 'locationId')}
   * />
   * ```
   */
  mapToValue: _propTypes.default.func,

  /**
   * The css class added to the Field Input when it fails validation
   */
  errorClass: _propTypes.default.string,

  /**
   * Tells the Field to trigger validation for specific paths.
   * Useful when used in conjuction with a `mapFromValue` hash that updates more than one value, or
   * if you want to trigger validation for the parent path as well.
   *
   * > NOTE! This overrides the default behavior of validating the field itself by `name`,
   * include the `name` if you want the field to validate itself.
   *
   * ```jsx
   * <Form.Field name='name.first' validates="name.last" />
   * <Form.Field name='name' validates={['name', 'surname']} />
   * ```
   */
  validates: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),

  /**
   * Indicates whether child fields of the named field
   * affect the active state ofthe field.
   *
   * ```js
   * -> 'names'
   * -> 'names.first'
   * -> 'names.last'
   * ```
   *
   * Are all considered "part" of a field named `'names'` by default.
   */
  exclusive: _propTypes.default.bool,

  /**
   * Disables validation for the Field.
   */
  noValidate: _propTypes.default.bool,

  /**
   * When children is the traditional react element or nodes, they are
   * passed through as-is to the Field `type` component.
   *
   * ```jsx
   * <Field type='select'>
   *   <option>red</option>
   *   <option>red</option>
   * </Field>
   * ```
   *
   * When `children` is a function, its called with the processed field
   * props and the resolved Field Input component, for more advanced use cases
   *
   * ```jsx
   * <Field name='birthDate'>
   *  {(props, Input) =>
   *    <DataProvider>
   *      <Input {...props} />
   *    </DataProvider>
   *  }
   * </Field>
   * ```
   */
  children: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.func]),

  /**
   * Instruct the field to not inject the `meta` prop into the input
   */
  noMeta: _propTypes.default.bool,

  /**
   * Attach a ref to the rendered input component
   */
  fieldRef: _propTypes.default.func,

  /** @private */
  noResolveType: _propTypes.default.bool,

  /** @private */
  bindingProps: _propTypes.default.object,

  /** @private */
  yupContext: _propTypes.default.any,

  /** @private */
  errors: _propTypes.default.object,

  /** @private */
  touched: _propTypes.default.bool,

  /** @private */
  actions: _propTypes.default.object,

  /** @private */
  submits: _propTypes.default.shape({
    submitAttempts: _propTypes.default.number,
    submitCount: _propTypes.default.number,
    submitting: _propTypes.default.bool
  })
};

var _default = (0, _Contexts.withState)(function (ctx, props, ref) {
  var mapToValue = props.mapToValue,
      mapFromValue = props.mapFromValue,
      name = props.name,
      fieldRef = props.fieldRef,
      rest = _objectWithoutPropertiesLoose(props, ["mapToValue", "mapFromValue", "name", "fieldRef"]);

  return _react.default.createElement(_topeka.Binding, {
    bindTo: mapToValue || name,
    mapValue: mapFromValue
  }, function (bindingProps) {
    return _react.default.createElement(_Contexts.FormActionsContext.Consumer, null, function (actions) {
      var _extends2;

      return _react.default.createElement(Field, _extends({}, rest, (_extends2 = {
        name: name,
        actions: actions,
        fieldRef: fieldRef || ref,
        bindingProps: bindingProps,
        errors: ctx.errors,
        yupContext: ctx.yupContext,
        noValidate: ctx.noValidate,
        submits: ctx.submits,
        touched: ctx.touched[name]
      }, _extends2["noValidate"] = props.noValidate == null ? ctx.noValidate : props.noValidate, _extends2)));
    });
  });
}, _Contexts.FORM_DATA.ERRORS | _Contexts.FORM_DATA.TOUCHED | _Contexts.FORM_DATA.SUBMITS | _Contexts.FORM_DATA.YUP_CONTEXT | _Contexts.FORM_DATA.NO_VALIDATE);

exports.default = _default;
module.exports = exports["default"];