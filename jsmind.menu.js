/*
 * Released under BSD License
 * Copyright (c) 2019-2020 Allen_sun_js@hotmail.com
 *
 * Project Home:
 *  https://github.com/allensunjian
 */

(function ($w, temp) {
  var Jm = $w[temp],
      name = 'menu',
      $d = $w['document'],
      menuEvent = 'oncontextmenu',
      clickEvent = 'onclick',
      overEvent = 'mouseover',
      $c = function (tag) { return $d.createElement(tag); },
      _noop = function () { },
      logger = (typeof console === 'undefined') ? {
        log: _noop, debug: _noop, error: _noop, warn: _noop, info: _noop
      } : console;
  if (!Jm || Jm[name]) return;
  Jm.menu = function (_jm) {
    this._get_menu_options(_jm, function () {
      this.init(_jm);
      this._mount_events()
    })
  }
  Jm.menu.prototype = {
    defaultDataMap: {
      funcMap: {
        edit: {
          isDepNode: true,
          fn: function (n) {
            this.begin_edit(n);
          },
          text: 'edit node'
        },
        addChild: {
          isDepNode: true,
          fn: function (nodeid,text) {
              var selected_node = this.get_selected_node();
              if (!!selected_node) {
                  var node = this.add_node(selected_node, nodeid, text);
                  if (!!node) {
                      this.select_node(nodeid);
                      this.begin_edit(nodeid);
                  }
              }
          },
          text: 'append child'
        },
        addBrother: {
          isDepNode: true,
          fn: function (nodeid,text) {
              var selected_node = this.get_selected_node();
              if (!!selected_node && !selected_node.isroot) {
                  var node = this.insert_node_after(selected_node, nodeid, text);
                  if (!!node) {
                      this.select_node(nodeid);
                      this.begin_edit(nodeid);
                 }
              }
          },
          text: 'append brother'
        },
        delete: {
          isDepNode: true,
          fn: function () {
            this.shortcut.handle_delnode.call(this.shortcut, this);
          },
          text: 'delete node'
        },
        showAll: {
          sDepNode: false,
          fn: function () {
            this.expand_all(this)
          },
          text: 'show all'
        },
        hideAll: {
          isDepNode: false,
          fn: function () {
            this.collapse_all(this)
          },
          text: 'hide all'
        },
        screenshot: {
          isDepNode: false,
          fn: function () {
            if (!this.screenshot) {
              logger.error('[jsmind] screenshot dependent on jsmind.screenshot.js !');
              return;
            }
              this.screenshot.shootDownload();
          },
          text: 'load mind picture'
        },
        showNode: {
          isDepNode: true,
          fn: function (node) {
              this.expand_node(node);
          },
          text: 'show target node'
        },
        hideNode: {
          isDepNode: true,
          fn: function (node) {
              this.collapse_node(node);
          },
          text: 'hide target node'
        },
      },
      menuStl: {
          'width': '150px',
          'padding': '12px 0',
          'position': 'fixed',
          'z-index': '10',
          'background': '#fff',
          'box-shadow': '0 2px 12px 0 rgba(0,0,0,0.1)',
          'border-radius': '5px',
          'font-size': '12px',
          'display': 'none'
      },
      menuItemStl:{
          padding: '5px 15px',
          cursor: 'pointer',
          display: 'block',
          'text-align': 'center',
          'transition':'all .2s'
      },
      injectionList:['edit','addChild','delete']
    },
    init: function (_jm) {
      this._create_menu(_jm);
      this._get_injectionList(_jm);
    },
    _event_contextMenu (e) {
        e.preventDefault();
        this.menu.style.left = e.clientX + 'px';
        this.menu.style.top = e.clientY + 'px';
        this.menu.style.display = 'block';
        this.selected_node = this.jm.get_selected_node();
    } ,
    _event_hideMenu() {
        this.menu.style.display = 'none'
    },
    _mount_events () {
      $w[menuEvent] = this._event_contextMenu.bind(this);
      $w[clickEvent] = this._event_hideMenu.bind(this);
    },
    _create_menu (_jm) {
      var d = $c('menu');
      this._set_menu_wrap_syl(d);
      this.menu = d;
      this.e_panel = _jm.view.e_panel;
      this.e_panel.appendChild(d);
    },
    _create_menu_item (j, text, fn, isDepNode,cb) {
      var d = $c('menu-item'),_this = this;
      this._set_menu_item_syl(d);
      d.innerText = text;
      d.addEventListener('click', function () {
        if (this.selected_node || !isDepNode) {
          if (!_this._get_mid_opts()) {
              cb(this.selected_node, _noop)
              fn.call(j,Jm.util.uuid.newid(), this.menuOpts.newNodeText || 'New Node');
              return;
          }
            cb(this.selected_node,_this._mid_stage_next(function () {
                var retArgs = [this.selected_node],
                    argus = Array.prototype.slice.call(arguments[0],0);
                argus[1] = this.menuOpts.newNodeText || 'New Node';
                if (argus[0]) {
                    retArgs = argus
                }
                fn.apply(j,retArgs);
            }.bind(this)))
          return
        }
        alert(this.menuOpts.tipContent || 'Continue with node selected！')
      }.bind(this))
      d.addEventListener('mouseover', function () {
          d.style.background = 'rgb(179, 216, 255)'
      }.bind(this))
      d.addEventListener('mouseleave', function () {
          d.style.background = '#fff'
      }.bind(this))
      return d
    },
    _set_menu_wrap_syl (d) {
      var os = this._get_option_sty('menu',this._get_mixin_sty);
      d.style.cssText = this._format_cssText(os);
    },
    _set_menu_item_syl (d) {
        var os = this._get_option_sty('menuItem',this._get_mixin_sty);
      d.style.cssText = this._format_cssText(os)
    },
    _format_cssText (o) {
      var text = '';
      Object.keys(o).forEach(function (k) {
        text += k +':'+o[k] +';'
      })
      return text;
    },
     _empty_object (o) {
       return Object.keys(o).length == 0? true :false
     },
    _get_option_sty (type, fn) {
      var sty = this.menuOpts.style,
          menu = this.defaultDataMap.menuStl,
          menuItem = this.defaultDataMap.menuItemStl,
          o = {menu,menuItem}
      if (!sty) return o[type];
      if (!sty[type]) return o[type];
      if (!sty[type] || this._empty_object(sty[type])) return o[type];
      return fn( o[type],sty[type])
    },
    _get_mixin_sty (dSty, oSty) {
      var o = {};
      Object.keys(oSty).forEach(function (k) {
          o[k] = oSty[k];
      })
      Object.keys(dSty).forEach(function (k) {
          if (!o[k]) o[k] = dSty[k];
      })
        return o
    },
    _get_menu_options (j, fn) {
      var options = j.options;
      if (!options.menuOpts) return;
      if (!options.menuOpts.showMenu) return;
      this.menuOpts = j.options.menuOpts
      fn.call(this)
    },
    _get_injectionDetail () {
      var iLs = this.menuOpts.injectionList,
          dLs = this.defaultDataMap.injectionList;
      if (!iLs) return dLs;
      if (!Array.isArray(iLs)) {
          logger.error('[jsmind] injectionList must be a Array');
          return;
      }
      if (iLs.length == 0) return dLs;
      return iLs
    },
    _get_injectionList (j) {
      var list = this._get_injectionDetail(),
          _this = this;
      list.forEach(function (k) {
        var o = null,
            text = "",
            callback = _noop;
        if (typeof k == 'object') {
            o = _this.defaultDataMap.funcMap[k.target];
            text = k.text;
            k.callback && (callback = k.callback);
        } else {
            o = _this.defaultDataMap.funcMap[k];
            text = o.text;
        }
        _this.menu.appendChild(_this._create_menu_item(j ,text, o.fn, o.isDepNode,callback));
      })
    },
    _get_mid_opts () {
       var b = this.menuOpts.switchMidStage;
       if (!b) return false;
       if (typeof b !== 'boolean') {
         logger.error('[jsmind] switchMidStage must be Boolean');
         return false;
       }
        return b
    },
    _mid_stage_next (fn) {
     return function () {
         fn(arguments);
     }
    },
  }
  plugin = new Jm.plugin('menu',function (_jm) {
    var menu = new Jm.menu(_jm);
    menu.jm = _jm;
    if(menu.menuOpts) _jm.menu = menu;
  })
  Jm.register_plugin(plugin)
})(window, 'jsMind')
