var La = Object.create;
var Qn = Object.defineProperty;
var Fa = Object.getOwnPropertyDescriptor;
var Ua = Object.getOwnPropertyNames;
var za = Object.getPrototypeOf,
  Ba = Object.prototype.hasOwnProperty;
var Rt = ((e) =>
  typeof require < "u"
    ? require
    : typeof Proxy < "u"
      ? new Proxy(e, { get: (t, r) => (typeof require < "u" ? require : t)[r] })
      : e)(function (e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
});
var Va = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var Ha = (e, t, r, n) => {
  if ((t && typeof t == "object") || typeof t == "function")
    for (let o of Ua(t))
      !Ba.call(e, o) &&
        o !== r &&
        Qn(e, o, {
          get: () => t[o],
          enumerable: !(n = Fa(t, o)) || n.enumerable,
        });
  return e;
};
var Wa = (e, t, r) => (
  (r = e != null ? La(za(e)) : {}),
  Ha(
    t || !e || !e.__esModule
      ? Qn(r, "default", { value: e, enumerable: !0 })
      : r,
    e,
  )
);
var Sa = Va((Na, Hn) => {
  (function (e) {
    if (typeof Na == "object" && typeof Hn < "u") Hn.exports = e();
    else if (typeof define == "function" && define.amd) define([], e);
    else {
      var t;
      (typeof window < "u"
        ? (t = window)
        : typeof global < "u"
          ? (t = global)
          : typeof self < "u"
            ? (t = self)
            : (t = this),
        (t.GIF = e()));
    }
  })(function () {
    var e, t, r;
    return (function n(o, i, a) {
      function s(f, p) {
        if (!i[f]) {
          if (!o[f]) {
            var _ = typeof Rt == "function" && Rt;
            if (!p && _) return _(f, !0);
            if (c) return c(f, !0);
            var v = new Error("Cannot find module '" + f + "'");
            throw ((v.code = "MODULE_NOT_FOUND"), v);
          }
          var g = (i[f] = { exports: {} });
          o[f][0].call(
            g.exports,
            function (E) {
              var x = o[f][1][E];
              return s(x || E);
            },
            g,
            g.exports,
            n,
            o,
            i,
            a,
          );
        }
        return i[f].exports;
      }
      for (var c = typeof Rt == "function" && Rt, u = 0; u < a.length; u++)
        s(a[u]);
      return s;
    })(
      {
        1: [
          function (n, o, i) {
            function a() {
              ((this._events = this._events || {}),
                (this._maxListeners = this._maxListeners || void 0));
            }
            ((o.exports = a),
              (a.EventEmitter = a),
              (a.prototype._events = void 0),
              (a.prototype._maxListeners = void 0),
              (a.defaultMaxListeners = 10),
              (a.prototype.setMaxListeners = function (p) {
                if (!c(p) || p < 0 || isNaN(p))
                  throw TypeError("n must be a positive number");
                return ((this._maxListeners = p), this);
              }),
              (a.prototype.emit = function (p) {
                var _, v, g, E, x, b;
                if (
                  (this._events || (this._events = {}),
                  p === "error" &&
                    (!this._events.error ||
                      (u(this._events.error) && !this._events.error.length)))
                ) {
                  if (((_ = arguments[1]), _ instanceof Error)) throw _;
                  var w = new Error(
                    'Uncaught, unspecified "error" event. (' + _ + ")",
                  );
                  throw ((w.context = _), w);
                }
                if (((v = this._events[p]), f(v))) return !1;
                if (s(v))
                  switch (arguments.length) {
                    case 1:
                      v.call(this);
                      break;
                    case 2:
                      v.call(this, arguments[1]);
                      break;
                    case 3:
                      v.call(this, arguments[1], arguments[2]);
                      break;
                    default:
                      ((E = Array.prototype.slice.call(arguments, 1)),
                        v.apply(this, E));
                  }
                else if (u(v))
                  for (
                    E = Array.prototype.slice.call(arguments, 1),
                      b = v.slice(),
                      g = b.length,
                      x = 0;
                    x < g;
                    x++
                  )
                    b[x].apply(this, E);
                return !0;
              }),
              (a.prototype.addListener = function (p, _) {
                var v;
                if (!s(_)) throw TypeError("listener must be a function");
                return (
                  this._events || (this._events = {}),
                  this._events.newListener &&
                    this.emit("newListener", p, s(_.listener) ? _.listener : _),
                  this._events[p]
                    ? u(this._events[p])
                      ? this._events[p].push(_)
                      : (this._events[p] = [this._events[p], _])
                    : (this._events[p] = _),
                  u(this._events[p]) &&
                    !this._events[p].warned &&
                    (f(this._maxListeners)
                      ? (v = a.defaultMaxListeners)
                      : (v = this._maxListeners),
                    v &&
                      v > 0 &&
                      this._events[p].length > v &&
                      ((this._events[p].warned = !0),
                      console.error(
                        "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
                        this._events[p].length,
                      ),
                      typeof console.trace == "function" && console.trace())),
                  this
                );
              }),
              (a.prototype.on = a.prototype.addListener),
              (a.prototype.once = function (p, _) {
                if (!s(_)) throw TypeError("listener must be a function");
                var v = !1;
                function g() {
                  (this.removeListener(p, g),
                    v || ((v = !0), _.apply(this, arguments)));
                }
                return ((g.listener = _), this.on(p, g), this);
              }),
              (a.prototype.removeListener = function (p, _) {
                var v, g, E, x;
                if (!s(_)) throw TypeError("listener must be a function");
                if (!this._events || !this._events[p]) return this;
                if (
                  ((v = this._events[p]),
                  (E = v.length),
                  (g = -1),
                  v === _ || (s(v.listener) && v.listener === _))
                )
                  (delete this._events[p],
                    this._events.removeListener &&
                      this.emit("removeListener", p, _));
                else if (u(v)) {
                  for (x = E; x-- > 0; )
                    if (v[x] === _ || (v[x].listener && v[x].listener === _)) {
                      g = x;
                      break;
                    }
                  if (g < 0) return this;
                  (v.length === 1
                    ? ((v.length = 0), delete this._events[p])
                    : v.splice(g, 1),
                    this._events.removeListener &&
                      this.emit("removeListener", p, _));
                }
                return this;
              }),
              (a.prototype.removeAllListeners = function (p) {
                var _, v;
                if (!this._events) return this;
                if (!this._events.removeListener)
                  return (
                    arguments.length === 0
                      ? (this._events = {})
                      : this._events[p] && delete this._events[p],
                    this
                  );
                if (arguments.length === 0) {
                  for (_ in this._events)
                    _ !== "removeListener" && this.removeAllListeners(_);
                  return (
                    this.removeAllListeners("removeListener"),
                    (this._events = {}),
                    this
                  );
                }
                if (((v = this._events[p]), s(v))) this.removeListener(p, v);
                else if (v)
                  for (; v.length; ) this.removeListener(p, v[v.length - 1]);
                return (delete this._events[p], this);
              }),
              (a.prototype.listeners = function (p) {
                var _;
                return (
                  !this._events || !this._events[p]
                    ? (_ = [])
                    : s(this._events[p])
                      ? (_ = [this._events[p]])
                      : (_ = this._events[p].slice()),
                  _
                );
              }),
              (a.prototype.listenerCount = function (p) {
                if (this._events) {
                  var _ = this._events[p];
                  if (s(_)) return 1;
                  if (_) return _.length;
                }
                return 0;
              }),
              (a.listenerCount = function (p, _) {
                return p.listenerCount(_);
              }));
            function s(p) {
              return typeof p == "function";
            }
            function c(p) {
              return typeof p == "number";
            }
            function u(p) {
              return typeof p == "object" && p !== null;
            }
            function f(p) {
              return p === void 0;
            }
          },
          {},
        ],
        2: [
          function (n, o, i) {
            var a, s, c, u, f;
            ((f = navigator.userAgent.toLowerCase()),
              (u = navigator.platform.toLowerCase()),
              (a = f.match(
                /(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/,
              ) || [null, "unknown", 0]),
              (c = a[1] === "ie" && document.documentMode),
              (s = {
                name: a[1] === "version" ? a[3] : a[1],
                version:
                  c || parseFloat(a[1] === "opera" && a[4] ? a[4] : a[2]),
                platform: {
                  name: f.match(/ip(?:ad|od|hone)/)
                    ? "ios"
                    : (f.match(/(?:webos|android)/) ||
                        u.match(/mac|win|linux/) || ["other"])[0],
                },
              }),
              (s[s.name] = !0),
              (s[s.name + parseInt(s.version, 10)] = !0),
              (s.platform[s.platform.name] = !0),
              (o.exports = s));
          },
          {},
        ],
        3: [
          function (n, o, i) {
            var a,
              s,
              c,
              u = function (v, g) {
                for (var E in g) f.call(g, E) && (v[E] = g[E]);
                function x() {
                  this.constructor = v;
                }
                return (
                  (x.prototype = g.prototype),
                  (v.prototype = new x()),
                  (v.__super__ = g.prototype),
                  v
                );
              },
              f = {}.hasOwnProperty,
              p =
                [].indexOf ||
                function (v) {
                  for (var g = 0, E = this.length; g < E; g++)
                    if (g in this && this[g] === v) return g;
                  return -1;
                },
              _ = [].slice;
            ((a = n("events").EventEmitter),
              (c = n("./browser.coffee")),
              (s = (function (v) {
                var g, E;
                (u(x, v),
                  (g = {
                    workerScript: "gif.worker.js",
                    workers: 2,
                    repeat: 0,
                    background: "#fff",
                    quality: 10,
                    width: null,
                    height: null,
                    transparent: null,
                    debug: !1,
                    dither: !1,
                  }),
                  (E = { delay: 500, copy: !1 }));
                function x(b) {
                  var w, N, O;
                  ((this.running = !1),
                    (this.options = {}),
                    (this.frames = []),
                    (this.freeWorkers = []),
                    (this.activeWorkers = []),
                    this.setOptions(b));
                  for (N in g)
                    ((O = g[N]), (w = this.options)[N] == null && (w[N] = O));
                }
                return (
                  (x.prototype.setOption = function (b, w) {
                    if (
                      ((this.options[b] = w),
                      this._canvas != null && (b === "width" || b === "height"))
                    )
                      return (this._canvas[b] = w);
                  }),
                  (x.prototype.setOptions = function (b) {
                    var w, N, O;
                    N = [];
                    for (w in b)
                      f.call(b, w) &&
                        ((O = b[w]), N.push(this.setOption(w, O)));
                    return N;
                  }),
                  (x.prototype.addFrame = function (b, w) {
                    var N, O;
                    (w == null && (w = {}),
                      (N = {}),
                      (N.transparent = this.options.transparent));
                    for (O in E) N[O] = w[O] || E[O];
                    if (
                      (this.options.width == null &&
                        this.setOption("width", b.width),
                      this.options.height == null &&
                        this.setOption("height", b.height),
                      typeof ImageData < "u" &&
                        ImageData !== null &&
                        b instanceof ImageData)
                    )
                      N.data = b.data;
                    else if (
                      (typeof CanvasRenderingContext2D < "u" &&
                        CanvasRenderingContext2D !== null &&
                        b instanceof CanvasRenderingContext2D) ||
                      (typeof WebGLRenderingContext < "u" &&
                        WebGLRenderingContext !== null &&
                        b instanceof WebGLRenderingContext)
                    )
                      w.copy
                        ? (N.data = this.getContextData(b))
                        : (N.context = b);
                    else if (b.childNodes != null)
                      w.copy ? (N.data = this.getImageData(b)) : (N.image = b);
                    else throw new Error("Invalid image");
                    return this.frames.push(N);
                  }),
                  (x.prototype.render = function () {
                    var b, w, N, O;
                    if (this.running) throw new Error("Already running");
                    if (
                      this.options.width == null ||
                      this.options.height == null
                    )
                      throw new Error(
                        "Width and height must be set prior to rendering",
                      );
                    if (
                      ((this.running = !0),
                      (this.nextFrame = 0),
                      (this.finishedFrames = 0),
                      (this.imageParts = function () {
                        var L, G, J;
                        for (
                          J = [], b = L = 0, G = this.frames.length;
                          0 <= G ? L < G : L > G;
                          b = 0 <= G ? ++L : --L
                        )
                          J.push(null);
                        return J;
                      }.call(this)),
                      (N = this.spawnWorkers()),
                      this.options.globalPalette === !0)
                    )
                      this.renderNextFrame();
                    else
                      for (
                        b = w = 0, O = N;
                        0 <= O ? w < O : w > O;
                        b = 0 <= O ? ++w : --w
                      )
                        this.renderNextFrame();
                    return (this.emit("start"), this.emit("progress", 0));
                  }),
                  (x.prototype.abort = function () {
                    for (var b; (b = this.activeWorkers.shift()), b != null; )
                      (this.log("killing active worker"), b.terminate());
                    return ((this.running = !1), this.emit("abort"));
                  }),
                  (x.prototype.spawnWorkers = function () {
                    var b, w, N, O;
                    return (
                      (w = Math.min(this.options.workers, this.frames.length)),
                      function () {
                        O = [];
                        for (
                          var L = (N = this.freeWorkers.length);
                          N <= w ? L < w : L > w;
                          N <= w ? L++ : L--
                        )
                          O.push(L);
                        return O;
                      }
                        .apply(this)
                        .forEach(
                          (function (L) {
                            return function (G) {
                              var J;
                              return (
                                L.log("spawning worker " + G),
                                (J = new Worker(L.options.workerScript)),
                                (J.onmessage = function (_e) {
                                  return (
                                    L.activeWorkers.splice(
                                      L.activeWorkers.indexOf(J),
                                      1,
                                    ),
                                    L.freeWorkers.push(J),
                                    L.frameFinished(_e.data)
                                  );
                                }),
                                L.freeWorkers.push(J)
                              );
                            };
                          })(this),
                        ),
                      w
                    );
                  }),
                  (x.prototype.frameFinished = function (b) {
                    var w, N, O;
                    if (
                      (this.log(
                        "frame " +
                          b.index +
                          " finished - " +
                          this.activeWorkers.length +
                          " active",
                      ),
                      this.finishedFrames++,
                      this.emit(
                        "progress",
                        this.finishedFrames / this.frames.length,
                      ),
                      (this.imageParts[b.index] = b),
                      this.options.globalPalette === !0 &&
                        ((this.options.globalPalette = b.globalPalette),
                        this.log("global palette analyzed"),
                        this.frames.length > 2))
                    )
                      for (
                        w = N = 1, O = this.freeWorkers.length;
                        1 <= O ? N < O : N > O;
                        w = 1 <= O ? ++N : --N
                      )
                        this.renderNextFrame();
                    return p.call(this.imageParts, null) >= 0
                      ? this.renderNextFrame()
                      : this.finishRendering();
                  }),
                  (x.prototype.finishRendering = function () {
                    var b, w, N, O, L, G, J, _e, bt, ot, $e, ve, wt, Ve, Te, je;
                    for (
                      _e = 0, Ve = this.imageParts, L = 0, bt = Ve.length;
                      L < bt;
                      L++
                    )
                      ((w = Ve[L]),
                        (_e += (w.data.length - 1) * w.pageSize + w.cursor));
                    for (
                      _e += w.pageSize - w.cursor,
                        this.log(
                          "rendering finished - filesize " +
                            Math.round(_e / 1e3) +
                            "kb",
                        ),
                        b = new Uint8Array(_e),
                        ve = 0,
                        Te = this.imageParts,
                        G = 0,
                        ot = Te.length;
                      G < ot;
                      G++
                    )
                      for (
                        w = Te[G], je = w.data, N = J = 0, $e = je.length;
                        J < $e;
                        N = ++J
                      )
                        ((wt = je[N]),
                          b.set(wt, ve),
                          N === w.data.length - 1
                            ? (ve += w.cursor)
                            : (ve += w.pageSize));
                    return (
                      (O = new Blob([b], { type: "image/gif" })),
                      this.emit("finished", O, b)
                    );
                  }),
                  (x.prototype.renderNextFrame = function () {
                    var b, w, N;
                    if (this.freeWorkers.length === 0)
                      throw new Error("No free workers");
                    if (!(this.nextFrame >= this.frames.length))
                      return (
                        (b = this.frames[this.nextFrame++]),
                        (N = this.freeWorkers.shift()),
                        (w = this.getTask(b)),
                        this.log(
                          "starting frame " +
                            (w.index + 1) +
                            " of " +
                            this.frames.length,
                        ),
                        this.activeWorkers.push(N),
                        N.postMessage(w)
                      );
                  }),
                  (x.prototype.getContextData = function (b) {
                    return b.getImageData(
                      0,
                      0,
                      this.options.width,
                      this.options.height,
                    ).data;
                  }),
                  (x.prototype.getImageData = function (b) {
                    var w;
                    return (
                      this._canvas == null &&
                        ((this._canvas = document.createElement("canvas")),
                        (this._canvas.width = this.options.width),
                        (this._canvas.height = this.options.height)),
                      (w = this._canvas.getContext("2d")),
                      (w.setFill = this.options.background),
                      w.fillRect(0, 0, this.options.width, this.options.height),
                      w.drawImage(b, 0, 0),
                      this.getContextData(w)
                    );
                  }),
                  (x.prototype.getTask = function (b) {
                    var w, N;
                    if (
                      ((w = this.frames.indexOf(b)),
                      (N = {
                        index: w,
                        last: w === this.frames.length - 1,
                        delay: b.delay,
                        transparent: b.transparent,
                        width: this.options.width,
                        height: this.options.height,
                        quality: this.options.quality,
                        dither: this.options.dither,
                        globalPalette: this.options.globalPalette,
                        repeat: this.options.repeat,
                        canTransfer: c.name === "chrome",
                      }),
                      b.data != null)
                    )
                      N.data = b.data;
                    else if (b.context != null)
                      N.data = this.getContextData(b.context);
                    else if (b.image != null)
                      N.data = this.getImageData(b.image);
                    else throw new Error("Invalid frame");
                    return N;
                  }),
                  (x.prototype.log = function () {
                    var b;
                    if (
                      ((b = 1 <= arguments.length ? _.call(arguments, 0) : []),
                      !!this.options.debug)
                    )
                      return console.log.apply(console, b);
                  }),
                  x
                );
              })(a)),
              (o.exports = s));
          },
          { "./browser.coffee": 2, events: 1 },
        ],
      },
      {},
      [3],
    )(3);
  });
});
var eo = "1.0.0",
  Mt = "macros";
var to = {};
var ro = {};
var no = {
  "action.macros": "Macros",
  "macro.run": "Run",
  "macro.save_and_run": "Save & Run",
  "dialog.manage_macros": "Manage Macros",
  "dialog.edit_macro": "Edit Macro",
  "dialog.create_macro": "Create Macro",
  "dialog.add_action": "Add Action",
  "dialog.add": "Add",
  "dialog.delete": "Delete",
  "message.run_macro": "Running macro...",
  "message.unsupported_variant": "Can't run on this platform.",
  "message.macro_running": "Macro already running.",
  "macros.set_appearance": "Set Appearance",
  "macros.set_appearance.desc": "Changes the appearance mode.",
  "macros.set_appearance.turn": "$operation appearance $mode",
  "macros.set_appearance.toggle": "$operation appearance",
  "macros.take_screenshot": "Take Screenshot",
  "macros.take_screenshot.desc":
    "Capture a screenshot of the screen, canvas, or selected preview.",
  "macros.take_screenshot.summary": "Take screenshot",
  "macros.save_image": "Save Image",
  "macros.save_image.summary": "Save image as $name",
  "macros.choose_output_folder": "Choose Output Folder",
  "macros.choose_output_folder.summary": "Choose where to save files",
  "macros.get_project_items": "Get Project Items",
  "macros.get_project_items.summary": "Get $items",
  "macros.select_elements": "Select Elements",
  "macros.select_elements.summary": "$mode selection: $elements",
  "macros.filter_project_items": "Filter Project Items",
  "macros.filter_project_items.summary": "Find $items matching $name",
  "macros.get_element_property": "Get Element Property",
  "macros.get_element_property.summary": "Get $property of $element",
  "macros.set_element_property": "Set Element Property",
  "macros.set_element_property.summary": "Set $property of $element to $value",
  "macros.set_cube_dimension": "Set Cube Dimension",
  "macros.set_cube_dimension.summary": "Set $cube $axis size to $size",
  "macros.set_element_visibility": "Set Element Visibility",
  "macros.set_element_visibility.summary": "$mode $element",
  "macros.comment": "Comment",
  "macros.comment.summary": "Comment $text",
  "macros.show_content": "Show Content",
  "macros.show_content.summary": "Show $text",
  "macros.show_alert": "Show Alert",
  "macros.show_alert.summary": "Show alert $prompt",
  "macros.ask_input": "Ask Input",
  "macros.ask_input.summary": "Ask for $type with $value",
  "macros.count": "Count",
  "macros.count.summary": "Count $items in input",
  "macros.choose_from_menu": "Choose from Menu",
  "macros.choose_from_menu.summary": "Choose from menu with $prompt",
  "macros.if": "If",
  "macros.if.summary": "If $condition",
  "macros.repeat": "Repeat",
  "macros.repeat.summary": "Repeat $count",
  "macros.repeat_each": "Repeat Each",
  "macros.repeat_each.summary": "Repeat with each item in $items",
  "macros.try": "Try",
  "macros.try.summary": "Try actions",
  "macros.on_error": "On Error",
  "macros.on_error.summary": "Handle error",
  "macros.end_try": "End Try",
  "macros.end_try.summary": "End Try",
  "macros.wait": "Wait",
  "macros.wait.summary": "Wait $seconds",
  "macros.set_variable": "Set Variable",
  "macros.set_variable.summary": "Set variable $name to $input",
  "macros.get_variable": "Get Variable",
  "macros.get_variable.summary": "Get $name",
  "macros.add_variable": "Add Variable",
  "macros.add_variable.summary": "Add $input to $name",
  "macros.list": "List",
  "macros.list.summary": "List",
  "macros.sort_list": "Sort List",
  "macros.sort_list.summary": "Sort $items by $type $order",
  "macros.remove_duplicates": "Remove Duplicates",
  "macros.remove_duplicates.summary": "Remove duplicates from $items",
  "macros.join_list": "Join List",
  "macros.join_list.summary": "Join $items with $separator",
  "macros.choose_from_list": "Choose from List",
  "macros.choose_from_list.summary": "Choose from $list",
  "macros.get_from_list": "Get from List",
  "macros.get_from_list.summary": "Get $item from $items",
  "macros.dictionary": "Dictionary",
  "macros.dictionary.summary": "Dictionary",
  "macros.get_dictionary_keys": "Get Dictionary Keys",
  "macros.get_dictionary_keys.summary": "Get keys from $dictionary",
  "macros.merge_dictionaries": "Merge Dictionaries",
  "macros.merge_dictionaries.summary": "Merge $first and $second ($conflict)",
  "macros.get_dictionary_value": "Get Dictionary Value",
  "macros.get_dictionary_value.summary": "Get $value for $key in $dictionary",
  "macros.set_dictionary_value": "Set Dictionary Value",
  "macros.set_dictionary_value.summary": "Set $key to $value in $dictionary",
  "macros.get_dictionary_from": "Get Dictionary From",
  "macros.get_dictionary_from.summary": "Get dictionary from $input",
  "macros.number": "Number",
  "macros.number.summary": "$number",
  "macros.random_number": "Random Number",
  "macros.random_number.summary": "Random number between $minimum and $maximum",
  "macros.round_number": "Round Number",
  "macros.round_number.summary": "Round $number to $type",
  "macros.format_number": "Format Number",
  "macros.format_number.summary": "Format $number to $decimals",
  "macros.get_numbers_input": "Get Numbers Input",
  "macros.get_numbers_input.summary": "Get numbers from $input",
  "macros.calculate": "Calculate",
  "macros.calculate.summary": "$number1 $operator $number2",
  "macros.calculate_expression": "Calculate Expression",
  "macros.calculate_expression.summary": "Calculate $expression",
  "macros.calculate_statistics": "Calculate Statistics",
  "macros.calculate_statistics.summary": "Calculate the $type of $result",
  "macros.measurement": "Measurement",
  "macros.measurement.summary": "$length $value $type",
  "macros.convert_measurement": "Convert Measurement",
  "macros.convert_measurement.summary":
    "Convert $unit into $length in $measurement",
  "macros.date": "Date",
  "macros.date.summary": "$date",
  "macros.format_date": "Format Date",
  "macros.format_date.summary": "Format $date",
  "macros.adjust_date": "Adjust Date",
  "macros.adjust_date.summary": "$operation $value $time to $formatted",
  "macros.get_time_between_dates": "Get Time between Dates",
  "macros.get_time_between_dates.summary":
    "Get $time between $date1 and $date2",
  "macros.get_dates_input": "Get Dates Input",
  "macros.get_dates_input.summary": "Get dates from $date",
  "macros.convert_time_zone": "Convert Time Zone",
  "macros.convert_time_zone.summary":
    "Convert $date from $time_zone to $result",
  "macros.text": "Text",
  "macros.text.summary": "Text",
  "macros.get_text_input": "Get Text Input",
  "macros.get_text_input.summary": "Get text from $input",
  "macros.show_definition": "Show Definition",
  "macros.show_definition.summary": "Show definition if $word",
  "macros.get_name_emoji": "Get Name Emoji",
  "macros.get_name_emoji.summary": "Get name of emoji in $text",
  "macros.change_case": "Change Case",
  "macros.change_case.summary": "Change $text to $case",
  "macros.combine_text": "Combine Text",
  "macros.combine_text.summary": "Combine $texts with $delemeter",
  "macros.split_text": "Split Text",
  "macros.split_text.summary": "Split $text by $delemeter",
  "macros.replace_text": "Replace Text",
  "macros.replace_text.summary": "Replace $text1 with $text2 in $text",
  "macros.trim_whitespace": "Trim Whitespace",
  "macros.trim_whitespace.summary": "Trim whitespace from $text",
  "macros.match_text": "Match Text",
  "macros.match_text.summary": "Match $regex in $text",
  "macros.get_group_from_matched_text": "Get Group From Matched Text",
  "macros.get_group_from_matched_text.summary": "Get $group $index in $regex",
  "macros.correct_spelling": "Correct Spelling",
  "macros.correct_spelling.summary": "Correct spelling of $text",
  "macros.speak_text": "Speak Text",
  "macros.speak_text.summary": "Speak $text",
  "macros.make_spoken_audio_from_text": "Make Spoken Audio From Text",
  "macros.make_spoken_audio_from_text.summary": "Make spoken audio from $text",
  "macros.detect_language": "Detect Language",
  "macros.detect_language.summary": "Detect language of $text",
  "macros.translate_text": "Translate Text",
  "macros.translate_text.summary":
    "Translate $text from $from_language to $to_language",
  "macros.get_name": "Get Name",
  "macros.get_name.summary": "Get name of $item",
  "macros.get_type": "Get Type",
  "macros.get_type.summary": "Get type of $item",
  "macros.set_name": "Set Name",
  "macros.set_name.summary": "Set name of $input to $name",
  "macros.show_content_graph": "Show Content Graph",
  "macros.show_content_graph.summary": "Show Content Graph of $input",
  "macros.get_actions": "Get Actions",
  "macros.get_actions.summary": "Get actions from $macro",
  "macros.run_macro": "Run Macro",
  "macros.run_macro.summary": "Run $macro with $input",
  "macros.run_action": "Run Action",
  "macros.run_action.summary": "Run $macro",
  "macros.get_whats_on_screen": "Get What's on Screen",
  "macros.get_whats_on_screen.summary": "Get What's on screen",
  "macros.base64_encode": "Base64 Encode",
  "macros.base64_encode.summary": "$encoding $input with $base64",
  "macros.generate_hash": "Generate Hash",
  "macros.generate_hash.summary": "Generate $type hash of $input",
  "macros.format_file_size": "Format File Size",
  "macros.format_file_size.summary": "Format $file_size into $unit",
  "macros.stop_and_output": "Stop and Output",
  "macros.stop_and_output.summary": "Stop and output $result",
  "macros.stop": "Stop",
  "macros.stop.summary": "Stop this macro",
  "macros.wait_to_return": "Wait to Return",
  "macros.wait_to_return.summary": "Wait to return",
  "macros.run_script_over_ssh": "Run Script Over SSH",
  "macros.run_script_over_ssh.summary": "Run script over SSH",
  "macros.open_x_callback_url": "Open X Callback URL",
  "macros.open_x_callback_url.summary": "Open $url with x-callback",
  "macros.nothing": "Nothing",
  "macros.nothing.summary": "Nothing",
  "macros.add_flag": "Add Flag",
  "macros.add_flag.summary": "Add $flag",
  "macros.remove_flag": "Remove Flag",
  "macros.remove_flag.summary": "Remove $flag",
  "macros.get_flags": "Get Flags",
  "macros.get_flags.summary": "",
  "macros.get_setting_value": "Get Setting Value",
  "macros.get_setting_value.summary": "Get $setting",
  "macros.set_setting_value": "Set Setting Value",
  "macros.set_setting_value.summary": "Set $setting to $value",
  "macros.select_project": "Select Project",
  "macros.select_project.summary": "Select $project",
  "macros.close_project": "Close Project",
  "macros.close_project.summary": "Close $project",
  "macros.export_project": "Export Project",
  "macros.export_project.summary": "Export $project as $export",
  "macros.import_project": "Import Project",
  "macros.import_project.summary": "Import $project from $file",
  "macros.convert_format": "Convert Format",
  "macros.convert_format.summary": "Convert $project to $format",
  "macros.trigger_blockbench_action": "Trigger Blockbench Action",
  "macros.trigger_blockbench_action.summary": "Trigger $action",
  "macros.add_animation": "Add Animation",
  "macros.add_animation.summary": "Add $animation to $project",
  "macros.remove_animation": "Remove Animation",
  "macros.remove_animation.summary": "Remove $animation from $project",
  "macros.add_cube": "Add Cube",
  "macros.add_cube.summary": "Add $cube to $project",
  "macros.remove_cube": "Remove Cube",
  "macros.remove_cube.summary": "Remove $cube from $project",
  "macros.add_group": "Add Group",
  "macros.add_group.summary": "Add $group to $project",
  "macros.remove_group": "Remove Group",
  "macros.remove_group.summary": "Remove $group from $project",
  "macros.open_group": "Open Group",
  "macros.open_group.summary": "Open $group from $project",
  "macros.on_event": "On Event",
  "macros.on_event.summary": "On $event",
  "macros.show_preview_scene": "Show Preview Scene",
  "macros.show_preview_scene.summary": "Show $preview scene",
  "macros.add_texture_group": "Add Texture Group",
  "macros.add_texture_group.summary": "Add $group to $project",
  "macros.remove_texture_group": "Remove Texture Group",
  "macros.remove_texture_group.summary": "Remove $group from $project",
  "macros.add_texture_layer": "Add Texture Layer",
  "macros.add_texture_layer.summary": "Add $layer to $project",
  "macros.remove_texture_layer": "Remove Texture Layer",
  "macros.remove_texture_layer.summary": "Remove $layer from $project",
  "macros.select_file": "Select File",
  "macros.select_file.summary": "Select $file",
  "macros.move_file": "Move File",
  "macros.move_file.summary": "Move $src to $dest",
  "macros.rename_file": "Rename File",
  "macros.rename_file.summary": "Rename $file to $name",
  "macros.save_file": "Save File",
  "macros.save_file.summary": "Save $file",
  "macros.delete_file": "Delete File",
  "macros.delete_file.summary": "Delete $file",
  "macros.create_folder": "Create Folder",
  "macros.create_folder.summary": "Create folder in $name at $path",
  "macros.get_contents_of_folder": "Get Contents of Folder",
  "macros.get_contents_of_folder.summary": "Get contents of $folder",
  "macros.find_files": "Find Files",
  "macros.find_files.summary": "Find $name_pattern files in $folder",
  "macros.get_file_from_folder": "Get File from Folder",
  "macros.get_file_from_folder.summary": "Get file from $folder at path $name",
  "macros.append_to_text_file": "Append to Text File",
  "macros.append_to_text_file.summary": "$operation $text to $name",
  "macros.make_archive": "Make Archive",
  "macros.make_archive.summary": "Make $type archive from $input",
  "macros.extract_archive": "Extract Archive",
  "macros.extract_archive.summary": "Extract $archive",
  "macros.open_file": "Open File",
  "macros.open_file.summary": "Open $file in $app",
  "macros.get_details_of_files": "Get Details of Files",
  "macros.get_details_of_files.summary": "Get $detail from $file",
  "macros.filter_files": "Filter Files",
  "macros.filter_files.summary": "Filter $file",
  "macros.convert_image": "Convert Image",
  "macros.convert_image.summary": "Convert $image to $format",
  "macros.filter_images": "Filter Image",
  "macros.filter_images.summary": "Filter $images",
  "macros.get_details_of_image": "Get Details of Image",
  "macros.get_details_of_image.summary": "Get $detail from $image",
  "macros.get_image_from_input": "Get Image from Input",
  "macros.get_image_from_input.summary": "Get images from $input",
  "macros.make_image_from_rich_text": "Make Image from Rich Text",
  "macros.make_image_from_rich_text.summary": "Make image from $text",
  "macros.extract_text_from_image": "Extract Text from Image",
  "macros.extract_text_from_image.summary": "Extract text from $image",
  "macros.markup": "Markup",
  "macros.markup.summary": "Mark up $document",
  "macros.combine_images": "Combine Images",
  "macros.combine_images.summary": "Combine $images $orientation",
  "macros.crop_image": "Crop Image",
  "macros.crop_image.summary": "Crop $image",
  "macros.flip_image": "Flip Image",
  "macros.flip_image.summary": "Flip $image $orientation",
  "macros.mask_image": "Mask Image",
  "macros.mask_image.summary": "Mask $image with $shape shape",
  "macros.overlay_image": "Overlay Image",
  "macros.overlay_image.summary": "Overlay $image1 from $image2",
  "macros.overlay_text": "Overlay Text",
  "macros.overlay_text.summary": "Overlay $text on $image at $location",
  "macros.resize_image": "Resize Image",
  "macros.resize_image.summary": "Resize $image to $width x $height",
  "macros.rotate_image": "Rotate Image",
  "macros.rotate_image.summary": "Rotate $image by $rotate degrees",
  "macros.remove_image_background": "Remove Image Background",
  "macros.remove_image_background.summary":
    "Remove image background from $image",
  "macros.make_gif": "Make GIF",
  "macros.make_gif.summary": "Make GIF from $content",
  "macros.get_frames_from_image": "Get Frames from Image",
  "macros.get_frames_from_image.summary": "Get frames from $image",
  "macros.share": "Share",
  "macros.share.summary": "Share $input",
  "macros.copy_to_clipboard": "Copy to Clipboard",
  "macros.copy_to_clipboard.summary": "Copy $content to clipboard",
  "macros.get_clipboard": "Get Clipboard",
  "macros.get_clipboard.summary": "Get clipboard",
  "macros.create_qr_code": "Create QR Code",
  "macros.create_qr_code.summary": "Create QR code for $text",
  "macros.search_web": "Search Web",
  "macros.search_web.summary": "Search $engine for $text",
  "macros.open_urls": "Open URLs",
  "macros.open_urls.summary": "Open $url",
  "macros.get_items_from_rss_feed": "Get Items from RSS Feed",
  "macros.get_items_from_rss_feed.summary": "Get $count from $url",
  "macros.get_rss_feeds_from_page": "Get RSS Feeds from Page",
  "macros.get_rss_feeds_from_page.summary": "Get RSS feeds from $page",
  "macros.url": "URL",
  "macros.url.summary": "$value",
  "macros.url_encode": "URL Encode",
  "macros.url_encode.summary": "URL $encoder $text",
  "macros.get_urls_from_input": "Get URLs from input",
  "macros.get_urls_from_input.summary": "Get URLs from $input",
  "macros.get_component_of_url": "Get Component of URL",
  "macros.get_component_of_url.summary": "Get $scheme from $url",
  "macros.expand_url": "Expand URL",
  "macros.expand_url.summary": "Expand $url",
  "macros.get_contents_of_url": "Get Contents of URL",
  "macros.get_contents_of_url.summary": "Get contents of $url",
  "macros.get_headers_of_url": "Get Headers of $url",
  "macros.get_headers_of_url.summary": "Get headers of $url",
  "macros.get_contents_of_web_page": "Get Contents of Web Page",
  "macros.get_contents_of_web_page.summary": "Get contents of $url",
  "macros.pin_tab": "Pin Tab",
  "macros.pin_tab.summary": "Pin $project",
  "macros.unpin_tab": "Unpin Tab",
  "macros.unpin_tab.summary": "Unpin $project",
  "macros.category.blockbench": "Blockbench",
  "macros.category.controls": "Controls",
  "macros.category.desktop": "Desktop",
  "macros.category.media": "Media",
  "macros.category.scripting": "Scripting",
  "macros.category.web": "Web",
};
var oo = {};
var io = {};
var ao = {};
var so = {};
var co = {};
var uo = {};
var lo = {};
var po = {};
var fo = {};
var mo = {};
var go = {};
var ho = {};
var _o = {};
var vo = {};
Language.addTranslations("cz", to);
Language.addTranslations("de", ro);
Language.addTranslations("en", no);
Language.addTranslations("es", oo);
Language.addTranslations("fr", io);
Language.addTranslations("it", ao);
Language.addTranslations("ja", so);
Language.addTranslations("ko", co);
Language.addTranslations("nl", uo);
Language.addTranslations("pl", lo);
Language.addTranslations("pt", po);
Language.addTranslations("ru", fo);
Language.addTranslations("sv", mo);
Language.addTranslations("uk", go);
Language.addTranslations("vi", ho);
Language.addTranslations("zh_tw", _o);
Language.addTranslations("zh", vo);
var yo = {
  name: "Test",
  icon: "play_arrow",
  intents: [
    {
      type: "ask_input",
      uuid: "6014b958-184f-44b9-a7f7-8a7c9544f7fa",
      params: {},
    },
    {
      type: "show_content",
      uuid: "6014b958-184f-44b9-a7f7-8a7c9544f7fa",
      params: { text: "$result" },
    },
  ],
};
var jr = {
  name: "Export All",
  icon: "insert_drive_file",
  intents: [
    {
      type: "get_project_items",
      uuid: "cb528404-54af-4fad-88f3-860905b464fa",
      params: { items: "projects" },
    },
    {
      type: "repeat_each",
      uuid: "388113f7-71ac-445c-9e8a-d467e0cbe4e5",
      params: { items: "$result" },
    },
    {
      type: "export_project",
      uuid: "17094441-421e-46d6-89d0-96a25036784d",
      params: { project: "$item", export: "project" },
    },
    {
      type: "end_repeat_each",
      uuid: "482bd3c6-62bd-44e6-900a-75a763005862",
      params: {},
    },
  ],
};
var Pr = {
  name: "Randomize Height",
  icon: "bar_chart",
  intents: [
    {
      type: "get_project_items",
      uuid: "ba0463f8-12ed-4ddd-82ef-0674137ad595",
      params: { items: "selected_cubes" },
    },
    {
      type: "repeat_each",
      uuid: "f1768986-d4ec-4819-a893-d6c8462037c7",
      params: { items: "$result" },
    },
    {
      type: "random_number",
      uuid: "3b3d84af-36ba-4f70-b5ec-bc3e65b59481",
      params: { min: 1, max: 16 },
    },
    {
      type: "set_cube_dimension",
      uuid: "4c394fa5-2204-41c1-96b1-6b4e517acc04",
      params: { cube: "$item", axis: "y", size: "$result" },
    },
    {
      type: "end_repeat_each",
      uuid: "70785570-9cd0-46fd-a279-c59568321a35",
      params: {},
    },
  ],
};
var Qt = {
  name: "Render Projects",
  icon: "movie",
  intents: [
    {
      type: "get_project_items",
      uuid: "6c4f4bef-d87d-49fd-ba85-bc2a0aa68bcd",
      params: { items: "projects" },
    },
    {
      type: "set_variable",
      uuid: "f5f9795d-267f-4507-b13e-1d7c1d25354e",
      params: { name: "render_projects", input: "$result" },
    },
    {
      type: "choose_output_folder",
      uuid: "6d40a245-3907-42b0-aa0b-96453af24669",
      params: {},
    },
    {
      type: "set_variable",
      uuid: "94e3dd0b-f36d-4538-839c-e55a28f09439",
      params: { name: "render_folder", input: "$result" },
    },
    {
      type: "repeat_each",
      uuid: "95ab83b2-7c9d-488c-8ea4-eb83dbe6da22",
      params: { items: "$input:f5f9795d-267f-4507-b13e-1d7c1d25354e:input" },
    },
    {
      type: "select_project",
      uuid: "9d575951-b103-4d97-b82e-62316214aba6",
      params: { project: "$item" },
    },
    {
      type: "set_variable",
      uuid: "963d7cf9-aeec-47c4-a813-d65db81881ce",
      params: { name: "render_project_name", input: "$result" },
    },
    {
      type: "wait",
      uuid: "52da01ef-23ad-4e51-a3e2-849bde60e3f9",
      params: { seconds: 0.1 },
    },
    {
      type: "take_screenshot",
      uuid: "4ccf70e3-aae2-4d5e-a6f7-c2e190535d96",
      params: { source: "clean" },
    },
    {
      type: "save_image",
      uuid: "6e395c6a-3fd2-49c3-a277-9ae7e3bb3ff5",
      params: {
        image: "$result",
        name: "$input:963d7cf9-aeec-47c4-a813-d65db81881ce:input",
        folder: "$input:94e3dd0b-f36d-4538-839c-e55a28f09439:input",
      },
    },
    {
      type: "end_repeat_each",
      uuid: "9d4d4971-28b7-420c-9f03-3c823cfaeea9",
      params: {},
    },
  ],
};
var ye = Object.freeze({}),
  R = Array.isArray;
function A(e) {
  return e == null;
}
function h(e) {
  return e != null;
}
function Z(e) {
  return e === !0;
}
function ds(e) {
  return e === !1;
}
function Jt(e) {
  return (
    typeof e == "string" ||
    typeof e == "number" ||
    typeof e == "symbol" ||
    typeof e == "boolean"
  );
}
function K(e) {
  return typeof e == "function";
}
function ne(e) {
  return e !== null && typeof e == "object";
}
var mn = Object.prototype.toString;
function be(e) {
  return mn.call(e) === "[object Object]";
}
function di(e) {
  return mn.call(e) === "[object RegExp]";
}
function mi(e) {
  var t = parseFloat(String(e));
  return t >= 0 && Math.floor(t) === t && isFinite(e);
}
function qr(e) {
  return h(e) && typeof e.then == "function" && typeof e.catch == "function";
}
function ms(e) {
  return e == null
    ? ""
    : Array.isArray(e) || (be(e) && e.toString === mn)
      ? JSON.stringify(e, gs, 2)
      : String(e);
}
function gs(e, t) {
  return t && t.__v_isRef ? t.value : t;
}
function Bt(e) {
  var t = parseFloat(e);
  return isNaN(t) ? e : t;
}
function Oe(e, t) {
  for (var r = Object.create(null), n = e.split(","), o = 0; o < n.length; o++)
    r[n[o]] = !0;
  return t
    ? function (i) {
        return r[i.toLowerCase()];
      }
    : function (i) {
        return r[i];
      };
}
var xp = Oe("slot,component", !0),
  hs = Oe("key,ref,slot,slot-scope,is");
function Xe(e, t) {
  var r = e.length;
  if (r) {
    if (t === e[r - 1]) {
      e.length = r - 1;
      return;
    }
    var n = e.indexOf(t);
    if (n > -1) return e.splice(n, 1);
  }
}
var _s = Object.prototype.hasOwnProperty;
function ae(e, t) {
  return _s.call(e, t);
}
function vt(e) {
  var t = Object.create(null);
  return function (n) {
    var o = t[n];
    return o || (t[n] = e(n));
  };
}
var vs = /-(\w)/g,
  dt = vt(function (e) {
    return e.replace(vs, function (t, r) {
      return r ? r.toUpperCase() : "";
    });
  }),
  ys = vt(function (e) {
    return e.charAt(0).toUpperCase() + e.slice(1);
  }),
  bs = /\B([A-Z])/g,
  Kt = vt(function (e) {
    return e.replace(bs, "-$1").toLowerCase();
  });
function ws(e, t) {
  function r(n) {
    var o = arguments.length;
    return o ? (o > 1 ? e.apply(t, arguments) : e.call(t, n)) : e.call(t);
  }
  return ((r._length = e.length), r);
}
function xs(e, t) {
  return e.bind(t);
}
var gi = Function.prototype.bind ? xs : ws;
function Jr(e, t) {
  t = t || 0;
  for (var r = e.length - t, n = new Array(r); r--; ) n[r] = e[r + t];
  return n;
}
function q(e, t) {
  for (var r in t) e[r] = t[r];
  return e;
}
function hi(e) {
  for (var t = {}, r = 0; r < e.length; r++) e[r] && q(t, e[r]);
  return t;
}
function ee(e, t, r) {}
var er = function (e, t, r) {
    return !1;
  },
  _i = function (e) {
    return e;
  };
function mt(e, t) {
  if (e === t) return !0;
  var r = ne(e),
    n = ne(t);
  if (r && n)
    try {
      var o = Array.isArray(e),
        i = Array.isArray(t);
      if (o && i)
        return (
          e.length === t.length &&
          e.every(function (c, u) {
            return mt(c, t[u]);
          })
        );
      if (e instanceof Date && t instanceof Date)
        return e.getTime() === t.getTime();
      if (!o && !i) {
        var a = Object.keys(e),
          s = Object.keys(t);
        return (
          a.length === s.length &&
          a.every(function (c) {
            return mt(e[c], t[c]);
          })
        );
      } else return !1;
    } catch {
      return !1;
    }
  else return !r && !n ? String(e) === String(t) : !1;
}
function vi(e, t) {
  for (var r = 0; r < e.length; r++) if (mt(e[r], t)) return r;
  return -1;
}
function dr(e) {
  var t = !1;
  return function () {
    t || ((t = !0), e.apply(this, arguments));
  };
}
function Es(e, t) {
  return e === t ? e === 0 && 1 / e !== 1 / t : e === e || t === t;
}
var bo = "data-server-rendered",
  $r = ["component", "directive", "filter"],
  yi = [
    "beforeCreate",
    "created",
    "beforeMount",
    "mounted",
    "beforeUpdate",
    "updated",
    "beforeDestroy",
    "destroyed",
    "activated",
    "deactivated",
    "errorCaptured",
    "serverPrefetch",
    "renderTracked",
    "renderTriggered",
  ],
  se = {
    optionMergeStrategies: Object.create(null),
    silent: !1,
    productionTip: !1,
    devtools: !1,
    performance: !1,
    errorHandler: null,
    warnHandler: null,
    ignoredElements: [],
    keyCodes: Object.create(null),
    isReservedTag: er,
    isReservedAttr: er,
    isUnknownElement: er,
    getTagNamespace: ee,
    parsePlatformTagName: _i,
    mustUseProp: er,
    async: !0,
    _lifecycleHooks: yi,
  },
  ks =
    /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
function bi(e) {
  var t = (e + "").charCodeAt(0);
  return t === 36 || t === 95;
}
function qe(e, t, r, n) {
  Object.defineProperty(e, t, {
    value: r,
    enumerable: !!n,
    writable: !0,
    configurable: !0,
  });
}
var $s = new RegExp("[^".concat(ks.source, ".$_\\d]"));
function Ns(e) {
  if (!$s.test(e)) {
    var t = e.split(".");
    return function (r) {
      for (var n = 0; n < t.length; n++) {
        if (!r) return;
        r = r[t[n]];
      }
      return r;
    };
  }
}
var Ss = "__proto__" in {},
  xe = typeof window < "u",
  oe = xe && window.navigator.userAgent.toLowerCase(),
  Ct = oe && /msie|trident/.test(oe),
  It = oe && oe.indexOf("msie 9.0") > 0,
  gn = oe && oe.indexOf("edge/") > 0;
oe && oe.indexOf("android") > 0;
var Cs = oe && /iphone|ipad|ipod|ios/.test(oe);
oe && /chrome\/\d+/.test(oe);
oe && /phantomjs/.test(oe);
var wo = oe && oe.match(/firefox\/(\d+)/),
  Kr = {}.watch,
  wi = !1;
if (xe)
  try {
    ((Lr = {}),
      Object.defineProperty(Lr, "passive", {
        get: function () {
          wi = !0;
        },
      }),
      window.addEventListener("test-passive", null, Lr));
  } catch {}
var Lr,
  tr,
  Zt = function () {
    return (
      tr === void 0 &&
        (!xe && typeof global < "u"
          ? (tr = global.process && global.process.env.VUE_ENV === "server")
          : (tr = !1)),
      tr
    );
  },
  mr = xe && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
function St(e) {
  return typeof e == "function" && /native code/.test(e.toString());
}
var Yt =
    typeof Symbol < "u" &&
    St(Symbol) &&
    typeof Reflect < "u" &&
    St(Reflect.ownKeys),
  Vt;
typeof Set < "u" && St(Set)
  ? (Vt = Set)
  : (Vt = (function () {
      function e() {
        this.set = Object.create(null);
      }
      return (
        (e.prototype.has = function (t) {
          return this.set[t] === !0;
        }),
        (e.prototype.add = function (t) {
          this.set[t] = !0;
        }),
        (e.prototype.clear = function () {
          this.set = Object.create(null);
        }),
        e
      );
    })());
var ut = null;
function Je(e) {
  (e === void 0 && (e = null),
    e || (ut && ut._scope.off()),
    (ut = e),
    e && e._scope.on());
}
var we = (function () {
    function e(t, r, n, o, i, a, s, c) {
      ((this.tag = t),
        (this.data = r),
        (this.children = n),
        (this.text = o),
        (this.elm = i),
        (this.ns = void 0),
        (this.context = a),
        (this.fnContext = void 0),
        (this.fnOptions = void 0),
        (this.fnScopeId = void 0),
        (this.key = r && r.key),
        (this.componentOptions = s),
        (this.componentInstance = void 0),
        (this.parent = void 0),
        (this.raw = !1),
        (this.isStatic = !1),
        (this.isRootInsert = !0),
        (this.isComment = !1),
        (this.isCloned = !1),
        (this.isOnce = !1),
        (this.asyncFactory = c),
        (this.asyncMeta = void 0),
        (this.isAsyncPlaceholder = !1));
    }
    return (
      Object.defineProperty(e.prototype, "child", {
        get: function () {
          return this.componentInstance;
        },
        enumerable: !1,
        configurable: !0,
      }),
      e
    );
  })(),
  lt = function (e) {
    e === void 0 && (e = "");
    var t = new we();
    return ((t.text = e), (t.isComment = !0), t);
  };
function kt(e) {
  return new we(void 0, void 0, void 0, String(e));
}
function Zr(e) {
  var t = new we(
    e.tag,
    e.data,
    e.children && e.children.slice(),
    e.text,
    e.elm,
    e.context,
    e.componentOptions,
    e.asyncFactory,
  );
  return (
    (t.ns = e.ns),
    (t.isStatic = e.isStatic),
    (t.key = e.key),
    (t.isComment = e.isComment),
    (t.fnContext = e.fnContext),
    (t.fnOptions = e.fnOptions),
    (t.fnScopeId = e.fnScopeId),
    (t.asyncMeta = e.asyncMeta),
    (t.isCloned = !0),
    t
  );
}
var Is = 0,
  cr = [],
  Ds = function () {
    for (var e = 0; e < cr.length; e++) {
      var t = cr[e];
      ((t.subs = t.subs.filter(function (r) {
        return r;
      })),
        (t._pending = !1));
    }
    cr.length = 0;
  },
  Ke = (function () {
    function e() {
      ((this._pending = !1), (this.id = Is++), (this.subs = []));
    }
    return (
      (e.prototype.addSub = function (t) {
        this.subs.push(t);
      }),
      (e.prototype.removeSub = function (t) {
        ((this.subs[this.subs.indexOf(t)] = null),
          this._pending || ((this._pending = !0), cr.push(this)));
      }),
      (e.prototype.depend = function (t) {
        e.target && e.target.addDep(this);
      }),
      (e.prototype.notify = function (t) {
        for (
          var r = this.subs.filter(function (a) {
              return a;
            }),
            n = 0,
            o = r.length;
          n < o;
          n++
        ) {
          var i = r[n];
          i.update();
        }
      }),
      e
    );
  })();
Ke.target = null;
var ur = [];
function Dt(e) {
  (ur.push(e), (Ke.target = e));
}
function Ot() {
  (ur.pop(), (Ke.target = ur[ur.length - 1]));
}
var xi = Array.prototype,
  gr = Object.create(xi),
  Os = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];
Os.forEach(function (e) {
  var t = xi[e];
  qe(gr, e, function () {
    for (var n = [], o = 0; o < arguments.length; o++) n[o] = arguments[o];
    var i = t.apply(this, n),
      a = this.__ob__,
      s;
    switch (e) {
      case "push":
      case "unshift":
        s = n;
        break;
      case "splice":
        s = n.slice(2);
        break;
    }
    return (s && a.observeArray(s), a.dep.notify(), i);
  });
});
var xo = Object.getOwnPropertyNames(gr),
  Ei = {},
  hn = !0;
function Ze(e) {
  hn = e;
}
var Ts = { notify: ee, depend: ee, addSub: ee, removeSub: ee },
  Eo = (function () {
    function e(t, r, n) {
      if (
        (r === void 0 && (r = !1),
        n === void 0 && (n = !1),
        (this.value = t),
        (this.shallow = r),
        (this.mock = n),
        (this.dep = n ? Ts : new Ke()),
        (this.vmCount = 0),
        qe(t, "__ob__", this),
        R(t))
      ) {
        if (!n)
          if (Ss) t.__proto__ = gr;
          else
            for (var o = 0, i = xo.length; o < i; o++) {
              var a = xo[o];
              qe(t, a, gr[a]);
            }
        r || this.observeArray(t);
      } else
        for (var s = Object.keys(t), o = 0; o < s.length; o++) {
          var a = s[o];
          gt(t, a, Ei, void 0, r, n);
        }
    }
    return (
      (e.prototype.observeArray = function (t) {
        for (var r = 0, n = t.length; r < n; r++) Fe(t[r], !1, this.mock);
      }),
      e
    );
  })();
function Fe(e, t, r) {
  if (e && ae(e, "__ob__") && e.__ob__ instanceof Eo) return e.__ob__;
  if (
    hn &&
    (r || !Zt()) &&
    (R(e) || be(e)) &&
    Object.isExtensible(e) &&
    !e.__v_skip &&
    !Re(e) &&
    !(e instanceof we)
  )
    return new Eo(e, t, r);
}
function gt(e, t, r, n, o, i, a) {
  a === void 0 && (a = !1);
  var s = new Ke(),
    c = Object.getOwnPropertyDescriptor(e, t);
  if (!(c && c.configurable === !1)) {
    var u = c && c.get,
      f = c && c.set;
    (!u || f) && (r === Ei || arguments.length === 2) && (r = e[t]);
    var p = o ? r && r.__ob__ : Fe(r, !1, i);
    return (
      Object.defineProperty(e, t, {
        enumerable: !0,
        configurable: !0,
        get: function () {
          var v = u ? u.call(e) : r;
          return (
            Ke.target && (s.depend(), p && (p.dep.depend(), R(v) && $i(v))),
            Re(v) && !o ? v.value : v
          );
        },
        set: function (v) {
          var g = u ? u.call(e) : r;
          if (Es(g, v)) {
            if (f) f.call(e, v);
            else {
              if (u) return;
              if (!o && Re(g) && !Re(v)) {
                g.value = v;
                return;
              } else r = v;
            }
            ((p = o ? v && v.__ob__ : Fe(v, !1, i)), s.notify());
          }
        },
      }),
      s
    );
  }
}
function _n(e, t, r) {
  if (!yn(e)) {
    var n = e.__ob__;
    return R(e) && mi(t)
      ? ((e.length = Math.max(e.length, t)),
        e.splice(t, 1, r),
        n && !n.shallow && n.mock && Fe(r, !1, !0),
        r)
      : t in e && !(t in Object.prototype)
        ? ((e[t] = r), r)
        : e._isVue || (n && n.vmCount)
          ? r
          : n
            ? (gt(n.value, t, r, void 0, n.shallow, n.mock), n.dep.notify(), r)
            : ((e[t] = r), r);
  }
}
function ki(e, t) {
  if (R(e) && mi(t)) {
    e.splice(t, 1);
    return;
  }
  var r = e.__ob__;
  e._isVue ||
    (r && r.vmCount) ||
    yn(e) ||
    (ae(e, t) && (delete e[t], r && r.dep.notify()));
}
function $i(e) {
  for (var t = void 0, r = 0, n = e.length; r < n; r++)
    ((t = e[r]), t && t.__ob__ && t.__ob__.dep.depend(), R(t) && $i(t));
}
function vn(e) {
  return (Si(e, !1), e);
}
function Ni(e) {
  return (Si(e, !0), qe(e, "__v_isShallow", !0), e);
}
function Si(e, t) {
  if (!yn(e)) {
    if (0) var r;
    var n = Fe(e, t, Zt());
  }
}
function yn(e) {
  return !!(e && e.__v_isReadonly);
}
function Re(e) {
  return !!(e && e.__v_isRef === !0);
}
function Yr(e, t, r) {
  Object.defineProperty(e, r, {
    enumerable: !0,
    configurable: !0,
    get: function () {
      var n = t[r];
      if (Re(n)) return n.value;
      var o = n && n.__ob__;
      return (o && o.dep.depend(), n);
    },
    set: function (n) {
      var o = t[r];
      Re(o) && !Re(n) ? (o.value = n) : (t[r] = n);
    },
  });
}
var bn = "watcher",
  Ep = "".concat(bn, " callback"),
  kp = "".concat(bn, " getter"),
  $p = "".concat(bn, " cleanup");
var fe,
  As = (function () {
    function e(t) {
      (t === void 0 && (t = !1),
        (this.detached = t),
        (this.active = !0),
        (this.effects = []),
        (this.cleanups = []),
        (this.parent = fe),
        !t &&
          fe &&
          (this.index = (fe.scopes || (fe.scopes = [])).push(this) - 1));
    }
    return (
      (e.prototype.run = function (t) {
        if (this.active) {
          var r = fe;
          try {
            return ((fe = this), t());
          } finally {
            fe = r;
          }
        }
      }),
      (e.prototype.on = function () {
        fe = this;
      }),
      (e.prototype.off = function () {
        fe = this.parent;
      }),
      (e.prototype.stop = function (t) {
        if (this.active) {
          var r = void 0,
            n = void 0;
          for (r = 0, n = this.effects.length; r < n; r++)
            this.effects[r].teardown();
          for (r = 0, n = this.cleanups.length; r < n; r++) this.cleanups[r]();
          if (this.scopes)
            for (r = 0, n = this.scopes.length; r < n; r++)
              this.scopes[r].stop(!0);
          if (!this.detached && this.parent && !t) {
            var o = this.parent.scopes.pop();
            o &&
              o !== this &&
              ((this.parent.scopes[this.index] = o), (o.index = this.index));
          }
          ((this.parent = void 0), (this.active = !1));
        }
      }),
      e
    );
  })();
function Rs(e, t) {
  (t === void 0 && (t = fe), t && t.active && t.effects.push(e));
}
function Ms() {
  return fe;
}
function js(e) {
  var t = e._provided,
    r = e.$parent && e.$parent._provided;
  return r === t ? (e._provided = Object.create(r)) : t;
}
var ko = vt(function (e) {
  var t = e.charAt(0) === "&";
  e = t ? e.slice(1) : e;
  var r = e.charAt(0) === "~";
  e = r ? e.slice(1) : e;
  var n = e.charAt(0) === "!";
  return (
    (e = n ? e.slice(1) : e),
    { name: e, once: r, capture: n, passive: t }
  );
});
function Xr(e, t) {
  function r() {
    var n = r.fns;
    if (R(n))
      for (var o = n.slice(), i = 0; i < o.length; i++)
        Ye(o[i], null, arguments, t, "v-on handler");
    else return Ye(n, null, arguments, t, "v-on handler");
  }
  return ((r.fns = e), r);
}
function Ci(e, t, r, n, o, i) {
  var a, s, c, u;
  for (a in e)
    ((s = e[a]),
      (c = t[a]),
      (u = ko(a)),
      A(s) ||
        (A(c)
          ? (A(s.fns) && (s = e[a] = Xr(s, i)),
            Z(u.once) && (s = e[a] = o(u.name, s, u.capture)),
            r(u.name, s, u.capture, u.passive, u.params))
          : s !== c && ((c.fns = s), (e[a] = c))));
  for (a in t) A(e[a]) && ((u = ko(a)), n(u.name, t[a], u.capture));
}
function We(e, t, r) {
  e instanceof we && (e = e.data.hook || (e.data.hook = {}));
  var n,
    o = e[t];
  function i() {
    (r.apply(this, arguments), Xe(n.fns, i));
  }
  (A(o)
    ? (n = Xr([i]))
    : h(o.fns) && Z(o.merged)
      ? ((n = o), n.fns.push(i))
      : (n = Xr([o, i])),
    (n.merged = !0),
    (e[t] = n));
}
function Ps(e, t, r) {
  var n = t.options.props;
  if (!A(n)) {
    var o = {},
      i = e.attrs,
      a = e.props;
    if (h(i) || h(a))
      for (var s in n) {
        var c = Kt(s);
        if (0) var u;
        $o(o, a, s, c, !0) || $o(o, i, s, c, !1);
      }
    return o;
  }
}
function $o(e, t, r, n, o) {
  if (h(t)) {
    if (ae(t, r)) return ((e[r] = t[r]), o || delete t[r], !0);
    if (ae(t, n)) return ((e[r] = t[n]), o || delete t[n], !0);
  }
  return !1;
}
function Ls(e) {
  for (var t = 0; t < e.length; t++)
    if (R(e[t])) return Array.prototype.concat.apply([], e);
  return e;
}
function wn(e) {
  return Jt(e) ? [kt(e)] : R(e) ? Ii(e) : void 0;
}
function jt(e) {
  return h(e) && h(e.text) && ds(e.isComment);
}
function Ii(e, t) {
  var r = [],
    n,
    o,
    i,
    a;
  for (n = 0; n < e.length; n++)
    ((o = e[n]),
      !(A(o) || typeof o == "boolean") &&
        ((i = r.length - 1),
        (a = r[i]),
        R(o)
          ? o.length > 0 &&
            ((o = Ii(o, "".concat(t || "", "_").concat(n))),
            jt(o[0]) && jt(a) && ((r[i] = kt(a.text + o[0].text)), o.shift()),
            r.push.apply(r, o))
          : Jt(o)
            ? jt(a)
              ? (r[i] = kt(a.text + o))
              : o !== "" && r.push(kt(o))
            : jt(o) && jt(a)
              ? (r[i] = kt(a.text + o.text))
              : (Z(e._isVList) &&
                  h(o.tag) &&
                  A(o.key) &&
                  h(t) &&
                  (o.key = "__vlist".concat(t, "_").concat(n, "__")),
                r.push(o))));
  return r;
}
function Fs(e, t) {
  var r = null,
    n,
    o,
    i,
    a;
  if (R(e) || typeof e == "string")
    for (r = new Array(e.length), n = 0, o = e.length; n < o; n++)
      r[n] = t(e[n], n);
  else if (typeof e == "number")
    for (r = new Array(e), n = 0; n < e; n++) r[n] = t(n + 1, n);
  else if (ne(e))
    if (Yt && e[Symbol.iterator]) {
      r = [];
      for (var s = e[Symbol.iterator](), c = s.next(); !c.done; )
        (r.push(t(c.value, r.length)), (c = s.next()));
    } else
      for (
        i = Object.keys(e), r = new Array(i.length), n = 0, o = i.length;
        n < o;
        n++
      )
        ((a = i[n]), (r[n] = t(e[a], a, n)));
  return (h(r) || (r = []), (r._isVList = !0), r);
}
function Us(e, t, r, n) {
  var o = this.$scopedSlots[e],
    i;
  o
    ? ((r = r || {}), n && (r = q(q({}, n), r)), (i = o(r) || (K(t) ? t() : t)))
    : (i = this.$slots[e] || (K(t) ? t() : t));
  var a = r && r.slot;
  return a ? this.$createElement("template", { slot: a }, i) : i;
}
function zs(e) {
  return wr(this.$options, "filters", e, !0) || _i;
}
function No(e, t) {
  return R(e) ? e.indexOf(t) === -1 : e !== t;
}
function Bs(e, t, r, n, o) {
  var i = se.keyCodes[t] || r;
  return o && n && !se.keyCodes[t]
    ? No(o, n)
    : i
      ? No(i, e)
      : n
        ? Kt(n) !== t
        : e === void 0;
}
function Vs(e, t, r, n, o) {
  if (r && ne(r)) {
    R(r) && (r = hi(r));
    var i = void 0,
      a = function (c) {
        if (c === "class" || c === "style" || hs(c)) i = e;
        else {
          var u = e.attrs && e.attrs.type;
          i =
            n || se.mustUseProp(t, u, c)
              ? e.domProps || (e.domProps = {})
              : e.attrs || (e.attrs = {});
        }
        var f = dt(c),
          p = Kt(c);
        if (!(f in i) && !(p in i) && ((i[c] = r[c]), o)) {
          var _ = e.on || (e.on = {});
          _["update:".concat(c)] = function (v) {
            r[c] = v;
          };
        }
      };
    for (var s in r) a(s);
  }
  return e;
}
function Hs(e, t) {
  var r = this._staticTrees || (this._staticTrees = []),
    n = r[e];
  return (
    (n && !t) ||
      ((n = r[e] =
        this.$options.staticRenderFns[e].call(
          this._renderProxy,
          this._c,
          this,
        )),
      Di(n, "__static__".concat(e), !1)),
    n
  );
}
function Ws(e, t, r) {
  return (Di(e, "__once__".concat(t).concat(r ? "_".concat(r) : ""), !0), e);
}
function Di(e, t, r) {
  if (R(e))
    for (var n = 0; n < e.length; n++)
      e[n] &&
        typeof e[n] != "string" &&
        So(e[n], "".concat(t, "_").concat(n), r);
  else So(e, t, r);
}
function So(e, t, r) {
  ((e.isStatic = !0), (e.key = t), (e.isOnce = r));
}
function Gs(e, t) {
  if (t && be(t)) {
    var r = (e.on = e.on ? q({}, e.on) : {});
    for (var n in t) {
      var o = r[n],
        i = t[n];
      r[n] = o ? [].concat(o, i) : i;
    }
  }
  return e;
}
function Oi(e, t, r, n) {
  t = t || { $stable: !r };
  for (var o = 0; o < e.length; o++) {
    var i = e[o];
    R(i) ? Oi(i, t, r) : i && (i.proxy && (i.fn.proxy = !0), (t[i.key] = i.fn));
  }
  return (n && (t.$key = n), t);
}
function qs(e, t) {
  for (var r = 0; r < t.length; r += 2) {
    var n = t[r];
    typeof n == "string" && n && (e[t[r]] = t[r + 1]);
  }
  return e;
}
function Js(e, t) {
  return typeof e == "string" ? t + e : e;
}
function Ti(e) {
  ((e._o = Ws),
    (e._n = Bt),
    (e._s = ms),
    (e._l = Fs),
    (e._t = Us),
    (e._q = mt),
    (e._i = vi),
    (e._m = Hs),
    (e._f = zs),
    (e._k = Bs),
    (e._b = Vs),
    (e._v = kt),
    (e._e = lt),
    (e._u = Oi),
    (e._g = Gs),
    (e._d = qs),
    (e._p = Js));
}
function xn(e, t) {
  if (!e || !e.length) return {};
  for (var r = {}, n = 0, o = e.length; n < o; n++) {
    var i = e[n],
      a = i.data;
    if (
      (a && a.attrs && a.attrs.slot && delete a.attrs.slot,
      (i.context === t || i.fnContext === t) && a && a.slot != null)
    ) {
      var s = a.slot,
        c = r[s] || (r[s] = []);
      i.tag === "template" ? c.push.apply(c, i.children || []) : c.push(i);
    } else (r.default || (r.default = [])).push(i);
  }
  for (var u in r) r[u].every(Ks) && delete r[u];
  return r;
}
function Ks(e) {
  return (e.isComment && !e.asyncFactory) || e.text === " ";
}
function Ht(e) {
  return e.isComment && e.asyncFactory;
}
function zt(e, t, r, n) {
  var o,
    i = Object.keys(r).length > 0,
    a = t ? !!t.$stable : !i,
    s = t && t.$key;
  if (!t) o = {};
  else {
    if (t._normalized) return t._normalized;
    if (a && n && n !== ye && s === n.$key && !i && !n.$hasNormal) return n;
    o = {};
    for (var c in t) t[c] && c[0] !== "$" && (o[c] = Zs(e, r, c, t[c]));
  }
  for (var u in r) u in o || (o[u] = Ys(r, u));
  return (
    t && Object.isExtensible(t) && (t._normalized = o),
    qe(o, "$stable", a),
    qe(o, "$key", s),
    qe(o, "$hasNormal", i),
    o
  );
}
function Zs(e, t, r, n) {
  var o = function () {
    var i = ut;
    Je(e);
    var a = arguments.length ? n.apply(null, arguments) : n({});
    a = a && typeof a == "object" && !R(a) ? [a] : wn(a);
    var s = a && a[0];
    return (
      Je(i),
      a && (!s || (a.length === 1 && s.isComment && !Ht(s))) ? void 0 : a
    );
  };
  return (
    n.proxy &&
      Object.defineProperty(t, r, { get: o, enumerable: !0, configurable: !0 }),
    o
  );
}
function Ys(e, t) {
  return function () {
    return e[t];
  };
}
function Xs(e) {
  var t = e.$options,
    r = t.setup;
  if (r) {
    var n = (e._setupContext = Qs(e));
    (Je(e), Dt());
    var o = Ye(r, null, [e._props || Ni({}), n], e, "setup");
    if ((Ot(), Je(), K(o))) t.render = o;
    else if (ne(o))
      if (((e._setupState = o), o.__sfc)) {
        var a = (e._setupProxy = {});
        for (var i in o) i !== "__sfc" && Yr(a, o, i);
      } else for (var i in o) bi(i) || Yr(e, o, i);
  }
}
function Qs(e) {
  var t = !1;
  return {
    get attrs() {
      if (!e._attrsProxy) {
        var r = (e._attrsProxy = {});
        (qe(r, "_v_attr_proxy", !0), hr(r, e.$attrs, ye, e, "$attrs"));
      }
      return e._attrsProxy;
    },
    get listeners() {
      if (!e._listenersProxy) {
        var r = (e._listenersProxy = {});
        hr(r, e.$listeners, ye, e, "$listeners");
      }
      return e._listenersProxy;
    },
    get slots() {
      return tc(e);
    },
    emit: gi(e.$emit, e),
    expose: function (r) {
      r &&
        Object.keys(r).forEach(function (n) {
          return Yr(e, r, n);
        });
    },
  };
}
function hr(e, t, r, n, o) {
  var i = !1;
  for (var a in t)
    a in e ? t[a] !== r[a] && (i = !0) : ((i = !0), ec(e, a, n, o));
  for (var a in e) a in t || ((i = !0), delete e[a]);
  return i;
}
function ec(e, t, r, n) {
  Object.defineProperty(e, t, {
    enumerable: !0,
    configurable: !0,
    get: function () {
      return r[n][t];
    },
  });
}
function tc(e) {
  return (
    e._slotsProxy || Ai((e._slotsProxy = {}), e.$scopedSlots),
    e._slotsProxy
  );
}
function Ai(e, t) {
  for (var r in t) e[r] = t[r];
  for (var r in e) r in t || delete e[r];
}
function rc(e) {
  ((e._vnode = null), (e._staticTrees = null));
  var t = e.$options,
    r = (e.$vnode = t._parentVnode),
    n = r && r.context;
  ((e.$slots = xn(t._renderChildren, n)),
    (e.$scopedSlots = r ? zt(e.$parent, r.data.scopedSlots, e.$slots) : ye),
    (e._c = function (i, a, s, c) {
      return _r(e, i, a, s, c, !1);
    }),
    (e.$createElement = function (i, a, s, c) {
      return _r(e, i, a, s, c, !0);
    }));
  var o = r && r.data;
  (gt(e, "$attrs", (o && o.attrs) || ye, null, !0),
    gt(e, "$listeners", t._parentListeners || ye, null, !0));
}
var lr = null;
function nc(e) {
  (Ti(e.prototype),
    (e.prototype.$nextTick = function (t) {
      return En(t, this);
    }),
    (e.prototype._render = function () {
      var t = this,
        r = t.$options,
        n = r.render,
        o = r._parentVnode;
      (o &&
        t._isMounted &&
        ((t.$scopedSlots = zt(
          t.$parent,
          o.data.scopedSlots,
          t.$slots,
          t.$scopedSlots,
        )),
        t._slotsProxy && Ai(t._slotsProxy, t.$scopedSlots)),
        (t.$vnode = o));
      var i = ut,
        a = lr,
        s;
      try {
        (Je(t), (lr = t), (s = n.call(t._renderProxy, t.$createElement)));
      } catch (c) {
        (ht(c, t, "render"), (s = t._vnode));
      } finally {
        ((lr = a), Je(i));
      }
      return (
        R(s) && s.length === 1 && (s = s[0]),
        s instanceof we || (s = lt()),
        (s.parent = o),
        s
      );
    }));
}
function Fr(e, t) {
  return (
    (e.__esModule || (Yt && e[Symbol.toStringTag] === "Module")) &&
      (e = e.default),
    ne(e) ? t.extend(e) : e
  );
}
function oc(e, t, r, n, o) {
  var i = lt();
  return (
    (i.asyncFactory = e),
    (i.asyncMeta = { data: t, context: r, children: n, tag: o }),
    i
  );
}
function ic(e, t) {
  if (Z(e.error) && h(e.errorComp)) return e.errorComp;
  if (h(e.resolved)) return e.resolved;
  var r = lr;
  if (
    (r && h(e.owners) && e.owners.indexOf(r) === -1 && e.owners.push(r),
    Z(e.loading) && h(e.loadingComp))
  )
    return e.loadingComp;
  if (r && !h(e.owners)) {
    var n = (e.owners = [r]),
      o = !0,
      i = null,
      a = null;
    r.$on("hook:destroyed", function () {
      return Xe(n, r);
    });
    var s = function (p) {
        for (var _ = 0, v = n.length; _ < v; _++) n[_].$forceUpdate();
        p &&
          ((n.length = 0),
          i !== null && (clearTimeout(i), (i = null)),
          a !== null && (clearTimeout(a), (a = null)));
      },
      c = dr(function (p) {
        ((e.resolved = Fr(p, t)), o ? (n.length = 0) : s(!0));
      }),
      u = dr(function (p) {
        h(e.errorComp) && ((e.error = !0), s(!0));
      }),
      f = e(c, u);
    return (
      ne(f) &&
        (qr(f)
          ? A(e.resolved) && f.then(c, u)
          : qr(f.component) &&
            (f.component.then(c, u),
            h(f.error) && (e.errorComp = Fr(f.error, t)),
            h(f.loading) &&
              ((e.loadingComp = Fr(f.loading, t)),
              f.delay === 0
                ? (e.loading = !0)
                : (i = setTimeout(function () {
                    ((i = null),
                      A(e.resolved) && A(e.error) && ((e.loading = !0), s(!1)));
                  }, f.delay || 200))),
            h(f.timeout) &&
              (a = setTimeout(function () {
                ((a = null), A(e.resolved) && u(null));
              }, f.timeout)))),
      (o = !1),
      e.loading ? e.loadingComp : e.resolved
    );
  }
}
function Ri(e) {
  if (R(e))
    for (var t = 0; t < e.length; t++) {
      var r = e[t];
      if (h(r) && (h(r.componentOptions) || Ht(r))) return r;
    }
}
var ac = 1,
  Mi = 2;
function _r(e, t, r, n, o, i) {
  return (
    (R(r) || Jt(r)) && ((o = n), (n = r), (r = void 0)),
    Z(i) && (o = Mi),
    sc(e, t, r, n, o)
  );
}
function sc(e, t, r, n, o) {
  if ((h(r) && h(r.__ob__)) || (h(r) && h(r.is) && (t = r.is), !t)) return lt();
  (R(n) &&
    K(n[0]) &&
    ((r = r || {}), (r.scopedSlots = { default: n[0] }), (n.length = 0)),
    o === Mi ? (n = wn(n)) : o === ac && (n = Ls(n)));
  var i, a;
  if (typeof t == "string") {
    var s = void 0;
    ((a = (e.$vnode && e.$vnode.ns) || se.getTagNamespace(t)),
      se.isReservedTag(t)
        ? (i = new we(se.parsePlatformTagName(t), r, n, void 0, void 0, e))
        : (!r || !r.pre) && h((s = wr(e.$options, "components", t)))
          ? (i = jo(s, r, e, n, t))
          : (i = new we(t, r, n, void 0, void 0, e)));
  } else i = jo(t, r, e, n);
  return R(i) ? i : h(i) ? (h(a) && ji(i, a), h(r) && cc(r), i) : lt();
}
function ji(e, t, r) {
  if (
    ((e.ns = t),
    e.tag === "foreignObject" && ((t = void 0), (r = !0)),
    h(e.children))
  )
    for (var n = 0, o = e.children.length; n < o; n++) {
      var i = e.children[n];
      h(i.tag) && (A(i.ns) || (Z(r) && i.tag !== "svg")) && ji(i, t, r);
    }
}
function cc(e) {
  (ne(e.style) && vr(e.style), ne(e.class) && vr(e.class));
}
function ht(e, t, r) {
  Dt();
  try {
    if (t)
      for (var n = t; (n = n.$parent); ) {
        var o = n.$options.errorCaptured;
        if (o)
          for (var i = 0; i < o.length; i++)
            try {
              var a = o[i].call(n, e, t, r) === !1;
              if (a) return;
            } catch (s) {
              Co(s, n, "errorCaptured hook");
            }
      }
    Co(e, t, r);
  } finally {
    Ot();
  }
}
function Ye(e, t, r, n, o) {
  var i;
  try {
    ((i = r ? e.apply(t, r) : e.call(t)),
      i &&
        !i._isVue &&
        qr(i) &&
        !i._handled &&
        (i.catch(function (a) {
          return ht(a, n, o + " (Promise/async)");
        }),
        (i._handled = !0)));
  } catch (a) {
    ht(a, n, o);
  }
  return i;
}
function Co(e, t, r) {
  if (se.errorHandler)
    try {
      return se.errorHandler.call(null, e, t, r);
    } catch (n) {
      n !== e && Io(n, null, "config.errorHandler");
    }
  Io(e, t, r);
}
function Io(e, t, r) {
  if (xe && typeof console < "u") console.error(e);
  else throw e;
}
var Qr = !1,
  en = [],
  tn = !1;
function rr() {
  tn = !1;
  var e = en.slice(0);
  en.length = 0;
  for (var t = 0; t < e.length; t++) e[t]();
}
var Ut;
typeof Promise < "u" && St(Promise)
  ? ((Do = Promise.resolve()),
    (Ut = function () {
      (Do.then(rr), Cs && setTimeout(ee));
    }),
    (Qr = !0))
  : !Ct &&
      typeof MutationObserver < "u" &&
      (St(MutationObserver) ||
        MutationObserver.toString() === "[object MutationObserverConstructor]")
    ? ((Pt = 1),
      (Oo = new MutationObserver(rr)),
      (Ur = document.createTextNode(String(Pt))),
      Oo.observe(Ur, { characterData: !0 }),
      (Ut = function () {
        ((Pt = (Pt + 1) % 2), (Ur.data = String(Pt)));
      }),
      (Qr = !0))
    : typeof setImmediate < "u" && St(setImmediate)
      ? (Ut = function () {
          setImmediate(rr);
        })
      : (Ut = function () {
          setTimeout(rr, 0);
        });
var Do, Pt, Oo, Ur;
function En(e, t) {
  var r;
  if (
    (en.push(function () {
      if (e)
        try {
          e.call(t);
        } catch (n) {
          ht(n, t, "nextTick");
        }
      else r && r(t);
    }),
    tn || ((tn = !0), Ut()),
    !e && typeof Promise < "u")
  )
    return new Promise(function (n) {
      r = n;
    });
}
function Se(e) {
  return function (t, r) {
    if ((r === void 0 && (r = ut), !!r)) return uc(r, e, t);
  };
}
function uc(e, t, r) {
  var n = e.$options;
  n[t] = Hi(n[t], r);
}
var Np = Se("beforeMount"),
  Sp = Se("mounted"),
  Cp = Se("beforeUpdate"),
  Ip = Se("updated"),
  Dp = Se("beforeDestroy"),
  Op = Se("destroyed"),
  Tp = Se("activated"),
  Ap = Se("deactivated"),
  Rp = Se("serverPrefetch"),
  Mp = Se("renderTracked"),
  jp = Se("renderTriggered"),
  Pp = Se("errorCaptured");
var lc = "2.7.16";
var To = new Vt();
function vr(e) {
  return (pr(e, To), To.clear(), e);
}
function pr(e, t) {
  var r,
    n,
    o = R(e);
  if (
    !((!o && !ne(e)) || e.__v_skip || Object.isFrozen(e) || e instanceof we)
  ) {
    if (e.__ob__) {
      var i = e.__ob__.dep.id;
      if (t.has(i)) return;
      t.add(i);
    }
    if (o) for (r = e.length; r--; ) pr(e[r], t);
    else if (Re(e)) pr(e.value, t);
    else for (n = Object.keys(e), r = n.length; r--; ) pr(e[n[r]], t);
  }
}
var pc = 0,
  kn = (function () {
    function e(t, r, n, o, i) {
      (Rs(this, fe && !fe._vm ? fe : t ? t._scope : void 0),
        (this.vm = t) && i && (t._watcher = this),
        o
          ? ((this.deep = !!o.deep),
            (this.user = !!o.user),
            (this.lazy = !!o.lazy),
            (this.sync = !!o.sync),
            (this.before = o.before))
          : (this.deep = this.user = this.lazy = this.sync = !1),
        (this.cb = n),
        (this.id = ++pc),
        (this.active = !0),
        (this.post = !1),
        (this.dirty = this.lazy),
        (this.deps = []),
        (this.newDeps = []),
        (this.depIds = new Vt()),
        (this.newDepIds = new Vt()),
        (this.expression = ""),
        K(r)
          ? (this.getter = r)
          : ((this.getter = Ns(r)), this.getter || (this.getter = ee)),
        (this.value = this.lazy ? void 0 : this.get()));
    }
    return (
      (e.prototype.get = function () {
        Dt(this);
        var t,
          r = this.vm;
        try {
          t = this.getter.call(r, r);
        } catch (n) {
          if (this.user)
            ht(n, r, 'getter for watcher "'.concat(this.expression, '"'));
          else throw n;
        } finally {
          (this.deep && vr(t), Ot(), this.cleanupDeps());
        }
        return t;
      }),
      (e.prototype.addDep = function (t) {
        var r = t.id;
        this.newDepIds.has(r) ||
          (this.newDepIds.add(r),
          this.newDeps.push(t),
          this.depIds.has(r) || t.addSub(this));
      }),
      (e.prototype.cleanupDeps = function () {
        for (var t = this.deps.length; t--; ) {
          var r = this.deps[t];
          this.newDepIds.has(r.id) || r.removeSub(this);
        }
        var n = this.depIds;
        ((this.depIds = this.newDepIds),
          (this.newDepIds = n),
          this.newDepIds.clear(),
          (n = this.deps),
          (this.deps = this.newDeps),
          (this.newDeps = n),
          (this.newDeps.length = 0));
      }),
      (e.prototype.update = function () {
        this.lazy ? (this.dirty = !0) : this.sync ? this.run() : Sc(this);
      }),
      (e.prototype.run = function () {
        if (this.active) {
          var t = this.get();
          if (t !== this.value || ne(t) || this.deep) {
            var r = this.value;
            if (((this.value = t), this.user)) {
              var n = 'callback for watcher "'.concat(this.expression, '"');
              Ye(this.cb, this.vm, [t, r], this.vm, n);
            } else this.cb.call(this.vm, t, r);
          }
        }
      }),
      (e.prototype.evaluate = function () {
        ((this.value = this.get()), (this.dirty = !1));
      }),
      (e.prototype.depend = function () {
        for (var t = this.deps.length; t--; ) this.deps[t].depend();
      }),
      (e.prototype.teardown = function () {
        if (
          (this.vm &&
            !this.vm._isBeingDestroyed &&
            Xe(this.vm._scope.effects, this),
          this.active)
        ) {
          for (var t = this.deps.length; t--; ) this.deps[t].removeSub(this);
          ((this.active = !1), this.onStop && this.onStop());
        }
      }),
      e
    );
  })();
function fc(e) {
  ((e._events = Object.create(null)), (e._hasHookEvent = !1));
  var t = e.$options._parentListeners;
  t && Pi(e, t);
}
var Wt;
function dc(e, t) {
  Wt.$on(e, t);
}
function mc(e, t) {
  Wt.$off(e, t);
}
function gc(e, t) {
  var r = Wt;
  return function n() {
    var o = t.apply(null, arguments);
    o !== null && r.$off(e, n);
  };
}
function Pi(e, t, r) {
  ((Wt = e), Ci(t, r || {}, dc, mc, gc, e), (Wt = void 0));
}
function hc(e) {
  var t = /^hook:/;
  ((e.prototype.$on = function (r, n) {
    var o = this;
    if (R(r)) for (var i = 0, a = r.length; i < a; i++) o.$on(r[i], n);
    else
      ((o._events[r] || (o._events[r] = [])).push(n),
        t.test(r) && (o._hasHookEvent = !0));
    return o;
  }),
    (e.prototype.$once = function (r, n) {
      var o = this;
      function i() {
        (o.$off(r, i), n.apply(o, arguments));
      }
      return ((i.fn = n), o.$on(r, i), o);
    }),
    (e.prototype.$off = function (r, n) {
      var o = this;
      if (!arguments.length) return ((o._events = Object.create(null)), o);
      if (R(r)) {
        for (var i = 0, a = r.length; i < a; i++) o.$off(r[i], n);
        return o;
      }
      var s = o._events[r];
      if (!s) return o;
      if (!n) return ((o._events[r] = null), o);
      for (var c, u = s.length; u--; )
        if (((c = s[u]), c === n || c.fn === n)) {
          s.splice(u, 1);
          break;
        }
      return o;
    }),
    (e.prototype.$emit = function (r) {
      var n = this;
      if (0) var o;
      var i = n._events[r];
      if (i) {
        i = i.length > 1 ? Jr(i) : i;
        for (
          var a = Jr(arguments, 1),
            s = 'event handler for "'.concat(r, '"'),
            c = 0,
            u = i.length;
          c < u;
          c++
        )
          Ye(i[c], n, a, n, s);
      }
      return n;
    }));
}
var pt = null;
function Li(e) {
  var t = pt;
  return (
    (pt = e),
    function () {
      pt = t;
    }
  );
}
function _c(e) {
  var t = e.$options,
    r = t.parent;
  if (r && !t.abstract) {
    for (; r.$options.abstract && r.$parent; ) r = r.$parent;
    r.$children.push(e);
  }
  ((e.$parent = r),
    (e.$root = r ? r.$root : e),
    (e.$children = []),
    (e.$refs = {}),
    (e._provided = r ? r._provided : Object.create(null)),
    (e._watcher = null),
    (e._inactive = null),
    (e._directInactive = !1),
    (e._isMounted = !1),
    (e._isDestroyed = !1),
    (e._isBeingDestroyed = !1));
}
function vc(e) {
  ((e.prototype._update = function (t, r) {
    var n = this,
      o = n.$el,
      i = n._vnode,
      a = Li(n);
    ((n._vnode = t),
      i ? (n.$el = n.__patch__(i, t)) : (n.$el = n.__patch__(n.$el, t, r, !1)),
      a(),
      o && (o.__vue__ = null),
      n.$el && (n.$el.__vue__ = n));
    for (
      var s = n;
      s && s.$vnode && s.$parent && s.$vnode === s.$parent._vnode;
    )
      ((s.$parent.$el = s.$el), (s = s.$parent));
  }),
    (e.prototype.$forceUpdate = function () {
      var t = this;
      t._watcher && t._watcher.update();
    }),
    (e.prototype.$destroy = function () {
      var t = this;
      if (!t._isBeingDestroyed) {
        (De(t, "beforeDestroy"), (t._isBeingDestroyed = !0));
        var r = t.$parent;
        (r &&
          !r._isBeingDestroyed &&
          !t.$options.abstract &&
          Xe(r.$children, t),
          t._scope.stop(),
          t._data.__ob__ && t._data.__ob__.vmCount--,
          (t._isDestroyed = !0),
          t.__patch__(t._vnode, null),
          De(t, "destroyed"),
          t.$off(),
          t.$el && (t.$el.__vue__ = null),
          t.$vnode && (t.$vnode.parent = null));
      }
    }));
}
function yc(e, t, r) {
  ((e.$el = t),
    e.$options.render || (e.$options.render = lt),
    De(e, "beforeMount"));
  var n;
  n = function () {
    e._update(e._render(), r);
  };
  var o = {
    before: function () {
      e._isMounted && !e._isDestroyed && De(e, "beforeUpdate");
    },
  };
  (new kn(e, n, ee, o, !0), (r = !1));
  var i = e._preWatchers;
  if (i) for (var a = 0; a < i.length; a++) i[a].run();
  return (e.$vnode == null && ((e._isMounted = !0), De(e, "mounted")), e);
}
function bc(e, t, r, n, o) {
  var i = n.data.scopedSlots,
    a = e.$scopedSlots,
    s = !!(
      (i && !i.$stable) ||
      (a !== ye && !a.$stable) ||
      (i && e.$scopedSlots.$key !== i.$key) ||
      (!i && e.$scopedSlots.$key)
    ),
    c = !!(o || e.$options._renderChildren || s),
    u = e.$vnode;
  ((e.$options._parentVnode = n),
    (e.$vnode = n),
    e._vnode && (e._vnode.parent = n),
    (e.$options._renderChildren = o));
  var f = n.data.attrs || ye;
  (e._attrsProxy &&
    hr(e._attrsProxy, f, (u.data && u.data.attrs) || ye, e, "$attrs") &&
    (c = !0),
    (e.$attrs = f),
    (r = r || ye));
  var p = e.$options._parentListeners;
  if (
    (e._listenersProxy && hr(e._listenersProxy, r, p || ye, e, "$listeners"),
    (e.$listeners = e.$options._parentListeners = r),
    Pi(e, r, p),
    t && e.$options.props)
  ) {
    Ze(!1);
    for (
      var _ = e._props, v = e.$options._propKeys || [], g = 0;
      g < v.length;
      g++
    ) {
      var E = v[g],
        x = e.$options.props;
      _[E] = Dn(E, x, t, e);
    }
    (Ze(!0), (e.$options.propsData = t));
  }
  c && ((e.$slots = xn(o, n.context)), e.$forceUpdate());
}
function Fi(e) {
  for (; e && (e = e.$parent); ) if (e._inactive) return !0;
  return !1;
}
function $n(e, t) {
  if (t) {
    if (((e._directInactive = !1), Fi(e))) return;
  } else if (e._directInactive) return;
  if (e._inactive || e._inactive === null) {
    e._inactive = !1;
    for (var r = 0; r < e.$children.length; r++) $n(e.$children[r]);
    De(e, "activated");
  }
}
function Ui(e, t) {
  if (!(t && ((e._directInactive = !0), Fi(e))) && !e._inactive) {
    e._inactive = !0;
    for (var r = 0; r < e.$children.length; r++) Ui(e.$children[r]);
    De(e, "deactivated");
  }
}
function De(e, t, r, n) {
  (n === void 0 && (n = !0), Dt());
  var o = ut,
    i = Ms();
  n && Je(e);
  var a = e.$options[t],
    s = "".concat(t, " hook");
  if (a) for (var c = 0, u = a.length; c < u; c++) Ye(a[c], e, r || null, e, s);
  (e._hasHookEvent && e.$emit("hook:" + t), n && (Je(o), i && i.on()), Ot());
}
var Pe = [],
  Nn = [],
  yr = {};
var rn = !1,
  Sn = !1,
  $t = 0;
function wc() {
  (($t = Pe.length = Nn.length = 0), (yr = {}), (rn = Sn = !1));
}
var zi = 0,
  nn = Date.now;
xe &&
  !Ct &&
  ((nr = window.performance),
  nr &&
    typeof nr.now == "function" &&
    nn() > document.createEvent("Event").timeStamp &&
    (nn = function () {
      return nr.now();
    }));
var nr,
  xc = function (e, t) {
    if (e.post) {
      if (!t.post) return 1;
    } else if (t.post) return -1;
    return e.id - t.id;
  };
function Ec() {
  ((zi = nn()), (Sn = !0));
  var e, t;
  for (Pe.sort(xc), $t = 0; $t < Pe.length; $t++)
    ((e = Pe[$t]), e.before && e.before(), (t = e.id), (yr[t] = null), e.run());
  var r = Nn.slice(),
    n = Pe.slice();
  (wc(), Nc(r), kc(n), Ds(), mr && se.devtools && mr.emit("flush"));
}
function kc(e) {
  for (var t = e.length; t--; ) {
    var r = e[t],
      n = r.vm;
    n &&
      n._watcher === r &&
      n._isMounted &&
      !n._isDestroyed &&
      De(n, "updated");
  }
}
function $c(e) {
  ((e._inactive = !1), Nn.push(e));
}
function Nc(e) {
  for (var t = 0; t < e.length; t++) ((e[t]._inactive = !0), $n(e[t], !0));
}
function Sc(e) {
  var t = e.id;
  if (yr[t] == null && !(e === Ke.target && e.noRecurse)) {
    if (((yr[t] = !0), !Sn)) Pe.push(e);
    else {
      for (var r = Pe.length - 1; r > $t && Pe[r].id > e.id; ) r--;
      Pe.splice(r + 1, 0, e);
    }
    rn || ((rn = !0), En(Ec));
  }
}
function Cc(e) {
  var t = e.$options.provide;
  if (t) {
    var r = K(t) ? t.call(e) : t;
    if (!ne(r)) return;
    for (
      var n = js(e), o = Yt ? Reflect.ownKeys(r) : Object.keys(r), i = 0;
      i < o.length;
      i++
    ) {
      var a = o[i];
      Object.defineProperty(n, a, Object.getOwnPropertyDescriptor(r, a));
    }
  }
}
function Ic(e) {
  var t = Bi(e.$options.inject, e);
  t &&
    (Ze(!1),
    Object.keys(t).forEach(function (r) {
      gt(e, r, t[r]);
    }),
    Ze(!0));
}
function Bi(e, t) {
  if (e) {
    for (
      var r = Object.create(null),
        n = Yt ? Reflect.ownKeys(e) : Object.keys(e),
        o = 0;
      o < n.length;
      o++
    ) {
      var i = n[o];
      if (i !== "__ob__") {
        var a = e[i].from;
        if (a in t._provided) r[i] = t._provided[a];
        else if ("default" in e[i]) {
          var s = e[i].default;
          r[i] = K(s) ? s.call(t) : s;
        }
      }
    }
    return r;
  }
}
function Cn(e, t, r, n, o) {
  var i = this,
    a = o.options,
    s;
  ae(n, "_uid")
    ? ((s = Object.create(n)), (s._original = n))
    : ((s = n), (n = n._original));
  var c = Z(a._compiled),
    u = !c;
  ((this.data = e),
    (this.props = t),
    (this.children = r),
    (this.parent = n),
    (this.listeners = e.on || ye),
    (this.injections = Bi(a.inject, n)),
    (this.slots = function () {
      return (
        i.$slots || zt(n, e.scopedSlots, (i.$slots = xn(r, n))),
        i.$slots
      );
    }),
    Object.defineProperty(this, "scopedSlots", {
      enumerable: !0,
      get: function () {
        return zt(n, e.scopedSlots, this.slots());
      },
    }),
    c &&
      ((this.$options = a),
      (this.$slots = this.slots()),
      (this.$scopedSlots = zt(n, e.scopedSlots, this.$slots))),
    a._scopeId
      ? (this._c = function (f, p, _, v) {
          var g = _r(s, f, p, _, v, u);
          return (
            g && !R(g) && ((g.fnScopeId = a._scopeId), (g.fnContext = n)),
            g
          );
        })
      : (this._c = function (f, p, _, v) {
          return _r(s, f, p, _, v, u);
        }));
}
Ti(Cn.prototype);
function Dc(e, t, r, n, o) {
  var i = e.options,
    a = {},
    s = i.props;
  if (h(s)) for (var c in s) a[c] = Dn(c, s, t || ye);
  else (h(r.attrs) && Ro(a, r.attrs), h(r.props) && Ro(a, r.props));
  var u = new Cn(r, a, o, n, e),
    f = i.render.call(null, u._c, u);
  if (f instanceof we) return Ao(f, r, u.parent, i, u);
  if (R(f)) {
    for (var p = wn(f) || [], _ = new Array(p.length), v = 0; v < p.length; v++)
      _[v] = Ao(p[v], r, u.parent, i, u);
    return _;
  }
}
function Ao(e, t, r, n, o) {
  var i = Zr(e);
  return (
    (i.fnContext = r),
    (i.fnOptions = n),
    t.slot && ((i.data || (i.data = {})).slot = t.slot),
    i
  );
}
function Ro(e, t) {
  for (var r in t) e[dt(r)] = t[r];
}
function br(e) {
  return e.name || e.__name || e._componentTag;
}
var In = {
    init: function (e, t) {
      if (
        e.componentInstance &&
        !e.componentInstance._isDestroyed &&
        e.data.keepAlive
      ) {
        var r = e;
        In.prepatch(r, r);
      } else {
        var n = (e.componentInstance = Oc(e, pt));
        n.$mount(t ? e.elm : void 0, t);
      }
    },
    prepatch: function (e, t) {
      var r = t.componentOptions,
        n = (t.componentInstance = e.componentInstance);
      bc(n, r.propsData, r.listeners, t, r.children);
    },
    insert: function (e) {
      var t = e.context,
        r = e.componentInstance;
      (r._isMounted || ((r._isMounted = !0), De(r, "mounted")),
        e.data.keepAlive && (t._isMounted ? $c(r) : $n(r, !0)));
    },
    destroy: function (e) {
      var t = e.componentInstance;
      t._isDestroyed || (e.data.keepAlive ? Ui(t, !0) : t.$destroy());
    },
  },
  Mo = Object.keys(In);
function jo(e, t, r, n, o) {
  if (!A(e)) {
    var i = r.$options._base;
    if ((ne(e) && (e = i.extend(e)), typeof e == "function")) {
      var a;
      if (A(e.cid) && ((a = e), (e = ic(a, i)), e === void 0))
        return oc(a, t, r, n, o);
      ((t = t || {}), Tn(e), h(t.model) && Rc(e.options, t));
      var s = Ps(t, e, o);
      if (Z(e.options.functional)) return Dc(e, s, t, r, n);
      var c = t.on;
      if (((t.on = t.nativeOn), Z(e.options.abstract))) {
        var u = t.slot;
        ((t = {}), u && (t.slot = u));
      }
      Tc(t);
      var f = br(e.options) || o,
        p = new we(
          "vue-component-".concat(e.cid).concat(f ? "-".concat(f) : ""),
          t,
          void 0,
          void 0,
          void 0,
          r,
          { Ctor: e, propsData: s, listeners: c, tag: o, children: n },
          a,
        );
      return p;
    }
  }
}
function Oc(e, t) {
  var r = { _isComponent: !0, _parentVnode: e, parent: t },
    n = e.data.inlineTemplate;
  return (
    h(n) && ((r.render = n.render), (r.staticRenderFns = n.staticRenderFns)),
    new e.componentOptions.Ctor(r)
  );
}
function Tc(e) {
  for (var t = e.hook || (e.hook = {}), r = 0; r < Mo.length; r++) {
    var n = Mo[r],
      o = t[n],
      i = In[n];
    o !== i && !(o && o._merged) && (t[n] = o ? Ac(i, o) : i);
  }
}
function Ac(e, t) {
  var r = function (n, o) {
    (e(n, o), t(n, o));
  };
  return ((r._merged = !0), r);
}
function Rc(e, t) {
  var r = (e.model && e.model.prop) || "value",
    n = (e.model && e.model.event) || "input";
  (t.attrs || (t.attrs = {}))[r] = t.model.value;
  var o = t.on || (t.on = {}),
    i = o[n],
    a = t.model.callback;
  h(i)
    ? (R(i) ? i.indexOf(a) === -1 : i !== a) && (o[n] = [a].concat(i))
    : (o[n] = a);
}
var Vi = ee;
var Ae = se.optionMergeStrategies;
function Gt(e, t, r) {
  if ((r === void 0 && (r = !0), !t)) return e;
  for (
    var n, o, i, a = Yt ? Reflect.ownKeys(t) : Object.keys(t), s = 0;
    s < a.length;
    s++
  )
    ((n = a[s]),
      n !== "__ob__" &&
        ((o = e[n]),
        (i = t[n]),
        !r || !ae(e, n) ? _n(e, n, i) : o !== i && be(o) && be(i) && Gt(o, i)));
  return e;
}
function Po(e, t, r) {
  return r
    ? function () {
        var o = K(t) ? t.call(r, r) : t,
          i = K(e) ? e.call(r, r) : e;
        return o ? Gt(o, i) : i;
      }
    : t
      ? e
        ? function () {
            return Gt(
              K(t) ? t.call(this, this) : t,
              K(e) ? e.call(this, this) : e,
            );
          }
        : t
      : e;
}
Ae.data = function (e, t, r) {
  return r ? Po(e, t, r) : t && typeof t != "function" ? e : Po(e, t);
};
function Hi(e, t) {
  var r = t ? (e ? e.concat(t) : R(t) ? t : [t]) : e;
  return r && Mc(r);
}
function Mc(e) {
  for (var t = [], r = 0; r < e.length; r++)
    t.indexOf(e[r]) === -1 && t.push(e[r]);
  return t;
}
yi.forEach(function (e) {
  Ae[e] = Hi;
});
function jc(e, t, r, n) {
  var o = Object.create(e || null);
  return t ? q(o, t) : o;
}
$r.forEach(function (e) {
  Ae[e + "s"] = jc;
});
Ae.watch = function (e, t, r, n) {
  if ((e === Kr && (e = void 0), t === Kr && (t = void 0), !t))
    return Object.create(e || null);
  if (!e) return t;
  var o = {};
  q(o, e);
  for (var i in t) {
    var a = o[i],
      s = t[i];
    (a && !R(a) && (a = [a]), (o[i] = a ? a.concat(s) : R(s) ? s : [s]));
  }
  return o;
};
Ae.props =
  Ae.methods =
  Ae.inject =
  Ae.computed =
    function (e, t, r, n) {
      if (!e) return t;
      var o = Object.create(null);
      return (q(o, e), t && q(o, t), o);
    };
Ae.provide = function (e, t) {
  return e
    ? function () {
        var r = Object.create(null);
        return (
          Gt(r, K(e) ? e.call(this) : e),
          t && Gt(r, K(t) ? t.call(this) : t, !1),
          r
        );
      }
    : t;
};
var Pc = function (e, t) {
  return t === void 0 ? e : t;
};
function Lc(e, t) {
  var r = e.props;
  if (r) {
    var n = {},
      o,
      i,
      a;
    if (R(r))
      for (o = r.length; o--; )
        ((i = r[o]),
          typeof i == "string" && ((a = dt(i)), (n[a] = { type: null })));
    else if (be(r))
      for (var s in r)
        ((i = r[s]), (a = dt(s)), (n[a] = be(i) ? i : { type: i }));
    e.props = n;
  }
}
function Fc(e, t) {
  var r = e.inject;
  if (r) {
    var n = (e.inject = {});
    if (R(r)) for (var o = 0; o < r.length; o++) n[r[o]] = { from: r[o] };
    else if (be(r))
      for (var i in r) {
        var a = r[i];
        n[i] = be(a) ? q({ from: i }, a) : { from: a };
      }
  }
}
function Uc(e) {
  var t = e.directives;
  if (t)
    for (var r in t) {
      var n = t[r];
      K(n) && (t[r] = { bind: n, update: n });
    }
}
function _t(e, t, r) {
  if (
    (K(t) && (t = t.options),
    Lc(t, r),
    Fc(t, r),
    Uc(t),
    !t._base && (t.extends && (e = _t(e, t.extends, r)), t.mixins))
  )
    for (var n = 0, o = t.mixins.length; n < o; n++) e = _t(e, t.mixins[n], r);
  var i = {},
    a;
  for (a in e) s(a);
  for (a in t) ae(e, a) || s(a);
  function s(c) {
    var u = Ae[c] || Pc;
    i[c] = u(e[c], t[c], r, c);
  }
  return i;
}
function wr(e, t, r, n) {
  if (typeof r == "string") {
    var o = e[t];
    if (ae(o, r)) return o[r];
    var i = dt(r);
    if (ae(o, i)) return o[i];
    var a = ys(i);
    if (ae(o, a)) return o[a];
    var s = o[r] || o[i] || o[a];
    return s;
  }
}
function Dn(e, t, r, n) {
  var o = t[e],
    i = !ae(r, e),
    a = r[e],
    s = Fo(Boolean, o.type);
  if (s > -1) {
    if (i && !ae(o, "default")) a = !1;
    else if (a === "" || a === Kt(e)) {
      var c = Fo(String, o.type);
      (c < 0 || s < c) && (a = !0);
    }
  }
  if (a === void 0) {
    a = zc(n, o, e);
    var u = hn;
    (Ze(!0), Fe(a), Ze(u));
  }
  return a;
}
function zc(e, t, r) {
  if (ae(t, "default")) {
    var n = t.default;
    return e &&
      e.$options.propsData &&
      e.$options.propsData[r] === void 0 &&
      e._props[r] !== void 0
      ? e._props[r]
      : K(n) && on(t.type) !== "Function"
        ? n.call(e)
        : n;
  }
}
var Bc = /^\s*function (\w+)/;
function on(e) {
  var t = e && e.toString().match(Bc);
  return t ? t[1] : "";
}
function Lo(e, t) {
  return on(e) === on(t);
}
function Fo(e, t) {
  if (!R(t)) return Lo(t, e) ? 0 : -1;
  for (var r = 0, n = t.length; r < n; r++) if (Lo(t[r], e)) return r;
  return -1;
}
var He = { enumerable: !0, configurable: !0, get: ee, set: ee };
function On(e, t, r) {
  ((He.get = function () {
    return this[t][r];
  }),
    (He.set = function (o) {
      this[t][r] = o;
    }),
    Object.defineProperty(e, r, He));
}
function Vc(e) {
  var t = e.$options;
  if ((t.props && Hc(e, t.props), Xs(e), t.methods && Kc(e, t.methods), t.data))
    Wc(e);
  else {
    var r = Fe((e._data = {}));
    r && r.vmCount++;
  }
  (t.computed && Jc(e, t.computed),
    t.watch && t.watch !== Kr && Zc(e, t.watch));
}
function Hc(e, t) {
  var r = e.$options.propsData || {},
    n = (e._props = Ni({})),
    o = (e.$options._propKeys = []),
    i = !e.$parent;
  i || Ze(!1);
  var a = function (c) {
    o.push(c);
    var u = Dn(c, t, r, e);
    if (0) var f;
    else gt(n, c, u, void 0, !0);
    c in e || On(e, "_props", c);
  };
  for (var s in t) a(s);
  Ze(!0);
}
function Wc(e) {
  var t = e.$options.data;
  ((t = e._data = K(t) ? Gc(t, e) : t || {}), be(t) || (t = {}));
  for (
    var r = Object.keys(t),
      n = e.$options.props,
      o = e.$options.methods,
      i = r.length;
    i--;
  ) {
    var a = r[i];
    (n && ae(n, a)) || bi(a) || On(e, "_data", a);
  }
  var s = Fe(t);
  s && s.vmCount++;
}
function Gc(e, t) {
  Dt();
  try {
    return e.call(t, t);
  } catch (r) {
    return (ht(r, t, "data()"), {});
  } finally {
    Ot();
  }
}
var qc = { lazy: !0 };
function Jc(e, t) {
  var r = (e._computedWatchers = Object.create(null)),
    n = Zt();
  for (var o in t) {
    var i = t[o],
      a = K(i) ? i : i.get;
    (n || (r[o] = new kn(e, a || ee, ee, qc)), o in e || Wi(e, o, i));
  }
}
function Wi(e, t, r) {
  var n = !Zt();
  (K(r)
    ? ((He.get = n ? Uo(t) : zo(r)), (He.set = ee))
    : ((He.get = r.get ? (n && r.cache !== !1 ? Uo(t) : zo(r.get)) : ee),
      (He.set = r.set || ee)),
    Object.defineProperty(e, t, He));
}
function Uo(e) {
  return function () {
    var r = this._computedWatchers && this._computedWatchers[e];
    if (r) return (r.dirty && r.evaluate(), Ke.target && r.depend(), r.value);
  };
}
function zo(e) {
  return function () {
    return e.call(this, this);
  };
}
function Kc(e, t) {
  var r = e.$options.props;
  for (var n in t) e[n] = typeof t[n] != "function" ? ee : gi(t[n], e);
}
function Zc(e, t) {
  for (var r in t) {
    var n = t[r];
    if (R(n)) for (var o = 0; o < n.length; o++) an(e, r, n[o]);
    else an(e, r, n);
  }
}
function an(e, t, r, n) {
  return (
    be(r) && ((n = r), (r = r.handler)),
    typeof r == "string" && (r = e[r]),
    e.$watch(t, r, n)
  );
}
function Yc(e) {
  var t = {};
  t.get = function () {
    return this._data;
  };
  var r = {};
  ((r.get = function () {
    return this._props;
  }),
    Object.defineProperty(e.prototype, "$data", t),
    Object.defineProperty(e.prototype, "$props", r),
    (e.prototype.$set = _n),
    (e.prototype.$delete = ki),
    (e.prototype.$watch = function (n, o, i) {
      var a = this;
      if (be(o)) return an(a, n, o, i);
      ((i = i || {}), (i.user = !0));
      var s = new kn(a, n, o, i);
      if (i.immediate) {
        var c = 'callback for immediate watcher "'.concat(s.expression, '"');
        (Dt(), Ye(o, a, [s.value], a, c), Ot());
      }
      return function () {
        s.teardown();
      };
    }));
}
var Xc = 0;
function Qc(e) {
  e.prototype._init = function (t) {
    var r = this;
    r._uid = Xc++;
    var n, o;
    ((r._isVue = !0),
      (r.__v_skip = !0),
      (r._scope = new As(!0)),
      (r._scope.parent = void 0),
      (r._scope._vm = !0),
      t && t._isComponent
        ? eu(r, t)
        : (r.$options = _t(Tn(r.constructor), t || {}, r)),
      (r._renderProxy = r),
      (r._self = r),
      _c(r),
      fc(r),
      rc(r),
      De(r, "beforeCreate", void 0, !1),
      Ic(r),
      Vc(r),
      Cc(r),
      De(r, "created"),
      r.$options.el && r.$mount(r.$options.el));
  };
}
function eu(e, t) {
  var r = (e.$options = Object.create(e.constructor.options)),
    n = t._parentVnode;
  ((r.parent = t.parent), (r._parentVnode = n));
  var o = n.componentOptions;
  ((r.propsData = o.propsData),
    (r._parentListeners = o.listeners),
    (r._renderChildren = o.children),
    (r._componentTag = o.tag),
    t.render &&
      ((r.render = t.render), (r.staticRenderFns = t.staticRenderFns)));
}
function Tn(e) {
  var t = e.options;
  if (e.super) {
    var r = Tn(e.super),
      n = e.superOptions;
    if (r !== n) {
      e.superOptions = r;
      var o = tu(e);
      (o && q(e.extendOptions, o),
        (t = e.options = _t(r, e.extendOptions)),
        t.name && (t.components[t.name] = e));
    }
  }
  return t;
}
function tu(e) {
  var t,
    r = e.options,
    n = e.sealedOptions;
  for (var o in r) r[o] !== n[o] && (t || (t = {}), (t[o] = r[o]));
  return t;
}
function X(e) {
  this._init(e);
}
Qc(X);
Yc(X);
hc(X);
vc(X);
nc(X);
function ru(e) {
  e.use = function (t) {
    var r = this._installedPlugins || (this._installedPlugins = []);
    if (r.indexOf(t) > -1) return this;
    var n = Jr(arguments, 1);
    return (
      n.unshift(this),
      K(t.install) ? t.install.apply(t, n) : K(t) && t.apply(null, n),
      r.push(t),
      this
    );
  };
}
function nu(e) {
  e.mixin = function (t) {
    return ((this.options = _t(this.options, t)), this);
  };
}
function ou(e) {
  e.cid = 0;
  var t = 1;
  e.extend = function (r) {
    r = r || {};
    var n = this,
      o = n.cid,
      i = r._Ctor || (r._Ctor = {});
    if (i[o]) return i[o];
    var a = br(r) || br(n.options),
      s = function (u) {
        this._init(u);
      };
    return (
      (s.prototype = Object.create(n.prototype)),
      (s.prototype.constructor = s),
      (s.cid = t++),
      (s.options = _t(n.options, r)),
      (s.super = n),
      s.options.props && iu(s),
      s.options.computed && au(s),
      (s.extend = n.extend),
      (s.mixin = n.mixin),
      (s.use = n.use),
      $r.forEach(function (c) {
        s[c] = n[c];
      }),
      a && (s.options.components[a] = s),
      (s.superOptions = n.options),
      (s.extendOptions = r),
      (s.sealedOptions = q({}, s.options)),
      (i[o] = s),
      s
    );
  };
}
function iu(e) {
  var t = e.options.props;
  for (var r in t) On(e.prototype, "_props", r);
}
function au(e) {
  var t = e.options.computed;
  for (var r in t) Wi(e.prototype, r, t[r]);
}
function su(e) {
  $r.forEach(function (t) {
    e[t] = function (r, n) {
      return n
        ? (t === "component" &&
            be(n) &&
            ((n.name = n.name || r), (n = this.options._base.extend(n))),
          t === "directive" && K(n) && (n = { bind: n, update: n }),
          (this.options[t + "s"][r] = n),
          n)
        : this.options[t + "s"][r];
    };
  });
}
function Bo(e) {
  return e && (br(e.Ctor.options) || e.tag);
}
function or(e, t) {
  return R(e)
    ? e.indexOf(t) > -1
    : typeof e == "string"
      ? e.split(",").indexOf(t) > -1
      : di(e)
        ? e.test(t)
        : !1;
}
function Vo(e, t) {
  var r = e.cache,
    n = e.keys,
    o = e._vnode,
    i = e.$vnode;
  for (var a in r) {
    var s = r[a];
    if (s) {
      var c = s.name;
      c && !t(c) && sn(r, a, n, o);
    }
  }
  i.componentOptions.children = void 0;
}
function sn(e, t, r, n) {
  var o = e[t];
  (o && (!n || o.tag !== n.tag) && o.componentInstance.$destroy(),
    (e[t] = null),
    Xe(r, t));
}
var Ho = [String, RegExp, Array],
  cu = {
    name: "keep-alive",
    abstract: !0,
    props: { include: Ho, exclude: Ho, max: [String, Number] },
    methods: {
      cacheVNode: function () {
        var e = this,
          t = e.cache,
          r = e.keys,
          n = e.vnodeToCache,
          o = e.keyToCache;
        if (n) {
          var i = n.tag,
            a = n.componentInstance,
            s = n.componentOptions;
          ((t[o] = { name: Bo(s), tag: i, componentInstance: a }),
            r.push(o),
            this.max &&
              r.length > parseInt(this.max) &&
              sn(t, r[0], r, this._vnode),
            (this.vnodeToCache = null));
        }
      },
    },
    created: function () {
      ((this.cache = Object.create(null)), (this.keys = []));
    },
    destroyed: function () {
      for (var e in this.cache) sn(this.cache, e, this.keys);
    },
    mounted: function () {
      var e = this;
      (this.cacheVNode(),
        this.$watch("include", function (t) {
          Vo(e, function (r) {
            return or(t, r);
          });
        }),
        this.$watch("exclude", function (t) {
          Vo(e, function (r) {
            return !or(t, r);
          });
        }));
    },
    updated: function () {
      this.cacheVNode();
    },
    render: function () {
      var e = this.$slots.default,
        t = Ri(e),
        r = t && t.componentOptions;
      if (r) {
        var n = Bo(r),
          o = this,
          i = o.include,
          a = o.exclude;
        if ((i && (!n || !or(i, n))) || (a && n && or(a, n))) return t;
        var s = this,
          c = s.cache,
          u = s.keys,
          f =
            t.key == null
              ? r.Ctor.cid + (r.tag ? "::".concat(r.tag) : "")
              : t.key;
        (c[f]
          ? ((t.componentInstance = c[f].componentInstance),
            Xe(u, f),
            u.push(f))
          : ((this.vnodeToCache = t), (this.keyToCache = f)),
          (t.data.keepAlive = !0));
      }
      return t || (e && e[0]);
    },
  },
  uu = { KeepAlive: cu };
function lu(e) {
  var t = {};
  ((t.get = function () {
    return se;
  }),
    Object.defineProperty(e, "config", t),
    (e.util = { warn: Vi, extend: q, mergeOptions: _t, defineReactive: gt }),
    (e.set = _n),
    (e.delete = ki),
    (e.nextTick = En),
    (e.observable = function (r) {
      return (Fe(r), r);
    }),
    (e.options = Object.create(null)),
    $r.forEach(function (r) {
      e.options[r + "s"] = Object.create(null);
    }),
    (e.options._base = e),
    q(e.options.components, uu),
    ru(e),
    nu(e),
    ou(e),
    su(e));
}
lu(X);
Object.defineProperty(X.prototype, "$isServer", { get: Zt });
Object.defineProperty(X.prototype, "$ssrContext", {
  get: function () {
    return this.$vnode && this.$vnode.ssrContext;
  },
});
Object.defineProperty(X, "FunctionalRenderContext", { value: Cn });
X.version = lc;
var pu = Oe("style,class"),
  fu = Oe("input,textarea,option,select,progress"),
  du = function (e, t, r) {
    return (
      (r === "value" && fu(e) && t !== "button") ||
      (r === "selected" && e === "option") ||
      (r === "checked" && e === "input") ||
      (r === "muted" && e === "video")
    );
  },
  Gi = Oe("contenteditable,draggable,spellcheck"),
  mu = Oe("events,caret,typing,plaintext-only"),
  gu = function (e, t) {
    return xr(t) || t === "false"
      ? "false"
      : e === "contenteditable" && mu(t)
        ? t
        : "true";
  },
  hu = Oe(
    "allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,truespeed,typemustmatch,visible",
  ),
  cn = "http://www.w3.org/1999/xlink",
  An = function (e) {
    return e.charAt(5) === ":" && e.slice(0, 5) === "xlink";
  },
  qi = function (e) {
    return An(e) ? e.slice(6, e.length) : "";
  },
  xr = function (e) {
    return e == null || e === !1;
  };
function _u(e) {
  for (var t = e.data, r = e, n = e; h(n.componentInstance); )
    ((n = n.componentInstance._vnode), n && n.data && (t = Wo(n.data, t)));
  for (; h((r = r.parent)); ) r && r.data && (t = Wo(t, r.data));
  return vu(t.staticClass, t.class);
}
function Wo(e, t) {
  return {
    staticClass: Rn(e.staticClass, t.staticClass),
    class: h(e.class) ? [e.class, t.class] : t.class,
  };
}
function vu(e, t) {
  return h(e) || h(t) ? Rn(e, Mn(t)) : "";
}
function Rn(e, t) {
  return e ? (t ? e + " " + t : e) : t || "";
}
function Mn(e) {
  return Array.isArray(e)
    ? yu(e)
    : ne(e)
      ? bu(e)
      : typeof e == "string"
        ? e
        : "";
}
function yu(e) {
  for (var t = "", r, n = 0, o = e.length; n < o; n++)
    h((r = Mn(e[n]))) && r !== "" && (t && (t += " "), (t += r));
  return t;
}
function bu(e) {
  var t = "";
  for (var r in e) e[r] && (t && (t += " "), (t += r));
  return t;
}
var wu = {
    svg: "http://www.w3.org/2000/svg",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  xu = Oe(
    "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot",
  ),
  jn = Oe(
    "svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",
    !0,
  ),
  Ji = function (e) {
    return xu(e) || jn(e);
  };
function Eu(e) {
  if (jn(e)) return "svg";
  if (e === "math") return "math";
}
var ir = Object.create(null);
function ku(e) {
  if (!xe) return !0;
  if (Ji(e)) return !1;
  if (((e = e.toLowerCase()), ir[e] != null)) return ir[e];
  var t = document.createElement(e);
  return e.indexOf("-") > -1
    ? (ir[e] =
        t.constructor === window.HTMLUnknownElement ||
        t.constructor === window.HTMLElement)
    : (ir[e] = /HTMLUnknownElement/.test(t.toString()));
}
var un = Oe("text,number,password,search,email,tel,url");
function $u(e) {
  if (typeof e == "string") {
    var t = document.querySelector(e);
    return t || document.createElement("div");
  } else return e;
}
function Nu(e, t) {
  var r = document.createElement(e);
  return (
    e !== "select" ||
      (t.data &&
        t.data.attrs &&
        t.data.attrs.multiple !== void 0 &&
        r.setAttribute("multiple", "multiple")),
    r
  );
}
function Su(e, t) {
  return document.createElementNS(wu[e], t);
}
function Cu(e) {
  return document.createTextNode(e);
}
function Iu(e) {
  return document.createComment(e);
}
function Du(e, t, r) {
  e.insertBefore(t, r);
}
function Ou(e, t) {
  e.removeChild(t);
}
function Tu(e, t) {
  e.appendChild(t);
}
function Au(e) {
  return e.parentNode;
}
function Ru(e) {
  return e.nextSibling;
}
function Mu(e) {
  return e.tagName;
}
function ju(e, t) {
  e.textContent = t;
}
function Pu(e, t) {
  e.setAttribute(t, "");
}
var Lu = Object.freeze({
    __proto__: null,
    createElement: Nu,
    createElementNS: Su,
    createTextNode: Cu,
    createComment: Iu,
    insertBefore: Du,
    removeChild: Ou,
    appendChild: Tu,
    parentNode: Au,
    nextSibling: Ru,
    tagName: Mu,
    setTextContent: ju,
    setStyleScope: Pu,
  }),
  Fu = {
    create: function (e, t) {
      Nt(t);
    },
    update: function (e, t) {
      e.data.ref !== t.data.ref && (Nt(e, !0), Nt(t));
    },
    destroy: function (e) {
      Nt(e, !0);
    },
  };
function Nt(e, t) {
  var r = e.data.ref;
  if (h(r)) {
    var n = e.context,
      o = e.componentInstance || e.elm,
      i = t ? null : o,
      a = t ? void 0 : o;
    if (K(r)) {
      Ye(r, n, [i], n, "template ref function");
      return;
    }
    var s = e.data.refInFor,
      c = typeof r == "string" || typeof r == "number",
      u = Re(r),
      f = n.$refs;
    if (c || u) {
      if (s) {
        var p = c ? f[r] : r.value;
        t
          ? R(p) && Xe(p, o)
          : R(p)
            ? p.includes(o) || p.push(o)
            : c
              ? ((f[r] = [o]), Go(n, r, f[r]))
              : (r.value = [o]);
      } else if (c) {
        if (t && f[r] !== o) return;
        ((f[r] = a), Go(n, r, i));
      } else if (u) {
        if (t && r.value !== o) return;
        r.value = i;
      }
    }
  }
}
function Go(e, t, r) {
  var n = e._setupState;
  n && ae(n, t) && (Re(n[t]) ? (n[t].value = r) : (n[t] = r));
}
var Ge = new we("", {}, []),
  Lt = ["create", "activate", "update", "remove", "destroy"];
function ct(e, t) {
  return (
    e.key === t.key &&
    e.asyncFactory === t.asyncFactory &&
    ((e.tag === t.tag &&
      e.isComment === t.isComment &&
      h(e.data) === h(t.data) &&
      Uu(e, t)) ||
      (Z(e.isAsyncPlaceholder) && A(t.asyncFactory.error)))
  );
}
function Uu(e, t) {
  if (e.tag !== "input") return !0;
  var r,
    n = h((r = e.data)) && h((r = r.attrs)) && r.type,
    o = h((r = t.data)) && h((r = r.attrs)) && r.type;
  return n === o || (un(n) && un(o));
}
function zu(e, t, r) {
  var n,
    o,
    i = {};
  for (n = t; n <= r; ++n) ((o = e[n].key), h(o) && (i[o] = n));
  return i;
}
function Bu(e) {
  var t,
    r,
    n = {},
    o = e.modules,
    i = e.nodeOps;
  for (t = 0; t < Lt.length; ++t)
    for (n[Lt[t]] = [], r = 0; r < o.length; ++r)
      h(o[r][Lt[t]]) && n[Lt[t]].push(o[r][Lt[t]]);
  function a(m) {
    return new we(i.tagName(m).toLowerCase(), {}, [], void 0, m);
  }
  function s(m, d) {
    function y() {
      --y.listeners === 0 && c(m);
    }
    return ((y.listeners = d), y);
  }
  function c(m) {
    var d = i.parentNode(m);
    h(d) && i.removeChild(d, m);
  }
  function u(m, d) {
    return (
      !d &&
      !m.ns &&
      !(
        se.ignoredElements.length &&
        se.ignoredElements.some(function (y) {
          return di(y) ? y.test(m.tag) : y === m.tag;
        })
      ) &&
      se.isUnknownElement(m.tag)
    );
  }
  var f = 0;
  function p(m, d, y, C, T, z, j) {
    if (
      (h(m.elm) && h(z) && (m = z[j] = Zr(m)),
      (m.isRootInsert = !T),
      !_(m, d, y, C))
    ) {
      var P = m.data,
        W = m.children,
        B = m.tag;
      h(B)
        ? ((m.elm = m.ns ? i.createElementNS(m.ns, B) : i.createElement(B, m)),
          N(m),
          x(m, W, d),
          h(P) && w(m, d),
          E(y, m.elm, C))
        : Z(m.isComment)
          ? ((m.elm = i.createComment(m.text)), E(y, m.elm, C))
          : ((m.elm = i.createTextNode(m.text)), E(y, m.elm, C));
    }
  }
  function _(m, d, y, C) {
    var T = m.data;
    if (h(T)) {
      var z = h(m.componentInstance) && T.keepAlive;
      if (
        (h((T = T.hook)) && h((T = T.init)) && T(m, !1), h(m.componentInstance))
      )
        return (v(m, d), E(y, m.elm, C), Z(z) && g(m, d, y, C), !0);
    }
  }
  function v(m, d) {
    (h(m.data.pendingInsert) &&
      (d.push.apply(d, m.data.pendingInsert), (m.data.pendingInsert = null)),
      (m.elm = m.componentInstance.$el),
      b(m) ? (w(m, d), N(m)) : (Nt(m), d.push(m)));
  }
  function g(m, d, y, C) {
    for (var T, z = m; z.componentInstance; )
      if (
        ((z = z.componentInstance._vnode),
        h((T = z.data)) && h((T = T.transition)))
      ) {
        for (T = 0; T < n.activate.length; ++T) n.activate[T](Ge, z);
        d.push(z);
        break;
      }
    E(y, m.elm, C);
  }
  function E(m, d, y) {
    h(m) &&
      (h(y)
        ? i.parentNode(y) === m && i.insertBefore(m, d, y)
        : i.appendChild(m, d));
  }
  function x(m, d, y) {
    if (R(d))
      for (var C = 0; C < d.length; ++C) p(d[C], y, m.elm, null, !0, d, C);
    else Jt(m.text) && i.appendChild(m.elm, i.createTextNode(String(m.text)));
  }
  function b(m) {
    for (; m.componentInstance; ) m = m.componentInstance._vnode;
    return h(m.tag);
  }
  function w(m, d) {
    for (var y = 0; y < n.create.length; ++y) n.create[y](Ge, m);
    ((t = m.data.hook),
      h(t) && (h(t.create) && t.create(Ge, m), h(t.insert) && d.push(m)));
  }
  function N(m) {
    var d;
    if (h((d = m.fnScopeId))) i.setStyleScope(m.elm, d);
    else
      for (var y = m; y; )
        (h((d = y.context)) &&
          h((d = d.$options._scopeId)) &&
          i.setStyleScope(m.elm, d),
          (y = y.parent));
    h((d = pt)) &&
      d !== m.context &&
      d !== m.fnContext &&
      h((d = d.$options._scopeId)) &&
      i.setStyleScope(m.elm, d);
  }
  function O(m, d, y, C, T, z) {
    for (; C <= T; ++C) p(y[C], z, m, d, !1, y, C);
  }
  function L(m) {
    var d,
      y,
      C = m.data;
    if (h(C))
      for (
        h((d = C.hook)) && h((d = d.destroy)) && d(m), d = 0;
        d < n.destroy.length;
        ++d
      )
        n.destroy[d](m);
    if (h((d = m.children)))
      for (y = 0; y < m.children.length; ++y) L(m.children[y]);
  }
  function G(m, d, y) {
    for (; d <= y; ++d) {
      var C = m[d];
      h(C) && (h(C.tag) ? (J(C), L(C)) : c(C.elm));
    }
  }
  function J(m, d) {
    if (h(d) || h(m.data)) {
      var y,
        C = n.remove.length + 1;
      for (
        h(d) ? (d.listeners += C) : (d = s(m.elm, C)),
          h((y = m.componentInstance)) &&
            h((y = y._vnode)) &&
            h(y.data) &&
            J(y, d),
          y = 0;
        y < n.remove.length;
        ++y
      )
        n.remove[y](m, d);
      h((y = m.data.hook)) && h((y = y.remove)) ? y(m, d) : d();
    } else c(m.elm);
  }
  function _e(m, d, y, C, T) {
    for (
      var z = 0,
        j = 0,
        P = d.length - 1,
        W = d[0],
        B = d[P],
        V = y.length - 1,
        Q = y[0],
        Ne = y[V],
        it,
        at,
        st,
        xt,
        Mr = !T;
      z <= P && j <= V;
    )
      A(W)
        ? (W = d[++z])
        : A(B)
          ? (B = d[--P])
          : ct(W, Q)
            ? ($e(W, Q, C, y, j), (W = d[++z]), (Q = y[++j]))
            : ct(B, Ne)
              ? ($e(B, Ne, C, y, V), (B = d[--P]), (Ne = y[--V]))
              : ct(W, Ne)
                ? ($e(W, Ne, C, y, V),
                  Mr && i.insertBefore(m, W.elm, i.nextSibling(B.elm)),
                  (W = d[++z]),
                  (Ne = y[--V]))
                : ct(B, Q)
                  ? ($e(B, Q, C, y, j),
                    Mr && i.insertBefore(m, B.elm, W.elm),
                    (B = d[--P]),
                    (Q = y[++j]))
                  : (A(it) && (it = zu(d, z, P)),
                    (at = h(Q.key) ? it[Q.key] : ot(Q, d, z, P)),
                    A(at)
                      ? p(Q, C, m, W.elm, !1, y, j)
                      : ((st = d[at]),
                        ct(st, Q)
                          ? ($e(st, Q, C, y, j),
                            (d[at] = void 0),
                            Mr && i.insertBefore(m, st.elm, W.elm))
                          : p(Q, C, m, W.elm, !1, y, j)),
                    (Q = y[++j]));
    z > P
      ? ((xt = A(y[V + 1]) ? null : y[V + 1].elm), O(m, xt, y, j, V, C))
      : j > V && G(d, z, P);
  }
  function bt(m) {
    for (var d = {}, y = 0; y < m.length; y++) {
      var C = m[y],
        T = C.key;
      h(T) &&
        (d[T]
          ? Vi(
              "Duplicate keys detected: '".concat(
                T,
                "'. This may cause an update error.",
              ),
              C.context,
            )
          : (d[T] = !0));
    }
  }
  function ot(m, d, y, C) {
    for (var T = y; T < C; T++) {
      var z = d[T];
      if (h(z) && ct(m, z)) return T;
    }
  }
  function $e(m, d, y, C, T, z) {
    if (m !== d) {
      h(d.elm) && h(C) && (d = C[T] = Zr(d));
      var j = (d.elm = m.elm);
      if (Z(m.isAsyncPlaceholder)) {
        h(d.asyncFactory.resolved)
          ? Te(m.elm, d, y)
          : (d.isAsyncPlaceholder = !0);
        return;
      }
      if (
        Z(d.isStatic) &&
        Z(m.isStatic) &&
        d.key === m.key &&
        (Z(d.isCloned) || Z(d.isOnce))
      ) {
        d.componentInstance = m.componentInstance;
        return;
      }
      var P,
        W = d.data;
      h(W) && h((P = W.hook)) && h((P = P.prepatch)) && P(m, d);
      var B = m.children,
        V = d.children;
      if (h(W) && b(d)) {
        for (P = 0; P < n.update.length; ++P) n.update[P](m, d);
        h((P = W.hook)) && h((P = P.update)) && P(m, d);
      }
      (A(d.text)
        ? h(B) && h(V)
          ? B !== V && _e(j, B, V, y, z)
          : h(V)
            ? (h(m.text) && i.setTextContent(j, ""),
              O(j, null, V, 0, V.length - 1, y))
            : h(B)
              ? G(B, 0, B.length - 1)
              : h(m.text) && i.setTextContent(j, "")
        : m.text !== d.text && i.setTextContent(j, d.text),
        h(W) && h((P = W.hook)) && h((P = P.postpatch)) && P(m, d));
    }
  }
  function ve(m, d, y) {
    if (Z(y) && h(m.parent)) m.parent.data.pendingInsert = d;
    else for (var C = 0; C < d.length; ++C) d[C].data.hook.insert(d[C]);
  }
  var wt = !1,
    Ve = Oe("attrs,class,staticClass,staticStyle,key");
  function Te(m, d, y, C) {
    var T,
      z = d.tag,
      j = d.data,
      P = d.children;
    if (
      ((C = C || (j && j.pre)),
      (d.elm = m),
      Z(d.isComment) && h(d.asyncFactory))
    )
      return ((d.isAsyncPlaceholder = !0), !0);
    if (
      h(j) &&
      (h((T = j.hook)) && h((T = T.init)) && T(d, !0),
      h((T = d.componentInstance)))
    )
      return (v(d, y), !0);
    if (h(z)) {
      if (h(P))
        if (!m.hasChildNodes()) x(d, P, y);
        else if (h((T = j)) && h((T = T.domProps)) && h((T = T.innerHTML))) {
          if (T !== m.innerHTML) return !1;
        } else {
          for (var W = !0, B = m.firstChild, V = 0; V < P.length; V++) {
            if (!B || !Te(B, P[V], y, C)) {
              W = !1;
              break;
            }
            B = B.nextSibling;
          }
          if (!W || B) return !1;
        }
      if (h(j)) {
        var Q = !1;
        for (var Ne in j)
          if (!Ve(Ne)) {
            ((Q = !0), w(d, y));
            break;
          }
        !Q && j.class && vr(j.class);
      }
    } else m.data !== d.text && (m.data = d.text);
    return !0;
  }
  function je(m, d, y) {
    return h(d.tag)
      ? d.tag.indexOf("vue-component") === 0 ||
          (!u(d, y) &&
            d.tag.toLowerCase() === (m.tagName && m.tagName.toLowerCase()))
      : m.nodeType === (d.isComment ? 8 : 3);
  }
  return function (d, y, C, T) {
    if (A(y)) {
      h(d) && L(d);
      return;
    }
    var z = !1,
      j = [];
    if (A(d)) ((z = !0), p(y, j));
    else {
      var P = h(d.nodeType);
      if (!P && ct(d, y)) $e(d, y, j, null, null, T);
      else {
        if (P) {
          if (
            (d.nodeType === 1 &&
              d.hasAttribute(bo) &&
              (d.removeAttribute(bo), (C = !0)),
            Z(C) && Te(d, y, j))
          )
            return (ve(y, j, !0), d);
          d = a(d);
        }
        var W = d.elm,
          B = i.parentNode(W);
        if ((p(y, j, W._leaveCb ? null : B, i.nextSibling(W)), h(y.parent)))
          for (var V = y.parent, Q = b(y); V; ) {
            for (var Ne = 0; Ne < n.destroy.length; ++Ne) n.destroy[Ne](V);
            if (((V.elm = y.elm), Q)) {
              for (var it = 0; it < n.create.length; ++it) n.create[it](Ge, V);
              var at = V.data.hook.insert;
              if (at.merged)
                for (var st = at.fns.slice(1), xt = 0; xt < st.length; xt++)
                  st[xt]();
            } else Nt(V);
            V = V.parent;
          }
        h(B) ? G([d], 0, 0) : h(d.tag) && L(d);
      }
    }
    return (ve(y, j, z), y.elm);
  };
}
var Vu = {
  create: zr,
  update: zr,
  destroy: function (t) {
    zr(t, Ge);
  },
};
function zr(e, t) {
  (e.data.directives || t.data.directives) && Hu(e, t);
}
function Hu(e, t) {
  var r = e === Ge,
    n = t === Ge,
    o = qo(e.data.directives, e.context),
    i = qo(t.data.directives, t.context),
    a = [],
    s = [],
    c,
    u,
    f;
  for (c in i)
    ((u = o[c]),
      (f = i[c]),
      u
        ? ((f.oldValue = u.value),
          (f.oldArg = u.arg),
          Ft(f, "update", t, e),
          f.def && f.def.componentUpdated && s.push(f))
        : (Ft(f, "bind", t, e), f.def && f.def.inserted && a.push(f)));
  if (a.length) {
    var p = function () {
      for (var _ = 0; _ < a.length; _++) Ft(a[_], "inserted", t, e);
    };
    r ? We(t, "insert", p) : p();
  }
  if (
    (s.length &&
      We(t, "postpatch", function () {
        for (var _ = 0; _ < s.length; _++) Ft(s[_], "componentUpdated", t, e);
      }),
    !r)
  )
    for (c in o) i[c] || Ft(o[c], "unbind", e, e, n);
}
var Wu = Object.create(null);
function qo(e, t) {
  var r = Object.create(null);
  if (!e) return r;
  var n, o;
  for (n = 0; n < e.length; n++) {
    if (
      ((o = e[n]),
      o.modifiers || (o.modifiers = Wu),
      (r[Gu(o)] = o),
      t._setupState && t._setupState.__sfc)
    ) {
      var i = o.def || wr(t, "_setupState", "v-" + o.name);
      typeof i == "function" ? (o.def = { bind: i, update: i }) : (o.def = i);
    }
    o.def = o.def || wr(t.$options, "directives", o.name, !0);
  }
  return r;
}
function Gu(e) {
  return (
    e.rawName ||
    "".concat(e.name, ".").concat(Object.keys(e.modifiers || {}).join("."))
  );
}
function Ft(e, t, r, n, o) {
  var i = e.def && e.def[t];
  if (i)
    try {
      i(r.elm, e, r, n, o);
    } catch (a) {
      ht(a, r.context, "directive ".concat(e.name, " ").concat(t, " hook"));
    }
}
var qu = [Fu, Vu];
function Jo(e, t) {
  var r = t.componentOptions;
  if (
    !(h(r) && r.Ctor.options.inheritAttrs === !1) &&
    !(A(e.data.attrs) && A(t.data.attrs))
  ) {
    var n,
      o,
      i,
      a = t.elm,
      s = e.data.attrs || {},
      c = t.data.attrs || {};
    (h(c.__ob__) || Z(c._v_attr_proxy)) && (c = t.data.attrs = q({}, c));
    for (n in c) ((o = c[n]), (i = s[n]), i !== o && Ko(a, n, o, t.data.pre));
    (Ct || gn) && c.value !== s.value && Ko(a, "value", c.value);
    for (n in s)
      A(c[n]) &&
        (An(n)
          ? a.removeAttributeNS(cn, qi(n))
          : Gi(n) || a.removeAttribute(n));
  }
}
function Ko(e, t, r, n) {
  n || e.tagName.indexOf("-") > -1
    ? Zo(e, t, r)
    : hu(t)
      ? xr(r)
        ? e.removeAttribute(t)
        : ((r = t === "allowfullscreen" && e.tagName === "EMBED" ? "true" : t),
          e.setAttribute(t, r))
      : Gi(t)
        ? e.setAttribute(t, gu(t, r))
        : An(t)
          ? xr(r)
            ? e.removeAttributeNS(cn, qi(t))
            : e.setAttributeNS(cn, t, r)
          : Zo(e, t, r);
}
function Zo(e, t, r) {
  if (xr(r)) e.removeAttribute(t);
  else {
    if (
      Ct &&
      !It &&
      e.tagName === "TEXTAREA" &&
      t === "placeholder" &&
      r !== "" &&
      !e.__ieph
    ) {
      var n = function (o) {
        (o.stopImmediatePropagation(), e.removeEventListener("input", n));
      };
      (e.addEventListener("input", n), (e.__ieph = !0));
    }
    e.setAttribute(t, r);
  }
}
var Ju = { create: Jo, update: Jo };
function Yo(e, t) {
  var r = t.elm,
    n = t.data,
    o = e.data;
  if (
    !(
      A(n.staticClass) &&
      A(n.class) &&
      (A(o) || (A(o.staticClass) && A(o.class)))
    )
  ) {
    var i = _u(t),
      a = r._transitionClasses;
    (h(a) && (i = Rn(i, Mn(a))),
      i !== r._prevClass && (r.setAttribute("class", i), (r._prevClass = i)));
  }
}
var Ku = { create: Yo, update: Yo },
  Br = "__r",
  Vr = "__c";
function Zu(e) {
  if (h(e[Br])) {
    var t = Ct ? "change" : "input";
    ((e[t] = [].concat(e[Br], e[t] || [])), delete e[Br]);
  }
  h(e[Vr]) && ((e.change = [].concat(e[Vr], e.change || [])), delete e[Vr]);
}
var qt;
function Yu(e, t, r) {
  var n = qt;
  return function o() {
    var i = t.apply(null, arguments);
    i !== null && Ki(e, o, r, n);
  };
}
var Xu = Qr && !(wo && Number(wo[1]) <= 53);
function Qu(e, t, r, n) {
  if (Xu) {
    var o = zi,
      i = t;
    t = i._wrapper = function (a) {
      if (
        a.target === a.currentTarget ||
        a.timeStamp >= o ||
        a.timeStamp <= 0 ||
        a.target.ownerDocument !== document
      )
        return i.apply(this, arguments);
    };
  }
  qt.addEventListener(e, t, wi ? { capture: r, passive: n } : r);
}
function Ki(e, t, r, n) {
  (n || qt).removeEventListener(e, t._wrapper || t, r);
}
function Hr(e, t) {
  if (!(A(e.data.on) && A(t.data.on))) {
    var r = t.data.on || {},
      n = e.data.on || {};
    ((qt = t.elm || e.elm),
      Zu(r),
      Ci(r, n, Qu, Ki, Yu, t.context),
      (qt = void 0));
  }
}
var el = {
    create: Hr,
    update: Hr,
    destroy: function (e) {
      return Hr(e, Ge);
    },
  },
  ar;
function Xo(e, t) {
  if (!(A(e.data.domProps) && A(t.data.domProps))) {
    var r,
      n,
      o = t.elm,
      i = e.data.domProps || {},
      a = t.data.domProps || {};
    (h(a.__ob__) || Z(a._v_attr_proxy)) && (a = t.data.domProps = q({}, a));
    for (r in i) r in a || (o[r] = "");
    for (r in a) {
      if (((n = a[r]), r === "textContent" || r === "innerHTML")) {
        if ((t.children && (t.children.length = 0), n === i[r])) continue;
        o.childNodes.length === 1 && o.removeChild(o.childNodes[0]);
      }
      if (r === "value" && o.tagName !== "PROGRESS") {
        o._value = n;
        var s = A(n) ? "" : String(n);
        rl(o, s) && (o.value = s);
      } else if (r === "innerHTML" && jn(o.tagName) && A(o.innerHTML)) {
        ((ar = ar || document.createElement("div")),
          (ar.innerHTML = "<svg>".concat(n, "</svg>")));
        for (var c = ar.firstChild; o.firstChild; ) o.removeChild(o.firstChild);
        for (; c.firstChild; ) o.appendChild(c.firstChild);
      } else if (n !== i[r])
        try {
          o[r] = n;
        } catch {}
    }
  }
}
function rl(e, t) {
  return !e.composing && (e.tagName === "OPTION" || nl(e, t) || ol(e, t));
}
function nl(e, t) {
  var r = !0;
  try {
    r = document.activeElement !== e;
  } catch {}
  return r && e.value !== t;
}
function ol(e, t) {
  var r = e.value,
    n = e._vModifiers;
  if (h(n)) {
    if (n.number) return Bt(r) !== Bt(t);
    if (n.trim) return r.trim() !== t.trim();
  }
  return r !== t;
}
var il = { create: Xo, update: Xo },
  al = vt(function (e) {
    var t = {},
      r = /;(?![^(]*\))/g,
      n = /:(.+)/;
    return (
      e.split(r).forEach(function (o) {
        if (o) {
          var i = o.split(n);
          i.length > 1 && (t[i[0].trim()] = i[1].trim());
        }
      }),
      t
    );
  });
function Wr(e) {
  var t = Zi(e.style);
  return e.staticStyle ? q(e.staticStyle, t) : t;
}
function Zi(e) {
  return Array.isArray(e) ? hi(e) : typeof e == "string" ? al(e) : e;
}
function sl(e, t) {
  var r = {},
    n;
  if (t)
    for (var o = e; o.componentInstance; )
      ((o = o.componentInstance._vnode),
        o && o.data && (n = Wr(o.data)) && q(r, n));
  (n = Wr(e.data)) && q(r, n);
  for (var i = e; (i = i.parent); ) i.data && (n = Wr(i.data)) && q(r, n);
  return r;
}
var cl = /^--/,
  Qo = /\s*!important$/,
  ei = function (e, t, r) {
    if (cl.test(t)) e.style.setProperty(t, r);
    else if (Qo.test(r))
      e.style.setProperty(Kt(t), r.replace(Qo, ""), "important");
    else {
      var n = ul(t);
      if (Array.isArray(r))
        for (var o = 0, i = r.length; o < i; o++) e.style[n] = r[o];
      else e.style[n] = r;
    }
  },
  ti = ["Webkit", "Moz", "ms"],
  sr,
  ul = vt(function (e) {
    if (
      ((sr = sr || document.createElement("div").style),
      (e = dt(e)),
      e !== "filter" && e in sr)
    )
      return e;
    for (
      var t = e.charAt(0).toUpperCase() + e.slice(1), r = 0;
      r < ti.length;
      r++
    ) {
      var n = ti[r] + t;
      if (n in sr) return n;
    }
  });
function ri(e, t) {
  var r = t.data,
    n = e.data;
  if (!(A(r.staticStyle) && A(r.style) && A(n.staticStyle) && A(n.style))) {
    var o,
      i,
      a = t.elm,
      s = n.staticStyle,
      c = n.normalizedStyle || n.style || {},
      u = s || c,
      f = Zi(t.data.style) || {};
    t.data.normalizedStyle = h(f.__ob__) ? q({}, f) : f;
    var p = sl(t, !0);
    for (i in u) A(p[i]) && ei(a, i, "");
    for (i in p) ((o = p[i]), ei(a, i, o ?? ""));
  }
}
var ll = { create: ri, update: ri },
  Yi = /\s+/;
function Xi(e, t) {
  if (!(!t || !(t = t.trim())))
    if (e.classList)
      t.indexOf(" ") > -1
        ? t.split(Yi).forEach(function (n) {
            return e.classList.add(n);
          })
        : e.classList.add(t);
    else {
      var r = " ".concat(e.getAttribute("class") || "", " ");
      r.indexOf(" " + t + " ") < 0 && e.setAttribute("class", (r + t).trim());
    }
}
function Qi(e, t) {
  if (!(!t || !(t = t.trim())))
    if (e.classList)
      (t.indexOf(" ") > -1
        ? t.split(Yi).forEach(function (o) {
            return e.classList.remove(o);
          })
        : e.classList.remove(t),
        e.classList.length || e.removeAttribute("class"));
    else {
      for (
        var r = " ".concat(e.getAttribute("class") || "", " "),
          n = " " + t + " ";
        r.indexOf(n) >= 0;
      )
        r = r.replace(n, " ");
      ((r = r.trim()),
        r ? e.setAttribute("class", r) : e.removeAttribute("class"));
    }
}
function ea(e) {
  if (e) {
    if (typeof e == "object") {
      var t = {};
      return (e.css !== !1 && q(t, ni(e.name || "v")), q(t, e), t);
    } else if (typeof e == "string") return ni(e);
  }
}
var ni = vt(function (e) {
    return {
      enterClass: "".concat(e, "-enter"),
      enterToClass: "".concat(e, "-enter-to"),
      enterActiveClass: "".concat(e, "-enter-active"),
      leaveClass: "".concat(e, "-leave"),
      leaveToClass: "".concat(e, "-leave-to"),
      leaveActiveClass: "".concat(e, "-leave-active"),
    };
  }),
  ta = xe && !It,
  Et = "transition",
  Gr = "animation",
  fr = "transition",
  Er = "transitionend",
  ln = "animation",
  ra = "animationend";
ta &&
  (window.ontransitionend === void 0 &&
    window.onwebkittransitionend !== void 0 &&
    ((fr = "WebkitTransition"), (Er = "webkitTransitionEnd")),
  window.onanimationend === void 0 &&
    window.onwebkitanimationend !== void 0 &&
    ((ln = "WebkitAnimation"), (ra = "webkitAnimationEnd")));
var oi = xe
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : function (e) {
      return e();
    };
function na(e) {
  oi(function () {
    oi(e);
  });
}
function ft(e, t) {
  var r = e._transitionClasses || (e._transitionClasses = []);
  r.indexOf(t) < 0 && (r.push(t), Xi(e, t));
}
function Le(e, t) {
  (e._transitionClasses && Xe(e._transitionClasses, t), Qi(e, t));
}
function oa(e, t, r) {
  var n = ia(e, t),
    o = n.type,
    i = n.timeout,
    a = n.propCount;
  if (!o) return r();
  var s = o === Et ? Er : ra,
    c = 0,
    u = function () {
      (e.removeEventListener(s, f), r());
    },
    f = function (p) {
      p.target === e && ++c >= a && u();
    };
  (setTimeout(function () {
    c < a && u();
  }, i + 1),
    e.addEventListener(s, f));
}
var pl = /\b(transform|all)(,|$)/;
function ia(e, t) {
  var r = window.getComputedStyle(e),
    n = (r[fr + "Delay"] || "").split(", "),
    o = (r[fr + "Duration"] || "").split(", "),
    i = ii(n, o),
    a = (r[ln + "Delay"] || "").split(", "),
    s = (r[ln + "Duration"] || "").split(", "),
    c = ii(a, s),
    u,
    f = 0,
    p = 0;
  t === Et
    ? i > 0 && ((u = Et), (f = i), (p = o.length))
    : t === Gr
      ? c > 0 && ((u = Gr), (f = c), (p = s.length))
      : ((f = Math.max(i, c)),
        (u = f > 0 ? (i > c ? Et : Gr) : null),
        (p = u ? (u === Et ? o.length : s.length) : 0));
  var _ = u === Et && pl.test(r[fr + "Property"]);
  return { type: u, timeout: f, propCount: p, hasTransform: _ };
}
function ii(e, t) {
  for (; e.length < t.length; ) e = e.concat(e);
  return Math.max.apply(
    null,
    t.map(function (r, n) {
      return ai(r) + ai(e[n]);
    }),
  );
}
function ai(e) {
  return Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function pn(e, t) {
  var r = e.elm;
  h(r._leaveCb) && ((r._leaveCb.cancelled = !0), r._leaveCb());
  var n = ea(e.data.transition);
  if (!A(n) && !(h(r._enterCb) || r.nodeType !== 1)) {
    for (
      var o = n.css,
        i = n.type,
        a = n.enterClass,
        s = n.enterToClass,
        c = n.enterActiveClass,
        u = n.appearClass,
        f = n.appearToClass,
        p = n.appearActiveClass,
        _ = n.beforeEnter,
        v = n.enter,
        g = n.afterEnter,
        E = n.enterCancelled,
        x = n.beforeAppear,
        b = n.appear,
        w = n.afterAppear,
        N = n.appearCancelled,
        O = n.duration,
        L = pt,
        G = pt.$vnode;
      G && G.parent;
    )
      ((L = G.context), (G = G.parent));
    var J = !L._isMounted || !e.isRootInsert;
    if (!(J && !b && b !== "")) {
      var _e = J && u ? u : a,
        bt = J && p ? p : c,
        ot = J && f ? f : s,
        $e = (J && x) || _,
        ve = J && K(b) ? b : v,
        wt = (J && w) || g,
        Ve = (J && N) || E,
        Te = Bt(ne(O) ? O.enter : O),
        je = o !== !1 && !It,
        m = Pn(ve),
        d = (r._enterCb = dr(function () {
          (je && (Le(r, ot), Le(r, bt)),
            d.cancelled ? (je && Le(r, _e), Ve && Ve(r)) : wt && wt(r),
            (r._enterCb = null));
        }));
      (e.data.show ||
        We(e, "insert", function () {
          var y = r.parentNode,
            C = y && y._pending && y._pending[e.key];
          (C && C.tag === e.tag && C.elm._leaveCb && C.elm._leaveCb(),
            ve && ve(r, d));
        }),
        $e && $e(r),
        je &&
          (ft(r, _e),
          ft(r, bt),
          na(function () {
            (Le(r, _e),
              d.cancelled ||
                (ft(r, ot), m || (sa(Te) ? setTimeout(d, Te) : oa(r, i, d))));
          })),
        e.data.show && (t && t(), ve && ve(r, d)),
        !je && !m && d());
    }
  }
}
function aa(e, t) {
  var r = e.elm;
  h(r._enterCb) && ((r._enterCb.cancelled = !0), r._enterCb());
  var n = ea(e.data.transition);
  if (A(n) || r.nodeType !== 1) return t();
  if (h(r._leaveCb)) return;
  var o = n.css,
    i = n.type,
    a = n.leaveClass,
    s = n.leaveToClass,
    c = n.leaveActiveClass,
    u = n.beforeLeave,
    f = n.leave,
    p = n.afterLeave,
    _ = n.leaveCancelled,
    v = n.delayLeave,
    g = n.duration,
    E = o !== !1 && !It,
    x = Pn(f),
    b = Bt(ne(g) ? g.leave : g),
    w = (r._leaveCb = dr(function () {
      (r.parentNode &&
        r.parentNode._pending &&
        (r.parentNode._pending[e.key] = null),
        E && (Le(r, s), Le(r, c)),
        w.cancelled ? (E && Le(r, a), _ && _(r)) : (t(), p && p(r)),
        (r._leaveCb = null));
    }));
  v ? v(N) : N();
  function N() {
    w.cancelled ||
      (!e.data.show &&
        r.parentNode &&
        ((r.parentNode._pending || (r.parentNode._pending = {}))[e.key] = e),
      u && u(r),
      E &&
        (ft(r, a),
        ft(r, c),
        na(function () {
          (Le(r, a),
            w.cancelled ||
              (ft(r, s), x || (sa(b) ? setTimeout(w, b) : oa(r, i, w))));
        })),
      f && f(r, w),
      !E && !x && w());
  }
}
function sa(e) {
  return typeof e == "number" && !isNaN(e);
}
function Pn(e) {
  if (A(e)) return !1;
  var t = e.fns;
  return h(t) ? Pn(Array.isArray(t) ? t[0] : t) : (e._length || e.length) > 1;
}
function si(e, t) {
  t.data.show !== !0 && pn(t);
}
var fl = xe
    ? {
        create: si,
        activate: si,
        remove: function (e, t) {
          e.data.show !== !0 ? aa(e, t) : t();
        },
      }
    : {},
  dl = [Ju, Ku, el, il, ll, fl],
  ml = dl.concat(qu),
  gl = Bu({ nodeOps: Lu, modules: ml });
It &&
  document.addEventListener("selectionchange", function () {
    var e = document.activeElement;
    e && e.vmodel && Ln(e, "input");
  });
var ca = {
  inserted: function (e, t, r, n) {
    r.tag === "select"
      ? (n.elm && !n.elm._vOptions
          ? We(r, "postpatch", function () {
              ca.componentUpdated(e, t, r);
            })
          : ci(e, t, r.context),
        (e._vOptions = [].map.call(e.options, kr)))
      : (r.tag === "textarea" || un(e.type)) &&
        ((e._vModifiers = t.modifiers),
        t.modifiers.lazy ||
          (e.addEventListener("compositionstart", hl),
          e.addEventListener("compositionend", pi),
          e.addEventListener("change", pi),
          It && (e.vmodel = !0)));
  },
  componentUpdated: function (e, t, r) {
    if (r.tag === "select") {
      ci(e, t, r.context);
      var n = e._vOptions,
        o = (e._vOptions = [].map.call(e.options, kr));
      if (
        o.some(function (a, s) {
          return !mt(a, n[s]);
        })
      ) {
        var i = e.multiple
          ? t.value.some(function (a) {
              return li(a, o);
            })
          : t.value !== t.oldValue && li(t.value, o);
        i && Ln(e, "change");
      }
    }
  },
};
function ci(e, t, r) {
  (ui(e, t, r),
    (Ct || gn) &&
      setTimeout(function () {
        ui(e, t, r);
      }, 0));
}
function ui(e, t, r) {
  var n = t.value,
    o = e.multiple;
  if (!(o && !Array.isArray(n))) {
    for (var i, a, s = 0, c = e.options.length; s < c; s++)
      if (((a = e.options[s]), o))
        ((i = vi(n, kr(a)) > -1), a.selected !== i && (a.selected = i));
      else if (mt(kr(a), n)) {
        e.selectedIndex !== s && (e.selectedIndex = s);
        return;
      }
    o || (e.selectedIndex = -1);
  }
}
function li(e, t) {
  return t.every(function (r) {
    return !mt(r, e);
  });
}
function kr(e) {
  return "_value" in e ? e._value : e.value;
}
function hl(e) {
  e.target.composing = !0;
}
function pi(e) {
  e.target.composing && ((e.target.composing = !1), Ln(e.target, "input"));
}
function Ln(e, t) {
  var r = document.createEvent("HTMLEvents");
  (r.initEvent(t, !0, !0), e.dispatchEvent(r));
}
function fn(e) {
  return e.componentInstance && (!e.data || !e.data.transition)
    ? fn(e.componentInstance._vnode)
    : e;
}
var _l = {
    bind: function (e, t, r) {
      var n = t.value;
      r = fn(r);
      var o = r.data && r.data.transition,
        i = (e.__vOriginalDisplay =
          e.style.display === "none" ? "" : e.style.display);
      n && o
        ? ((r.data.show = !0),
          pn(r, function () {
            e.style.display = i;
          }))
        : (e.style.display = n ? i : "none");
    },
    update: function (e, t, r) {
      var n = t.value,
        o = t.oldValue;
      if (!n != !o) {
        r = fn(r);
        var i = r.data && r.data.transition;
        i
          ? ((r.data.show = !0),
            n
              ? pn(r, function () {
                  e.style.display = e.__vOriginalDisplay;
                })
              : aa(r, function () {
                  e.style.display = "none";
                }))
          : (e.style.display = n ? e.__vOriginalDisplay : "none");
      }
    },
    unbind: function (e, t, r, n, o) {
      o || (e.style.display = e.__vOriginalDisplay);
    },
  },
  vl = { model: ca, show: _l },
  ua = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object],
  };
function dn(e) {
  var t = e && e.componentOptions;
  return t && t.Ctor.options.abstract ? dn(Ri(t.children)) : e;
}
function la(e) {
  var t = {},
    r = e.$options;
  for (var n in r.propsData) t[n] = e[n];
  var o = r._parentListeners;
  for (var n in o) t[dt(n)] = o[n];
  return t;
}
function fi(e, t) {
  if (/\d-keep-alive$/.test(t.tag))
    return e("keep-alive", { props: t.componentOptions.propsData });
}
function yl(e) {
  for (; (e = e.parent); ) if (e.data.transition) return !0;
}
function bl(e, t) {
  return t.key === e.key && t.tag === e.tag;
}
var wl = function (e) {
    return e.tag || Ht(e);
  },
  xl = function (e) {
    return e.name === "show";
  },
  El = {
    name: "transition",
    props: ua,
    abstract: !0,
    render: function (e) {
      var t = this,
        r = this.$slots.default;
      if (r && ((r = r.filter(wl)), !!r.length)) {
        var n = this.mode,
          o = r[0];
        if (yl(this.$vnode)) return o;
        var i = dn(o);
        if (!i) return o;
        if (this._leaving) return fi(e, o);
        var a = "__transition-".concat(this._uid, "-");
        i.key =
          i.key == null
            ? i.isComment
              ? a + "comment"
              : a + i.tag
            : Jt(i.key)
              ? String(i.key).indexOf(a) === 0
                ? i.key
                : a + i.key
              : i.key;
        var s = ((i.data || (i.data = {})).transition = la(this)),
          c = this._vnode,
          u = dn(c);
        if (
          (i.data.directives &&
            i.data.directives.some(xl) &&
            (i.data.show = !0),
          u &&
            u.data &&
            !bl(i, u) &&
            !Ht(u) &&
            !(u.componentInstance && u.componentInstance._vnode.isComment))
        ) {
          var f = (u.data.transition = q({}, s));
          if (n === "out-in")
            return (
              (this._leaving = !0),
              We(f, "afterLeave", function () {
                ((t._leaving = !1), t.$forceUpdate());
              }),
              fi(e, o)
            );
          if (n === "in-out") {
            if (Ht(i)) return c;
            var p,
              _ = function () {
                p();
              };
            (We(s, "afterEnter", _),
              We(s, "enterCancelled", _),
              We(f, "delayLeave", function (v) {
                p = v;
              }));
          }
        }
        return o;
      }
    },
  },
  pa = q({ tag: String, moveClass: String }, ua);
delete pa.mode;
var kl = {
  props: pa,
  beforeMount: function () {
    var e = this,
      t = this._update;
    this._update = function (r, n) {
      var o = Li(e);
      (e.__patch__(e._vnode, e.kept, !1, !0),
        (e._vnode = e.kept),
        o(),
        t.call(e, r, n));
    };
  },
  render: function (e) {
    for (
      var t = this.tag || this.$vnode.data.tag || "span",
        r = Object.create(null),
        n = (this.prevChildren = this.children),
        o = this.$slots.default || [],
        i = (this.children = []),
        a = la(this),
        s = 0;
      s < o.length;
      s++
    ) {
      var c = o[s];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf("__vlist") !== 0)
          (i.push(c),
            (r[c.key] = c),
            ((c.data || (c.data = {})).transition = a));
        else if (0) var u, f;
      }
    }
    if (n) {
      for (var p = [], _ = [], s = 0; s < n.length; s++) {
        var c = n[s];
        ((c.data.transition = a),
          (c.data.pos = c.elm.getBoundingClientRect()),
          r[c.key] ? p.push(c) : _.push(c));
      }
      ((this.kept = e(t, null, p)), (this.removed = _));
    }
    return e(t, null, i);
  },
  updated: function () {
    var e = this.prevChildren,
      t = this.moveClass || (this.name || "v") + "-move";
    !e.length ||
      !this.hasMove(e[0].elm, t) ||
      (e.forEach($l),
      e.forEach(Nl),
      e.forEach(Sl),
      (this._reflow = document.body.offsetHeight),
      e.forEach(function (r) {
        if (r.data.moved) {
          var n = r.elm,
            o = n.style;
          (ft(n, t),
            (o.transform = o.WebkitTransform = o.transitionDuration = ""),
            n.addEventListener(
              Er,
              (n._moveCb = function i(a) {
                (a && a.target !== n) ||
                  ((!a || /transform$/.test(a.propertyName)) &&
                    (n.removeEventListener(Er, i),
                    (n._moveCb = null),
                    Le(n, t)));
              }),
            ));
        }
      }));
  },
  methods: {
    hasMove: function (e, t) {
      if (!ta) return !1;
      if (this._hasMove) return this._hasMove;
      var r = e.cloneNode();
      (e._transitionClasses &&
        e._transitionClasses.forEach(function (o) {
          Qi(r, o);
        }),
        Xi(r, t),
        (r.style.display = "none"),
        this.$el.appendChild(r));
      var n = ia(r);
      return (this.$el.removeChild(r), (this._hasMove = n.hasTransform));
    },
  },
};
function $l(e) {
  (e.elm._moveCb && e.elm._moveCb(), e.elm._enterCb && e.elm._enterCb());
}
function Nl(e) {
  e.data.newPos = e.elm.getBoundingClientRect();
}
function Sl(e) {
  var t = e.data.pos,
    r = e.data.newPos,
    n = t.left - r.left,
    o = t.top - r.top;
  if (n || o) {
    e.data.moved = !0;
    var i = e.elm.style;
    ((i.transform = i.WebkitTransform =
      "translate(".concat(n, "px,").concat(o, "px)")),
      (i.transitionDuration = "0s"));
  }
}
var Cl = { Transition: El, TransitionGroup: kl };
X.config.mustUseProp = du;
X.config.isReservedTag = Ji;
X.config.isReservedAttr = pu;
X.config.getTagNamespace = Eu;
X.config.isUnknownElement = ku;
q(X.options.directives, vl);
q(X.options.components, Cl);
X.prototype.__patch__ = xe ? gl : ee;
X.prototype.$mount = function (e, t) {
  return ((e = e && xe ? $u(e) : void 0), yc(this, e, t));
};
xe &&
  setTimeout(function () {
    se.devtools && mr && mr.emit("init", X);
  }, 0);
var ie = {
  result: "$result",
  item: "$item",
  index: "$index",
  askEachTime: "$ask_each_time",
  clipboard: "$clipboard",
  currentDate: "$current_date",
  deviceDetails: "$device_details",
};
function Nr(e, t) {
  return `$input:${e}:${encodeURIComponent(t)}`;
}
function Qe(e) {
  if (typeof e != "string") return;
  let t = /^\$input:([^:]+):(.+)$/.exec(e);
  if (t)
    try {
      return { uuid: t[1], field: decodeURIComponent(t[2]) };
    } catch {
      return;
    }
}
function fa(e) {
  return typeof e == "string" && (Object.values(ie).includes(e) || !!Qe(e));
}
var ce = {
    if: "end_if",
    repeat: "end_repeat",
    repeat_each: "end_repeat_each",
    try: "end_try",
  },
  et = new Set(["otherwise", "on_error", ...Object.values(ce)]);
function Ue(e, t) {
  let r = ce[e[t]?.type];
  if (!r) return t;
  let n = [r];
  for (let o = t + 1; o < e.length; o++) {
    let i = e[o].type;
    if (ce[i]) n.push(ce[i]);
    else if (i === n[n.length - 1] && (n.pop(), !n.length)) return o;
  }
  return t;
}
function da(e) {
  let t = [];
  return e.map((r) => {
    let n = r.type;
    n === t[t.length - 1] && t.pop();
    let o =
      n === "otherwise" || n === "on_error"
        ? Math.max(0, t.length - 1)
        : t.length;
    return (ce[n] && t.push(ce[n]), o);
  });
}
function ma(e) {
  let t = 0;
  function r(n) {
    let o = [];
    for (; t < e.length && !n.has(e[t].type); ) {
      let i = e[t++];
      if (et.has(i.type))
        throw new Error(`Unexpected ${i.type.replace(/_/g, " ")}`);
      if (i.type === "try" && Ue(e, t - 1) === t - 1)
        throw new Error("Try is missing End Try");
      if (!ce[i.type] || Ue(e, t - 1) === t - 1) {
        o.push({ kind: "action", step: i });
        continue;
      }
      if (i.type === "if") {
        let a = r(new Set(["otherwise", "end_if"])),
          s = [];
        if (
          (e[t]?.type === "otherwise" && (t++, (s = r(new Set(["end_if"])))),
          e[t]?.type !== "end_if")
        )
          throw new Error("If is missing End If");
        (t++, o.push({ kind: "if", step: i, yes: a, no: s }));
      } else if (i.type === "try") {
        let a = r(new Set(["on_error", "end_try"]));
        if (e[t]?.type !== "on_error")
          throw new Error("Try is missing On Error");
        t++;
        let s = r(new Set(["end_try"]));
        if (e[t]?.type !== "end_try") throw new Error("Try is missing End Try");
        (t++, o.push({ kind: "try", step: i, body: a, onError: s }));
      } else {
        let a = r(new Set([ce[i.type]]));
        if (e[t]?.type !== ce[i.type])
          throw new Error(`${i.type} is missing its end marker`);
        (t++, o.push({ kind: i.type, step: i, children: a }));
      }
    }
    return o;
  }
  return r(new Set());
}
function Sr(e, t) {
  let r = [],
    n = (o) => {
      if (Array.isArray(o)) return o;
      if (typeof o != "string") return [];
      try {
        let i = JSON.parse(o || "[]");
        return Array.isArray(i) ? i : void 0;
      } catch {
        return;
      }
    };
  for (let o = 0; o < e.length; o++) {
    let i = e[o];
    if (!ce[i.type] || Ue(e, o) > o) {
      r.push(i);
      continue;
    }
    let a = n(i.params?.actions),
      s = i.type === "if" ? n(i.params?.otherwise) : [];
    if (!a || !s) {
      r.push(i);
      continue;
    }
    (r.push({ ...i, params: { ...i.params, actions: "", otherwise: "" } }),
      r.push(...Sr(a, t)),
      i.type === "if" &&
        (r.push({ type: "otherwise", uuid: t(), params: {} }),
        r.push(...Sr(s, t))),
      r.push({ type: ce[i.type], uuid: t(), params: {} }));
  }
  return r;
}
var F = class e {
  static isRunning = !1;
  static runId = 0;
  static watchdogSeconds = 60;
  static selected = void 0;
  static all = [];
  static draft = vn({ name: "", icon: "play_arrow", intents: [] });
  static result = void 0;
  static lastOutput = void 0;
  static executionStack = [];
  static showContextMenu(t, r) {
    let n = t;
    ((e.selected = n),
      new Menu([
        ...(e.canRun(n)
          ? [
              {
                name: "Run",
                icon: "play_arrow",
                click: () => {
                  Blockbench.showMessageBox(
                    {
                      title: "Run Macro",
                      message: `Run "${n.name}"?`,
                      buttons: ["macro.run", "dialog.cancel"],
                      confirm: 0,
                      cancel: 1,
                    },
                    (o) => {
                      if (o !== 0) return;
                      let i = e.all.indexOf(n);
                      i !== -1 && e.run(i);
                    },
                  );
                },
              },
            ]
          : []),
        {
          name: "Edit",
          icon: "edit",
          click: () => {
            e.openEditor(n);
          },
        },
        {
          name: "Duplicate",
          icon: "content_copy",
          click: () => {
            let o = JSON.parse(JSON.stringify(n)),
              i = `${n.name} Copy`,
              a = i;
            for (let u = 2; e.all.some((f) => f.name === a); u++)
              a = `${i} ${u}`;
            o.name = a;
            let s = new Map(o.intents.map((u) => [u.uuid, guid()]));
            for (let u of o.intents) {
              u.uuid = s.get(u.uuid);
              for (let [f, p] of Object.entries(u.params)) {
                let _ = Qe(p);
                _ &&
                  s.has(_.uuid) &&
                  (u.params[f] = Nr(s.get(_.uuid), _.field));
              }
            }
            let c = e.all.indexOf(n);
            (e.all.splice(c < 0 ? e.all.length : c + 1, 0, o), e.save());
          },
        },
        {
          name: "Export",
          icon: "insert_drive_file",
          click: () => {
            let o =
              n.name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "macro";
            Blockbench.export({
              type: "Macro",
              extensions: ["json"],
              name: o,
              content: JSON.stringify(n, null, 2),
              savetype: "text",
            });
          },
        },
        {
          name: "Delete",
          icon: "delete",
          click: () => {
            Blockbench.showMessageBox(
              {
                title: "Delete Macro",
                message: `Delete "${n.name}"?`,
                buttons: ["dialog.delete", "dialog.cancel"],
                confirm: 0,
                cancel: 1,
              },
              (o) => {
                if (o !== 0) return;
                let i = e.all.indexOf(n);
                i !== -1 &&
                  (e.all.splice(i, 1),
                  e.selected === n && (e.selected = void 0),
                  e.save());
              },
            );
          },
        },
      ]).open(r));
  }
  static component = {
    name: "Macro",
    props: { macro: { type: Object } },
    data() {
      return {};
    },
    methods: {
      showContextMenu: this.showContextMenu,
      unavailableReason: this.unavailableReason,
    },
    template: `
    <div>
      <div class="macro_options_button" :title="unavailableReason(macro)" @click="showContextMenu(macro, $event)" @contextmenu.prevent="showContextMenu(macro, $event)">
          <i class="material-icons">{{ unavailableReason(macro) ? 'warning' : 'more_horiz' }}</i>
      </div>
      <div class="macro_icon">
          <i class="material-icons">{{ macro.icon }}</i>
      </div>
      <div class="macro_name">{{ macro.name }}</div>
    </div>`,
  };
  static load() {
    let t = JSON.stringify([yo, jr, Pr, Qt]);
    e.all = vn({
      items: JSON.parse(localStorage.getItem("macros") ?? t),
    }).items;
    let r = [
        [jr, "cb528404-54af-4fad-88f3-860905b464fa"],
        [Pr, "ba0463f8-12ed-4ddd-82ef-0674137ad595"],
        [Qt, "6c4f4bef-d87d-49fd-ba85-bc2a0aa68bcd"],
      ],
      n = !1;
    for (let o of e.all) {
      let i = r.find(
        ([_]) => _.name === o.name || (_ === Qt && o.name === "Render Items"),
      );
      if (!i) continue;
      let [a, s] = i,
        c = [
          [
            "get_project_items",
            "6c4f4bef-d87d-49fd-ba85-bc2a0aa68bcd",
            { items: "selected_elements" },
          ],
          [
            "set_variable",
            "f5f9795d-267f-4507-b13e-1d7c1d25354e",
            { name: "render_items", input: "$result" },
          ],
          ["choose_output_folder", "6d40a245-3907-42b0-aa0b-96453af24669", {}],
          [
            "set_variable",
            "94e3dd0b-f36d-4538-839c-e55a28f09439",
            { name: "render_folder", input: "$result" },
          ],
          [
            "repeat_each",
            "95ab83b2-7c9d-488c-8ea4-eb83dbe6da22",
            { items: "$input:f5f9795d-267f-4507-b13e-1d7c1d25354e:input" },
          ],
          [
            "set_element_visibility",
            "9d575951-b103-4d97-b82e-62316214aba6",
            { element: "$item", mode: "isolate" },
          ],
          [
            "take_screenshot",
            "4ccf70e3-aae2-4d5e-a6f7-c2e190535d96",
            { source: "clean" },
          ],
          [
            "save_image",
            "6e395c6a-3fd2-49c3-a277-9ae7e3bb3ff5",
            {
              image: "$result",
              name: "$item",
              folder: "$input:94e3dd0b-f36d-4538-839c-e55a28f09439:input",
            },
          ],
          ["end_repeat_each", "9d4d4971-28b7-420c-9f03-3c823cfaeea9", {}],
          [
            "set_element_visibility",
            "963d7cf9-aeec-47c4-a813-d65db81881ce",
            { mode: "restore" },
          ],
        ];
      if (
        o.name === "Render Items" &&
        o.intents.length === c.length &&
        o.intents.every((_, v) => {
          let [g, E, x] = c[v];
          return (
            _.type === g &&
            _.uuid === E &&
            Object.keys(_.params).length === Object.keys(x).length &&
            Object.entries(x).every(([b, w]) => _.params[b] === w)
          );
        })
      ) {
        ((o.name = a.name),
          o.intents.splice(
            0,
            o.intents.length,
            ...JSON.parse(JSON.stringify(a.intents)),
          ),
          (n = !0));
        continue;
      }
      let u = [
        ["get_project_items", "6c4f4bef-d87d-49fd-ba85-bc2a0aa68bcd"],
        ["repeat_each", "95ab83b2-7c9d-488c-8ea4-eb83dbe6da22"],
        ["set_element_visibility", "9d575951-b103-4d97-b82e-62316214aba6"],
        ["take_screenshot", "4ccf70e3-aae2-4d5e-a6f7-c2e190535d96"],
        ["save_image", "6e395c6a-3fd2-49c3-a277-9ae7e3bb3ff5"],
        ["end_repeat_each", "9d4d4971-28b7-420c-9f03-3c823cfaeea9"],
        ["set_element_visibility", "963d7cf9-aeec-47c4-a813-d65db81881ce"],
      ];
      if (
        o.name === "Render Items" &&
        o.intents.length === u.length &&
        o.intents.every((_, v) => _.type === u[v][0] && _.uuid === u[v][1]) &&
        o.intents[0].params.items === "selected_elements" &&
        o.intents[1].params.items === "$result" &&
        o.intents[2].params.element === "$item" &&
        o.intents[2].params.mode === "isolate" &&
        o.intents[3].params.source === "clean" &&
        o.intents[4].params.image === "$result" &&
        o.intents[4].params.name === "$item" &&
        o.intents[4].params.folder === "" &&
        o.intents[6].params.mode === "restore"
      ) {
        (o.intents.splice(
          0,
          o.intents.length,
          ...JSON.parse(JSON.stringify(a.intents)),
        ),
          (o.name = a.name),
          (n = !0));
        continue;
      }
      let f = {
        "Export All": "export_all_projects",
        "Randomize Height": "randomize_cube_height",
        "Render Items": "render_selected_items",
      };
      if (
        o.intents.length === 1 &&
        o.intents[0].uuid === s &&
        o.intents[0].type === f[o.name]
      ) {
        (o.intents.splice(0, 1, ...JSON.parse(JSON.stringify(a.intents))),
          (o.name = a.name),
          (n = !0));
        continue;
      }
      let p = o.intents.find(
        (_) =>
          _.uuid === s &&
          _.type === "show_content" &&
          _.params?.text === "Not implemented!",
      );
      p &&
        (o.intents.splice(
          o.intents.indexOf(p),
          1,
          ...JSON.parse(JSON.stringify(a.intents)),
        ),
        (o.name = a.name),
        (n = !0));
    }
    (n && e.save(), (e.selected = e.all[0]));
  }
  static save() {
    localStorage.setItem("macros", JSON.stringify(e.all));
  }
  static importMacro() {
    Blockbench.import(
      { type: "Macro", extensions: ["json"], readtype: "text", multiple: !1 },
      (t) => {
        if (t?.length)
          try {
            let r = JSON.parse(String(t[0].content));
            if (!r || typeof r != "object" || Array.isArray(r))
              throw new Error("Invalid macro file");
            let n = r;
            if (
              typeof n.name != "string" ||
              !n.name.trim() ||
              typeof n.icon != "string" ||
              !Array.isArray(n.intents) ||
              n.intents.some(
                (i) =>
                  !i ||
                  typeof i.type != "string" ||
                  typeof i.uuid != "string" ||
                  !i.params ||
                  typeof i.params != "object" ||
                  Array.isArray(i.params),
              )
            )
              throw new Error("Invalid macro file");
            let o = { name: n.name, icon: n.icon, intents: n.intents };
            (e.all.push(o), e.save());
          } catch (r) {
            Blockbench.showMessageBox({
              title: "Import Macro",
              message: r instanceof Error ? r.message : String(r),
            });
          }
      },
    );
  }
  static openEditor(t) {
    ((e.selected = t),
      (e.draft.name = t?.name ?? `Macro ${e.all.length + 1}`),
      (e.draft.icon = t?.icon ?? "play_arrow"),
      e.draft.intents.splice(
        0,
        e.draft.intents.length,
        ...JSON.parse(JSON.stringify(t?.intents ?? [])),
      ),
      e.draft.intents.splice(
        0,
        e.draft.intents.length,
        ...Sr(e.draft.intents, guid),
      ));
    let r = new Set();
    for (let n of e.draft.intents)
      ((!n.uuid || r.has(n.uuid)) && (n.uuid = guid()), r.add(n.uuid));
    l.editDialog.show();
  }
  static saveDraft() {
    let t = JSON.parse(JSON.stringify(e.draft));
    t.name = t.name.trim() || "Untitled Macro";
    let r = e.selected ? e.all.indexOf(e.selected) : -1;
    return (
      r === -1 ? e.all.push(t) : e.all.splice(r, 1, t),
      (e.selected = e.all[r === -1 ? e.all.length - 1 : r]),
      e.save(),
      e.all.indexOf(e.selected)
    );
  }
  static format(t, r) {
    return t.replace(/\$(\w+)/g, (n, o) => {
      let i = o in r ? String(r[o]) : "";
      return `<span class="param" data-key="${o}">${i}</span>`;
    });
  }
  static canRun(t) {
    for (let r of t.intents) if (!l.canPerform(r.type)) return !1;
    return !0;
  }
  static unavailableReason(t) {
    let r = t.intents.filter((i) => !l.canPerform(i.type));
    if (!r.length) return "";
    let n = [...new Set(r.map((i) => l.all.get(i.type)?.getName() ?? i.type))];
    return `Can't run on ${Blockbench.isWeb ? "web" : "desktop"}: ${n.join(", ")}`;
  }
  static renderSummary(t) {
    let r = l.all.get(t.type);
    return r
      ? `<p>${this.format(tl(r.options.summary(t.params)) ?? tl(r.options.name ?? ""), t.params)}</p>`
      : `<p style="color: red;">Unknown intent <code>${t.type}</code></p>`;
  }
  static async run(t) {
    if (this.isRunning) {
      Blockbench.showQuickMessage("message.macro_running");
      return;
    }
    let r = this.all[t];
    if (!r) return;
    if (!e.canRun(r)) {
      Blockbench.showMessageBox({
        title: r.name ?? "Macro",
        message: "message.unsupported_variant",
      });
      return;
    }
    if (!r.intents) return;
    this.isRunning = !0;
    let n = ++this.runId;
    ((this.result = void 0),
      (this.lastOutput = void 0),
      Blockbench.showQuickMessage("message.run_macro"),
      Blockbench.setProgress(0));
    let o,
      i = Number(this.watchdogSeconds),
      a =
        Number.isFinite(i) && i > 0
          ? new Promise((s, c) => {
              o = setTimeout(() => {
                (this.runId++,
                  (this.executionStack = []),
                  c(
                    new Error(
                      `Macro exceeded the ${i} second watchdog limit and was stopped.`,
                    ),
                  ));
              }, i * 1e3);
            })
          : void 0;
    try {
      this.result = await (a
        ? Promise.race([this.executeMacro(r, void 0), a])
        : this.executeMacro(r, void 0));
    } catch (s) {
      (console.error("Macro failed", s),
        Blockbench.showMessageBox({
          title: r.name || "Macro",
          message: s instanceof Error ? s.message : String(s),
        }));
    } finally {
      (o !== void 0 && clearTimeout(o),
        (this.isRunning = !1),
        Blockbench.setProgress(0));
    }
  }
  static async executeMacro(t, r) {
    let n = this.runId,
      o = this.executionStack,
      i = () => {
        if (n !== this.runId) throw new Error("Macro stopped");
      };
    if (o.includes(t)) throw new Error(`Macro recursion detected: ${t.name}`);
    if (o.length >= 8) throw new Error("Macro calls are nested too deeply");
    if (!this.canRun(t))
      throw new Error(`Macro has unavailable actions: ${t.name}`);
    o.push(t);
    let a = t.intents.length,
      s = 0,
      c = new Map(),
      u = r;
    try {
      let f = async (_, v, g) => {
          let E = Object.fromEntries(
              Object.entries(_.params ?? {}).map(([b, w]) => [
                b,
                w === "$item" ? v : w === "$index" ? g : w,
              ]),
            ),
            x = await this.resolveParams(E, c, t, u);
          return (x && c.set(_.uuid, x), x);
        },
        p = async (_, v = 0, g, E) => {
          if (v > 8) throw new Error("Control flow is nested too deeply");
          for (let x of _) {
            i();
            let b = x.step;
            (s++,
              o.length === 1 &&
                (Blockbench.showStatusMessage(`Macro action (${s}/${a})`, 2e3),
                Blockbench.setProgress(Math.min(1, s / a))));
            let w = await f(b, g, E);
            if ((i(), w === null)) return !0;
            if (x.kind === "if") {
              let N =
                w.condition !== !1 && w.condition !== "false" && !!w.condition;
              if (await p(N ? x.yes : x.no, v + 1, g, E)) return !0;
            } else if (x.kind === "try")
              try {
                if (await p(x.body, v + 1, g, E)) return !0;
              } catch (N) {
                i();
                let O = N && typeof N == "object" ? N : void 0;
                if (
                  ((u = {
                    name: typeof O?.name == "string" ? O.name : "Error",
                    message:
                      typeof O?.message == "string" ? O.message : String(N),
                  }),
                  await p(x.onError, v + 1, g, E))
                )
                  return !0;
              }
            else if (x.kind === "repeat") {
              let N = Number(w.count);
              if (!Number.isInteger(N) || N < 0 || N > 1e3)
                throw new Error("Repeat count must be between 0 and 1000");
              for (let O = 0; O < N; O++)
                if (await p(x.children, v + 1, g, O)) return !0;
            } else if (x.kind === "repeat_each") {
              let N = w.items === "" || w.items === void 0 ? u : w.items,
                O = Array.isArray(N)
                  ? N
                  : String(N ?? "")
                      .split(/\r?\n/)
                      .filter(Boolean);
              if (O.length > 1e3)
                throw new Error("Repeat Each supports at most 1000 items");
              let L = [];
              for (let G = 0; G < O.length; G++) {
                if (((u = O[G]), await p(x.children, v + 1, O[G], G)))
                  return !0;
                L.push(u);
              }
              u = L;
            } else {
              let N = l.all.get(b.type);
              if (!N) continue;
              this.result = u;
              let O = await N.perform(w, t, u);
              if ((i(), O === "__return")) return !0;
              if (
                O &&
                typeof O == "object" &&
                !Array.isArray(O) &&
                "__macro_stop" in O
              )
                return (
                  o.length === 1 && (this.lastOutput = O.value),
                  (u = O.value),
                  !0
                );
              u = O;
            }
          }
          return !1;
        };
      return (await p(ma(t.intents)), i(), u);
    } finally {
      o.pop();
    }
  }
  static async resolveParams(t, r, n, o) {
    let i = {};
    for (let [a, s] of Object.entries(t))
      if (
        ((i[a] = await this.resolveValue(s, r, n, a, o)),
        s === ie.askEachTime && i[a] === void 0)
      )
        return null;
    return i;
  }
  static async resolveValue(t, r, n, o, i) {
    if (t === ie.result) return i;
    if (t === ie.askEachTime)
      return new Promise((s) => {
        new Dialog({
          title: n.name,
          form: { value: { type: "text", label: o.replace(/_/g, " ") } },
          buttons: ["dialog.ok", "dialog.cancel"],
          onConfirm(c) {
            s(c.value);
          },
          onCancel() {
            s(void 0);
          },
        }).show();
      });
    if (t === ie.clipboard)
      try {
        return await navigator.clipboard.readText();
      } catch {
        return (Blockbench.showQuickMessage("Unable to read clipboard"), "");
      }
    if (t === ie.currentDate) return new Date();
    if (t === ie.deviceDetails)
      return JSON.stringify({
        platform: navigator.platform,
        language: navigator.language,
        userAgent: navigator.userAgent,
        online: navigator.onLine,
        variant: Blockbench.isWeb ? "web" : "desktop",
      });
    let a = Qe(t);
    return a ? r.get(a.uuid)?.[a.field] : t;
  }
};
function ga(e) {
  return Plugins.installed.some((t) => t.id === e);
}
function Fn(e, t) {
  localStorage.setItem(`${Mt}:${e}`, JSON.stringify(t));
}
function Cr(e, t) {
  let r = localStorage.getItem(`${Mt}:${e}`);
  return r ? JSON.parse(r) : t;
}
var Un = {
  search_web: "travel_explore",
  open_urls: "open_in_new",
  get_items_from_rss_feed: "rss_feed",
  get_rss_feeds_from_page: "dynamic_feed",
  url: "link",
  url_encode: "code",
  get_urls_from_input: "link_off",
  get_component_of_url: "segment",
  expand_url: "unfold_more",
  get_contents_of_url: "cloud_download",
  get_headers_of_url: "http",
  get_contents_of_web_page: "web",
  comment: "comment",
  show_content: "message",
  show_alert: "warning",
  ask_input: "question_mark",
  count: "format_list_numbered",
  choose_from_menu: "menu_open",
  if: "call_split",
  repeat: "repeat",
  repeat_each: "repeat_on",
  try: "shield",
  on_error: "error_outline",
  end_try: "verified_user",
  otherwise: "alt_route",
  end_if: "merge_type",
  end_repeat: "repeat_one",
  end_repeat_each: "loop",
  wait: "access_time",
  set_variable: "assignment",
  get_variable: "assignment_return",
  add_variable: "add_box",
  list: "list",
  choose_from_list: "playlist_add_check",
  sort_list: "sort_by_alpha",
  remove_duplicates: "filter_alt",
  join_list: "merge_type",
  get_from_list: "playlist_play",
  dictionary: "menu_book",
  get_dictionary_keys: "key",
  merge_dictionaries: "merge",
  get_dictionary_value: "auto_stories",
  set_dictionary_value: "edit_note",
  get_dictionary_from: "library_books",
  number: "pin",
  random_number: "casino",
  round_number: "adjust",
  format_number: "numbers",
  get_numbers_input: "dialpad",
  calculate: "calculate",
  calculate_expression: "functions",
  calculate_statistics: "bar_chart",
  measurement: "straighten",
  convert_measurement: "square_foot",
  date: "today",
  format_date: "date_range",
  adjust_date: "edit_calendar",
  get_time_between_dates: "hourglass_empty",
  get_dates_input: "event",
  convert_time_zone: "schedule",
  text: "text_fields",
  get_text_input: "input",
  show_definition: "local_library",
  get_name_emoji: "emoji_emotions",
  change_case: "title",
  combine_text: "merge",
  split_text: "splitscreen",
  replace_text: "find_replace",
  trim_whitespace: "format_clear",
  match_text: "manage_search",
  get_group_from_matched_text: "group_work",
  correct_spelling: "spellcheck",
  speak_text: "record_voice_over",
  make_spoken_audio_from_text: "graphic_eq",
  detect_language: "language",
  translate_text: "translate",
  get_name: "badge",
  get_type: "category",
  set_name: "drive_file_rename_outline",
  show_content_graph: "account_tree",
  get_actions: "apps",
  run_action: "play_arrow",
  run_macro: "account_tree",
  get_whats_on_screen: "desktop_windows",
  base64_encode: "data_object",
  generate_hash: "fingerprint",
  format_file_size: "storage",
  stop_and_output: "output",
  stop: "stop_circle",
  wait_to_return: "pause_circle",
  run_script_over_ssh: "terminal",
  open_x_callback_url: "call_made",
  nothing: "block",
  convert_image: "transform",
  filter_images: "filter_alt",
  get_details_of_image: "image_search",
  get_image_from_input: "add_photo_alternate",
  make_image_from_rich_text: "article",
  extract_text_from_image: "document_scanner",
  markup: "draw",
  combine_images: "collections",
  crop_image: "crop",
  flip_image: "flip",
  mask_image: "gradient",
  overlay_image: "layers",
  overlay_text: "text_format",
  resize_image: "photo_size_select_large",
  rotate_image: "rotate_right",
  remove_image_background: "filter",
  get_frames_from_image: "burst_mode",
  share: "share",
  copy_to_clipboard: "content_copy",
  get_clipboard: "content_paste",
  make_gif: "gif",
  create_qr_code: "qr_code_2",
  select_file: "attach_file",
  move_file: "drive_file_move",
  rename_file: "mode_edit",
  save_file: "save",
  delete_file: "delete",
  create_folder: "create_new_folder",
  get_contents_of_folder: "folder_open",
  find_files: "find_in_page",
  get_file_from_folder: "folder_shared",
  append_to_text_file: "post_add",
  make_archive: "archive",
  extract_archive: "unarchive",
  open_file: "file_open",
  get_details_of_files: "file_present",
  filter_files: "filter_list",
  set_appearance: "palette",
  take_screenshot: "screenshot",
  save_image: "save_alt",
  add_flag: "flag",
  remove_flag: "outlined_flag",
  get_flags: "tour",
  get_setting_value: "settings_suggest",
  set_setting_value: "settings_applications",
  select_project: "tab",
  close_project: "tab_unselected",
  export_project: "upload_file",
  import_project: "file_download",
  convert_format: "change_circle",
  run_blockbench_action: "smart_button",
  add_animation: "animation",
  remove_animation: "motion_photos_off",
  add_cube: "view_in_ar",
  remove_cube: "disabled_by_default",
  add_group: "group_add",
  remove_group: "group_remove",
  open_group: "expand_circle_down",
  on_event: "event_available",
  show_preview_scene: "preview",
  add_texture_group: "playlist_add",
  remove_texture_group: "playlist_remove",
  add_texture_layer: "add_to_photos",
  remove_texture_layer: "remove_circle_outline",
  get_project_items: "inventory_2",
  select_elements: "select_all",
  filter_project_items: "filter_list",
  get_element_property: "data_object",
  set_element_property: "edit_attributes",
  set_cube_dimension: "aspect_ratio",
  set_element_visibility: "visibility",
};
var ze = ((c) => (
    (c.Text = "text"),
    (c.Number = "number"),
    (c.Boolean = "boolean"),
    (c.URL = "url"),
    (c.Date = "date"),
    (c.Enum = "enum"),
    (c.Variable = "variable"),
    (c.AskEachTime = "ask"),
    c
  ))(ze || {}),
  l = class e {
    static DEFAULT_PINNED = ["show_content"];
    static menu;
    static manageDialog;
    static editDialog;
    static all = new Map();
    static get pinned() {
      let t = Cr("pinned_intents", e.DEFAULT_PINNED);
      return [...this.all.values()].filter((r) => t?.includes(r.id));
    }
    static get categories() {
      let t = new Map();
      for (let r of e.all.values()) {
        let n = r.options.category;
        n && t.set(n, tl(`macros.category.${n}`));
      }
      return t;
    }
    static search(t) {
      let r = t.split(" "),
        n = [],
        o = [],
        i = [];
      for (let s of r) {
        if (s.startsWith("category:")) {
          n.push(s.replace("category:", ""));
          continue;
        }
        if (s.startsWith("plugin:")) {
          o.push(s.replace("plugin:", ""));
          continue;
        }
        i.push(s);
      }
      let a = i.join(" ").toLowerCase();
      return [...e.all.values()].filter((s) => {
        let c = s.options.category,
          u = n.length === 0 || (c !== void 0 && n.includes(c)),
          f = o.length === 0 || (s instanceof tt && o.includes(s.pluginId)),
          p = a.length === 0 || s.getName().toLowerCase().includes(a);
        return (u && f) || p;
      });
    }
    static component = {
      name: "Intent",
      props: { intent: { type: Object } },
      data() {
        return {
          formId: guid(),
          showForm: !1,
          intentType: e.all.get(this.intent?.type),
          form: void 0,
        };
      },
      mounted() {
        let t = new InputForm(this.intentType.form).node;
        $(`#${this.formId}`).append(t);
      },
      methods: {
        renderSummary(t) {
          return F.renderSummary(t);
        },
        deleteIntent(t) {
          F.selected &&
            (F.selected.intents = F.selected.intents.filter(
              (r) => r.uuid !== t,
            ));
        },
      },
      template: `
  <div>
    <div class="delete_macro_intent_button" @click="deleteIntent(intent.uuid)">
        <i class="material-icons">clear</i>
    </div>
    <div class="intent_icon">
        <i class="material-icons">{{intentType.options?.icon ?? 'token'}}</i>
    </div>
    <div class="intent_summary" v-html="renderSummary(intent)"></div>
    <span class="form_intent_button" v-if="intentType.options.form" @click="showForm = !showForm">
      <i class="material-icons" v-if="showForm">keyboard_arrow_down</i>
      <i class="material-icons" v-else>keyboard_arrow_right</i>
    </span>
    <div v-if="showForm && intentType.options.form"><hr><div :formId="id"></div></div>
  </div>`,
    };
    constructor(t, r) {
      if (
        ((this.id = t),
        (this.options = r ?? { perform: () => {} }),
        new.target === e &&
          Object.prototype.hasOwnProperty.call(Un, t) &&
          (this.options.icon = Un[t]),
        this.options.name || (this.options.name = tl(`macros.${this.id}`)),
        !this.options.description)
      ) {
        let n = `macros.${this.id}.desc`,
          o = tl(n);
        this.options.description = o === n ? this.options.name : o;
      }
      (this.options.summary ||
        (this.options.summary = () => tl(`macros.${this.id}.summary`)),
        this.initialize());
    }
    initialize() {
      e.all.set(this.id, this);
    }
    id;
    options;
    enumValues = new Map();
    getName() {
      return this.options.name ?? tl(`macros.${this.id}`);
    }
    addEnum(t, r) {
      return (this.enumValues.set(t, r), this);
    }
    async perform(t, r, n) {
      return await this.options.perform(t, r, n);
    }
    static canPerform(t) {
      let r = this.all.get(t);
      if (!r) return !1;
      let n = Blockbench.isWeb ? "web" : "desktop",
        o = r.options?.variant ?? "both";
      return o === "both" || o === n;
    }
    pin() {
      let t = new Set(Cr("pinned_intents", e.DEFAULT_PINNED));
      (t.add(this.id), Fn("pinned_intents", t));
    }
    unpin() {
      let t = new Set(Cr("pinned_intents", e.DEFAULT_PINNED));
      (t.delete(this.id), Fn("pinned_intents", t));
    }
  },
  tt = class e extends l {
    static pluginIds = new Set();
    pluginId;
    static get plugins() {
      return Plugins.installed.filter((t) => e.pluginIds.has(t.id));
    }
    constructor(t, r, n) {
      (super(t, n), (this.pluginId = r));
    }
    initialize() {
      ga(this.pluginId) && (super.initialize(), e.pluginIds.add(this.pluginId));
    }
  };
var U = (e) => String(e ?? "").trim(),
  D = (e, t = "text") => ({ name: e, type: t }),
  Bn = () => globalThis.Animation;
function ue(e) {
  let t = U(e.project),
    r = t
      ? ModelProject.all.find((n) => n.uuid === t || n.name === t)
      : Project;
  if (!r) throw new Error(t ? `Project not found: ${t}` : "No project is open");
  if (r !== Project && !r.select())
    throw new Error(`Could not select project: ${t}`);
  return r;
}
function Ce(e, t, r) {
  let n = U(t);
  if (!n) throw new Error(`${r} is required`);
  let o = e.find((i) => i.uuid === n || i.name === n);
  if (!o) throw new Error(`${r} not found: ${n}`);
  return o;
}
function Il(e) {
  let t = U(e) || "project",
    r = Codecs[t];
  if (!r) throw new Error(`Codec not found: ${t}`);
  return r;
}
function Ir(e, t) {
  if (e == null || e === "") return t;
  let r = (Array.isArray(e) ? e : U(e).split(/[\s,]+/)).map(Number);
  if (r.length !== 3 || r.some((n) => !Number.isFinite(n)))
    throw new Error("Expected three coordinates");
  return r;
}
function _a(e) {
  if (!Project) throw new Error("No project is open");
  let t = U(e);
  if (!t) throw new Error("Element is required");
  let r = [...Cube.all, ...Group.all].find((n) => n.uuid === t || n.name === t);
  if (!r) throw new Error(`Cube or group not found: ${t}`);
  return r;
}
function va(e, t) {
  switch (t) {
    case "name":
      return e.name;
    case "visibility":
      return e.visibility;
    case "rotation":
      return [...e.rotation];
    case "pivot":
      return [...e.origin];
    case "position":
      return [...(e instanceof Cube ? e.from : e.origin)];
    case "size":
      if (e instanceof Cube) return e.to.map((r, n) => r - e.from[n]);
      throw new Error("Size is only available for cubes");
    default:
      throw new Error(`Unknown element property: ${t}`);
  }
}
function Dl(e) {
  if (e === !0 || e === "true") return !0;
  if (e === !1 || e === "false") return !1;
  throw new Error("Visibility must be true or false");
}
var ha = (e) => (/\.(glb|bin)$/i.test(e) ? "buffer" : "text");
new l("add_flag", {
  category: "blockbench",
  parameters: [D("flag")],
  perform(e) {
    let t = U(e.flag);
    if (!t) throw new Error("Flag is required");
    return (Blockbench.addFlag(t), t);
  },
});
new l("remove_flag", {
  category: "blockbench",
  parameters: [D("flag")],
  perform(e) {
    let t = U(e.flag);
    if (!t) throw new Error("Flag is required");
    return (Blockbench.removeFlag(t), t);
  },
});
new l("get_flags", {
  category: "blockbench",
  perform() {
    return [...Blockbench.flags].map(String);
  },
});
new l("get_setting_value", {
  category: "blockbench",
  parameters: [D("setting")],
  perform(e) {
    let t = settings[U(e.setting)];
    if (!t) throw new Error(`Setting not found: ${e.setting}`);
    return t.value;
  },
});
new l("set_setting_value", {
  category: "blockbench",
  parameters: [D("setting"), D("value")],
  perform(e) {
    let t = settings[U(e.setting)];
    if (!t) throw new Error(`Setting not found: ${e.setting}`);
    let r = t.value,
      n =
        typeof r == "boolean"
          ? e.value === !0 || e.value === "true"
          : typeof r == "number"
            ? Number(e.value)
            : U(e.value);
    if (typeof n == "number" && !Number.isFinite(n))
      throw new Error("Setting value must be a number");
    return (t.set(n), t.value);
  },
});
new l("select_project", {
  category: "blockbench",
  parameters: [D("project")],
  perform(e) {
    return ue(e).name;
  },
});
new l("close_project", {
  category: "blockbench",
  parameters: [D("project")],
  async perform(e) {
    return ue(e).close();
  },
});
new l("export_project", {
  category: "blockbench",
  parameters: [D("project"), D("export")],
  perform(e) {
    return (ue(e), Il(e.export).export(), !0);
  },
});
new l("import_project", {
  category: "blockbench",
  parameters: [D("file")],
  async perform(e) {
    let t = U(e.file);
    if (t && Blockbench.isWeb)
      throw new Error("Importing a file path requires desktop Blockbench");
    return t
      ? new Promise((r, n) =>
          Blockbench.read([t], { readtype: ha(t) }, (o) => {
            try {
              if (!o?.length) throw new Error(`Could not read: ${t}`);
              (loadModelFile(o[0], {}), r(o[0].name));
            } catch (i) {
              n(i);
            }
          }),
        )
      : new Promise((r, n) =>
          Blockbench.import(
            {
              type: "Model",
              extensions: ["bbmodel", "json", "obj", "gltf", "glb"],
              readtype: ha,
            },
            (o) => {
              try {
                if (!o?.length) return r(void 0);
                (loadModelFile(o[0], {}), r(o[0].name));
              } catch (i) {
                n(i);
              }
            },
          ),
        );
  },
});
new l("convert_format", {
  category: "blockbench",
  parameters: [D("project"), D("format")],
  perform(e) {
    ue(e);
    let t = Formats[U(e.format)];
    if (!t) throw new Error(`Format not found: ${e.format}`);
    return (t.convertTo(), t.id);
  },
});
new l("run_blockbench_action", {
  category: "blockbench",
  parameters: [D("action")],
  perform(e) {
    let t = U(e.action),
      r = BarItems[t];
    if (!(r instanceof Action)) throw new Error(`Action not found: ${t}`);
    return r.trigger();
  },
});
new l("add_animation", {
  category: "blockbench",
  parameters: [D("project"), D("animation")],
  perform(e) {
    return (
      ue(e),
      new (Bn())({ name: U(e.animation) || "animation" }).add(!0).uuid
    );
  },
});
new l("remove_animation", {
  category: "blockbench",
  parameters: [D("project"), D("animation")],
  perform(e) {
    ue(e);
    let t = Ce(Bn().all, e.animation, "Animation");
    return (t.remove(!0), t.uuid);
  },
});
new l("add_cube", {
  category: "blockbench",
  parameters: [D("project"), D("cube"), D("position"), D("size"), D("group")],
  form: {
    position: { type: "vector", value: [0, 0, 0] },
    size: { type: "vector", value: [1, 1, 1] },
  },
  perform(e) {
    ue(e);
    let t = U(e.group) ? Ce(Group.all, e.group, "Group") : void 0;
    Undo.initEdit({ elements: [] });
    let r = Ir(e.position ?? e.from, [0, 0, 0]),
      n =
        e.position !== void 0 || e.size !== void 0
          ? Ir(e.size, [1, 1, 1]).map((i, a) => r[a] + i)
          : Ir(e.to, [1, 1, 1]),
      o = new Cube({ name: U(e.cube) || "cube", from: r, to: n })
        .addTo(t)
        .init();
    return (Undo.finishEdit("Add cube", { elements: [o] }), o.uuid);
  },
});
new l("remove_cube", {
  category: "blockbench",
  parameters: [D("project"), D("cube")],
  perform(e) {
    ue(e);
    let t = Ce(Cube.all, e.cube, "Cube");
    return (
      Undo.initEdit({ elements: [t] }),
      t.remove(),
      Undo.finishEdit("Remove cube", { elements: [] }),
      t.uuid
    );
  },
});
new l("add_group", {
  category: "blockbench",
  parameters: [D("project"), D("group"), D("parent")],
  perform(e) {
    ue(e);
    let t = U(e.parent) ? Ce(Group.all, e.parent, "Parent group") : void 0;
    Undo.initEdit({ outliner: !0 });
    let r = new Group({ name: U(e.group) || "group" }).addTo(t).init();
    return (Undo.finishEdit("Add group", { outliner: !0 }), r.uuid);
  },
});
new l("remove_group", {
  category: "blockbench",
  parameters: [D("project"), D("group")],
  perform(e) {
    ue(e);
    let t = Ce(Group.all, e.group, "Group"),
      r = t.uuid;
    return (t.remove(!0), r);
  },
});
new l("open_group", {
  category: "blockbench",
  parameters: [D("project"), D("group")],
  perform(e) {
    ue(e);
    let t = Ce(Group.all, e.group, "Group");
    return (t.openUp(), t.uuid);
  },
});
new l("on_event", {
  category: "blockbench",
  parameters: [D("event")],
  perform(e) {
    let t = U(e.event);
    if (!t) throw new Error("Event name is required");
    return new Promise((r) => Blockbench.once(t, (n) => r(n ?? !0)));
  },
});
new l("show_preview_scene", {
  category: "blockbench",
  parameters: [D("preview")],
  perform(e) {
    let t = U(e.preview);
    if (!t) return (PreviewScene.active?.unselect(), "");
    let r = PreviewScene.scenes[t];
    if (!r) throw new Error(`Preview scene not found: ${t}`);
    return (r.select(), r.id);
  },
});
new l("add_texture_group", {
  category: "blockbench",
  parameters: [D("project"), D("group")],
  perform(e) {
    return (
      ue(e),
      new TextureGroup({ name: U(e.group) || "group" }).add().uuid
    );
  },
});
new l("remove_texture_group", {
  category: "blockbench",
  parameters: [D("project"), D("group")],
  perform(e) {
    ue(e);
    let t = Ce(TextureGroup.all, e.group, "Texture group"),
      r = t.uuid;
    return (t.remove(), r);
  },
});
new l("add_texture_layer", {
  category: "blockbench",
  parameters: [D("project"), D("texture"), D("layer")],
  perform(e) {
    ue(e);
    let t = Ce(Texture.all, e.texture, "Texture"),
      r = new TextureLayer({ name: U(e.layer) || "layer" }, t);
    return (r.addForEditing(), r.uuid);
  },
});
new l("remove_texture_layer", {
  category: "blockbench",
  parameters: [D("project"), D("texture"), D("layer")],
  perform(e) {
    ue(e);
    let t = Ce(Texture.all, e.texture, "Texture"),
      r = Ce(t.layers, e.layer, "Texture layer"),
      n = r.uuid;
    return (r.remove(!0), n);
  },
});
new l("get_project_items", {
  category: "blockbench",
  parameters: [D("items", "enum")],
  perform(e) {
    switch (e.items) {
      case "projects":
        return ModelProject.all.map((t) => t.uuid);
      case "selected_cubes":
        return Cube.selected.map((t) => t.uuid);
      case "selected_elements":
        return OutlinerElement.selected.map((t) => t.uuid);
      default:
        throw new Error(`Unknown item collection: ${e.items}`);
    }
  },
}).addEnum("items", ["projects", "selected_cubes", "selected_elements"]);
new l("select_elements", {
  category: "blockbench",
  description:
    "Select outliner elements or groups by UUID or name. Accepts a list, or comma-separated or newline-separated names. Leave Elements empty to use the previous action's output.",
  parameters: [D("elements"), D("mode", "enum")],
  perform(e, t, r) {
    if (!Project) throw new Error("No project is open");
    let n = U(e.mode) || "replace";
    if (n !== "replace" && n !== "add")
      throw new Error(`Unknown selection mode: ${n}`);
    let o = e.elements === "" || e.elements == null ? r : e.elements,
      i = (Array.isArray(o) ? o : U(o).split(/[,\r\n]+/))
        .map(U)
        .filter(Boolean),
      a = [
        ...new Set(
          i.map((s) => {
            let c = Outliner.nodes.find((u) => u.uuid === s || u.name === s);
            if (!c) throw new Error(`Outliner element not found: ${s}`);
            if (c.locked) throw new Error(`Outliner element is locked: ${s}`);
            return c;
          }),
        ),
      ];
    (Undo.initSelection(), n === "replace" && unselectAll());
    for (let s of a) s.select({ ctrlOrCmd: !0 });
    return (Undo.finishSelection("Select elements"), a.map((s) => s.uuid));
  },
}).addEnum("mode", ["replace", "add"]);
new l("filter_project_items", {
  category: "blockbench",
  description:
    "Find cubes, groups, textures, or animations by name, visibility, and parent group. Returns their UUIDs.",
  parameters: [
    D("items", "enum"),
    D("name"),
    D("visibility", "enum"),
    D("parent"),
  ],
  perform(e) {
    if (!Project) throw new Error("No project is open");
    let t = U(e.items),
      r =
        t === "cubes"
          ? Cube.all
          : t === "groups"
            ? Group.all
            : t === "textures"
              ? Texture.all
              : t === "animations"
                ? Bn().all
                : void 0;
    if (!r) throw new Error(`Unknown project item collection: ${t}`);
    let n = U(e.name).toLowerCase(),
      o = U(e.visibility),
      i = U(e.parent);
    if (o && !["visible", "hidden"].includes(o))
      throw new Error(`Unknown visibility filter: ${o}`);
    if (o && t === "animations")
      throw new Error("Animations do not support a visibility filter");
    if (i && t === "animations")
      throw new Error("Animations do not have a parent group");
    let a =
      i && t === "textures"
        ? TextureGroup.all.find((c) => c.uuid === i || c.name === i)
        : void 0;
    return r
      .filter((c) => {
        if (n && !c.name.toLowerCase().includes(n)) return !1;
        let u = t === "textures" ? c.visible : c.visibility;
        if (o && u !== (o === "visible")) return !1;
        if (i)
          if (t === "textures") {
            if (!a || c.group !== a.uuid) return !1;
          } else {
            let f = c.parent;
            if (
              i === "root"
                ? f !== "root"
                : f === "root" || (f.uuid !== i && f.name !== i)
            )
              return !1;
          }
        return !0;
      })
      .map((c) => c.uuid);
  },
})
  .addEnum("items", ["cubes", "groups", "textures", "animations"])
  .addEnum("visibility", ["", "visible", "hidden"]);
new l("get_element_property", {
  category: "blockbench",
  description:
    "Read a cube or group property. Vectors are returned as three numbers.",
  parameters: [D("element"), D("property", "enum")],
  perform(e) {
    return va(_a(e.element), U(e.property));
  },
}).addEnum("property", [
  "name",
  "visibility",
  "position",
  "rotation",
  "size",
  "pivot",
]);
new l("set_element_property", {
  category: "blockbench",
  description:
    "Set a cube or group property. Enter vectors as x,y,z. Position moves a cube without changing its size; size applies to cubes only.",
  parameters: [D("element"), D("property", "enum"), D("value")],
  perform(e) {
    let t = _a(e.element),
      r = U(e.property);
    if (
      !["name", "visibility", "position", "rotation", "size", "pivot"].includes(
        r,
      )
    )
      throw new Error(`Unknown element property: ${r}`);
    if (r === "size" && !(t instanceof Cube))
      throw new Error("Size is only available for cubes");
    let n =
      r === "name"
        ? U(e.value)
        : r === "visibility"
          ? Dl(e.value)
          : Ir(e.value, [0, 0, 0]);
    if (r === "name" && !n) throw new Error("Element name is required");
    if (r === "size" && n.some((o) => o < 0))
      throw new Error("Cube size cannot be negative");
    switch (
      (Undo.initEdit({ outliner: !0, elements: t instanceof Cube ? [t] : [] }),
      r)
    ) {
      case "name":
        t.name = n;
        break;
      case "visibility":
        t.visibility = n;
        break;
      case "rotation":
        t.rotation = n;
        break;
      case "pivot":
        t.origin = n;
        break;
      case "position": {
        let o = n;
        if (t instanceof Cube) {
          let i = o.map((a, s) => a - t.from[s]);
          ((t.from = o),
            (t.to = t.to.map((a, s) => a + i[s])),
            (t.origin = t.origin.map((a, s) => a + i[s])));
        } else t.origin = o;
        break;
      }
      case "size": {
        let o = t;
        o.to = n.map((i, a) => o.from[a] + i);
        break;
      }
    }
    return (Canvas.updateAll(), Undo.finishEdit(`Set element ${r}`), va(t, r));
  },
}).addEnum("property", [
  "name",
  "visibility",
  "position",
  "rotation",
  "size",
  "pivot",
]);
new l("set_cube_dimension", {
  category: "blockbench",
  parameters: [D("cube"), D("axis", "enum"), D("size", "number")],
  perform(e) {
    if (!Project) throw new Error("No project is open");
    let t = Ce(Cube.all, e.cube, "Cube"),
      r = { x: 0, y: 1, z: 2 }[U(e.axis)],
      n = Number(e.size);
    if (r === void 0 || !Number.isFinite(n) || n < 0)
      throw new Error("Invalid cube dimension");
    return (
      Undo.initEdit({ elements: [t] }),
      (t.to[r] = t.from[r] + n),
      Canvas.updateView({ elements: [t], element_aspects: { geometry: !0 } }),
      Undo.finishEdit("Set cube dimension"),
      t.uuid
    );
  },
}).addEnum("axis", ["x", "y", "z"]);
var zn;
new l("set_element_visibility", {
  category: "blockbench",
  parameters: [D("element"), D("mode", "enum")],
  perform(e) {
    if (!Project) throw new Error("No project is open");
    let t = U(e.mode);
    if (t === "restore") {
      for (let n of OutlinerElement.all) {
        let o = zn?.get(n.uuid);
        o !== void 0 && (n.scene_object.visible = o);
      }
      return ((zn = void 0), !0);
    }
    let r = Ce(OutlinerElement.all, e.element, "Element");
    if (t === "isolate") {
      zn ??= new Map(
        OutlinerElement.all.map((n) => [n.uuid, n.scene_object.visible]),
      );
      for (let n of OutlinerElement.all) n.scene_object.visible = n === r;
    } else if (t === "show" || t === "hide")
      r.scene_object.visible = t === "show";
    else throw new Error(`Unknown visibility mode: ${t}`);
    return r.uuid;
  },
}).addEnum("mode", ["show", "hide", "isolate", "restore"]);
var ya = ((r) => ((r.Turn = "turn"), (r.Toggle = "toggle"), r))(ya || {}),
  ba = ((r) => ((r.Dark = "dark"), (r.Light = "light"), r))(ba || {});
function Dr(e) {
  let t = e.colors.back || e.colors.ui,
    n = document.createElement("canvas").getContext("2d");
  if (!n) throw new Error("Could not inspect theme colors");
  n.fillStyle = t;
  let o = n.fillStyle,
    i = /^#([0-9a-f]{6})$/i.exec(o),
    a = i
      ? [0, 2, 4].map((s) => parseInt(i[1].slice(s, s + 2), 16))
      : (o.match(/\d+(?:\.\d+)?/g) ?? []).slice(0, 3).map(Number);
  if (a.length !== 3)
    throw new Error(`Cannot determine appearance of theme: ${e.name}`);
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722 >= 128;
}
new l("set_appearance", {
  category: "controls",
  parameters: [
    { name: "op", type: "enum" },
    { name: "mode", type: "enum" },
  ],
  perform(e) {
    let t = CustomTheme.selected;
    if (!t) throw new Error("No theme is selected");
    let r = e.op === "toggle" ? (Dr(t) ? "dark" : "light") : e.mode;
    if (r !== "dark" && r !== "light")
      throw new Error(`Unknown appearance mode: ${r}`);
    if (Dr(t) === (r === "light")) return t.id;
    let n = CustomTheme.themes.filter(
        (i) => !i.desktop_only || !Blockbench.isWeb,
      ),
      o =
        n.find((i) => i.id === r) ??
        n.find((i) => i.source === "built_in" && Dr(i) === (r === "light")) ??
        n.find((i) => Dr(i) === (r === "light"));
    if (!o) throw new Error(`No ${r} theme is available`);
    return (CustomTheme.loadTheme(o), o.id);
  },
  summary: (e) =>
    tl(`macros.set_appearance.${e.op}`).replace("$operation", String(e.op)),
})
  .addEnum("op", Object.values(ya))
  .addEnum("mode", Object.values(ba));
new l("take_screenshot", {
  category: "controls",
  parameters: [
    { name: "source", type: "enum" },
    { name: "width", type: "number" },
    { name: "height", type: "number" },
  ],
  perform(e) {
    let t = Number(e.width) || void 0,
      r = Number(e.height) || void 0;
    if (t !== void 0 && (t < 1 || !Number.isFinite(t)))
      throw new Error("Invalid screenshot width");
    if (r !== void 0 && (r < 1 || !Number.isFinite(r)))
      throw new Error("Invalid screenshot height");
    let n = { width: t, height: r };
    return new Promise((o) => {
      let i = (a) => o(a);
      switch (e.source) {
        case "screen":
          Screencam.fullScreen(n, i);
          break;
        case "2d":
          Screencam.screenshot2DEditor(n, i);
          break;
        case "clean":
          Screencam.cleanCanvas(n, i);
          break;
        case "preview":
          if (!Preview.selected) throw new Error("No preview is selected");
          Screencam.screenshotPreview(Preview.selected, n, i);
          break;
        default:
          throw new Error(`Unknown screenshot source: ${e.source}`);
      }
    });
  },
}).addEnum("source", ["preview", "screen", "2d", "clean"]);
var Vn,
  wa = new Map();
new l("choose_output_folder", {
  category: "controls",
  async perform() {
    if (!Blockbench.isWeb)
      return (
        Blockbench.pickDirectory({
          title: "Choose output folder for renders",
        }) || "__return"
      );
    let e = window.showDirectoryPicker;
    if (typeof e != "function")
      throw new Error("This browser cannot choose an output folder");
    try {
      let t = await e.call(window, { mode: "readwrite" }),
        r = `browser-folder:${guid()}`;
      return (wa.set(r, t), r);
    } catch (t) {
      if (t?.name === "AbortError") return "__return";
      throw t;
    }
  },
});
new l("save_image", {
  category: "controls",
  parameters: [
    { name: "image", type: "text" },
    { name: "name", type: "text" },
    { name: "folder", type: "text" },
  ],
  async perform(e, t, r) {
    let n = String(e.image || r || ""),
      o = /^data:image\/png;base64,(.+)$/.exec(n);
    if (!o) throw new Error("Expected a PNG image");
    let i = Uint8Array.from(atob(o[1]), (u) => u.charCodeAt(0)),
      a =
        (String(e.name || "image")
          .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
          .trim() || "image") + ".png",
      s = String(e.folder || "");
    if (s.startsWith("browser-folder:")) {
      let u = wa.get(s);
      if (!u) throw new Error("Output folder is no longer available");
      let p = await (await u.getFileHandle(a, { create: !0 })).createWritable();
      return (await p.write(i), await p.close(), a);
    }
    let c = Blockbench.isWeb
      ? ""
      : s ||
        (() => {
          if (Vn?.runId === F.runId) return Vn.folder;
          let u = Blockbench.pickDirectory({ title: "Choose output folder" });
          return (u && (Vn = { runId: F.runId, folder: u }), u);
        })();
    if (!(!Blockbench.isWeb && !c)) {
      if (c) {
        let u = `${c.replace(/[\\/]$/, "")}/${a}`;
        return (
          await new Promise((f) =>
            Blockbench.writeFile(
              u,
              { content: i.buffer, savetype: "buffer" },
              () => f(),
            ),
          ),
          u
        );
      }
      return (
        Blockbench.export({
          type: "PNG Image",
          extensions: ["png"],
          name: a.slice(0, -4),
          content: i.buffer,
          savetype: "buffer",
        }),
        a
      );
    }
  },
});
var M = (e, t = "text") => ({ name: e, type: t }),
  Ee = (e, t) => (e === void 0 || e === "" ? t : e),
  de = (e) => String(e ?? "").trim();
function te() {
  if (Blockbench.isWeb)
    throw new Error("File actions require desktop Blockbench");
  let e = globalThis.require;
  if (typeof e != "function") throw new Error("Node access is unavailable");
  return {
    fs: e("node:fs"),
    path: e("node:path"),
    child: e("node:child_process"),
  };
}
function le(e, t) {
  let r = de(e);
  if (!r) throw new Error(`${t} is required`);
  return r;
}
function Or(e) {
  if (Array.isArray(e)) return e.flatMap(Or);
  let t = de(e);
  return t ? [t] : [];
}
function ka(e) {
  let { fs: t } = te(),
    r = t.statSync(e);
  return {
    path: e,
    name: te().path.basename(e),
    size: r.size,
    isDirectory: r.isDirectory(),
    created: r.birthtime.toISOString(),
    modified: r.mtime.toISOString(),
    extension: te().path.extname(e),
  };
}
function xa(e, t, r) {
  if (e === "" || e == null) return r;
  let n = Number(e);
  if (!Number.isFinite(n) || n < 0)
    throw new Error(`${t} must be a nonnegative number`);
  return n;
}
function Ea(e, t, r, n = !1) {
  if (e === "" || e == null) return r;
  let o = e instanceof Date ? e.getTime() : new Date(String(e)).getTime();
  if (!Number.isFinite(o)) throw new Error(`${t} must be a valid date`);
  return n && typeof e == "string" && /^\d{4}-\d{2}-\d{2}$/.test(e)
    ? o + 86399999
    : o;
}
function Ol(e) {
  let t = de(e);
  if (!t) return;
  let r = Array.from(t)
    .map((n) =>
      n === "*"
        ? ".*"
        : n === "?"
          ? "."
          : n.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&"),
    )
    .join("");
  return new RegExp(`^${r}$`, "i");
}
function $a(e, t) {
  let { child: r } = te(),
    n = r.spawnSync(e, t, { encoding: "utf8", windowsHide: !0 });
  if (n.error) throw n.error;
  if (n.status !== 0)
    throw new Error(n.stderr?.trim() || `${e} exited with code ${n.status}`);
}
new l("select_file", {
  category: "desktop",
  variant: "desktop",
  parameters: [M("file")],
  perform(e) {
    let t = de(e.file);
    return t
      ? (te().fs.accessSync(t), t)
      : new Promise((r) =>
          Blockbench.import(
            {
              type: "File",
              extensions: ["*"],
              readtype: "buffer",
              multiple: !1,
            },
            (n) => r(n?.[0]?.path || void 0),
          ),
        );
  },
});
new l("move_file", {
  category: "desktop",
  variant: "desktop",
  parameters: [M("src"), M("dest")],
  perform(e, t, r) {
    let { fs: n, path: o } = te(),
      i = le(Ee(e.src, r), "Source file"),
      a = le(e.dest, "Destination");
    return (
      n.existsSync(a) &&
        n.statSync(a).isDirectory() &&
        (a = o.join(a, o.basename(i))),
      n.renameSync(i, a),
      a
    );
  },
});
new l("rename_file", {
  category: "desktop",
  variant: "desktop",
  parameters: [M("file"), M("name")],
  perform(e, t, r) {
    let { fs: n, path: o } = te(),
      i = le(Ee(e.file, r), "File"),
      a = le(e.name, "New name");
    if (o.basename(a) !== a || a === "." || a === "..")
      throw new Error("New name must be a file name");
    let s = o.join(o.dirname(i), a);
    return (n.renameSync(i, s), s);
  },
});
new l("save_file", {
  category: "desktop",
  variant: "desktop",
  parameters: [M("file"), M("content")],
  perform(e, t, r) {
    let n = le(e.file, "File path"),
      o = Ee(e.content, r);
    return (
      te().fs.writeFileSync(
        n,
        typeof o == "string" ? o : JSON.stringify(o ?? "", null, 2),
        "utf8",
      ),
      n
    );
  },
});
new l("delete_file", {
  category: "desktop",
  variant: "desktop",
  parameters: [M("file")],
  perform(e, t, r) {
    let n = le(Ee(e.file, r), "File");
    return (te().fs.unlinkSync(n), n);
  },
});
new l("create_folder", {
  category: "desktop",
  variant: "desktop",
  parameters: [M("name"), M("path")],
  perform(e) {
    let { fs: t, path: r } = te(),
      n = le(e.name, "Folder name"),
      o = de(e.path) ? r.join(de(e.path), n) : n;
    return (t.mkdirSync(o, { recursive: !0 }), o);
  },
});
new l("get_contents_of_folder", {
  category: "desktop",
  variant: "desktop",
  parameters: [M("folder")],
  perform(e, t, r) {
    let { fs: n, path: o } = te(),
      i = le(Ee(e.folder, r), "Folder");
    return n.readdirSync(i).map((a) => o.join(i, a));
  },
});
new l("find_files", {
  category: "desktop",
  variant: "desktop",
  description:
    "Find files in a folder. Name Pattern uses * and ? wildcards; size is in bytes and modified dates are inclusive.",
  parameters: [
    M("folder"),
    M("recursive", "boolean"),
    M("name_pattern"),
    M("extension"),
    M("min_size", "number"),
    M("max_size", "number"),
    M("modified_after", "date"),
    M("modified_before", "date"),
  ],
  perform(e, t, r) {
    let { fs: n, path: o } = te(),
      i = o.resolve(le(Ee(e.folder, r), "Folder"));
    if (!n.statSync(i).isDirectory()) throw new Error(`Not a folder: ${i}`);
    let a = e.recursive === !0 || e.recursive === "true",
      s = Ol(e.name_pattern),
      c = de(e.extension).toLowerCase(),
      u = c ? `.${c.replace(/^\./, "")}` : "",
      f = xa(e.min_size, "Minimum size", 0),
      p = xa(e.max_size, "Maximum size", 1 / 0),
      _ = Ea(e.modified_after, "Modified After", -1 / 0),
      v = Ea(e.modified_before, "Modified Before", 1 / 0, !0);
    if (f > p) throw new Error("Minimum size cannot exceed maximum size");
    if (_ > v)
      throw new Error("Modified After cannot be later than Modified Before");
    let g = [],
      E = [i];
    for (; E.length; ) {
      let x = E.pop();
      for (let b of n.readdirSync(x, { withFileTypes: !0 })) {
        let w = o.join(x, b.name);
        if (b.isDirectory()) {
          a && E.push(w);
          continue;
        }
        if (
          !b.isFile() ||
          (s && !s.test(b.name)) ||
          (u && o.extname(b.name).toLowerCase() !== u)
        )
          continue;
        let N = n.statSync(w);
        N.size < f || N.size > p || N.mtimeMs < _ || N.mtimeMs > v || g.push(w);
      }
    }
    return g.sort((x, b) => x.localeCompare(b));
  },
});
new l("get_file_from_folder", {
  category: "desktop",
  variant: "desktop",
  parameters: [M("folder"), M("name")],
  perform(e, t, r) {
    let { fs: n, path: o } = te(),
      i = le(Ee(e.folder, r), "Folder"),
      a = le(e.name, "File name"),
      s = o.resolve(i, a),
      c = o.relative(o.resolve(i), s);
    if (c === ".." || c.startsWith(`..${o.sep}`) || o.isAbsolute(c))
      throw new Error("File must be inside the folder");
    return (n.accessSync(s), s);
  },
});
new l("append_to_text_file", {
  category: "desktop",
  variant: "desktop",
  parameters: [M("name"), M("text"), M("operation", "enum")],
  perform(e, t, r) {
    let n = le(e.name, "Text file"),
      o = String(Ee(e.text, r) ?? ""),
      i = de(e.operation).toLowerCase();
    if (i === "prepend") {
      let a = te().fs;
      a.writeFileSync(
        n,
        o + (a.existsSync(n) ? a.readFileSync(n, "utf8") : ""),
        "utf8",
      );
    } else if (i === "append" || !i) te().fs.appendFileSync(n, o, "utf8");
    else throw new Error(`Unsupported operation: ${i}`);
    return n;
  },
}).addEnum("operation", ["append", "prepend"]);
new l("make_archive", {
  category: "desktop",
  variant: "desktop",
  parameters: [M("input"), M("output"), M("type", "enum")],
  perform(e, t, r) {
    let { fs: n, path: o } = te(),
      i = Or(Ee(e.input, r));
    if (!i.length) throw new Error("Archive input is required");
    let a = de(e.type).toLowerCase() || "zip";
    if (!["zip", "tar", "tar.gz", "tgz"].includes(a))
      throw new Error(`Unsupported archive type: ${a}`);
    let s = o.resolve(le(e.output, "Archive output"));
    if (a === "zip" && !s.toLowerCase().endsWith(".zip"))
      throw new Error("ZIP output must end in .zip");
    for (let p of i) n.accessSync(p);
    let c = o.dirname(o.resolve(i[0])),
      u = i.map((p) => o.relative(c, o.resolve(p)));
    if (u.some((p) => p.startsWith("..") || o.isAbsolute(p)))
      throw new Error("Archive inputs must share a parent folder");
    let f = a === "zip" ? "-a" : a === "tar.gz" || a === "tgz" ? "-z" : "";
    return ($a("tar", [...(f ? [f] : []), "-cf", s, "-C", c, ...u]), s);
  },
}).addEnum("type", ["zip", "tar", "tar.gz", "tgz"]);
new l("extract_archive", {
  category: "desktop",
  variant: "desktop",
  parameters: [M("archive"), M("destination")],
  perform(e, t, r) {
    let { fs: n, path: o } = te(),
      i = o.resolve(le(Ee(e.archive, r), "Archive")),
      a = o.resolve(de(e.destination) || o.dirname(i));
    return (
      n.mkdirSync(a, { recursive: !0 }),
      $a("tar", ["-xf", i, "-C", a]),
      a
    );
  },
});
new l("open_file", {
  category: "desktop",
  variant: "desktop",
  parameters: [M("file"), M("app")],
  async perform(e, t, r) {
    let { fs: n, child: o } = te(),
      i = le(Ee(e.file, r), "File");
    n.accessSync(i);
    let a = de(e.app);
    if (a) {
      let s = o.spawn(a, [i], {
        detached: !0,
        stdio: "ignore",
        windowsHide: !0,
      });
      (await new Promise((c, u) => {
        (s.once("error", u), s.once("spawn", c));
      }),
        s.unref());
    } else {
      let c = await globalThis.require("electron").shell.openPath(i);
      if (c) throw new Error(c);
    }
    return i;
  },
});
new l("get_details_of_files", {
  category: "desktop",
  variant: "desktop",
  parameters: [M("file"), M("detail", "enum")],
  perform(e, t, r) {
    let n = Or(Ee(e.file, r));
    if (!n.length) throw new Error("File is required");
    let o = de(e.detail),
      i = n.map((a) => {
        let s = ka(a);
        if (o && !(o in s)) throw new Error(`Unknown file detail: ${o}`);
        return o ? s[o] : s;
      });
    return i.length === 1 ? i[0] : i;
  },
}).addEnum("detail", [
  "path",
  "name",
  "size",
  "isDirectory",
  "created",
  "modified",
  "extension",
]);
new l("filter_files", {
  category: "desktop",
  variant: "desktop",
  parameters: [
    M("file"),
    M("name"),
    M("extension"),
    M("min_size", "number"),
    M("max_size", "number"),
  ],
  perform(e, t, r) {
    let n = Or(Ee(e.file, r)),
      o = de(e.name).toLowerCase(),
      i = de(e.extension).toLowerCase().replace(/^\.?/, "."),
      a = e.min_size === "" || e.min_size == null ? -1 / 0 : Number(e.min_size),
      s = e.max_size === "" || e.max_size == null ? 1 / 0 : Number(e.max_size);
    if (Number.isNaN(a) || Number.isNaN(s))
      throw new Error("File size must be a number");
    return n.filter((c) => {
      let u = ka(c);
      return (
        (!o || u.name.toLowerCase().includes(o)) &&
        (!i || u.extension.toLowerCase() === i) &&
        u.size >= a &&
        u.size <= s
      );
    });
  },
});
var Ca = Wa(Sa()),
  I = (e, t = "text") => ({ name: e, type: t }),
  Y = (e, t) => (e === void 0 || e === "" ? t : e),
  me = (e) => String(e ?? ""),
  re = (e, t) => (e === void 0 || e === "" ? t : Number(e));
function Ie(e, t, r) {
  let n = re(e, r ?? NaN);
  if (!Number.isFinite(n) || n <= 0)
    throw new Error(`${t} must be a positive number`);
  return Math.round(n);
}
function ge(e, t) {
  let r = document.createElement("canvas");
  return (
    (r.width = Math.max(1, Math.round(e))),
    (r.height = Math.max(1, Math.round(t))),
    r
  );
}
function he(e) {
  let t = e.getContext("2d");
  if (!t) throw new Error("Canvas is unavailable");
  return t;
}
function rt(e) {
  if (Array.isArray(e)) return e.flatMap(rt);
  if (
    e &&
    typeof e == "object" &&
    !(e instanceof URL) &&
    !(e instanceof Date)
  ) {
    let r = e;
    return rt(r.image ?? r.url ?? r.path);
  }
  let t = me(e).trim();
  return t ? [t] : [];
}
function Ia(e) {
  if (!/^(data:|blob:|https?:|file:)/i.test(e)) {
    if (Blockbench.isWeb)
      throw new Error("Local image paths require desktop Blockbench");
    let t = globalThis.require;
    if (typeof t != "function") throw new Error("Node access is unavailable");
    let r = t("node:fs"),
      o = t("node:path").extname(e).slice(1).toLowerCase();
    return `data:image/${{ jpg: "jpeg", svg: "svg+xml" }[o] || o || "png"};base64,${r.readFileSync(e).toString("base64")}`;
  }
  return e;
}
async function pe(e) {
  let t = rt(e)[0];
  if (!t) throw new Error("Image is required");
  let r = Ia(t);
  return new Promise((n, o) => {
    let i = new Image();
    ((i.crossOrigin = "anonymous"),
      (i.onload = () => n(i)),
      (i.onerror = () => o(new Error(`Could not load image: ${t}`))),
      (i.src = r));
  });
}
function ke(e, t = "png", r = 0.92) {
  let n = t.toLowerCase().replace(/^image\//, "");
  if (!["png", "jpeg", "webp"].includes(n))
    throw new Error(`Unsupported image format: ${n}`);
  return e.toDataURL(`image/${n}`, r);
}
async function Tr(e, t, r, n) {
  let o = await pe(e),
    i = ge(r ?? o.naturalWidth, n ?? o.naturalHeight);
  return (t(he(i), o), ke(i));
}
new l("convert_image", {
  category: "media",
  parameters: [I("image"), I("format", "enum"), I("quality", "number")],
  async perform(e, t, r) {
    let n = await pe(Y(e.image, r)),
      o = ge(n.naturalWidth, n.naturalHeight);
    return (
      he(o).drawImage(n, 0, 0),
      ke(o, me(e.format) || "png", re(e.quality, 0.92))
    );
  },
}).addEnum("format", ["png", "jpeg", "webp"]);
new l("filter_images", {
  category: "media",
  parameters: [
    I("images"),
    I("format"),
    I("min_width", "number"),
    I("min_height", "number"),
  ],
  async perform(e, t, r) {
    let n = rt(Y(e.images, r)),
      o = me(e.format).replace(/^\./, "").toLowerCase();
    if (o && !/^[a-z0-9+]+$/.test(o)) throw new Error("Invalid image format");
    let i = [];
    for (let a of n) {
      if (
        o &&
        !new RegExp(`(?:\\.${o}(?:[?#]|$)|^data:image/${o}[;,])`, "i").test(a)
      )
        continue;
      let s = await pe(a);
      s.naturalWidth >= re(e.min_width, 0) &&
        s.naturalHeight >= re(e.min_height, 0) &&
        i.push(a);
    }
    return i;
  },
});
new l("get_details_of_image", {
  category: "media",
  parameters: [I("image"), I("detail", "enum")],
  async perform(e, t, r) {
    let n = rt(Y(e.image, r))[0],
      o = await pe(n),
      i = {
        width: o.naturalWidth,
        height: o.naturalHeight,
        aspectRatio: o.naturalWidth / o.naturalHeight,
        source: n,
        format:
          /^data:image\/([^;,]+)/.exec(n)?.[1] ||
          /\.([a-z0-9]+)(?:[?#]|$)/i.exec(n)?.[1] ||
          "unknown",
      },
      a = me(e.detail);
    if (a && !(a in i)) throw new Error(`Unknown image detail: ${a}`);
    return a ? i[a] : i;
  },
}).addEnum("detail", ["width", "height", "aspectRatio", "source", "format"]);
new l("get_image_from_input", {
  category: "media",
  parameters: [I("input")],
  async perform(e, t, r) {
    let n = await pe(Y(e.input, r)),
      o = ge(n.naturalWidth, n.naturalHeight);
    return (he(o).drawImage(n, 0, 0), ke(o));
  },
});
new l("make_image_from_rich_text", {
  category: "media",
  parameters: [
    I("text"),
    I("width", "number"),
    I("height", "number"),
    I("font_size", "number"),
    I("color"),
    I("background"),
  ],
  perform(e, t, r) {
    let n = ge(Ie(e.width, "Width", 600), Ie(e.height, "Height", 200)),
      o = he(n);
    e.background &&
      ((o.fillStyle = me(e.background)), o.fillRect(0, 0, n.width, n.height));
    let i = Ie(e.font_size, "Font size", 24);
    return (
      (o.font = `${i}px sans-serif`),
      (o.fillStyle = me(e.color) || "#000000"),
      me(Y(e.text, r))
        .replace(
          /<br\s*\/?\s*>/gi,
          `
`,
        )
        .replace(/<[^>]*>/g, "")
        .split(
          `
`,
        )
        .forEach((a, s) => o.fillText(a, 10, 10 + i * (s + 1))),
      ke(n)
    );
  },
});
new l("extract_text_from_image", {
  category: "media",
  parameters: [I("image")],
  async perform(e, t, r) {
    let n = globalThis.TextDetector;
    if (!n)
      throw new Error(
        "Text recognition is unavailable in this Blockbench runtime",
      );
    let o = await pe(Y(e.image, r));
    return (await new n().detect(o)).map((a) => a.rawValue).join(`
`);
  },
});
new l("markup", {
  category: "media",
  parameters: [
    I("document"),
    I("shape", "enum"),
    I("x", "number"),
    I("y", "number"),
    I("width", "number"),
    I("height", "number"),
    I("color"),
    I("line_width", "number"),
  ],
  async perform(e, t, r) {
    return Tr(Y(e.document, r), (n, o) => {
      (n.drawImage(o, 0, 0),
        (n.strokeStyle = me(e.color) || "#ff0000"),
        (n.lineWidth = Ie(e.line_width, "Line width", 3)));
      let i = re(e.x, 0),
        a = re(e.y, 0),
        s = re(e.width, 100),
        c = re(e.height, 100);
      e.shape === "ellipse"
        ? (n.beginPath(),
          n.ellipse(
            i + s / 2,
            a + c / 2,
            Math.abs(s / 2),
            Math.abs(c / 2),
            0,
            0,
            Math.PI * 2,
          ),
          n.stroke())
        : e.shape === "line"
          ? (n.beginPath(), n.moveTo(i, a), n.lineTo(i + s, a + c), n.stroke())
          : n.strokeRect(i, a, s, c);
    });
  },
}).addEnum("shape", ["rectangle", "ellipse", "line"]);
new l("combine_images", {
  category: "media",
  parameters: [I("images"), I("orientation", "enum"), I("spacing", "number")],
  async perform(e, t, r) {
    let n = await Promise.all(rt(Y(e.images, r)).map(pe));
    if (!n.length) throw new Error("Images are required");
    let o = Math.max(0, re(e.spacing, 0)),
      i = e.orientation === "vertical",
      a = i
        ? Math.max(...n.map((p) => p.naturalWidth))
        : n.reduce((p, _) => p + _.naturalWidth, o * (n.length - 1)),
      s = i
        ? n.reduce((p, _) => p + _.naturalHeight, o * (n.length - 1))
        : Math.max(...n.map((p) => p.naturalHeight)),
      c = ge(a, s),
      u = he(c),
      f = 0;
    for (let p of n)
      (u.drawImage(p, i ? 0 : f, i ? f : 0),
        (f += (i ? p.naturalHeight : p.naturalWidth) + o));
    return ke(c);
  },
}).addEnum("orientation", ["horizontal", "vertical"]);
new l("crop_image", {
  category: "media",
  parameters: [
    I("image"),
    I("x", "number"),
    I("y", "number"),
    I("width", "number"),
    I("height", "number"),
  ],
  async perform(e, t, r) {
    let n = await pe(Y(e.image, r)),
      o = re(e.x, 0),
      i = re(e.y, 0),
      a = Ie(e.width, "Width", n.naturalWidth - o),
      s = Ie(e.height, "Height", n.naturalHeight - i),
      c = ge(a, s);
    return (he(c).drawImage(n, o, i, a, s, 0, 0, a, s), ke(c));
  },
});
new l("flip_image", {
  category: "media",
  parameters: [I("image"), I("orientation", "enum")],
  perform(e, t, r) {
    return Tr(Y(e.image, r), (n, o) => {
      (e.orientation === "vertical"
        ? (n.translate(0, o.naturalHeight), n.scale(1, -1))
        : (n.translate(o.naturalWidth, 0), n.scale(-1, 1)),
        n.drawImage(o, 0, 0));
    });
  },
}).addEnum("orientation", ["horizontal", "vertical"]);
new l("mask_image", {
  category: "media",
  parameters: [I("image"), I("shape", "enum")],
  perform(e, t, r) {
    return Tr(Y(e.image, r), (n, o) => {
      (n.beginPath(),
        e.shape === "circle"
          ? n.ellipse(
              o.naturalWidth / 2,
              o.naturalHeight / 2,
              Math.min(o.naturalWidth, o.naturalHeight) / 2,
              Math.min(o.naturalWidth, o.naturalHeight) / 2,
              0,
              0,
              Math.PI * 2,
            )
          : e.shape === "ellipse"
            ? n.ellipse(
                o.naturalWidth / 2,
                o.naturalHeight / 2,
                o.naturalWidth / 2,
                o.naturalHeight / 2,
                0,
                0,
                Math.PI * 2,
              )
            : n.rect(0, 0, o.naturalWidth, o.naturalHeight),
        n.clip(),
        n.drawImage(o, 0, 0));
    });
  },
}).addEnum("shape", ["circle", "ellipse", "rectangle"]);
new l("overlay_image", {
  category: "media",
  parameters: [
    I("image1"),
    I("image2"),
    I("x", "number"),
    I("y", "number"),
    I("opacity", "number"),
  ],
  async perform(e, t, r) {
    let n = await pe(Y(e.image1, r)),
      o = await pe(e.image2),
      i = ge(n.naturalWidth, n.naturalHeight),
      a = he(i);
    return (
      a.drawImage(n, 0, 0),
      (a.globalAlpha = Math.max(0, Math.min(1, re(e.opacity, 1)))),
      a.drawImage(o, re(e.x, 0), re(e.y, 0)),
      ke(i)
    );
  },
});
new l("overlay_text", {
  category: "media",
  parameters: [
    I("image"),
    I("text"),
    I("location", "enum"),
    I("x", "number"),
    I("y", "number"),
    I("font_size", "number"),
    I("color"),
  ],
  perform(e, t, r) {
    return Tr(Y(e.image, r), (n, o) => {
      n.drawImage(o, 0, 0);
      let i = Ie(e.font_size, "Font size", 24),
        a = me(e.location);
      ((n.font = `${i}px sans-serif`),
        (n.fillStyle = me(e.color) || "#ffffff"));
      let s = me(e.text),
        c = n.measureText(s).width,
        u =
          a === "center"
            ? (o.naturalWidth - c) / 2
            : a === "bottom_right"
              ? o.naturalWidth - c - 10
              : re(e.x, 10),
        f =
          a === "center"
            ? o.naturalHeight / 2
            : a === "bottom_right"
              ? o.naturalHeight - 10
              : re(e.y, i + 10);
      n.fillText(s, u, f);
    });
  },
}).addEnum("location", ["custom", "center", "bottom_right"]);
new l("resize_image", {
  category: "media",
  parameters: [I("image"), I("width", "number"), I("height", "number")],
  async perform(e, t, r) {
    let n = await pe(Y(e.image, r)),
      o = e.width
        ? Ie(e.width, "Width")
        : Math.round(
            (n.naturalWidth * Ie(e.height, "Height")) / n.naturalHeight,
          ),
      i = e.height
        ? Ie(e.height, "Height")
        : Math.round((n.naturalHeight * o) / n.naturalWidth),
      a = ge(o, i);
    return (he(a).drawImage(n, 0, 0, o, i), ke(a));
  },
});
new l("rotate_image", {
  category: "media",
  parameters: [I("image"), I("rotate", "number")],
  async perform(e, t, r) {
    let n = await pe(Y(e.image, r)),
      o = (re(e.rotate, 0) * Math.PI) / 180,
      i = Math.ceil(
        Math.abs(n.naturalWidth * Math.cos(o)) +
          Math.abs(n.naturalHeight * Math.sin(o)),
      ),
      a = Math.ceil(
        Math.abs(n.naturalWidth * Math.sin(o)) +
          Math.abs(n.naturalHeight * Math.cos(o)),
      ),
      s = ge(i, a),
      c = he(s);
    return (
      c.translate(i / 2, a / 2),
      c.rotate(o),
      c.drawImage(n, -n.naturalWidth / 2, -n.naturalHeight / 2),
      ke(s)
    );
  },
});
new l("remove_image_background", {
  category: "media",
  parameters: [I("image"), I("tolerance", "number")],
  async perform(e, t, r) {
    let n = await pe(Y(e.image, r)),
      o = ge(n.naturalWidth, n.naturalHeight),
      i = he(o);
    i.drawImage(n, 0, 0);
    let a = i.getImageData(0, 0, o.width, o.height),
      s = a.data,
      c = [s[0], s[1], s[2]],
      u = Math.max(0, re(e.tolerance, 30)),
      f = o.width,
      p = o.height,
      _ = new Uint8Array(f * p),
      v = [];
    for (let g = 0; g < f; g++) v.push(g, (p - 1) * f + g);
    for (let g = 0; g < p; g++) v.push(g * f, g * f + f - 1);
    for (; v.length; ) {
      let g = v.pop();
      if (_[g]) continue;
      _[g] = 1;
      let E = g * 4;
      if (Math.hypot(s[E] - c[0], s[E + 1] - c[1], s[E + 2] - c[2]) > u)
        continue;
      s[E + 3] = 0;
      let b = g % f,
        w = Math.floor(g / f);
      (b > 0 && v.push(g - 1),
        b + 1 < f && v.push(g + 1),
        w > 0 && v.push(g - f),
        w + 1 < p && v.push(g + f));
    }
    return (i.putImageData(a, 0, 0), ke(o));
  },
});
new l("get_frames_from_image", {
  category: "media",
  parameters: [I("image")],
  async perform(e, t, r) {
    let n = rt(Y(e.image, r))[0];
    if (!n) throw new Error("Image is required");
    let o = globalThis.ImageDecoder;
    if (!o) {
      if (/^data:image\/gif|\.gif(?:[?#]|$)/i.test(n))
        throw new Error(
          "Animated frame decoding is unavailable in this Blockbench runtime",
        );
      let u = await pe(n),
        f = ge(u.naturalWidth, u.naturalHeight);
      return (he(f).drawImage(u, 0, 0), [ke(f)]);
    }
    let i = await fetch(Ia(n)),
      a = await i.arrayBuffer(),
      s = new o({
        data: a,
        type: i.headers.get("content-type") || "image/gif",
      });
    await s.tracks.ready;
    let c = [];
    for (let u = 0; u < s.tracks.selectedTrack.frameCount; u++) {
      let { image: f } = await s.decode({ frameIndex: u }),
        p = ge(f.displayWidth, f.displayHeight);
      (he(p).drawImage(f, 0, 0), c.push(ke(p)), f.close());
    }
    return (s.close(), c);
  },
});
new l("share", {
  category: "media",
  parameters: [I("input")],
  async perform(e, t, r) {
    if (!navigator.share)
      throw new Error("Sharing is unavailable in this Blockbench runtime");
    let n = me(Y(e.input, r));
    return (
      await navigator.share(/^https?:\/\//i.test(n) ? { url: n } : { text: n }),
      n
    );
  },
});
new l("copy_to_clipboard", {
  category: "media",
  parameters: [I("content")],
  async perform(e, t, r) {
    let n = me(Y(e.content, r));
    return (await navigator.clipboard.writeText(n), n);
  },
});
new l("get_clipboard", {
  category: "media",
  async perform() {
    return navigator.clipboard.readText();
  },
});
new l("make_gif", {
  category: "media",
  parameters: [I("content"), I("delay", "number")],
  async perform(e, t, r) {
    let n = await Promise.all(rt(Y(e.content, r)).map(pe));
    if (!n.length) throw new Error("GIF frames are required");
    let o = n[0].naturalWidth,
      i = n[0].naturalHeight,
      a = n.map((u) => {
        let f = ge(o, i);
        return (he(f).drawImage(u, 0, 0, o, i), f);
      }),
      s = Ie(e.delay, "Delay", 100),
      c = URL.createObjectURL(
        new Blob(
          [
            `// gif.worker.js 0.2.0 - https://github.com/jnordberg/gif.js
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){var NeuQuant=require("./TypedNeuQuant.js");var LZWEncoder=require("./LZWEncoder.js");function ByteArray(){this.page=-1;this.pages=[];this.newPage()}ByteArray.pageSize=4096;ByteArray.charMap={};for(var i=0;i<256;i++)ByteArray.charMap[i]=String.fromCharCode(i);ByteArray.prototype.newPage=function(){this.pages[++this.page]=new Uint8Array(ByteArray.pageSize);this.cursor=0};ByteArray.prototype.getData=function(){var rv="";for(var p=0;p<this.pages.length;p++){for(var i=0;i<ByteArray.pageSize;i++){rv+=ByteArray.charMap[this.pages[p][i]]}}return rv};ByteArray.prototype.writeByte=function(val){if(this.cursor>=ByteArray.pageSize)this.newPage();this.pages[this.page][this.cursor++]=val};ByteArray.prototype.writeUTFBytes=function(string){for(var l=string.length,i=0;i<l;i++)this.writeByte(string.charCodeAt(i))};ByteArray.prototype.writeBytes=function(array,offset,length){for(var l=length||array.length,i=offset||0;i<l;i++)this.writeByte(array[i])};function GIFEncoder(width,height){this.width=~~width;this.height=~~height;this.transparent=null;this.transIndex=0;this.repeat=-1;this.delay=0;this.image=null;this.pixels=null;this.indexedPixels=null;this.colorDepth=null;this.colorTab=null;this.neuQuant=null;this.usedEntry=new Array;this.palSize=7;this.dispose=-1;this.firstFrame=true;this.sample=10;this.dither=false;this.globalPalette=false;this.out=new ByteArray}GIFEncoder.prototype.setDelay=function(milliseconds){this.delay=Math.round(milliseconds/10)};GIFEncoder.prototype.setFrameRate=function(fps){this.delay=Math.round(100/fps)};GIFEncoder.prototype.setDispose=function(disposalCode){if(disposalCode>=0)this.dispose=disposalCode};GIFEncoder.prototype.setRepeat=function(repeat){this.repeat=repeat};GIFEncoder.prototype.setTransparent=function(color){this.transparent=color};GIFEncoder.prototype.addFrame=function(imageData){this.image=imageData;this.colorTab=this.globalPalette&&this.globalPalette.slice?this.globalPalette:null;this.getImagePixels();this.analyzePixels();if(this.globalPalette===true)this.globalPalette=this.colorTab;if(this.firstFrame){this.writeLSD();this.writePalette();if(this.repeat>=0){this.writeNetscapeExt()}}this.writeGraphicCtrlExt();this.writeImageDesc();if(!this.firstFrame&&!this.globalPalette)this.writePalette();this.writePixels();this.firstFrame=false};GIFEncoder.prototype.finish=function(){this.out.writeByte(59)};GIFEncoder.prototype.setQuality=function(quality){if(quality<1)quality=1;this.sample=quality};GIFEncoder.prototype.setDither=function(dither){if(dither===true)dither="FloydSteinberg";this.dither=dither};GIFEncoder.prototype.setGlobalPalette=function(palette){this.globalPalette=palette};GIFEncoder.prototype.getGlobalPalette=function(){return this.globalPalette&&this.globalPalette.slice&&this.globalPalette.slice(0)||this.globalPalette};GIFEncoder.prototype.writeHeader=function(){this.out.writeUTFBytes("GIF89a")};GIFEncoder.prototype.analyzePixels=function(){if(!this.colorTab){this.neuQuant=new NeuQuant(this.pixels,this.sample);this.neuQuant.buildColormap();this.colorTab=this.neuQuant.getColormap()}if(this.dither){this.ditherPixels(this.dither.replace("-serpentine",""),this.dither.match(/-serpentine/)!==null)}else{this.indexPixels()}this.pixels=null;this.colorDepth=8;this.palSize=7;if(this.transparent!==null){this.transIndex=this.findClosest(this.transparent,true)}};GIFEncoder.prototype.indexPixels=function(imgq){var nPix=this.pixels.length/3;this.indexedPixels=new Uint8Array(nPix);var k=0;for(var j=0;j<nPix;j++){var index=this.findClosestRGB(this.pixels[k++]&255,this.pixels[k++]&255,this.pixels[k++]&255);this.usedEntry[index]=true;this.indexedPixels[j]=index}};GIFEncoder.prototype.ditherPixels=function(kernel,serpentine){var kernels={FalseFloydSteinberg:[[3/8,1,0],[3/8,0,1],[2/8,1,1]],FloydSteinberg:[[7/16,1,0],[3/16,-1,1],[5/16,0,1],[1/16,1,1]],Stucki:[[8/42,1,0],[4/42,2,0],[2/42,-2,1],[4/42,-1,1],[8/42,0,1],[4/42,1,1],[2/42,2,1],[1/42,-2,2],[2/42,-1,2],[4/42,0,2],[2/42,1,2],[1/42,2,2]],Atkinson:[[1/8,1,0],[1/8,2,0],[1/8,-1,1],[1/8,0,1],[1/8,1,1],[1/8,0,2]]};if(!kernel||!kernels[kernel]){throw"Unknown dithering kernel: "+kernel}var ds=kernels[kernel];var index=0,height=this.height,width=this.width,data=this.pixels;var direction=serpentine?-1:1;this.indexedPixels=new Uint8Array(this.pixels.length/3);for(var y=0;y<height;y++){if(serpentine)direction=direction*-1;for(var x=direction==1?0:width-1,xend=direction==1?width:0;x!==xend;x+=direction){index=y*width+x;var idx=index*3;var r1=data[idx];var g1=data[idx+1];var b1=data[idx+2];idx=this.findClosestRGB(r1,g1,b1);this.usedEntry[idx]=true;this.indexedPixels[index]=idx;idx*=3;var r2=this.colorTab[idx];var g2=this.colorTab[idx+1];var b2=this.colorTab[idx+2];var er=r1-r2;var eg=g1-g2;var eb=b1-b2;for(var i=direction==1?0:ds.length-1,end=direction==1?ds.length:0;i!==end;i+=direction){var x1=ds[i][1];var y1=ds[i][2];if(x1+x>=0&&x1+x<width&&y1+y>=0&&y1+y<height){var d=ds[i][0];idx=index+x1+y1*width;idx*=3;data[idx]=Math.max(0,Math.min(255,data[idx]+er*d));data[idx+1]=Math.max(0,Math.min(255,data[idx+1]+eg*d));data[idx+2]=Math.max(0,Math.min(255,data[idx+2]+eb*d))}}}}};GIFEncoder.prototype.findClosest=function(c,used){return this.findClosestRGB((c&16711680)>>16,(c&65280)>>8,c&255,used)};GIFEncoder.prototype.findClosestRGB=function(r,g,b,used){if(this.colorTab===null)return-1;if(this.neuQuant&&!used){return this.neuQuant.lookupRGB(r,g,b)}var c=b|g<<8|r<<16;var minpos=0;var dmin=256*256*256;var len=this.colorTab.length;for(var i=0,index=0;i<len;index++){var dr=r-(this.colorTab[i++]&255);var dg=g-(this.colorTab[i++]&255);var db=b-(this.colorTab[i++]&255);var d=dr*dr+dg*dg+db*db;if((!used||this.usedEntry[index])&&d<dmin){dmin=d;minpos=index}}return minpos};GIFEncoder.prototype.getImagePixels=function(){var w=this.width;var h=this.height;this.pixels=new Uint8Array(w*h*3);var data=this.image;var srcPos=0;var count=0;for(var i=0;i<h;i++){for(var j=0;j<w;j++){this.pixels[count++]=data[srcPos++];this.pixels[count++]=data[srcPos++];this.pixels[count++]=data[srcPos++];srcPos++}}};GIFEncoder.prototype.writeGraphicCtrlExt=function(){this.out.writeByte(33);this.out.writeByte(249);this.out.writeByte(4);var transp,disp;if(this.transparent===null){transp=0;disp=0}else{transp=1;disp=2}if(this.dispose>=0){disp=dispose&7}disp<<=2;this.out.writeByte(0|disp|0|transp);this.writeShort(this.delay);this.out.writeByte(this.transIndex);this.out.writeByte(0)};GIFEncoder.prototype.writeImageDesc=function(){this.out.writeByte(44);this.writeShort(0);this.writeShort(0);this.writeShort(this.width);this.writeShort(this.height);if(this.firstFrame||this.globalPalette){this.out.writeByte(0)}else{this.out.writeByte(128|0|0|0|this.palSize)}};GIFEncoder.prototype.writeLSD=function(){this.writeShort(this.width);this.writeShort(this.height);this.out.writeByte(128|112|0|this.palSize);this.out.writeByte(0);this.out.writeByte(0)};GIFEncoder.prototype.writeNetscapeExt=function(){this.out.writeByte(33);this.out.writeByte(255);this.out.writeByte(11);this.out.writeUTFBytes("NETSCAPE2.0");this.out.writeByte(3);this.out.writeByte(1);this.writeShort(this.repeat);this.out.writeByte(0)};GIFEncoder.prototype.writePalette=function(){this.out.writeBytes(this.colorTab);var n=3*256-this.colorTab.length;for(var i=0;i<n;i++)this.out.writeByte(0)};GIFEncoder.prototype.writeShort=function(pValue){this.out.writeByte(pValue&255);this.out.writeByte(pValue>>8&255)};GIFEncoder.prototype.writePixels=function(){var enc=new LZWEncoder(this.width,this.height,this.indexedPixels,this.colorDepth);enc.encode(this.out)};GIFEncoder.prototype.stream=function(){return this.out};module.exports=GIFEncoder},{"./LZWEncoder.js":2,"./TypedNeuQuant.js":3}],2:[function(require,module,exports){var EOF=-1;var BITS=12;var HSIZE=5003;var masks=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];function LZWEncoder(width,height,pixels,colorDepth){var initCodeSize=Math.max(2,colorDepth);var accum=new Uint8Array(256);var htab=new Int32Array(HSIZE);var codetab=new Int32Array(HSIZE);var cur_accum,cur_bits=0;var a_count;var free_ent=0;var maxcode;var clear_flg=false;var g_init_bits,ClearCode,EOFCode;function char_out(c,outs){accum[a_count++]=c;if(a_count>=254)flush_char(outs)}function cl_block(outs){cl_hash(HSIZE);free_ent=ClearCode+2;clear_flg=true;output(ClearCode,outs)}function cl_hash(hsize){for(var i=0;i<hsize;++i)htab[i]=-1}function compress(init_bits,outs){var fcode,c,i,ent,disp,hsize_reg,hshift;g_init_bits=init_bits;clear_flg=false;n_bits=g_init_bits;maxcode=MAXCODE(n_bits);ClearCode=1<<init_bits-1;EOFCode=ClearCode+1;free_ent=ClearCode+2;a_count=0;ent=nextPixel();hshift=0;for(fcode=HSIZE;fcode<65536;fcode*=2)++hshift;hshift=8-hshift;hsize_reg=HSIZE;cl_hash(hsize_reg);output(ClearCode,outs);outer_loop:while((c=nextPixel())!=EOF){fcode=(c<<BITS)+ent;i=c<<hshift^ent;if(htab[i]===fcode){ent=codetab[i];continue}else if(htab[i]>=0){disp=hsize_reg-i;if(i===0)disp=1;do{if((i-=disp)<0)i+=hsize_reg;if(htab[i]===fcode){ent=codetab[i];continue outer_loop}}while(htab[i]>=0)}output(ent,outs);ent=c;if(free_ent<1<<BITS){codetab[i]=free_ent++;htab[i]=fcode}else{cl_block(outs)}}output(ent,outs);output(EOFCode,outs)}function encode(outs){outs.writeByte(initCodeSize);remaining=width*height;curPixel=0;compress(initCodeSize+1,outs);outs.writeByte(0)}function flush_char(outs){if(a_count>0){outs.writeByte(a_count);outs.writeBytes(accum,0,a_count);a_count=0}}function MAXCODE(n_bits){return(1<<n_bits)-1}function nextPixel(){if(remaining===0)return EOF;--remaining;var pix=pixels[curPixel++];return pix&255}function output(code,outs){cur_accum&=masks[cur_bits];if(cur_bits>0)cur_accum|=code<<cur_bits;else cur_accum=code;cur_bits+=n_bits;while(cur_bits>=8){char_out(cur_accum&255,outs);cur_accum>>=8;cur_bits-=8}if(free_ent>maxcode||clear_flg){if(clear_flg){maxcode=MAXCODE(n_bits=g_init_bits);clear_flg=false}else{++n_bits;if(n_bits==BITS)maxcode=1<<BITS;else maxcode=MAXCODE(n_bits)}}if(code==EOFCode){while(cur_bits>0){char_out(cur_accum&255,outs);cur_accum>>=8;cur_bits-=8}flush_char(outs)}}this.encode=encode}module.exports=LZWEncoder},{}],3:[function(require,module,exports){var ncycles=100;var netsize=256;var maxnetpos=netsize-1;var netbiasshift=4;var intbiasshift=16;var intbias=1<<intbiasshift;var gammashift=10;var gamma=1<<gammashift;var betashift=10;var beta=intbias>>betashift;var betagamma=intbias<<gammashift-betashift;var initrad=netsize>>3;var radiusbiasshift=6;var radiusbias=1<<radiusbiasshift;var initradius=initrad*radiusbias;var radiusdec=30;var alphabiasshift=10;var initalpha=1<<alphabiasshift;var alphadec;var radbiasshift=8;var radbias=1<<radbiasshift;var alpharadbshift=alphabiasshift+radbiasshift;var alpharadbias=1<<alpharadbshift;var prime1=499;var prime2=491;var prime3=487;var prime4=503;var minpicturebytes=3*prime4;function NeuQuant(pixels,samplefac){var network;var netindex;var bias;var freq;var radpower;function init(){network=[];netindex=new Int32Array(256);bias=new Int32Array(netsize);freq=new Int32Array(netsize);radpower=new Int32Array(netsize>>3);var i,v;for(i=0;i<netsize;i++){v=(i<<netbiasshift+8)/netsize;network[i]=new Float64Array([v,v,v,0]);freq[i]=intbias/netsize;bias[i]=0}}function unbiasnet(){for(var i=0;i<netsize;i++){network[i][0]>>=netbiasshift;network[i][1]>>=netbiasshift;network[i][2]>>=netbiasshift;network[i][3]=i}}function altersingle(alpha,i,b,g,r){network[i][0]-=alpha*(network[i][0]-b)/initalpha;network[i][1]-=alpha*(network[i][1]-g)/initalpha;network[i][2]-=alpha*(network[i][2]-r)/initalpha}function alterneigh(radius,i,b,g,r){var lo=Math.abs(i-radius);var hi=Math.min(i+radius,netsize);var j=i+1;var k=i-1;var m=1;var p,a;while(j<hi||k>lo){a=radpower[m++];if(j<hi){p=network[j++];p[0]-=a*(p[0]-b)/alpharadbias;p[1]-=a*(p[1]-g)/alpharadbias;p[2]-=a*(p[2]-r)/alpharadbias}if(k>lo){p=network[k--];p[0]-=a*(p[0]-b)/alpharadbias;p[1]-=a*(p[1]-g)/alpharadbias;p[2]-=a*(p[2]-r)/alpharadbias}}}function contest(b,g,r){var bestd=~(1<<31);var bestbiasd=bestd;var bestpos=-1;var bestbiaspos=bestpos;var i,n,dist,biasdist,betafreq;for(i=0;i<netsize;i++){n=network[i];dist=Math.abs(n[0]-b)+Math.abs(n[1]-g)+Math.abs(n[2]-r);if(dist<bestd){bestd=dist;bestpos=i}biasdist=dist-(bias[i]>>intbiasshift-netbiasshift);if(biasdist<bestbiasd){bestbiasd=biasdist;bestbiaspos=i}betafreq=freq[i]>>betashift;freq[i]-=betafreq;bias[i]+=betafreq<<gammashift}freq[bestpos]+=beta;bias[bestpos]-=betagamma;return bestbiaspos}function inxbuild(){var i,j,p,q,smallpos,smallval,previouscol=0,startpos=0;for(i=0;i<netsize;i++){p=network[i];smallpos=i;smallval=p[1];for(j=i+1;j<netsize;j++){q=network[j];if(q[1]<smallval){smallpos=j;smallval=q[1]}}q=network[smallpos];if(i!=smallpos){j=q[0];q[0]=p[0];p[0]=j;j=q[1];q[1]=p[1];p[1]=j;j=q[2];q[2]=p[2];p[2]=j;j=q[3];q[3]=p[3];p[3]=j}if(smallval!=previouscol){netindex[previouscol]=startpos+i>>1;for(j=previouscol+1;j<smallval;j++)netindex[j]=i;previouscol=smallval;startpos=i}}netindex[previouscol]=startpos+maxnetpos>>1;for(j=previouscol+1;j<256;j++)netindex[j]=maxnetpos}function inxsearch(b,g,r){var a,p,dist;var bestd=1e3;var best=-1;var i=netindex[g];var j=i-1;while(i<netsize||j>=0){if(i<netsize){p=network[i];dist=p[1]-g;if(dist>=bestd)i=netsize;else{i++;if(dist<0)dist=-dist;a=p[0]-b;if(a<0)a=-a;dist+=a;if(dist<bestd){a=p[2]-r;if(a<0)a=-a;dist+=a;if(dist<bestd){bestd=dist;best=p[3]}}}}if(j>=0){p=network[j];dist=g-p[1];if(dist>=bestd)j=-1;else{j--;if(dist<0)dist=-dist;a=p[0]-b;if(a<0)a=-a;dist+=a;if(dist<bestd){a=p[2]-r;if(a<0)a=-a;dist+=a;if(dist<bestd){bestd=dist;best=p[3]}}}}}return best}function learn(){var i;var lengthcount=pixels.length;var alphadec=30+(samplefac-1)/3;var samplepixels=lengthcount/(3*samplefac);var delta=~~(samplepixels/ncycles);var alpha=initalpha;var radius=initradius;var rad=radius>>radiusbiasshift;if(rad<=1)rad=0;for(i=0;i<rad;i++)radpower[i]=alpha*((rad*rad-i*i)*radbias/(rad*rad));var step;if(lengthcount<minpicturebytes){samplefac=1;step=3}else if(lengthcount%prime1!==0){step=3*prime1}else if(lengthcount%prime2!==0){step=3*prime2}else if(lengthcount%prime3!==0){step=3*prime3}else{step=3*prime4}var b,g,r,j;var pix=0;i=0;while(i<samplepixels){b=(pixels[pix]&255)<<netbiasshift;g=(pixels[pix+1]&255)<<netbiasshift;r=(pixels[pix+2]&255)<<netbiasshift;j=contest(b,g,r);altersingle(alpha,j,b,g,r);if(rad!==0)alterneigh(rad,j,b,g,r);pix+=step;if(pix>=lengthcount)pix-=lengthcount;i++;if(delta===0)delta=1;if(i%delta===0){alpha-=alpha/alphadec;radius-=radius/radiusdec;rad=radius>>radiusbiasshift;if(rad<=1)rad=0;for(j=0;j<rad;j++)radpower[j]=alpha*((rad*rad-j*j)*radbias/(rad*rad))}}}function buildColormap(){init();learn();unbiasnet();inxbuild()}this.buildColormap=buildColormap;function getColormap(){var map=[];var index=[];for(var i=0;i<netsize;i++)index[network[i][3]]=i;var k=0;for(var l=0;l<netsize;l++){var j=index[l];map[k++]=network[j][0];map[k++]=network[j][1];map[k++]=network[j][2]}return map}this.getColormap=getColormap;this.lookupRGB=inxsearch}module.exports=NeuQuant},{}],4:[function(require,module,exports){var GIFEncoder,renderFrame;GIFEncoder=require("./GIFEncoder.js");renderFrame=function(frame){var encoder,page,stream,transfer;encoder=new GIFEncoder(frame.width,frame.height);if(frame.index===0){encoder.writeHeader()}else{encoder.firstFrame=false}encoder.setTransparent(frame.transparent);encoder.setRepeat(frame.repeat);encoder.setDelay(frame.delay);encoder.setQuality(frame.quality);encoder.setDither(frame.dither);encoder.setGlobalPalette(frame.globalPalette);encoder.addFrame(frame.data);if(frame.last){encoder.finish()}if(frame.globalPalette===true){frame.globalPalette=encoder.getGlobalPalette()}stream=encoder.stream();frame.data=stream.pages;frame.cursor=stream.cursor;frame.pageSize=stream.constructor.pageSize;if(frame.canTransfer){transfer=function(){var i,len,ref,results;ref=frame.data;results=[];for(i=0,len=ref.length;i<len;i++){page=ref[i];results.push(page.buffer)}return results}();return self.postMessage(frame,transfer)}else{return self.postMessage(frame)}};self.onmessage=function(event){return renderFrame(event.data)}},{"./GIFEncoder.js":1}]},{},[4]);
//# sourceMappingURL=gif.worker.js.map
`,
          ],
          { type: "text/javascript" },
        ),
      );
    return new Promise((u, f) => {
      try {
        let p = new Ca.default({
          workers: 2,
          quality: 10,
          workerScript: c,
          width: o,
          height: i,
          repeat: 0,
        });
        for (let _ of a) p.addFrame(_, { delay: s, copy: !0 });
        (p.on("finished", (_) => {
          URL.revokeObjectURL(c);
          let v = new FileReader();
          ((v.onload = () => u(String(v.result))),
            (v.onerror = () => f(v.error)),
            v.readAsDataURL(_));
        }),
          p.on("error", (_) => {
            (URL.revokeObjectURL(c), f(_));
          }),
          p.render());
      } catch (p) {
        (URL.revokeObjectURL(c), f(p));
      }
    });
  },
});
function Wn(e, t) {
  let r = 0;
  for (let n = 0; n < 8; n++)
    (t & 1 && (r ^= e), (e = (e << 1) ^ (e & 128 ? 285 : 0)), (t >>= 1));
  return r;
}
function Tl(e) {
  let t = new TextEncoder().encode(e);
  if (t.length > 17) throw new Error("QR text is limited to 17 UTF-8 bytes");
  let r = [0, 1, 0, 0];
  for (let g = 7; g >= 0; g--) r.push((t.length >> g) & 1);
  for (let g of t) for (let E = 7; E >= 0; E--) r.push((g >> E) & 1);
  for (let g = 0; g < 4 && r.length < 152; g++) r.push(0);
  for (; r.length % 8; ) r.push(0);
  let n = [];
  for (let g = 0; g < r.length; g += 8)
    n.push(r.slice(g, g + 8).reduce((E, x) => (E << 1) | x, 0));
  let o = 0;
  for (; n.length < 19; ) n.push(o++ % 2 ? 17 : 236);
  let i = [1],
    a = 1;
  for (let g = 0; g < 7; g++) {
    let E = Array(i.length + 1).fill(0);
    (i.forEach((x, b) => {
      ((E[b] ^= x), (E[b + 1] ^= Wn(x, a)));
    }),
      (i = E),
      (a = Wn(a, 2)));
  }
  let s = Array(7).fill(0);
  for (let g of n) {
    let E = g ^ s.shift();
    s.push(0);
    for (let x = 0; x < 7; x++) s[x] ^= Wn(i[x + 1], E);
  }
  let c = [...n, ...s].flatMap((g) =>
      Array.from({ length: 8 }, (E, x) => (g >> (7 - x)) & 1),
    ),
    u = Array.from({ length: 21 }, () => Array(21).fill(!1)),
    f = Array.from({ length: 21 }, () => Array(21).fill(!1)),
    p = (g, E, x) => {
      g >= 0 && E >= 0 && g < 21 && E < 21 && ((u[E][g] = x), (f[E][g] = !0));
    };
  for (let [g, E] of [
    [3, 3],
    [17, 3],
    [3, 17],
  ])
    for (let x = -4; x <= 4; x++)
      for (let b = -4; b <= 4; b++) {
        let w = Math.max(Math.abs(b), Math.abs(x));
        p(g + b, E + x, w === 3 || w <= 1);
      }
  for (let g = 8; g <= 12; g++) (p(g, 6, g % 2 === 0), p(6, g, g % 2 === 0));
  let _ = 30660;
  for (let g = 0; g < 15; g++) {
    let E = ((_ >> g) & 1) !== 0;
    (g < 6
      ? p(8, g, E)
      : g === 6
        ? p(8, 7, E)
        : p(g === 7 ? 8 : g === 8 ? 7 : 14 - g, 8, E),
      g < 8 ? p(20 - g, 8, E) : p(8, g + 6, E));
  }
  p(8, 13, !0);
  let v = 0;
  for (let g = 20; g >= 1; g -= 2) {
    g === 6 && (g = 5);
    for (let E = 0; E < 21; E++) {
      let x = (g + 1) & 2 ? E : 20 - E;
      for (let b = 0; b < 2; b++) {
        let w = g - b;
        f[x][w] || (u[x][w] = !!(c[v++] ?? 0) != ((w + x) % 2 === 0));
      }
    }
  }
  return u;
}
new l("create_qr_code", {
  category: "media",
  parameters: [I("text"), I("size", "number")],
  perform(e, t, r) {
    let n = Tl(me(Y(e.text, r))),
      o = Ie(e.size, "Size", 250),
      i = Math.max(1, Math.floor(o / 29)),
      a = ge(i * 29, i * 29),
      s = he(a);
    ((s.fillStyle = "#ffffff"),
      s.fillRect(0, 0, a.width, a.height),
      (s.fillStyle = "#000000"));
    for (let c = 0; c < 21; c++)
      for (let u = 0; u < 21; u++)
        n[c][u] && s.fillRect((u + 4) * i, (c + 4) * i, i, i);
    return ke(a);
  },
});
var S = (e) => (e == null ? "" : String(e)),
  k = (e, t = "text") => ({ name: e, type: t }),
  H = (e, t) => (e === "" || e === void 0 ? t : e),
  Xt = (e) =>
    e &&
    typeof e == "object" &&
    !Array.isArray(e) &&
    !(e instanceof Date) &&
    !(e instanceof URL)
      ? e
      : void 0,
  Gn = 0;
function Me(e, t = "Number") {
  let r = Number(e);
  if (!Number.isFinite(r)) throw new Error(`${t} must be finite`);
  return r;
}
function Oa(e) {
  let t = e.match(/\d+(?:\.\d+)?(?:e[+-]?\d+)?|[()+*/^%-]/gi) ?? [];
  if (t.join("").toLowerCase() !== e.replace(/\s+/g, "").toLowerCase())
    throw new Error("Invalid expression");
  let r = 0,
    n = () => {
      let c = t[r++];
      if (c === "+") return n();
      if (c === "-") return -n();
      if (c === "(") {
        let u = a();
        if (t[r++] !== ")") throw new Error("Missing closing parenthesis");
        return u;
      }
      if (!c || !/^\d/.test(c)) throw new Error("Expected a number");
      return Me(c);
    },
    o = () => {
      let c = n();
      return t[r] === "^" ? (r++, c ** o()) : c;
    },
    i = () => {
      let c = o();
      for (; ["*", "/", "%"].includes(t[r]); ) {
        let u = t[r++],
          f = o();
        c = u === "*" ? c * f : u === "/" ? c / f : c % f;
      }
      return c;
    },
    a = () => {
      let c = i();
      for (; ["+", "-"].includes(t[r]); ) c += (t[r++] === "+" ? 1 : -1) * i();
      return c;
    },
    s = a();
  if (r !== t.length) throw new Error("Unexpected expression token");
  return Me(s, "Expression result");
}
var yt = {
  mm: ["length", 0.001],
  cm: ["length", 0.01],
  m: ["length", 1],
  km: ["length", 1e3],
  in: ["length", 0.0254],
  ft: ["length", 0.3048],
  yd: ["length", 0.9144],
  mi: ["length", 1609.344],
  mg: ["mass", 0.001],
  g: ["mass", 1],
  kg: ["mass", 1e3],
  oz: ["mass", 28.349523125],
  lb: ["mass", 453.59237],
  ms: ["time", 0.001],
  s: ["time", 1],
  min: ["time", 60],
  h: ["time", 3600],
  day: ["time", 86400],
};
function Be(e) {
  let t = e instanceof Date ? new Date(e) : new Date(S(e));
  if (Number.isNaN(t.getTime())) throw new Error("Invalid date");
  return t;
}
async function Tt(e, t) {
  let r = S(e);
  if (!r) throw new Error("Configure a service endpoint for this action");
  let n = await fetch(r, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(t),
  });
  if (!n.ok) throw new Error(`Service request failed: ${n.status}`);
  return n;
}
function Jn(e) {
  let t = typeof e == "string" ? JSON.parse(e || "[]") : e;
  if (
    !Array.isArray(t) ||
    t.length > 1e3 ||
    t.some((r) => !r || typeof r.type != "string")
  )
    throw new Error("Actions must be a JSON array of macro steps");
  return t;
}
async function Kn(e, t, r, n, o) {
  if (++Gn > 8) throw (Gn--, new Error("Nested actions are too deep"));
  let i = r,
    a = new Map();
  try {
    for (let s of e) {
      let c = l.all.get(s.type);
      if (!c || !l.canPerform(s.type))
        throw new Error(`Unavailable action: ${s.type}`);
      let u = Object.fromEntries(
          Object.entries(s.params ?? {}).map(([p, _]) => [
            p,
            _ === "$result" ? i : _ === "$item" ? n : _ === "$index" ? o : _,
          ]),
        ),
        f = await F.resolveParams(u, a, t);
      if (f === null) return "__return";
      if (
        (a.set(s.uuid, f),
        (i = await c.perform(f, t, i)),
        i === "__return" || Xt(i)?.__macro_stop === !0)
      )
        return i;
    }
    return i;
  } finally {
    Gn--;
  }
}
var Da = new WeakMap();
function Ar(e) {
  let t = Da.get(e);
  return (t || Da.set(e, (t = new Map())), t);
}
new l("comment", {
  category: "scripting",
  icon: "comment",
  parameters: [{ name: "text", type: "text" }],
  perform() {},
});
new l("show_content", {
  category: "scripting",
  icon: "message",
  parameters: [{ name: "text", type: "text" }],
  perform(e, t) {
    Blockbench.showMessageBox({ title: t.name ?? "Macro", message: S(e.text) });
  },
});
new l("show_alert", {
  category: "scripting",
  icon: "warning",
  form: {
    title: { type: "text", label: "Title", placeholder: "optional" },
    show_cancel: { type: "checkbox", label: "Show Cancel Button", value: !0 },
  },
  parameters: [{ name: "prompt", type: "text" }],
  async perform(e) {
    let t = e?.show_cancel === void 0 ? !0 : e?.show_cancel,
      r = ["dialog.ok"];
    return (
      t && r.unshift("dialog.cancel"),
      new Promise((n) => {
        Blockbench.showMessageBox(
          {
            title: String(e.title ?? "Alert"),
            message: e.prompt?.toString() ?? "Do you want to continue?",
            buttons: r,
          },
          (o) => {
            let i = o === 0 ? "__return" : !0;
            if (!t) return n(!0);
            n(i);
          },
        );
      })
    );
  },
});
var Ta = ((n) => (
  (n.AskEachTime = "ask"),
  (n.Clipboard = "clipboard"),
  (n.CurrentDate = "current_date"),
  n
))(Ta || {});
new l("ask_input", {
  category: "scripting",
  icon: "question_mark",
  parameters: [
    { name: "type", type: "enum" },
    { name: "value", type: "enum" },
  ],
  form: {
    default: { type: "text", label: "Default Answer", placeholder: "Text" },
    multiple: { type: "checkbox", label: "Allow Multiple Lines", value: !0 },
  },
  async perform(e, t) {
    if (e.value === "clipboard") return navigator.clipboard.readText();
    if (e.value === "current_date") return new Date();
    let r = S(e.type) || "text",
      n =
        r === "number"
          ? "number"
          : r === "boolean"
            ? "checkbox"
            : e.multiple
              ? "textarea"
              : "text",
      o =
        n === "checkbox"
          ? e.default === !0 || e.default === "true"
          : n === "number"
            ? Number(e.default) || 0
            : S(e.default);
    return new Promise((i) =>
      new Dialog({
        title: t.name || "Input",
        form: { value: { type: n, label: "Value", value: o } },
        buttons: ["dialog.ok", "dialog.cancel"],
        onConfirm(a) {
          let s = a.value;
          r === "number"
            ? i(Me(s))
            : r === "boolean"
              ? i(!!s)
              : r === "date"
                ? i(Be(s))
                : r === "url"
                  ? i(new URL(S(s)))
                  : i(S(s));
        },
        onCancel() {
          i(void 0);
        },
      }).show(),
    );
  },
})
  .addEnum(
    "type",
    Object.values(ze).filter((e) => !["enum"].includes(e)),
  )
  .addEnum("value", Object.values(Ta));
new l("count", {
  category: "scripting",
  parameters: [
    { name: "items", type: "text" },
    { name: "input", type: "text" },
  ],
  perform(e, t, r) {
    let n = e.input ?? r;
    if (Array.isArray(n)) return n.length;
    let o = String(n ?? ""),
      i = String(e.items ?? "");
    return i ? o.split(i).length - 1 : o.length;
  },
});
new l("choose_from_menu", {
  category: "scripting",
  parameters: [k("prompt"), k("options")],
  perform(e, t) {
    let r = S(e.options)
      .split(/\r?\n/)
      .map((n) => n.trim())
      .filter(Boolean);
    if (!r.length) throw new Error("Add at least one menu option");
    return new Promise((n) =>
      Blockbench.showMessageBox(
        {
          title: t.name || "Choose",
          message: S(e.prompt),
          buttons: [...r, "dialog.cancel"],
        },
        (o) => {
          n(typeof o == "number" && o < r.length ? r[o] : void 0);
        },
      ),
    );
  },
});
new l("if", {
  category: "scripting",
  parameters: [k("condition", "boolean"), k("actions"), k("otherwise")],
  async perform(e, t, r) {
    let n = e.condition && e.condition !== "false" ? e.actions : e.otherwise;
    return Kn(Jn(n), t, r);
  },
});
new l("repeat", {
  category: "scripting",
  parameters: [k("count", "number"), k("actions")],
  async perform(e, t, r) {
    let n = Number(e.count);
    if (!Number.isInteger(n) || n < 0 || n > 1e3)
      throw new Error("Repeat count must be between 0 and 1000");
    let o = Jn(e.actions),
      i = r;
    for (let a = 0; a < n; a++)
      if (
        ((i = await Kn(o, t, i, void 0, a)),
        i === "__return" || Xt(i)?.__macro_stop === !0)
      )
        return i;
    return i;
  },
});
new l("repeat_each", {
  category: "scripting",
  parameters: [k("items"), k("actions")],
  async perform(e, t, r) {
    let n = H(e.items, r),
      o = Array.isArray(n) ? n : S(n).split(/\r?\n/).filter(Boolean);
    if (o.length > 1e3)
      throw new Error("Repeat Each supports at most 1000 items");
    let i = Jn(e.actions),
      a = [];
    for (let s = 0; s < o.length; s++) {
      let c = await Kn(i, t, o[s], o[s], s);
      if (c === "__return" || Xt(c)?.__macro_stop === !0) return c;
      a.push(c);
    }
    return a;
  },
});
new l("try", {
  category: "scripting",
  description:
    "Run the enclosed actions and continue at On Error if one fails. The error is passed as a dictionary with name and message.",
  perform(e, t, r) {
    return r;
  },
});
new l("on_error", {
  category: "scripting",
  name: "On Error",
  perform(e, t, r) {
    return r;
  },
});
new l("end_try", {
  category: "scripting",
  name: "End Try",
  perform(e, t, r) {
    return r;
  },
});
new l("otherwise", {
  category: "scripting",
  name: "Otherwise",
  icon: "call_split",
  perform(e, t, r) {
    return r;
  },
});
new l("end_if", {
  category: "scripting",
  name: "End If",
  icon: "alt_route",
  perform(e, t, r) {
    return r;
  },
});
new l("end_repeat", {
  category: "scripting",
  name: "End Repeat",
  icon: "repeat",
  perform(e, t, r) {
    return r;
  },
});
new l("end_repeat_each", {
  category: "scripting",
  name: "End Repeat Each",
  icon: "repeat_on",
  perform(e, t, r) {
    return r;
  },
});
function Al(e) {
  return new Promise((t) => setTimeout(t, e * 1e3));
}
new l("wait", {
  category: "scripting",
  icon: "access_time",
  parameters: [{ name: "seconds", type: "number" }],
  async perform(e) {
    await Al(Math.max(0, Number(e.seconds) || 0));
  },
});
new l("set_variable", {
  category: "scripting",
  parameters: [
    { name: "name", type: "text" },
    { name: "input", type: "text" },
  ],
  perform(e, t, r) {
    let n = e.input ?? r;
    return (Ar(t).set(String(e.name), n), n);
  },
});
new l("get_variable", {
  category: "scripting",
  parameters: [{ name: "name", type: "text" }],
  perform(e, t) {
    return Ar(t).get(String(e.name));
  },
});
new l("add_variable", {
  category: "scripting",
  parameters: [
    { name: "name", type: "text" },
    { name: "input", type: "number" },
  ],
  perform(e, t) {
    let r = String(e.name),
      n = Number(Ar(t).get(r) ?? 0) + Number(e.input ?? 0);
    return (Ar(t).set(r, n), n);
  },
});
function Zn(e) {
  return Array.isArray(e) ? [...e] : S(e).split(/\r?\n/).filter(Boolean);
}
function Rl(e) {
  let t = JSON.stringify(e, (r, n) =>
    n && typeof n == "object" && !Array.isArray(n)
      ? Object.fromEntries(
          Object.entries(n).sort(([o], [i]) => o.localeCompare(i)),
        )
      : n,
  );
  return `${typeof e}:${t}`;
}
new l("list", {
  category: "scripting",
  parameters: [{ name: "items", type: "text" }],
  perform(e, t, r) {
    let n = e.items ?? r;
    return Array.isArray(n)
      ? n
      : String(n ?? "")
          .split(/\r?\n/)
          .filter(Boolean);
  },
});
new l("sort_list", {
  category: "scripting",
  description:
    "Sort a list as text, numbers, or dates without changing the original list.",
  parameters: [k("items"), k("order", "enum"), k("type", "enum")],
  perform(e, t, r) {
    let n = Zn(H(e.items, r)),
      o = S(e.order) || "ascending",
      i = S(e.type) || "text";
    if (!["ascending", "descending"].includes(o))
      throw new Error(`Unknown sort order: ${o}`);
    if (!["text", "number", "date"].includes(i))
      throw new Error(`Unknown sort type: ${i}`);
    let a = n.map((c) => {
        if (i === "text") return S(c);
        let u =
          i === "number"
            ? Number(c)
            : c instanceof Date
              ? c.getTime()
              : new Date(S(c)).getTime();
        if (!Number.isFinite(u))
          throw new Error(`List contains an invalid ${i}`);
        return u;
      }),
      s = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
    return n
      .map((c, u) => ({ item: c, index: u }))
      .sort((c, u) => {
        let f = a[c.index],
          p = a[u.index],
          _ = i === "text" ? s.compare(f, p) : f - p;
        return (o === "ascending" ? _ : -_) || c.index - u.index;
      })
      .map(({ item: c }) => c);
  },
})
  .addEnum("order", ["ascending", "descending"])
  .addEnum("type", ["text", "number", "date"]);
new l("remove_duplicates", {
  category: "scripting",
  description: "Keep the first occurrence of each value in a list.",
  parameters: [k("items")],
  perform(e, t, r) {
    let n = new Set();
    return Zn(H(e.items, r)).filter((o) => {
      let i = Rl(o);
      return n.has(i) ? !1 : (n.add(i), !0);
    });
  },
});
new l("join_list", {
  category: "scripting",
  description:
    "Join list values into text. The default separator is a newline.",
  parameters: [k("items"), k("separator")],
  perform(e, t, r) {
    let n =
      e.separator == null
        ? `
`
        : S(e.separator);
    return Zn(H(e.items, r))
      .map((o) =>
        o == null
          ? ""
          : o instanceof Date
            ? o.toISOString()
            : typeof o == "object" && !(o instanceof URL)
              ? JSON.stringify(o)
              : S(o),
      )
      .join(n);
  },
});
new l("choose_from_list", {
  category: "scripting",
  parameters: [k("items"), k("prompt")],
  perform(e, t, r) {
    let n = H(e.items, r),
      o = (Array.isArray(n) ? n : S(n).split(/\r?\n/)).filter((i) => S(i));
    if (!o.length) throw new Error("No list items to choose from");
    return new Promise((i) =>
      Blockbench.showMessageBox(
        {
          title: t.name || "Choose",
          message: S(e.prompt),
          buttons: [...o.map(S), "dialog.cancel"],
        },
        (a) => {
          i(typeof a == "number" && a < o.length ? o[a] : void 0);
        },
      ),
    );
  },
});
new l("get_from_list", {
  category: "scripting",
  parameters: [{ name: "index", type: "number" }],
  perform(e, t, r) {
    return Array.isArray(r) ? r[Number(e.index) || 0] : void 0;
  },
});
function qn(e, t) {
  let r = e;
  if (typeof r == "string")
    try {
      r = JSON.parse(r);
    } catch {
      throw new Error(`${t} must be a JSON object`);
    }
  if (
    !r ||
    typeof r != "object" ||
    Array.isArray(r) ||
    r instanceof Date ||
    r instanceof URL
  )
    throw new Error(`${t} must be a dictionary`);
  return r;
}
new l("dictionary", {
  category: "scripting",
  parameters: [{ name: "json", type: "text" }],
  perform(e, t, r) {
    let n = e.json || r;
    if (n && typeof n == "object" && !Array.isArray(n)) return n;
    let o = JSON.parse(String(n || "{}"));
    if (!o || typeof o != "object" || Array.isArray(o))
      throw new Error("Expected a JSON object");
    return o;
  },
});
new l("get_dictionary_keys", {
  category: "scripting",
  description:
    "Return the keys of a dictionary as a list, preserving their order.",
  parameters: [k("dictionary")],
  perform(e, t, r) {
    return Object.keys(qn(H(e.dictionary, r), "Dictionary"));
  },
});
new l("merge_dictionaries", {
  category: "scripting",
  description:
    "Shallow-merge two dictionaries. The previous result supplies First when left empty.",
  parameters: [k("first"), k("second"), k("conflict", "enum")],
  perform(e, t, r) {
    let n = qn(H(e.first, r), "First dictionary"),
      o = qn(e.second, "Second dictionary"),
      i = S(e.conflict) || "use_second";
    if (i === "use_second") return { ...n, ...o };
    if (i === "keep_first") return { ...o, ...n };
    throw new Error(`Unknown conflict option: ${i}`);
  },
}).addEnum("conflict", ["use_second", "keep_first"]);
new l("get_dictionary_value", {
  category: "scripting",
  parameters: [{ name: "key", type: "text" }],
  perform(e, t, r) {
    return r && typeof r == "object" && !Array.isArray(r)
      ? r[String(e.key)]
      : void 0;
  },
});
new l("set_dictionary_value", {
  category: "scripting",
  parameters: [
    { name: "key", type: "text" },
    { name: "value", type: "text" },
  ],
  perform(e, t, r) {
    return {
      ...(r && typeof r == "object" && !Array.isArray(r) ? r : {}),
      [String(e.key)]: e.value,
    };
  },
});
new l("get_dictionary_from", {
  category: "scripting",
  parameters: [k("input")],
  perform(e, t, r) {
    let n = H(e.input, r);
    if (
      n &&
      typeof n == "object" &&
      !Array.isArray(n) &&
      !(n instanceof Date) &&
      !(n instanceof URL)
    )
      return n;
    let o = JSON.parse(S(n));
    if (!o || typeof o != "object" || Array.isArray(o))
      throw new Error("Input is not a JSON object");
    return o;
  },
});
new l("number", {
  category: "scripting",
  parameters: [{ name: "value", type: "number" }],
  perform(e, t, r) {
    let n = Number(e.value ?? r);
    if (!Number.isFinite(n)) throw new Error("Expected a finite number");
    return n;
  },
});
new l("random_number", {
  category: "scripting",
  parameters: [
    { name: "min", type: "number" },
    { name: "max", type: "number" },
  ],
  perform(e) {
    let t = Number(e.min ?? 0),
      r = Number(e.max ?? 1);
    if (!Number.isFinite(t) || !Number.isFinite(r) || r < t)
      throw new Error("Invalid random number range");
    return t + Math.random() * (r - t);
  },
});
new l("round_number", {
  category: "scripting",
  parameters: [{ name: "digits", type: "number" }],
  perform(e, t, r) {
    let n = 10 ** Math.max(-15, Math.min(15, Number(e.digits) || 0));
    return Math.round(Number(r) * n) / n;
  },
});
new l("format_number", {
  category: "scripting",
  parameters: [{ name: "locale", type: "text" }],
  perform(e, t, r) {
    return new Intl.NumberFormat(e.locale ? String(e.locale) : void 0).format(
      Number(r),
    );
  },
});
new l("get_numbers_input", {
  category: "scripting",
  parameters: [k("input")],
  perform(e, t, r) {
    let n = H(e.input, r);
    return Array.isArray(n)
      ? n.map((o) => Me(o))
      : (S(n).match(/[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/gi) ?? []).map(
          Number,
        );
  },
});
new l("calculate", {
  category: "scripting",
  parameters: [
    k("number1", "number"),
    k("operator", "enum"),
    k("number2", "number"),
  ],
  perform(e) {
    return Oa(`${Me(e.number1)}${S(e.operator)}${Me(e.number2)}`);
  },
}).addEnum("operator", ["+", "-", "*", "/", "%", "^"]);
new l("calculate_expression", {
  category: "scripting",
  parameters: [k("expression")],
  perform(e, t, r) {
    return Oa(S(H(e.expression, r)));
  },
});
new l("calculate_statistics", {
  category: "scripting",
  parameters: [k("type", "enum"), k("input")],
  perform(e, t, r) {
    let n = H(e.input, r),
      o = (
        Array.isArray(n)
          ? n
          : S(n)
              .split(/[\s,]+/)
              .filter(Boolean)
      ).map((s) => Me(s));
    if (!o.length) throw new Error("No numbers to analyze");
    let i = [...o].sort((s, c) => s - c),
      a = o.reduce((s, c) => s + c, 0);
    switch (e.type) {
      case "sum":
        return a;
      case "mean":
        return a / o.length;
      case "median":
        return i.length % 2
          ? i[(i.length - 1) / 2]
          : (i[i.length / 2 - 1] + i[i.length / 2]) / 2;
      case "min":
        return i[0];
      case "max":
        return i[i.length - 1];
      case "count":
        return o.length;
      case "range":
        return i[i.length - 1] - i[0];
      case "standard_deviation": {
        let s = a / o.length;
        return Math.sqrt(o.reduce((c, u) => c + (u - s) ** 2, 0) / o.length);
      }
      default:
        throw new Error(`Unknown statistic: ${e.type}`);
    }
  },
}).addEnum("type", [
  "sum",
  "mean",
  "median",
  "min",
  "max",
  "count",
  "range",
  "standard_deviation",
]);
new l("measurement", {
  category: "scripting",
  parameters: [k("value", "number"), k("unit")],
  perform(e) {
    let t = S(e.unit);
    if (!yt[t]) throw new Error(`Unknown unit: ${t}`);
    return { value: Me(e.value), unit: t };
  },
});
new l("convert_measurement", {
  category: "scripting",
  parameters: [k("value"), k("from"), k("to")],
  perform(e, t, r) {
    let n = Xt(r),
      o = S(e.from || n?.unit),
      i = S(e.to);
    if (!yt[o] || !yt[i] || yt[o][0] !== yt[i][0])
      throw new Error("Incompatible measurement units");
    return (Me(H(e.value, n?.value)) * yt[o][1]) / yt[i][1];
  },
});
new l("date", {
  category: "scripting",
  parameters: [k("date", "date")],
  perform(e, t, r) {
    let n = H(e.date, r);
    return n == null || n === "" ? new Date() : Be(n);
  },
});
new l("format_date", {
  category: "scripting",
  parameters: [
    k("date", "date"),
    k("locale"),
    k("time_zone"),
    k("style", "enum"),
  ],
  perform(e, t, r) {
    let n = Be(H(e.date, r));
    return new Intl.DateTimeFormat(S(e.locale) || void 0, {
      dateStyle: S(e.style) || "medium",
      timeZone: S(e.time_zone) || void 0,
    }).format(n);
  },
}).addEnum("style", ["short", "medium", "long", "full"]);
new l("adjust_date", {
  category: "scripting",
  parameters: [
    k("date", "date"),
    k("operation", "enum"),
    k("value", "number"),
    k("time", "enum"),
  ],
  perform(e, t, r) {
    let n = Be(H(e.date, r)),
      o = Me(e.value) * (e.operation === "subtract" ? -1 : 1);
    switch (e.time) {
      case "years":
        n.setUTCFullYear(n.getUTCFullYear() + o);
        break;
      case "months":
        n.setUTCMonth(n.getUTCMonth() + o);
        break;
      case "days":
        n.setUTCDate(n.getUTCDate() + o);
        break;
      case "hours":
        n.setUTCHours(n.getUTCHours() + o);
        break;
      case "minutes":
        n.setUTCMinutes(n.getUTCMinutes() + o);
        break;
      case "seconds":
        n.setUTCSeconds(n.getUTCSeconds() + o);
        break;
      default:
        throw new Error(`Unknown time unit: ${e.time}`);
    }
    return n;
  },
})
  .addEnum("operation", ["add", "subtract"])
  .addEnum("time", ["years", "months", "days", "hours", "minutes", "seconds"]);
new l("get_time_between_dates", {
  category: "scripting",
  parameters: [k("date1", "date"), k("date2", "date"), k("time", "enum")],
  perform(e, t, r) {
    let n = Be(H(e.date1, r)),
      o = Be(e.date2),
      i = {
        milliseconds: 1,
        seconds: 1e3,
        minutes: 6e4,
        hours: 36e5,
        days: 864e5,
        weeks: 6048e5,
      },
      a = S(e.time) || "days";
    if (!i[a]) throw new Error(`Unknown time unit: ${a}`);
    return (o.getTime() - n.getTime()) / i[a];
  },
}).addEnum("time", [
  "milliseconds",
  "seconds",
  "minutes",
  "hours",
  "days",
  "weeks",
]);
new l("get_dates_input", {
  category: "scripting",
  parameters: [k("input")],
  perform(e, t, r) {
    let n = H(e.input, r);
    return Array.isArray(n)
      ? n.map(Be)
      : (
          S(n).match(
            /\b\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?\b/g,
          ) ?? []
        ).map(Be);
  },
});
new l("convert_time_zone", {
  category: "scripting",
  parameters: [k("date", "date"), k("time_zone")],
  perform(e, t, r) {
    return new Intl.DateTimeFormat(void 0, {
      dateStyle: "medium",
      timeStyle: "long",
      timeZone: S(e.time_zone) || void 0,
    }).format(Be(H(e.date, r)));
  },
});
new l("text", {
  category: "scripting",
  parameters: [{ name: "text", type: "text" }],
  perform(e) {
    return e.text ?? "";
  },
});
new l("get_text_input", {
  category: "scripting",
  parameters: [k("input")],
  perform(e, t, r) {
    let n = H(e.input, r);
    return Array.isArray(n)
      ? n.filter((o) => typeof o == "string").join(`
`)
      : S(n);
  },
});
new l("show_definition", {
  category: "scripting",
  description:
    "POST {word} to the endpoint; expects JSON with a definition or text field.",
  parameters: [k("word"), k("endpoint")],
  async perform(e, t, r) {
    let n = S(H(e.word, r)),
      o = await (await Tt(e.endpoint, { word: n })).json(),
      i = S(o.definition ?? o.text);
    if (!i) throw new Error("Definition service returned no definition");
    return (Blockbench.showMessageBox({ title: n || t.name, message: i }), i);
  },
});
new l("get_name_emoji", {
  category: "scripting",
  description:
    "Gets common emoji names locally, or POSTs {emoji} to an endpoint that returns {name}.",
  parameters: [k("text"), k("endpoint")],
  async perform(e, t, r) {
    let o = S(H(e.text, r)).match(/\p{Extended_Pictographic}(?:\uFE0F)?/u)?.[0];
    if (!o) throw new Error("No emoji found in input");
    if (e.endpoint) {
      let a = await (await Tt(e.endpoint, { emoji: o })).json();
      if (a.name) return S(a.name);
    }
    return (
      {
        "\u{1F600}": "grinning face",
        "\u{1F602}": "face with tears of joy",
        "\u2764\uFE0F": "red heart",
        "\u{1F44D}": "thumbs up",
        "\u{1F389}": "party popper",
        "\u{1F525}": "fire",
        "\u2705": "check mark",
        "\u2B50": "star",
      }[o] ?? `Emoji U+${o.codePointAt(0).toString(16).toUpperCase()}`
    );
  },
});
var Aa = ((a) => (
  (a.Upper = "upper"),
  (a.Lower = "lower"),
  (a.Title = "title"),
  (a.CapitalizeEveryWord = "all_words"),
  (a.CapitalizeSentence = "sentence"),
  (a.CapitalizeAlternating = "alternating"),
  a
))(Aa || {});
new l("change_case", {
  category: "scripting",
  parameters: [
    { name: "text", type: "text" },
    { name: "case", type: "enum" },
  ],
  perform(e) {
    switch (e?.case) {
      case "upper":
        return e?.text.toString().toUpperCase();
      case "lower":
        return e?.text.toString().toLowerCase();
      case "title":
        return String(e?.text ?? "")
          .toLowerCase()
          .replace(/\b\p{L}/gu, (t) => t.toUpperCase());
      case "all_words":
        return String(e?.text ?? "").replace(/\b\p{L}/gu, (t) =>
          t.toUpperCase(),
        );
      case "sentence":
        return String(e?.text ?? "")
          .toLowerCase()
          .replace(/(^|[.!?]\s+)\p{L}/gu, (t) => t.toUpperCase());
      case "alternating":
        return [...String(e?.text ?? "")]
          .map((t, r) => (r % 2 ? t.toLowerCase() : t.toUpperCase()))
          .join("");
      default:
        break;
    }
  },
}).addEnum("case", Object.values(Aa));
new l("combine_text", {
  category: "scripting",
  parameters: [{ name: "separator", type: "text" }],
  perform(e, t, r) {
    return Array.isArray(r)
      ? r.map(String).join(String(e.separator ?? ""))
      : String(r ?? "");
  },
});
new l("split_text", {
  category: "scripting",
  parameters: [{ name: "separator", type: "text" }],
  perform(e, t, r) {
    return String(r ?? "").split(
      String(
        e.separator ??
          `
`,
      ),
    );
  },
});
new l("replace_text", {
  category: "scripting",
  parameters: [
    { name: "find", type: "text" },
    { name: "replace", type: "text" },
  ],
  perform(e, t, r) {
    let n = String(e.find ?? "");
    return n
      ? String(r ?? "")
          .split(n)
          .join(String(e.replace ?? ""))
      : String(r ?? "");
  },
});
new l("trim_whitespace", {
  category: "scripting",
  perform(e, t, r) {
    return String(r ?? "").trim();
  },
});
new l("match_text", {
  category: "scripting",
  parameters: [
    { name: "pattern", type: "text" },
    { name: "flags", type: "text" },
  ],
  perform(e, t, r) {
    let n = S(e.flags) || "g",
      o = new RegExp(S(e.pattern), n.includes("g") ? n : `${n}g`);
    return [...String(r ?? "").matchAll(o)].map((i) => ({
      match: i[0],
      groups: [...i].slice(1),
      named: i.groups ?? {},
    }));
  },
});
new l("get_group_from_matched_text", {
  category: "scripting",
  parameters: [k("index", "number"), k("group")],
  perform(e, t, r) {
    let n = Array.isArray(r) ? r[Number(e.index) || 0] : r,
      o = Xt(n);
    if (!o) throw new Error("Input is not a text match");
    let i = S(e.group),
      a = o.named;
    if (i && a && typeof a == "object" && !Array.isArray(a) && i in a)
      return a[i];
    let s = o.groups;
    if (!Array.isArray(s)) throw new Error("Match has no capture groups");
    return s[i ? Number(i) - 1 : 0];
  },
});
new l("correct_spelling", {
  category: "scripting",
  description:
    "POST {text, language} to the endpoint; expects JSON with corrected or text.",
  parameters: [k("text"), k("language"), k("endpoint")],
  async perform(e, t, r) {
    let n = await (
        await Tt(e.endpoint, {
          text: S(H(e.text, r)),
          language: S(e.language) || navigator.language,
        })
      ).json(),
      o = n.corrected ?? n.text;
    if (typeof o != "string")
      throw new Error("Spelling service returned no corrected text");
    return o;
  },
});
new l("speak_text", {
  category: "scripting",
  parameters: [k("text"), k("language"), k("rate", "number")],
  perform(e, t, r) {
    if (!window.speechSynthesis)
      throw new Error("Speech synthesis is unavailable");
    let n = new SpeechSynthesisUtterance(S(H(e.text, r)));
    return (
      (n.lang = S(e.language) || navigator.language),
      (n.rate = Number(e.rate) || 1),
      new Promise((o, i) => {
        ((n.onend = () => o(!0)),
          (n.onerror = (a) =>
            i(new Error(`Speech synthesis failed: ${a.error}`))),
          window.speechSynthesis.speak(n));
      })
    );
  },
});
new l("make_spoken_audio_from_text", {
  category: "scripting",
  description:
    "POST {text, language} to the endpoint; expects an audio response.",
  parameters: [k("text"), k("language"), k("endpoint")],
  async perform(e, t, r) {
    let o = await (
      await Tt(e.endpoint, {
        text: S(H(e.text, r)),
        language: S(e.language) || navigator.language,
      })
    ).blob();
    if (!o.type.startsWith("audio/"))
      throw new Error("Speech service did not return audio");
    return new Promise((i, a) => {
      let s = new FileReader();
      ((s.onload = () => i(String(s.result))),
        (s.onerror = () => a(s.error)),
        s.readAsDataURL(o));
    });
  },
});
new l("detect_language", {
  category: "scripting",
  description:
    "POST {text} to the endpoint; expects JSON with language or lang.",
  parameters: [k("text"), k("endpoint")],
  async perform(e, t, r) {
    let n = await (await Tt(e.endpoint, { text: S(H(e.text, r)) })).json(),
      o = n.language ?? n.lang;
    if (typeof o != "string")
      throw new Error("Language service returned no language");
    return o;
  },
});
new l("translate_text", {
  category: "scripting",
  description:
    "POST {text, from, to} to the endpoint; expects JSON with translatedText, translation, or text.",
  parameters: [k("text"), k("from_language"), k("to_language"), k("endpoint")],
  async perform(e, t, r) {
    let n = await (
        await Tt(e.endpoint, {
          text: S(H(e.text, r)),
          from: S(e.from_language) || "auto",
          to: S(e.to_language),
        })
      ).json(),
      o = n.translatedText ?? n.translation ?? n.text;
    if (typeof o != "string")
      throw new Error("Translation service returned no text");
    return o;
  },
});
new l("get_name", {
  category: "scripting",
  perform(e, t, r) {
    return r && typeof r == "object" && "name" in r ? String(r.name) : "";
  },
});
new l("get_type", {
  category: "scripting",
  perform(e, t, r) {
    return r instanceof Date
      ? "date"
      : r instanceof URL
        ? "url"
        : Array.isArray(r)
          ? "list"
          : typeof r;
  },
});
new l("set_name", {
  category: "scripting",
  parameters: [k("name")],
  perform(e, t, r) {
    if (!r || typeof r != "object" || Array.isArray(r) || !("name" in r))
      throw new Error("Input has no name");
    return ((r.name = S(e.name)), r);
  },
});
new l("show_content_graph", {
  category: "scripting",
  perform(e, t, r) {
    let n = new WeakSet(),
      o =
        JSON.stringify(
          r,
          (i, a) => {
            if (a && typeof a == "object") {
              if (n.has(a)) return "[Circular]";
              n.add(a);
            }
            return a;
          },
          2,
        ) ?? S(r);
    return (
      Blockbench.showMessageBox({ title: t.name || "Content", message: o }),
      r
    );
  },
});
new l("get_actions", {
  category: "scripting",
  parameters: [k("macro")],
  perform(e, t) {
    return (F.all.find((n) => n.name === S(e.macro)) ?? t).intents.map((n) => ({
      type: n.type,
      uuid: n.uuid,
      params: n.params,
    }));
  },
});
new l("run_macro", {
  category: "scripting",
  description:
    "Run a saved macro by name. Leave Input empty to pass the previous result; the called macro's output becomes this action's result.",
  parameters: [k("macro"), k("input")],
  async perform(e, t, r) {
    let n = S(e.macro).trim();
    if (!n) throw new Error("Macro name is required");
    let o = F.all.filter((i) => i.name === n);
    if (!o.length) throw new Error(`Macro not found: ${n}`);
    if (o.length > 1) throw new Error(`Multiple macros are named: ${n}`);
    return F.executeMacro(o[0], H(e.input, r));
  },
});
new l("run_action", {
  category: "scripting",
  parameters: [k("action"), k("params")],
  async perform(e, t, r) {
    let n = S(e.action),
      o = F.all.find((s) => s.name === n);
    if (o) return F.executeMacro(o, r);
    let i = l.all.get(n);
    if (!i || n === "run_action" || !l.canPerform(n))
      throw new Error(`Action not found: ${n}`);
    let a =
      typeof e.params == "string"
        ? JSON.parse(e.params || "{}")
        : (e.params ?? {});
    if (!a || typeof a != "object" || Array.isArray(a))
      throw new Error("Action params must be a JSON object");
    return i.perform(a, t, r);
  },
});
new l("get_whats_on_screen", {
  category: "scripting",
  perform() {
    return new Promise((e) => Screencam.fullScreen({}, e));
  },
});
new l("base64_encode", {
  category: "scripting",
  perform(e, t, r) {
    let n = new TextEncoder().encode(S(r)),
      o = "";
    for (let i of n) o += String.fromCharCode(i);
    return btoa(o);
  },
});
new l("generate_hash", {
  category: "scripting",
  parameters: [k("input"), k("type", "enum")],
  async perform(e, t, r) {
    let n = new TextEncoder().encode(S(H(e.input, r))),
      o = await crypto.subtle.digest(S(e.type) || "SHA-256", n);
    return [...new Uint8Array(o)]
      .map((i) => i.toString(16).padStart(2, "0"))
      .join("");
  },
}).addEnum("type", ["SHA-256", "SHA-384", "SHA-512", "SHA-1"]);
new l("format_file_size", {
  category: "scripting",
  perform(e, t, r) {
    let n = Number(r);
    if (!Number.isFinite(n) || n < 0)
      throw new Error("Expected a nonnegative file size");
    let o = Math.min(4, Math.floor(Math.log(n || 1) / Math.log(1024)));
    return `${(n / 1024 ** o).toFixed(o ? 1 : 0)} ${["B", "KiB", "MiB", "GiB", "TiB"][o]}`;
  },
});
new l("stop_and_output", {
  category: "scripting",
  parameters: [k("result")],
  perform(e, t, r) {
    let n = H(e.result, r);
    return (
      Blockbench.showMessageBox({
        title: t.name || "Macro Output",
        message: typeof n == "object" ? JSON.stringify(n, null, 2) : S(n),
      }),
      { __macro_stop: !0, value: n }
    );
  },
});
new l("stop", {
  category: "scripting",
  perform() {
    return "__return";
  },
});
new l("wait_to_return", {
  category: "scripting",
  parameters: [k("prompt")],
  perform(e, t, r) {
    return new Promise((n) =>
      Blockbench.showMessageBox(
        {
          title: t.name || "Macro",
          message: S(e.prompt) || "Continue?",
          buttons: ["dialog.ok", "dialog.cancel"],
        },
        (o) => {
          n(o === 0 ? r : "__return");
        },
      ),
    );
  },
});
new l("run_script_over_ssh", {
  category: "scripting",
  description:
    "Runs a command over the system SSH client with noninteractive authentication and a 30 second limit.",
  variant: "desktop",
  parameters: [k("host"), k("user"), k("port", "number"), k("script")],
  perform(e) {
    let t = S(e.host),
      r = S(e.script),
      n = S(e.user),
      o = Number(e.port) || 22;
    if (
      !/^[A-Za-z0-9][A-Za-z0-9.:[\]_-]*$/.test(t) ||
      (n && !/^[A-Za-z0-9_][A-Za-z0-9._-]*$/.test(n)) ||
      !r ||
      !Number.isInteger(o) ||
      o < 1 ||
      o > 65535
    )
      throw new Error("Valid SSH host, user, port, and script are required");
    let i = globalThis.require;
    if (typeof i != "function")
      throw new Error("SSH requires Node access in desktop Blockbench");
    let a = i("node:child_process");
    return new Promise((s, c) => {
      let u = a.spawn(
          "ssh",
          [
            "-p",
            String(o),
            "-o",
            "BatchMode=yes",
            "-o",
            "ConnectTimeout=10",
            n ? `${n}@${t}` : t,
            r,
          ],
          { windowsHide: !0 },
        ),
        f = "",
        p = "",
        _ = setTimeout(() => u.kill(), 3e4);
      (u.stdout.on("data", (v) => {
        ((f += v), f.length > 1e6 && u.kill());
      }),
        u.stderr.on("data", (v) => {
          ((p += v), p.length > 1e6 && u.kill());
        }),
        u.on("error", (v) => {
          (clearTimeout(_), c(v));
        }),
        u.on("close", (v) => {
          (clearTimeout(_),
            v === 0
              ? s(f.trim())
              : c(new Error(p.trim() || `SSH exited with code ${v}`)));
        }));
    });
  },
});
new l("open_x_callback_url", {
  category: "scripting",
  parameters: [k("url", "url")],
  perform(e, t, r) {
    let n = new URL(S(H(e.url, r)));
    if (["javascript:", "data:", "file:"].includes(n.protocol))
      throw new Error("Unsupported URL protocol");
    return (Blockbench.openLink(n.href), n.href);
  },
});
new l("nothing", {
  category: "scripting",
  perform(e, t, r) {
    return r;
  },
});
var At = (e) => (e == null ? "" : String(e)),
  nt = (e, t) => At(e.url || e.input || t),
  Ra = (e) =>
    Array.isArray(e)
      ? e.map(At)
      : (At(e).match(/https?:\/\/[^\s<>"']+/g) ?? []);
new l("search_web", {
  category: "web",
  parameters: [{ name: "query", type: "text" }],
  perform(e, t, r) {
    let n = `https://www.google.com/search?q=${encodeURIComponent(At(e.query || r))}`;
    return (window.open(n, "_blank", "noopener,noreferrer"), n);
  },
});
new l("open_urls", {
  category: "web",
  parameters: [{ name: "urls", type: "text" }],
  perform(e, t, r) {
    let n = Ra(e.urls || r);
    for (let o of n) window.open(o, "_blank", "noopener,noreferrer");
    return n;
  },
});
new l("get_items_from_rss_feed", {
  category: "web",
  parameters: [{ name: "url", type: "url" }],
  async perform(e, t, r) {
    let n = await fetch(nt(e, r));
    if (!n.ok) throw new Error(`RSS request failed: ${n.status}`);
    let o = new DOMParser().parseFromString(await n.text(), "application/xml");
    if (o.querySelector("parsererror"))
      throw new Error("Invalid RSS or Atom feed");
    return [...o.querySelectorAll("item, entry")].map((i) => ({
      title: i.querySelector("title")?.textContent ?? "",
      link:
        i.querySelector("link")?.getAttribute("href") ||
        i.querySelector("link")?.textContent ||
        "",
      description:
        i.querySelector("description, summary, content")?.textContent ?? "",
      date: i.querySelector("pubDate, published, updated")?.textContent ?? "",
    }));
  },
});
new l("get_rss_feeds_from_page", {
  category: "web",
  parameters: [{ name: "url", type: "url" }],
  async perform(e, t, r) {
    let n = nt(e, r),
      o = await fetch(n);
    if (!o.ok) throw new Error(`Page request failed: ${o.status}`);
    return [
      ...new DOMParser()
        .parseFromString(await o.text(), "text/html")
        .querySelectorAll(
          'link[rel="alternate"][type="application/rss+xml"], link[rel="alternate"][type="application/atom+xml"]',
        ),
    ].map((a) => new URL(a.getAttribute("href") || "", n).href);
  },
});
new l("url", {
  category: "web",
  parameters: [{ name: "url", type: "url" }],
  perform(e, t, r) {
    return new URL(nt(e, r));
  },
});
new l("url_encode", {
  category: "web",
  parameters: [{ name: "input", type: "text" }],
  perform(e, t, r) {
    return encodeURIComponent(At(e.input || r));
  },
});
new l("get_urls_from_input", {
  category: "web",
  parameters: [{ name: "input", type: "text" }],
  perform(e, t, r) {
    return Ra(e.input || r);
  },
});
new l("get_component_of_url", {
  category: "web",
  parameters: [
    { name: "url", type: "url" },
    { name: "component", type: "enum" },
  ],
  perform(e, t, r) {
    let n = new URL(nt(e, r)),
      o = At(e.component),
      i = n[o];
    return typeof i == "string" ? i : void 0;
  },
}).addEnum("component", [
  "href",
  "protocol",
  "host",
  "hostname",
  "port",
  "pathname",
  "search",
  "hash",
  "origin",
]);
new l("expand_url", {
  category: "web",
  parameters: [{ name: "url", type: "url" }],
  async perform(e, t, r) {
    let n = await fetch(nt(e, r), { method: "HEAD", redirect: "follow" });
    if (!n.ok) throw new Error(`URL request failed: ${n.status}`);
    return n.url;
  },
});
new l("get_contents_of_url", {
  category: "web",
  parameters: [{ name: "url", type: "url" }],
  async perform(e, t, r) {
    let n = await fetch(nt(e, r));
    if (!n.ok) throw new Error(`URL request failed: ${n.status}`);
    return n.text();
  },
});
new l("get_headers_of_url", {
  category: "web",
  parameters: [{ name: "url", type: "url" }],
  async perform(e, t, r) {
    let n = await fetch(nt(e, r), { method: "HEAD" });
    if (!n.ok) throw new Error(`URL request failed: ${n.status}`);
    return Object.fromEntries(n.headers.entries());
  },
});
new l("get_contents_of_web_page", {
  category: "web",
  parameters: [{ name: "url", type: "url" }],
  async perform(e, t, r) {
    let n = await fetch(nt(e, r));
    if (!n.ok) throw new Error(`Page request failed: ${n.status}`);
    let o = new DOMParser().parseFromString(await n.text(), "text/html");
    return (
      o.querySelectorAll("script, style, noscript").forEach((i) => i.remove()),
      o.body?.textContent?.replace(/\s+/g, " ").trim() ?? ""
    );
  },
});
var Ml = "asset_browser";
new tt("open_asset_browser", Ml, { category: "test", perform() {} });
var Ma = "tweaks_n_stuff";
new tt("pin_tab", Ma, { perform() {} });
new tt("unpin_tab", Ma, { perform() {} });
var Yn = [
  { value: "select", label: "Select variable", icon: "ads_click" },
  { value: ie.askEachTime, label: "Ask Each Time", icon: "help_outline" },
  { value: ie.clipboard, label: "Clipboard", icon: "content_paste" },
  { value: ie.currentDate, label: "Current Date", icon: "today" },
  { value: ie.deviceDetails, label: "Device Details", icon: "devices" },
  { value: ie.result, label: "Previous Result", icon: "input" },
  { value: ie.item, label: "Current Item", icon: "inventory_2" },
  { value: ie.index, label: "Current Index", icon: "tag" },
];
function Xn(e) {
  return e.replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
}
function Rr(e) {
  let t = (e.options.parameters ?? []).map((r) => ({
    name: r.name,
    label: Xn(r.name),
    type: r.type,
    options: e.enumValues.get(r.name),
  }));
  for (let [r, n] of Object.entries(e.options.form ?? {})) {
    if (n === "_") continue;
    let o = n,
      i = t.find((a) => a.name === r);
    if (i) {
      ((i.type = o.type ?? i.type), (i.label = o.label ?? i.label));
      continue;
    }
    t.push({ name: r, label: o.label ?? Xn(r), type: o.type ?? "text" });
  }
  return t;
}
var ja = {
  name: "MacroEditor",
  data() {
    return {
      macro: F.draft,
      search: "",
      category: "",
      dragging: -1,
      libraryDragging: null,
      dropIndex: null,
      insertAt: null,
      iconsOpen: !1,
      suggestions: null,
      selecting: null,
      variableChoices: Yn,
    };
  },
  computed: {
    categories() {
      return [["", "All Actions"], ...l.categories.entries()];
    },
    actions() {
      let e = this.search.trim().toLowerCase();
      return [...l.all.values()].filter(
        (t) =>
          l.canPerform(t.id) &&
          !et.has(t.id) &&
          (!this.category || t.options.category === this.category) &&
          (!e ||
            `${t.getName()} ${t.options.description ?? ""}`
              .toLowerCase()
              .includes(e)),
      );
    },
    depths() {
      return da(this.macro.intents);
    },
  },
  methods: {
    resetState() {
      ((this.suggestions = null),
        (this.selecting = null),
        (this.insertAt = null),
        (this.dragging = -1),
        (this.libraryDragging = null),
        (this.dropIndex = null));
    },
    action(e) {
      return l.all.get(e.type);
    },
    actionIcon(e) {
      return l.all.get(e.type)?.options.icon ?? "extension";
    },
    actionName(e) {
      return l.all.get(e.type)?.getName() ?? e.type;
    },
    fields(e) {
      return Rr(e);
    },
    fieldsForStep(e, t) {
      let r = this.action(e);
      if (!r || et.has(e.type)) return [];
      if (
        e.type === "add_cube" &&
        ("from" in e.params || "to" in e.params) &&
        !("position" in e.params || "size" in e.params)
      )
        return Rr(r).map((o) =>
          o.name === "position"
            ? { ...o, name: "from", label: "From" }
            : o.name === "size"
              ? { ...o, name: "to", label: "To" }
              : o,
        );
      let n = Rr(r);
      return ce[e.type] && Ue(this.macro.intents, t) > t
        ? n.filter((o) => o.name !== "actions" && o.name !== "otherwise")
        : n;
    },
    isMarker(e) {
      return et.has(e.type);
    },
    isVariable(e) {
      return fa(e);
    },
    variableLabel(e) {
      let t = Yn.find((o) => o.value === e);
      if (t) return t.label;
      let r = Qe(e);
      if (!r) return "Variable";
      let n = this.macro.intents.find((o) => o.uuid === r.uuid);
      return n ? `${this.actionName(n)} \xB7 ${Xn(r.field)}` : "Missing Input";
    },
    variableIcon(e) {
      return Qe(e) ? "link" : (Yn.find((t) => t.value === e)?.icon ?? "input");
    },
    showSuggestions(e, t, r) {
      if (this.selecting) return;
      let n = r?.currentTarget?.closest(".macro_editor_field"),
        o = this.$el.querySelector(".macro_editor_workflow"),
        i =
          n && o
            ? o.getBoundingClientRect().bottom -
              n.getBoundingClientRect().bottom
            : 1 / 0,
        a =
          n && o
            ? n.getBoundingClientRect().top - o.getBoundingClientRect().top
            : 0;
      this.suggestions = { uuid: e.uuid, field: t, above: i < 230 && a > i };
    },
    hideSuggestions(e, t) {
      window.setTimeout(() => {
        this.suggestions?.uuid === e.uuid &&
          this.suggestions.field === t &&
          (this.suggestions = null);
      }, 120);
    },
    chooseVariable(e, t, r) {
      ((this.suggestions = null),
        r === "select"
          ? (this.selecting = { uuid: e.uuid, field: t })
          : this.setParam(e, t, r));
    },
    canSelectInput(e) {
      return this.selecting
        ? this.macro.intents.findIndex((r) => r.uuid === this.selecting?.uuid) >
            e
        : !1;
    },
    selectInput(e, t, r, n) {
      if (!this.selecting || !this.canSelectInput(r)) return;
      (n.preventDefault(), n.stopPropagation());
      let o = this.macro.intents.find((i) => i.uuid === this.selecting?.uuid);
      (o && this.setParam(o, this.selecting.field, Nr(e.uuid, t)),
        (this.selecting = null));
    },
    setParam(e, t, r) {
      this.$set(e.params, t, r);
    },
    updateParam(e, t, r) {
      let n = r.target.value;
      this.setParam(e, t.name, t.type === "number" && n !== "" ? Number(n) : n);
    },
    vectorValue(e, t) {
      let r = Array.isArray(e)
          ? e
          : typeof e == "string"
            ? e.trim().split(/[\s,]+/)
            : [],
        n = Number(r[t]);
      return r.length === 3 && Number.isFinite(n) ? n : 0;
    },
    updateVector(e, t, r, n) {
      let o = [0, 1, 2].map((i) => this.vectorValue(e.params[t.name], i));
      ((o[r] = Number(n.target.value)), this.$set(e.params, t.name, o));
    },
    add(e, t = this.insertAt ?? this.macro.intents.length) {
      let r = {};
      for (let o of Rr(e)) {
        let i = e.options.form?.[o.name],
          a = i && i !== "_" ? i.value : void 0;
        r[o.name] = Array.isArray(a)
          ? [...a]
          : typeof a == "boolean" ||
              typeof a == "number" ||
              typeof a == "string"
            ? a
            : o.options?.length
              ? o.options[0]
              : o.type === "boolean" || o.type === "checkbox"
                ? !1
                : o.type === "number" || o.type === "number"
                  ? 0
                  : "";
      }
      let n = [{ type: e.id, uuid: guid(), params: r }];
      (e.id === "if"
        ? n.push(
            { type: "otherwise", uuid: guid(), params: {} },
            { type: "end_if", uuid: guid(), params: {} },
          )
        : e.id === "try"
          ? n.push(
              { type: "on_error", uuid: guid(), params: {} },
              { type: "end_try", uuid: guid(), params: {} },
            )
          : ce[e.id] && n.push({ type: ce[e.id], uuid: guid(), params: {} }),
        this.macro.intents.splice(t, 0, ...n),
        this.insertAt !== null && (this.insertAt = t + n.length));
    },
    remove(e) {
      let t = this.macro.intents[e];
      if (et.has(t.type)) return;
      let r = Ue(this.macro.intents, e),
        n = this.macro.intents.splice(e, r - e + 1),
        o = new Set(n.map((i) => i.uuid));
      for (let i of this.macro.intents)
        for (let [a, s] of Object.entries(i.params))
          o.has(Qe(s)?.uuid ?? "") && this.setParam(i, a, "");
      this.insertAt = null;
    },
    move(e, t) {
      if (
        e < 0 ||
        t < 0 ||
        t > this.macro.intents.length ||
        et.has(this.macro.intents[e]?.type)
      )
        return;
      let r = Ue(this.macro.intents, e);
      if (t >= e && t <= r + 1) return;
      let n = this.macro.intents.splice(e, r - e + 1);
      (this.macro.intents.splice(t > e ? t - n.length : t, 0, ...n),
        (this.insertAt = null));
    },
    startDrag(e, t) {
      if (et.has(this.macro.intents[e].type)) {
        t.preventDefault();
        return;
      }
      ((this.dragging = e),
        (this.libraryDragging = null),
        (this.dropIndex = null),
        t.dataTransfer?.setData("text/plain", String(e)),
        t.dataTransfer && (t.dataTransfer.effectAllowed = "move"));
    },
    startLibraryDrag(e, t) {
      ((this.libraryDragging = e.id),
        (this.dragging = -1),
        (this.dropIndex = null),
        t.dataTransfer?.setData("text/plain", e.id),
        t.dataTransfer && (t.dataTransfer.effectAllowed = "copy"));
    },
    dragOver(e, t) {
      if (this.dragging < 0 && !this.libraryDragging) return;
      let r = t.currentTarget.getBoundingClientRect(),
        n = e + (t.clientY >= r.top + r.height / 2 ? 1 : 0),
        o = this.dragging >= 0 ? Ue(this.macro.intents, this.dragging) : -1;
      ((this.dropIndex =
        !this.libraryDragging && n >= this.dragging && n <= o + 1 ? null : n),
        t.dataTransfer &&
          (t.dataTransfer.dropEffect = this.libraryDragging ? "copy" : "move"));
    },
    dragOverEnd(e) {
      (this.dragging < 0 && !this.libraryDragging) ||
        ((this.dropIndex =
          !this.libraryDragging &&
          Ue(this.macro.intents, this.dragging) ===
            this.macro.intents.length - 1
            ? null
            : this.macro.intents.length),
        e.dataTransfer &&
          (e.dataTransfer.dropEffect = this.libraryDragging ? "copy" : "move"));
    },
    leaveWorkflow(e) {
      let t = e.relatedTarget;
      (!t || !e.currentTarget.contains(t)) && (this.dropIndex = null);
    },
    endDrag() {
      ((this.dragging = -1),
        (this.libraryDragging = null),
        (this.dropIndex = null));
    },
    drop() {
      let e = this.dragging,
        t = this.dropIndex;
      if (t !== null && this.libraryDragging) {
        let r = l.all.get(this.libraryDragging);
        r && this.add(r, t);
      } else e >= 0 && t !== null && this.move(e, t);
      this.endDrag();
    },
    setIcon(e) {
      ((this.macro.icon = e), (this.iconsOpen = !1));
    },
  },
  template: `<div id="macro_editor">
    <div class="macro_editor_header">
      <div class="macro_editor_identity">
        <button type="button" class="macro_editor_icon" title="Choose icon" @click="iconsOpen = !iconsOpen"><i class="material-icons">{{ macro.icon }}</i></button>
        <input class="dark_bordered macro_editor_name" type="text" aria-label="Macro name" v-model="macro.name" placeholder="Untitled Macro">
      </div>
      <div v-if="iconsOpen" class="macro_editor_icon_choices">
        <button v-for="icon in ['play_arrow', 'bolt', 'build', 'auto_awesome', 'code', 'brush', 'image', 'folder', 'save', 'file_download', 'settings', 'star']" :key="icon" type="button" :title="icon" @click="setIcon(icon)"><i class="material-icons">{{ icon }}</i></button>
        <input class="dark_bordered" type="text" aria-label="Material icon name" v-model="macro.icon" placeholder="Material icon name">
      </div>
    </div>
    <div class="macro_editor_body">
      <aside class="macro_editor_library">
        <div class="macro_editor_library_title">Action Library</div>
        <input class="dark_bordered" type="search" v-model="search" placeholder="Search actions" aria-label="Search actions">
        <select class="dark_bordered" v-model="category" aria-label="Action category">
          <option v-for="[id, name] in categories" :key="id" :value="id">{{ name }}</option>
        </select>
        <div class="macro_editor_actions">
          <button v-for="intent in actions" :key="intent.id" type="button" class="macro_editor_action" draggable="true" @dragstart="startLibraryDrag(intent, $event)" @dragend="endDrag" @click="add(intent)" :title="intent.options.description">
            <i class="material-icons">{{ intent.options.icon || 'extension' }}</i>
            <span>{{ intent.getName() }}</span>
            <i class="material-icons macro_editor_add">add</i>
          </button>
          <div v-if="!actions.length" class="macro_editor_hint">No matching actions</div>
        </div>
        <div v-if="insertAt !== null" class="macro_editor_insert_hint">Choose an action to insert at step {{ insertAt + 1 }} <button type="button" @click="insertAt = null">Done</button></div>
      </aside>
      <main class="macro_editor_workflow" @dragover.prevent="dragOverEnd($event)" @drop.prevent="drop" @dragleave="leaveWorkflow($event)">
        <div class="macro_editor_workflow_title">Workflow <span>{{ macro.intents.length }} actions</span></div>
        <div v-if="selecting" class="macro_editor_selection_prompt">
          <i class="material-icons">ads_click</i>
          <span>Choose an input from an earlier action</span>
          <button type="button" @click="selecting = null">Cancel</button>
        </div>
        <div v-if="!macro.intents.length" class="macro_editor_empty" :class="{macro_editor_empty_drop: dropIndex === 0}">Choose an action from the library to start your workflow.</div>
        <div v-for="(step, index) in macro.intents" :key="step.uuid + '-' + index" class="macro_editor_step" :class="{macro_editor_dragging: dragging === index, macro_editor_drop_before: dropIndex === index, macro_editor_drop_after: dropIndex === macro.intents.length && index === macro.intents.length - 1, macro_editor_has_suggestions: suggestions && suggestions.uuid === step.uuid, macro_editor_nested: depths[index] > 0, macro_editor_marker: isMarker(step), macro_editor_inserting: insertAt === index + 1}" :style="{marginLeft: (depths[index] * 24) + 'px'}" :draggable="!isMarker(step)" @dragstart="startDrag(index, $event)" @dragend="endDrag" @dragover.stop.prevent="dragOver(index, $event)" @drop.stop.prevent="drop">
          <div class="macro_editor_step_header">
            <span v-if="!isMarker(step)" class="macro_editor_handle" title="Drag to reorder"><i class="material-icons">drag_indicator</i></span>
            <i class="material-icons macro_editor_step_icon">{{ actionIcon(step) }}</i>
            <strong>{{ actionName(step) }}</strong>
            <button v-if="!isMarker(step) || step.type === 'otherwise' || step.type === 'on_error'" class="macro_editor_insert_below" type="button" title="Insert action below" aria-label="Insert action below" @click="insertAt = index + 1"><i class="material-icons">add</i></button>
            <button v-if="!isMarker(step)" class="macro_editor_remove" type="button" title="Remove action" aria-label="Remove action" @click="remove(index)"><i class="material-icons">close</i></button>
          </div>
          <div v-if="action(step) && fieldsForStep(step, index).length" class="macro_editor_fields">
            <div v-for="field in fieldsForStep(step, index)" :key="field.name" class="macro_editor_field" :class="{macro_editor_candidate: canSelectInput(index)}" @click.capture="selectInput(step, field.name, index, $event)">
              <span>{{ field.label }}</span>
              <div v-if="isVariable(step.params[field.name])" class="macro_editor_variable" :title="variableLabel(step.params[field.name])" @click="showSuggestions(step, field.name, $event)">
                <i class="material-icons">{{ variableIcon(step.params[field.name]) }}</i><span>{{ variableLabel(step.params[field.name]) }}</span>
                <button type="button" title="Remove variable" aria-label="Remove variable" @click.stop="setParam(step, field.name, '')"><i class="material-icons">close</i></button>
              </div>
              <div v-else class="macro_editor_value">
                <input v-if="field.type === 'boolean' || field.type === 'checkbox'" type="checkbox" v-model="step.params[field.name]" @focus="showSuggestions(step, field.name, $event)" @blur="hideSuggestions(step, field.name)">
                <select v-else-if="field.options && field.options.length" class="dark_bordered" v-model="step.params[field.name]" @focus="showSuggestions(step, field.name, $event)" @blur="hideSuggestions(step, field.name)"><option v-for="option in field.options" :key="option" :value="option">{{ option }}</option></select>
                <div v-else-if="field.type === 'vector'" class="macro_editor_vector"><input v-for="(axis, axisIndex) in ['X', 'Y', 'Z']" :key="axis" class="dark_bordered" type="number" step="any" :aria-label="field.label + ' ' + axis" :title="axis" :value="vectorValue(step.params[field.name], axisIndex)" @input="updateVector(step, field, axisIndex, $event)" @focus="showSuggestions(step, field.name, $event)" @blur="hideSuggestions(step, field.name)"></div>
                <input v-else class="dark_bordered" :type="field.type === 'number' ? 'number' : 'text'" :value="step.params[field.name]" :placeholder="field.name" @input="updateParam(step, field, $event)" @focus="showSuggestions(step, field.name, $event)" @blur="hideSuggestions(step, field.name)">
                <button type="button" class="macro_editor_insert_variable" title="Choose variable" aria-label="Choose variable" @mousedown.prevent @click="showSuggestions(step, field.name, $event)"><i class="material-icons">input</i></button>
              </div>
              <div v-if="suggestions && suggestions.uuid === step.uuid && suggestions.field === field.name" class="macro_editor_suggestions" :class="{macro_editor_suggestions_above: suggestions.above}">
                <button v-for="choice in variableChoices" :key="choice.value" type="button" @mousedown.prevent @click="chooseVariable(step, field.name, choice.value)">
                  <i class="material-icons">{{ choice.icon }}</i><span>{{ choice.label }}</span>
                </button>
              </div>
            </div>
          </div>
          <div v-else-if="!action(step)" class="macro_editor_hint">This action is unavailable.</div>
        </div>
      </main>
    </div>
  </div>`,
};
var Pa = [];
BBPlugin.register(Mt, {
  title: "Macros",
  author: "legopitstop",
  icon: "icon.png",
  description: "This plugin lets you automate actions.",
  has_changelog: !0,
  website: "https://docs.lpsmods.dev/macros",
  repository:
    "https://github.com/legopitstop/blockbench-plugins/tree/master/plugins/macros",
  variant: "both",
  version: eo,
  min_version: "4.8.0",
  tags: ["Blockbench"],
  new_repository_format: !0,
  oninstall() {},
  onuninstall() {},
  onload() {
    F.load();
    let e = new Setting("macros_watchdog_seconds", {
      name: "Macros: Watchdog limit (seconds)",
      description:
        "Stop a macro after this many seconds. Set to 0 to disable the watchdog.",
      category: "general",
      type: "number",
      value: 60,
      min: 0,
      max: 3600,
      onChange(r) {
        F.watchdogSeconds = Number(r);
      },
    });
    ((F.watchdogSeconds = Number(e.value)),
      (l.menu = new Action("macros", {
        icon: "play_arrow",
        click() {},
        children() {
          return [
            ...F.all
              .filter((r) => F.canRun(r))
              .map((r) => ({
                name: r.name,
                icon: r.icon,
                click() {
                  F.run(F.all.indexOf(r));
                },
              })),
            new MenuSeparator(),
            {
              name: tl("dialog.manage_macros"),
              icon: "build",
              click() {
                l.manageDialog.show();
              },
            },
            {
              name: tl("dialog.create_macro"),
              icon: "add",
              click() {
                F.openEditor();
              },
            },
          ];
        },
      })),
      (l.manageDialog = new Dialog({
        title: "dialog.manage_macros",
        id: "manage_macros",
        buttons: ["dialog.close"],
        component: {
          data() {
            return { macros: F.all, search: "" };
          },
          components: { Macro: F.component },
          computed: {
            filteredMacros() {
              let r = this.search.trim().toLowerCase();
              return r
                ? this.macros.filter((n) => n.name.toLowerCase().includes(r))
                : this.macros;
            },
          },
          methods: {
            importMacro() {
              F.importMacro();
            },
          },
          template: `<div id="macro_manager">
          <div class="macro_manager_toolbar">
            <div class="search_bar" id="macro_search_bar">
              <input type="text" inputmode="search" class="dark_bordered" v-model="search">
              <i class="material-icons">search</i>
            </div>
            <button type="button" class="macro_import_button" title="Import Macro" aria-label="Import Macro" @click="importMacro"><i class="material-icons" aria-hidden="true">file_upload</i></button>
          </div>
          <ul class="macros">
            <li class="macro" v-for="macro in filteredMacros" :key="macros.indexOf(macro)">
              <Macro :macro="macro" />
            </li>
          </ul>
        </div>`,
        },
      })),
      (l.editDialog = new Dialog({
        title: "dialog.edit_macro",
        id: "edit_macro",
        width: 900,
        resizable: "xy",
        onOpen() {
          l.editDialog.content_vue?.resetState?.();
        },
        buttons: ["macro.save_and_run", "dialog.save", "dialog.cancel"],
        onButton(r) {
          switch (r) {
            case 0:
              F.run(F.saveDraft());
              break;
            case 1:
              F.saveDraft();
              break;
          }
        },
        component: ja,
      })),
      MenuBar.addAction(l.menu, "tools"),
      Pa.push(
        Blockbench.addCSS(`#edit_macro {display: flex; flex-direction: column; height: min(680px, calc(100vh - 40px));}
    #edit_macro .dialog_wrapper {display: flex; flex-direction: column; min-height: 0;}
    #edit_macro .dialog_content {display: flex; flex-direction: column; flex: 1 1 0; min-height: 0; max-height: none; overflow: hidden;}
    #macro_editor {display: flex; flex-direction: column; flex: 1 1 0; min-width: 0; min-height: 320px; color: var(--color-text);}
    #macro_editor * {box-sizing: border-box;}
    #macro_editor button {cursor: pointer; color: inherit;}
    #macro_editor button:disabled {opacity: .35; cursor: default;}
    #macro_editor .macro_editor_header {position: relative; padding: 8px 12px 16px; border-bottom: 1px solid var(--color-border);}
    #macro_editor .macro_editor_identity {display: flex; align-items: center; gap: 12px;}
    #macro_editor .macro_editor_icon {width: 48px; height: 48px; border: 0; border-radius: 12px; background: var(--color-accent); color: var(--color-light);}
    #macro_editor .macro_editor_icon .material-icons {font-size: 27px;}
    #macro_editor .macro_editor_name {font-size: 20px; font-weight: 600; min-width: 0; flex: 1;}
    #macro_editor .macro_editor_icon_choices {position: absolute; z-index: 5; top: 62px; left: 12px; width: 290px; padding: 10px; display: flex; flex-wrap: wrap; gap: 5px; background: var(--color-elevated); border: 1px solid var(--color-border); border-radius: 8px; box-shadow: 0 6px 20px #0006;}
    #macro_editor .macro_editor_icon_choices button {border: 0; background: var(--color-button); border-radius: 5px; width: 40px; height: 36px;}
    #macro_editor .macro_editor_icon_choices input {width: 100%;}
    #macro_editor .macro_editor_body {display: grid; grid-template-columns: minmax(220px, 32%) minmax(0, 1fr); min-height: 0; flex: 1; overflow: hidden;}
    #macro_editor .macro_editor_library {display: flex; flex-direction: column; min-width: 0; min-height: 0; overflow: hidden; padding: 14px; gap: 8px; border-right: 1px solid var(--color-border);}
    #macro_editor .macro_editor_library_title, #macro_editor .macro_editor_workflow_title {font-size: 15px; font-weight: 600; margin-bottom: 4px;}
    #macro_editor .macro_editor_library input, #macro_editor .macro_editor_library select {width: 100%; min-width: 0;}
    #macro_editor .macro_editor_actions {flex: 1 1 0; min-height: 0; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain;}
    #macro_editor .macro_editor_action {width: 100%; display: flex; align-items: center; gap: 9px; text-align: left; border: 0; border-radius: 6px; background: var(--color-elevated); padding: 9px; margin-bottom: 5px; cursor: grab;}
    #macro_editor .macro_editor_action:hover {background: var(--color-button);}
    #macro_editor .macro_editor_action span {flex: 1; min-width: 0; overflow-wrap: anywhere;}
    #macro_editor .macro_editor_add {opacity: .55;}
    #macro_editor .macro_editor_workflow {min-width: 0; overflow-y: auto; padding: 16px; background: var(--color-back);}
    #macro_editor .macro_editor_workflow_title {display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px;}
    #macro_editor .macro_editor_workflow_title span {font-size: 12px; font-weight: 400; opacity: .7;}
    #macro_editor .macro_editor_empty {padding: 48px 24px; text-align: center; border: 2px dashed var(--color-border); border-radius: 10px; opacity: .75;}
    #macro_editor .macro_editor_empty.macro_editor_empty_drop {border-color: var(--color-accent); opacity: 1;}
    #macro_editor .macro_editor_step {position: relative; margin-bottom: 12px; border-radius: 9px; background: var(--color-elevated); box-shadow: 0 2px 6px #0003;}
    #macro_editor .macro_editor_step:not(:last-child)::after {content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); width: 2px; height: 8px; background: var(--color-accent); opacity: .75; pointer-events: none;}
    #macro_editor .macro_editor_step:not(:last-child)::before {content: ""; position: absolute; top: calc(100% + 7px); left: 50%; transform: translateX(-50%); border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid var(--color-accent); opacity: .75; pointer-events: none;}
    #macro_editor .macro_editor_step.macro_editor_nested {border-left: 3px solid var(--color-accent);}
    #macro_editor .macro_editor_step.macro_editor_nested::before {content: ''; position: absolute; left: -15px; top: -12px; bottom: -12px; border-left: 2px solid var(--color-border);}
    #macro_editor .macro_editor_step.macro_editor_marker {background: var(--color-button);}
    #macro_editor .macro_editor_step.macro_editor_inserting {box-shadow: 0 3px 0 var(--color-accent), 0 2px 6px #0003;}
    #macro_editor .macro_editor_insert_hint {font-size: 12px; padding: 8px 0;}
    #macro_editor .macro_editor_insert_hint button {margin-left: 8px;}
    #macro_editor .macro_editor_step.macro_editor_has_suggestions {z-index: 5;}
    #macro_editor .macro_editor_step.macro_editor_dragging {opacity: .45;}
    #macro_editor .macro_editor_step.macro_editor_drop_before {box-shadow: 0 -4px 0 var(--color-accent), 0 2px 6px #0003;}
    #macro_editor .macro_editor_step.macro_editor_drop_after {box-shadow: 0 4px 0 var(--color-accent), 0 2px 6px #0003;}
    #macro_editor .macro_editor_step_header {display: flex; align-items: center; gap: 7px; padding: 9px 42px 9px 10px; border-bottom: 1px solid var(--color-border);}
    #macro_editor .macro_editor_step_header strong {flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
    #macro_editor .macro_editor_step_header button {width: 26px; height: 26px; padding: 0; border: 0; background: none;}
    #macro_editor .macro_editor_step_header .macro_editor_insert_below {display: flex; align-items: center; justify-content: center; flex: 0 0 26px; min-width: 26px; max-width: 26px; min-height: 26px; max-height: 26px;}
    #macro_editor .macro_editor_step_header button .material-icons {font-size: 19px;}
    #macro_editor .macro_editor_step_header .macro_editor_remove {position: absolute; top: 7px; right: 8px; display: flex; align-items: center; justify-content: center; flex: 0 0 26px; min-width: 26px; max-width: 26px; min-height: 26px; max-height: 26px;}
    #macro_editor .macro_editor_handle {cursor: grab; opacity: .5;}
    #macro_editor .macro_editor_step_icon {color: var(--color-accent);}
    #macro_editor .macro_editor_fields {display: flex; flex-direction: column; gap: 10px; padding: 12px 14px;}
    #macro_editor .macro_editor_field {position: relative; display: flex; align-items: center; gap: 12px; min-width: 0;}
    #macro_editor .macro_editor_field.macro_editor_candidate {outline: 2px solid var(--color-accent); outline-offset: 2px; border-radius: 4px; cursor: pointer;}
    #macro_editor .macro_editor_selection_prompt {display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px 10px; border-radius: 6px; background: var(--color-selected); color: var(--color-text);}
    #macro_editor .macro_editor_selection_prompt span {flex: 1;}
    #macro_editor .macro_editor_selection_prompt button {border: 0; border-radius: 4px; background: var(--color-button); padding: 4px 8px;}
    #macro_editor .macro_editor_field > span {width: 110px; flex: 0 0 110px;}
    #macro_editor .macro_editor_value {display: flex; align-items: center; gap: 4px; flex: 1; min-width: 0;}
    #macro_editor .macro_editor_vector {display: flex; flex: 1; min-width: 0; gap: 2px;}
    #macro_editor .macro_editor_vector input {width: 0; min-width: 0; flex: 1; text-align: center;}
    #macro_editor .macro_editor_vector input:nth-child(1) {border-top-right-radius: 0; border-bottom-right-radius: 0; border-top: 2px solid #f44336;}
    #macro_editor .macro_editor_vector input:nth-child(2) {border-radius: 0; border-top: 2px solid #4caf50;}
    #macro_editor .macro_editor_vector input:nth-child(3) {border-top-left-radius: 0; border-bottom-left-radius: 0; border-top: 2px solid #2196f3;}
    #macro_editor .macro_editor_value > input:not([type=checkbox]), #macro_editor .macro_editor_value > select {min-width: 0; flex: 1;}
    #macro_editor .macro_editor_value > input[type=checkbox] + button {margin-left: auto;}
    #macro_editor .macro_editor_value button {border: 0; border-radius: 4px; background: var(--color-button); height: 28px; min-width: 28px; padding: 2px;}
    #macro_editor .macro_editor_value button .material-icons {font-size: 18px;}
    #macro_editor .macro_editor_insert_variable {opacity: .7;}
    #macro_editor .macro_editor_insert_variable:hover {opacity: 1; color: var(--color-accent);}
    #macro_editor .macro_editor_variable {display: inline-flex; align-items: center; gap: 5px; min-width: 0; height: 28px; padding: 2px 3px 2px 8px; border-radius: 5px; background: var(--color-accent); color: var(--color-accent_text); font-weight: 600;}
    #macro_editor .macro_editor_variable > .material-icons {font-size: 17px;}
    #macro_editor .macro_editor_variable button {display: flex; align-items: center; justify-content: center; flex: 0 0 22px; min-width: 22px; max-width: 22px; width: 22px; height: 22px; padding: 0; border: 0; border-radius: 4px; background: transparent; color: inherit;}
    #macro_editor .macro_editor_variable button .material-icons {font-size: 17px;}
    #macro_editor .macro_editor_suggestions {position: absolute; z-index: 10; top: calc(100% + 4px); left: 122px; right: 0; max-height: 230px; overflow-y: auto; padding: 5px; border: 1px solid var(--color-border); border-radius: 6px; background: var(--color-elevated); box-shadow: 0 6px 18px #0008;}
    #macro_editor .macro_editor_suggestions.macro_editor_suggestions_above {top: auto; bottom: calc(100% + 4px);}
    #macro_editor .macro_editor_suggestions button {display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; border: 0; border-radius: 4px; background: transparent; text-align: left;}
    #macro_editor .macro_editor_suggestions button:hover {background: var(--color-button);}
    #macro_editor .macro_editor_suggestions .material-icons {font-size: 18px; color: var(--color-accent);}
    #macro_editor .macro_editor_hint {padding: 10px; opacity: .65;}
    #macro_manager {display: flex; flex-direction: column; min-width: 0;}
    #macro_manager .macro_manager_toolbar {display: flex; align-items: center; gap: 8px;}
    #macro_manager .macro_manager_toolbar .search_bar {flex: 1; min-width: 0;}
    #macro_manager .macro_manager_toolbar button {display: flex; align-items: center; justify-content: center; white-space: nowrap;}
    #macro_manager .macro_import_button {width: 32px; height: 32px; padding: 0; flex: 0 0 32px;}
    #macro_manager .macros {display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0 0; padding: 0; list-style: none; max-height: 50vh; overflow-y: auto;}
    #macro_manager .macro {box-sizing: border-box; flex: 0 0 110px; position: relative; min-width: 0; background-color: var(--color-back); padding: 16px; border-radius: 5px; overflow-wrap: anywhere;}
    .macro_options_button {position: absolute; top: 4px; right: 0px; height: 30px; width: 30px; margin-left: 1px; margin-right: 1px; cursor: pointer; }
    .macro_options_button:hover { color: var(--color-light) }
    
    #macro_search_bar {display: flex; position: relative; width: 100%; box-sizing: border-box; margin: 0;}
    #macro_search_bar input {min-width: 0; flex: 1;}`),
      ));
  },
  onunload() {
    (Pa.forEach((e) => e.delete()),
      l.menu?.delete(),
      l.manageDialog?.delete(),
      l.editDialog?.delete());
  },
});
/*! Bundled license information:

vue/dist/vue.runtime.esm.js:
  (*!
   * Vue.js v2.7.16
   * (c) 2014-2023 Evan You
   * Released under the MIT License.
   *)
*/
