var $B = function(a, b) {
  console.log(b);
  var c = document.createElement(a);
  c.immune = !0;
  for (var d in b) {
    if ("style" == d) {
      for (var e in b.style) {
        "float" == e ? c.style.cssFloat = c.style.styleFloat = b.style["float"] : c.style[e] = b.style[e];
      }
    } else {
      if ("children" == d) {
        for (e = 0;e < b.children.length;e++) {
          c.appendChild(b.children[e]);
        }
      } else {
        c[d] = b[d];
      }
    }
  }
  "input" == a && c.placeholder && (c.onblur = function() {
    0 == c.value.length && (c.value = c.placeholder);
  }, c.onfocus = function() {
    c.value == c.placeholder && (c.value = "");
  });
  $B.elements.push(c);
  return c;
};
$B.elements = [];
$B.destroyAll = function() {
  for (var a = $B.elements.length - 1;0 <= a;a--) {
    var b = $B.elements[a];
    b && (b.parentNode && b.parentNode.removeChild(b), delete b);
  }
};
var blank_function = function() {
}, block_event = function(a) {
  a || (a = window.event);
  a.cancelBubble = !0;
  a.stopPropagation && a.stopPropagation();
}, getPos = function(a) {
  var b, c;
  b = c = 0;
  if (a.offsetParent) {
    do {
      b += a.offsetLeft, c += a.offsetTop;
    } while (a = a.offsetParent);
  }
  return{left:b, top:c};
};
HTMLElement.prototype.getIndex = function() {
  if (this.index) {
    return this.index;
  }
  for (var a = 1, b = 1, c = this, d = this.tagName;c = c.previousSibling;) {
    b++, c.tagName == d && a++;
  }
  return this.index = a;
};
HTMLElement.prototype.getAbsolute = function() {
  this.abs && this.getIndex();
  return this.abs;
};
HTMLElement.prototype.isLast = function() {
  if (this.donelast) {
    return this.last;
  }
  var a = this.parentNode.children[this.parentNode.children.length - 1];
  this.donelast = !0;
  do {
    if (a == this) {
      return this.last = !0;
    }
    a = a.previousSibling;
  } while (a.tagName != this.tagName);
  return this.last = !1;
};
HTMLElement.prototype.getClasses = function() {
  if (this.classes) {
    return this.classes;
  }
  var a;
  if (this.className) {
    if ("" == this.className.trim()) {
      a = null;
    } else {
      a = this.className.trim().split(/\s+/);
      for (var b, c = classignorelist.length - 1;0 <= c;c--) {
        0 <= (b = a.indexOf(classignorelist[c])) && a.splice(b, 1);
      }
      a.sort();
    }
    this.classes = a;
  }
  return a;
};
window.queryDocument = function() {
  if (document.evaluate) {
    var a = null;
    return function(b) {
      if (b) {
        a = document.evaluate(b, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, a);
        var c = a.snapshotLength;
        b = [];
        for (c -= 1;0 <= c;c--) {
          var d = a.snapshotItem(c);
          -1 == d.className.indexOf(styles["interface"]) && b.push(d);
        }
        return b;
      }
    };
  }
}();
var styles = {"interface":"parcels_interface", selected:"parcels_selected", rejected:"parcels_rejected", highlighted:"parcels_highlight"}, GrabWindow = function(a, b, c, d) {
  console.log(d);
  b = b ? " " + b : "";
  c = $B("div", {children:[$B("div", {className:styles["interface"], innerHTML:"X", style:{"float":"right", display:"block", clear:"left"}, onclick:c})]});
  a = $B("div", {className:styles["interface"] + " main", children:a});
  var e = $B("div", {className:styles["interface"] + " dialog" + b, children:[c, a], style:d ? {left:d.left ? d.left + "px" : null, top:d.top ? d.top + "px" : null, right:d.right ? d.right + "px" : null, right:d.bottom ? d.bottom + "px" : null} : null, close:function() {
    e.parentNode.removeChild(e);
  }});
  document.body.appendChild(e);
  return e;
};
var Align = function(a, b, c, d, e) {
  return function(k, l) {
    for (var m = e(), n = Array(l.length + 1), p = Array(l.length + 1), h = Array(k.length + 1), f = 0;f < h.length;f++) {
      h[f] = Array(l.length + 1);
      var r;
      r = n;
      for (var n = p, p = r, g = 0;g < n.length;g++) {
        if (0 == f || 0 == g) {
          0 == f && 0 == g ? h[f][g] = 0 : 0 == f ? h[f][g] = 1 : 0 == g && (h[f][g] = 2), n[g] = 0;
        } else {
          r = b(k[f - 1], l[g - 1]);
          var q = p[g - 1];
          h[f][g] = 0;
          a(k[f - 1], l[g - 1]) || (n[g - 1] > q ? (q = n[g - 1], h[f][g] = 1) : p[g] > q && (q = p[g], h[f][g] = 2));
          n[g] = q + r;
        }
      }
    }
    f = h.length - 1;
    for (g = h[0].length - 1;0 != f || 0 != g;) {
      switch(h[f][g]) {
        case 0:
          c(k[f - 1], l[g - 1], m);
          f--;
          g--;
          break;
        case 1:
          d(m);
          g--;
          break;
        case 2:
          d(m), f--;
      }
    }
    return m;
  };
};
var StrictScorer = function(a, b, c) {
  return{score:function(c, e) {
    return c == e ? a : b;
  }, value:function(a, b) {
    return a == b ? a : c;
  }};
}, listCompare = {score:function(a, b) {
  for (var c = 0, d = 0;c < a.length && d < b.length;) {
    if (a[c] == b[d]) {
      return 1;
    }
    a[c] < b[d] ? c++ : a[c] > b[d] && d++;
  }
  return 0;
}, value:function(a, b) {
  for (var c = null, d = 0, e = 0;d < a.length && e < b.length;) {
    a[d] == b[e] ? (c = c ? c : [], c.push(a[d]), d++, e++) : a[d] < b[e] ? d++ : a[d] > b[e] && e++;
  }
}}, Features = {tagName:{extract:function(a) {
  return a.tagName.toLowerCase();
}, compare:null}, index:{extract:function(a) {
  return a.getIndex();
}, compare:new StrictScorer(1, 0, null), selector:function(a) {
  return a;
}}, abs:{extract:function(a) {
  return a.getAbsolute();
}, compare:new StrictScorer(1, 0, null)}, id:{extract:function(a) {
  return a.id;
}, compare:new StrictScorer(1, 0, null), selector:function(a) {
  return "@id='" + a + "'";
}, unique:!0}, last:{extract:function(a) {
  return a.isLast();
}, compare:new StrictScorer(1, 0, null), selector:function(a) {
  return a ? "last()" : null;
}}, classes:{extract:function(a) {
  return a.getClasses();
}, compare:listCompare, selector:function(a) {
  for (var b = ["contains(concat(' ',@class,' '),' ", " ')", "]["], c = b[0] + a[0] + b[1], d = 1;d < a.length;d++) {
    c += b[2] + b[0] + a[d] + b[1];
  }
  return c;
}}};
Features_max_score = function() {
  var a = 0, b;
  for (b in Features) {
    a++;
  }
  return a;
}();
Features.tagName.compare = new StrictScorer(Features_max_score, -1 * Math.ceil(Features_max_score / 2), "*");
var SimpleSet = function() {
  var a = [], b = this.contains = function(b) {
    return 0 <= a.indexOf(b);
  };
  this.add = function(c) {
    b(c) || a.push(c);
  };
  this.remove = function(b) {
    var d;
    0 <= (d = a.indexOf(b)) && a.splice(d, 1);
  };
  this.toArray = function(b) {
    return a;
  };
};
HTMLElement.prototype.getAbstractElement = function() {
  if (this._obj) {
    return this._obj;
  }
  var a = {}, b;
  for (b in Features) {
    var c = Features[b].extract(this);
    c && (a[b] = c);
  }
  return this._obj = a;
};
HTMLElement.prototype.getPath = function() {
  if (this._path) {
    return this._path;
  }
  for (var a = this, b = [];a != document.body;) {
    b.unshift(a.getAbstractElement()), a = a.parentNode;
  }
  return this._path = b;
};
var matchAlign = new Align(function(a, b) {
  return "*" != a.tagName ? a.tagName == b.tagName : !1;
}, function(a, b) {
  if ("*" == a || "*" == b) {
    return-2 * Features_max_score;
  }
  if (a == b) {
    return 2 * Features_max_score;
  }
  var c = 0, d;
  for (d in Features) {
    a[d] && b[d] && (c += Features[d].compare.score(a[d], b[d]));
  }
  return c;
}, function(a, b, c) {
  var d = {}, e, k;
  for (k in Features) {
    a[k] && b[k] && (e = Features[k].compare.value(a[k], b[k])) && (d[k] = e);
  }
  "*" == d.tagName && d.index && (d.abs ? d.index = d.abs : delete d.index);
  c.unshift(d);
}, function(a) {
  a.unshift("*");
}, function() {
  return[];
}), serialisePath = function(a) {
  if (!a) {
    return null;
  }
  for (var b = "", c = !0, d = a.length - 1;0 <= d;d--) {
    if ("*" == a[d]) {
      c && (b = "/" + b, c = !1);
    } else {
      var e = a[d].tagName, k = e, l;
      for (c in Features) {
        if (Features[c].selector && a[d][c]) {
          l = "[" + Features[c].selector(a[d][c]) + "]";
          if (Features[c].unique) {
            return "//" + e + l + b;
          }
          k += l;
        }
      }
      b = "/" + k + b;
      c = !0;
    }
  }
  return "/html/body" + b;
}, pathComparator = function(a, b) {
  return a._path.length - b._path.length;
}, GrabSelector = function(a) {
  var b = new SimpleSet, c = new SimpleSet, d = this.selected = b.toArray();
  this.rejected = c.toArray();
  var e = this.result = {tag:null, obj:null, xpath:""};
  a ? (e.obj = a, e.xpath = serialisePath(e.obj.selected), e.tag = a.selected[a.selected.length - 1].tagName) : e.obj = {selected:null, rejected:null};
  this.select = function(a) {
    b.add(a);
    e.obj.selected ? e.obj.selected = matchAlign(e.obj.selected, a.getPath()) : (e.obj.selected = a.getPath(), e.tag = a.tagName);
    e.xpath = serialisePath(e.obj.selected);
  };
  this.deselect = function(a) {
    b.remove(a);
    if (0 < d.length) {
      a = e.obj;
      d.sort(pathComparator);
      for (var c = d[0]._path, m = 1;m < d.length;m++) {
        c = matchAlign(c, d[m]._path);
      }
      a.selected = c;
      e.xpath = serialisePath(e.obj.selected);
    } else {
      e.obj.selected = null, e.tag = null, e.xpath = null;
    }
  };
  this.reject = function(a) {
    c.add(a);
  };
  this.dereject = function(a) {
    c.remove(a);
  };
};
var border_width = 5, makeBoxBorders = function(a, b) {
  var c = $B("div", {className:styles["interface"] + " box_border"});
  c.style[b] = a + "px";
  return c;
}, GrabBox = function() {
  var a = {visible:!1, top:makeBoxBorders(border_width, "height"), bottom:makeBoxBorders(border_width, "height"), left:makeBoxBorders(border_width, "width"), right:makeBoxBorders(border_width, "width"), text:$B("span", {}), setPosition:function(b, c) {
    a.setVisible(!0);
    a.bottom.style.width = a.top.style.width = c.width + 2 * border_width + "px";
    a.left.style.height = a.right.style.height = c.height + "px";
    a.left.style.top = a.right.style.top = b.top + "px";
    a.left.style.left = a.bottom.style.left = a.top.style.left = b.left - border_width + "px";
    a.top.style.top = b.top - border_width + "px";
    a.right.style.left = b.left + c.width + "px";
    a.bottom.style.top = b.top + c.height + "px";
  }, setText:function(b) {
    a.text.innerHTML = b;
  }, setVisible:function(b) {
    b != a.visible && (a.top.style.display = a.bottom.style.display = a.left.style.display = a.right.style.display = b ? "block" : "none", a.visible = b);
  }};
  HTMLElement.prototype.boxElement = function() {
    a.setPosition(getPos(this), {width:this.offsetWidth, height:this.offsetHeight});
    a.setText(this.parentNode.tagName + " " + this.tagName);
  };
  a.top.boxElement = a.left.boxElement = a.bottom.boxElement = a.right.boxElement = a.text.boxElement = blank_function;
  a.bottom.style.height = "auto";
  document.body.appendChild(a.top);
  document.body.appendChild(a.left);
  document.body.appendChild(a.bottom);
  document.body.appendChild(a.right);
  a.bottom.appendChild(a.text);
  return a;
}, GrabController = function(a) {
  var b = new GrabSelector, c = new GrabBox, d = [styles.highlighted, styles.selected, styles.rejected], e = [null, b.selected, b.rejected];
  HTMLElement.prototype.action = function(a) {
    b.select(a);
  };
  var k = [function(a) {
    b.reject(a);
  }, function(a) {
    b.deselect(a);
  }, function(a) {
    b.dereject(a);
  }], l = this;
  this.header = this.extractor = this.form = null;
  var m = function() {
    var a = new $B("form", {action:create_page, method:"POST", children:[$B("input", {type:"hidden", name:"url", value:document.location.href}), $B("input", {type:"hidden", name:"extractor_id", value:l.extractor.id}), $B("input", {type:"hidden", name:"title", value:document.title})]});
    document.body.appendChild(a);
    Connection.MakeIframeTarget(a, "page", function() {
      a.parentNode.removeChild(a);
      delete a;
    });
    a.submit();
  };
  this.setExtractor = function(a) {
    this.extractor = this.list.extractor = this.form.extactor = a;
    this.header.innerHTML = a.name;
    this.form.fields.extractor_id_field.value = a.id;
    m();
  };
  this.setPathObject = function(a) {
    n(new GrabSelector(a));
  };
  this.clear = function() {
    n(new GrabSelector);
  };
  var n = function(a) {
    p();
    b = a;
    e = [queryDocument(b.result.xpath), b.selected, b.rejected];
    h();
  }, p = function() {
    for (var a = 0;a < e.length;a++) {
      if (e[a]) {
        for (var b = e[a], c = b.length - 1;0 <= c;c--) {
          b[c].className = b[c]._className, delete b[c].action;
        }
      }
    }
  }, h = function() {
    for (var a = 0;a < e.length;a++) {
      if (e[a]) {
        for (var b = d[a], c = k[a], f = e[a], h = f.length - 1;0 <= h;h--) {
          var l = f[h];
          l._className || (l._className = l.className ? l.className : " ");
          f[h].className = f[h]._className + " " + b;
          f[h].action = c;
        }
      }
    }
  }, f = function(a) {
    return function(c) {
      c = c || window.event;
      var d = c.target || c.srcElement;
      if (d.immune) {
        return!0;
      }
      block_event(c);
      c = b.result.tag ? d.tagName.toLowerCase() == b.result.tag.toLowerCase() : !0;
      if (!c || d == document.body) {
        return!1;
      }
      a(d);
      return!1;
    };
  };
  document.body._onclick = document.body.onclick;
  document.body._onmouseover = document.body.onmouseover;
  document.body._onmouseout = document.body.onmouseout;
  this.close = function() {
    l.clear();
    document.body.onclick = document.body._onclick;
    document.body.onmouseover = document.body._onmouseover;
    document.body.onmouseout = document.body._onmouseout;
  };
  document.body.onclick = new f(function(c) {
    var d = c.action;
    p();
    d(c);
    e[0] = queryDocument(b.result.xpath);
    h();
    a(b.result.xpath);
    c.blur();
  });
  document.body.onmouseover = new f(function(a) {
    a.boxElement();
  });
  document.body.onmouseout = function(a) {
    c.setVisible(!1);
  };
};
var xpathView = new $B("div", {innerHTML:"", className:styles["interface"]}), display = new GrabWindow([xpathView], "display", $B.destroyAll, {top:5, right:5}), controller = new GrabController(function(a) {
  xpathView.innerHTML = a;
});
