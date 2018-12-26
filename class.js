function NiceScroll(a) {
	this.taId = a;
	this.ta = id(this.taId);
	if (1 != this.ta.nodeType) return null;
	this.st = el("label");
	this.sb = el("div");
	this.sbcH = this.avg = this.stH = this.scH = this.sbH = 0;
	this.n = 20;
	this.enabled = !0;
	this.mousePos = null;
	this.show = this.onSb = this.isScroll = !1;
	this.wtId = this.checkTt = null;
	this.woSpeed = this.wSpeed = this.wtCounter = 0;
	this.sbStyle = {
		position: "absolute",
		zIndex: 1001,
		width: "0.583em",
		mTop: 0,
		mLeft: 0
	};
	this.stStyle = {
		width: "0.583em",
		display: "inline-block",
		background: "#34A9DA",
		borderRadius: "3px",
		position: "relative",
		cursor: "pointer"
	};
	this.stOpacity = 0.1;
	"function" != typeof this.init && (NiceScroll.prototype.init = function() {
		this.sb.id = this.taId + "niceScrollSb" + (new Date).getTime();
		setStyle(this.sb, {
			backgroundColor: this.sbStyle.background || "transparent"
		});
		this.sb.appendChild(this.st);
		document.body.appendChild(this.sb);
		setStyle(this.sb, this.sbStyle);
		setStyle(this.st, this.stStyle);
		this._reset();
		!1 == OS.portable ? setStyle(this.ta, {
			overflow: "hidden"
		}) : setStyle(this.ta, {
			overflow: "scroll"
		});
		this._shSb();
		this._bind();
		this._scrollCheck()
	}, NiceScroll.prototype._scrollCheck = function() {
		var a = this;
		this.checkTt = window.setTimeout(function() {
			a._scrollCheck()
		}, 10);
		this._check()
	}, NiceScroll.prototype.scrollBarSet = function(a) {
		if ("object" == typeof a) for (var b in a) this.sbStyle[b] = a[b]
	}, NiceScroll.prototype.scrollTipSet = function(a) {
		if ("object" == typeof a) for (var b in a) this.stStyle[b] = a[b]
	}, NiceScroll.prototype.scrollTipOpacity = function(a) {
		this.stOpacity = a
	}, NiceScroll.prototype.scrollTo = function(a) {
		a = parseFloat(a);
		if (!0 == isNaN(a)) return !1;
		this.ta.scrollTop = a
	}, NiceScroll.prototype._reset = function() {
		var a = $(this.ta).offset(),
			b = this.ta.offsetWidth,
			d = this.ta.offsetHeight - this.sbStyle.mTop,
			e = this.ta.scrollHeight - this.sbStyle.mTop,
			f = parseFloat(getNodeDefaultView(this.ta, "borderTopWidth")) || 0,
			g = parseFloat(getNodeDefaultView(this.ta, "borderBottomWidth")) || 0,
			h = parseFloat(getNodeDefaultView(this.ta, "borderRightWidth")) || 0;
		parseFloat(getNodeDefaultView(this.ta, "borderLeftWidth"));
		this.scH = e - d + f + g;
		this.stH = parseInt(0.7 * (d / e) * d);
		this.sbcH = d - (this.stH + 2);
		this.avg = this.scH / this.sbcH;
		0 >= e - d ? (setStyle(this.sb, {
			visibility: "hidden",
			top: "-9999px"
		}), this.show = !1) : (this.show = !0, setStyle(this.sb, {
			visibility: "visible"
		}), setStyle(this.sb, {
			top: a.top + f + this.sbStyle.mTop + "px",
			height: d + "px",
			left: a.left - this.sbStyle.mLeft + b - h - parseInt(this.sb.offsetWidth) + "px"
		}), setStyle(this.st, {
			top: this.ta.scrollTop / this.scH * this.sbcH + "px",
			height: this.stH + "px"
		}))
	}, NiceScroll.prototype._bind = function() {
		function a(b) {
			b = b || window.event;
			var c = b.touches[0].clientY,
				g = c - d.mousePos.y,
				g = parseFloat(d.st.style.top) - g,
				g = g >= d.sbcH ? d.sbcH : 0 >= g ? 0 : g;
			d.st.style.top = g + "px";
			d.mousePos.y = c;
			d.isScroll = !0;
			!1 == OS.portable && (d.ta.scrollTop = d.scH * (g / d.sbcH), eventPreventDefault(b));
			clearSelection(b)
		}
		function b(e) {
			detachEvnt(document, "touchmove", a);
			detachEvnt(document, "touchend", b);
			!1 == d.onSb && (d.isScroll = !1)
		}
		var d = this;
		document.attachEvent ? (this.ta.attachEvent("onmousewheel", function(b) {
			b = b || window.event;
			d._scroll(b)
		}), this.sb.attachEvent("onmousewheel", function(b) {
			b = b || window.event;
			d._scroll(b)
		})) : (this.ta.addEventListener("mousewheel", function(b) {
			b = b || window.event;
			d._scroll(b)
		}, !1), this.ta.addEventListener("DOMMouseScroll", function(b) {
			b = b || window.event;
			d._scroll(b)
		}, !1), this.sb.addEventListener("mousewheel", function(b) {
			b = b || window.event;
			d._scroll(b)
		}, !1), this.sb.addEventListener("DOMMouseScroll", function(b) {
			b = b || window.event;
			d._scroll(b)
		}, !1));
		attachEvnt(this.ta, "touchstart", function(e) {
			e = e || window.event;
			d.mousePos = {
				x: e.touches[0].clientX,
				y: e.touches[0].clientY
			};
			attachEvnt(document, "touchmove", a);
			attachEvnt(document, "touchend", b)
		});
		this.st.onmousedown = function(b) {
			d.mousePos = getMousePos(b);
			document.onmouseup = function(b) {
				document.onmousemove = null;
				document.onmouseup = null;
				!1 == d.onSb && (d.isScroll = !1)
			};
			document.onmousemove = function(b) {
				var a = getMousePos(b),
					c = a.y - d.mousePos.y,
					c = parseFloat(d.st.style.top) + c,
					c = c >= d.sbcH ? d.sbcH : 0 >= c ? 0 : c;
				d.st.style.top = c + "px";
				d.mousePos.y = a.y;
				d.ta.scrollTop = d.scH * (c / d.sbcH);
				d.isScroll = !0;
				clearSelection(b)
			}
		};
		$("#" + this.sb.id)[0].onmouseover = function(b) {
			b = b || window.event;
			d.onSb = !0;
			!0 == d.show && d._scrollShow(b)
		};
		$("#" + this.sb.id)[0].onmouseout = function() {
			d.onSb = !1;
			d.isScroll = !1
		}
	}, NiceScroll.prototype._close = function() {
		this.sb.style.visibility = "hidden";
		this.enabled = !1
	}, NiceScroll.prototype._open = function() {
		this.enabled = !0
	}, NiceScroll.prototype._shSb = function() {
		this.sb.style.visibility = "none" == this.ta.style.display || "hidden" == this.ta.visibility ? "hidden" : "visible"
	}, NiceScroll.prototype._check = function() {
		null == id(this.taId) ? (window.clearTimeout(this.checkTt), this.sb.parentNode.removeChild(this.sb)) : !1 != this.enabled && (!1 == checkInHorize(this.ta) ? this.sb.style.display = "none" : (this.sb.style.display = "block", 0 >= parseInt(this.ta.offsetHeight) && (this.sb.style.visibility = "hidden"), this._reset()))
	}, NiceScroll.prototype._getWheelDelta = function(a) {
		a = a || window.event;
		return a.wheelDelta ? window.opera && 9.5 > window.opera.version ? -a.wheelDelta : a.wheelDelta : 40 * -a.detail
	}, NiceScroll.prototype._wheelAnimateHandle = function() {
		var a = 0,
			b = this;
		b.wtId = window.setTimeout(function() {
			b._wheelAnimateHandle()
		}, 5);
		if (0 > b.wtCounter) clearTimeout(b.wtId), b.wtId = null, !1 == b.onSb && (b.isScroll = !1);
		else {
			a = parseFloat(b.ta.scrollTop) + parseInt(b.wSpeed);
			if (a >= b.scH || 0 >= a) b.wtCounter = 0;
			b.ta.scrollTop = a;
			a = b.ta.scrollTop / b.scH * b.sbcH;
			isNaN(a) || (b.st.style.top = a + "px");
			b.wtCounter--
		}
	}, NiceScroll.prototype._wheelAnimate = function(a, b) {
		var d = !1;
		this.wtId ? (this.wtCounter = (d = 0 > (this.woSpeed ^ a)) ? b : 50 > this.wtCounter + b ? this.wtCounter + b : 50, this.wSpeed = d ? a : 1.05 * this.wSpeed) : (this.wtCounter = b, this.woSpeed = this.wSpeed = a, this._wheelAnimateHandle())
	}, NiceScroll.prototype._scrollShow = function(a) {
		$("#" + this.sb.id).stop(!0).css("visibility", "visible").css("opacity", 1);
		this.isScroll = !0;
		eventPreventDefault(a)
	}, NiceScroll.prototype._scroll = function(a) {
		a = a || window.event;
		var b = 0 < this._getWheelDelta(a) ? -1 : 1;
		!0 == this.show && !0 == this.enabled && (this._scrollShow(a), this._wheelAnimate(5 * b, 7))
	})
}

function DateControl(a, c) {
	this.table;
	this.weekList;
	this.hourList;
	this.dateCon = id(a);
	this.weekIsMouseDown = !1;
	this.selDate = [0, 0, 0, 0, 0, 0, 0];
	this.dateArray = [0, 0, 0, 0, 0, 0, 0];
	this.cellWidth = this.cellHeight = 22;
	this.cellSeColor = "#A0D468";
	this.cellDeColor = "#FCFCFC";
	this.cellPadding = 1;
	void 0 == DateControl.prototype.init && (DateControl.prototype.hourStr = label.lHour, DateControl.prototype.weekDayNum = 7, DateControl.prototype.lineStr = "-", DateControl.prototype.selTag = "selTag", DateControl.prototype.cellBorderWidth = 1, DateControl.prototype.iCellIndex = 0, DateControl.prototype.weekArray = [label.Mon, label.Tue, label.Wen, label.Thu, label.Fri, label.Sta, label.Sun], DateControl.prototype._init = function() {
		this._initOptions();
		this._dateConInit();
		this._hourListInit();
		this._weekListInit();
		this._dateTableInit()
	}, DateControl.prototype.reset = function(b) {
		var a, c, f, g = this.iCellIndex;
		if (!1 != b instanceof Array && void 0 != b && b.length == this.weekDayNum) for (var h = 0; h < this.weekDayNum; h++) {
			c = this.table.rows[h];
			a = b[h];
			for (var k = 0; 24 > k; k++) f = c.cells[k], f = f.childNodes[g], void 0 != a ? (this._setSel(f, a % 2), a >>= 1) : this._setSel(f, 0)
		}
	}, DateControl.prototype._initOptions = function() {
		for (var b in c)"undefined" != typeof this[b] && (this[b] = c[b])
	}, DateControl.prototype.getSelDate = function() {
		var b, a, c = this.weekDayNum,
			f = this.table.rows;
		this.selDate = [0, 0, 0, 0, 0, 0, 0];
		for (var g = 0; g < c; g++) {
			a = f[g];
			for (var h = 0; 24 > h; h++) b = a.cells[h], b = b.childNodes[0], b = parseInt(b.getAttribute("sel")), 1 == b && (this.selDate[g] += Math.pow(2, h))
		}
		return this.selDate
	}, DateControl.prototype._dateConInit = function() {
		this.dateCon.style.overflow = "hidden"
	}, DateControl.prototype._hourListInit = function() {
		var b = document.createElement("ul"),
			a, c, f = this;
		b.className = "hourList";
		for (var g = 0; 24 >= g; g++) a = document.createElement("li"), 24 != g ? (c = document.createElement("span"), c.innerHTML = g, a.appendChild(c), a.style.width = this.cellWidth + 2 * this.cellPadding + this.cellBorderWidth + "px", c.onclick = function(a) {
			return function() {
				for (var b = f.table.rows, c = b.length, d = f.iCellIndex, e = 1, g = 0; g < c && (e &= parseInt(b[g].cells[a].childNodes[d].getAttribute("sel")), 0 != e); g++);
				e = 1 - e;
				for (g = 0; g < c; g++) f._setSel(b[g].cells[a].childNodes[d], e);
				clearSelection()
			}
		}(g)) : (a.style.color = "#6EBFD9", a.innerHTML = this.hourStr), b.appendChild(a);
		this.dateCon.appendChild(b);
		this.hourList = b
	}, DateControl.prototype._weekListInit = function() {
		var a = document.createElement("ul"),
			c, e = this;
		a.className = "weekList";
		for (var f = 0, g = this.weekDayNum; f < g; f++) c = document.createElement("li"), c.style.height = this.cellHeight + 2 * this.cellPadding + this.cellBorderWidth + "px", c.style.lineHeight = this.cellHeight + 2 * this.cellPadding + this.cellBorderWidth + "px", c.innerHTML = this.weekArray[f], c.onclick = function(a) {
			return function() {
				for (var b = e.table.rows[a].cells, c = e.iCellIndex, d = 1, f = 0, g = b.length; f < g && (d &= parseInt(b[f].childNodes[c].getAttribute("sel")), 0 != d); f++);
				d = 1 - d;
				f = 0;
				for (g = b.length; f < g; f++) e._setSel(b[f].childNodes[c], d);
				clearSelection()
			}
		}(f), a.appendChild(c);
		this.dateCon.appendChild(a);
		this.weekList = a
	}, DateControl.prototype._setSel = function(a, c) {
		a.setAttribute("sel", c);
		a.style.backgroundColor = 1 == c ? this.cellSeColor : this.cellDeColor
	}, DateControl.prototype._dateCellCreate = function() {
		for (var a, c, e, f, g = this, h = 0, k = this.weekDayNum; h < k; h++) {
			c = this.table.insertRow(-1);
			void 0 != this.dateArray && (a = this.dateArray[h]);
			for (var m = 0; 24 > m; m++) e = c.insertCell(-1), e.style.padding = this.cellPadding + "px", e.className = "weekTd", f = document.createElement("i"), f.className = "tableICell", f.style.height = this.cellHeight + "px", f.style.width = this.cellWidth + "px", e.appendChild(f), this._setSel(f, 0), void 0 != a ? (this._setSel(f, a % 2), a >>= 1) : this._setSel(f, 0), f.onmouseover = function(a) {
				!0 == g.weekIsMouseDown && g._setSel(this, 1 - parseInt(this.getAttribute("sel")))
			}, f.onmousedown = function(a) {
				g._setSel(this, 1 - parseInt(this.getAttribute("sel")))
			}
		}
		3 == this.table.rows[0].cells[0].nodeType && (this.iCellIndex = 1)
	}, DateControl.prototype._dateCellBind = function() {
		var a = this;
		this.table.onmousedown = function(c) {
			a.weekIsMouseDown = !0;
			document.onmouseup = function(c) {
				a.weekIsMouseDown = !1
			}
		};
		this.table.onmouseup = function(c) {
			a.weekIsMouseDown = !1
		}
	}, DateControl.prototype._dateTableCreate = function() {
		this.table = document.createElement("table");
		this.table.className = "tableWeek";
		this.table.cellspacing = "0px";
		this.table.cellpadding = "0px";
		this.dateCon.appendChild(this.table)
	}, DateControl.prototype._dateTableInit = function() {
		this._dateTableCreate();
		this._dateCellCreate();
		this._dateCellBind()
	});
	this._init()
}

function PageFunc() {
	this.pathStr = "../";
	this.htmlPathStr = this.pathStr + "pc/";
	this.detectPathStr = "/web-static/images/logo.png";
	this.loginId = "Login";
	this.coverId = "Cover";
	this.cloudPageId = "CloudAccountPage";
	this.loadPageData = {
		url: "",
		id: "",
		options: {},
		handle: {},
		handlePre: {}
	};
	this.loginPageData = {
		url: "",
		id: ""
	};
	this.showLoginHideNodesDelayHd;
	this.helpIdStr = "helpStr";
	this.helpTopClassStr = "helpTopClass";
	this.LGKEYSTR = "lgKey";
	this.LGKEYLEN = "lgKeyLen";
	this.LGKEYTIMESTR = "lgKeyTime";
	this._gPageHeightLg = 0;
	this.gDomainDNS = "tplogin.cn";
	this.gDomainDetectArr = null;
	this.g_cur_host_mac = "00-00-00-00-00-00";
	this.$Init = function() {
		Load.call(jQuery);
		$.getExplorer();
		$.initUrl()
	};
	this.refreshSession = function(a) {
		$.refreshSession(this.htmlPathStr + "Content.htm", a)
	};
	this.loadPageHandleBg = function() {
		for (var a = $("i.helpBtn"), c, b, d = 0, e = a.length; d < e; d++) b = a[d], c = b.getAttribute(helpIdStr), b = b.getAttribute(helpTopClassStr), null != c && helpBind(a[d], c, b)
	};
	this.loadLgLessPage = function(a, c, b, d) {
		d = void 0 == d ? {} : d;
		d.htmlPathStr = this.pathStr + "loginLess/";
		this.loadPage(a, c, b, d)
	};
	this.loadAppPage = function(a, c, b, d) {
		d = void 0 == d ? {} : d;
		d.htmlPathStr = "";
		this.loadPage(a, c, b, d)
	};
	this.loadPage = function(a, c, b, d, e) {
		var f = this;
		window.setTimeout(function() {
			var g = f.htmlPathStr;
			helpClose();
			closeAlert();
			closeConfirm();
			closeLoading();
			basicAppUpgradeInfoClose();
			d = void 0 == d ? {} : d;
			g = void 0 == d.htmlPathStr ? g : d.htmlPathStr;
			!1 !== d.bRecordLoadPage && setLoadPage(a, c, d, b, e);
			$.load(g + a, function(a) {
				"function" == typeof b && b(a)
			}, c, d, function(a) {
				closeProgBar();
				"function" == typeof e && e(a)
			})
		}, 0)
	};
	this.unloadDetail = function(a) {
		(a = id(a)) && emptyNodes(a)
	};
	this.detailShow = function(a, c) {
		$("#" + a).fadeIn(800, c)
	};
	this.detailHide = function(a, c) {
		$("#" + a).fadeOut(800, function() {
			$("#" + a).css("display", "none");
			window.unloadDetail(c)
		})
	};
	this.selectChange = function(a, c) {
		id(a).value = c.options[c.selectedIndex].text
	};
	this.showCon = function(a) {
		var c = id(a),
			b, d = document.body.childNodes,
			e;
		for (e in d) b = d[e], void 0 != b.nodeName && "DIV" == b.nodeName.toUpperCase() && b.id != a && setStyle(b, {
			display: "none"
		});
		setStyle(c, {
			display: "block"
		})
	};
	this.loginChange = function(a) {
		function c() {
			for (var a in g) f = g[a], void 0 != f.nodeName && "DIV" == f.nodeName.toUpperCase() && f.id != h.loginId && f.id != h.coverId && h.setStyle(f, {
				display: d
			});
			h.setStyle(b, {
				display: e
			});
			"function" == typeof showLoginHideNodesDelayHd && showLoginHideNodesDelayHd()
		}
		var b = this.id(this.loginId),
			d = "block",
			e = "none",
			f, g = document.body.childNodes,
			h = this;
		!0 == a && (d = "none", e = "block", _gPageHeightLg = parseInt(document.body.offsetHeight));
		emptyNodes(b);
		!0 == a ? (a = $.authRltObj.code, ESYSRESET == a ? (!0 == OS.portable && !1 == OS.iPad ? loadLgLessPage("PhoneSetPwd.htm", "Con", void 0, {
			bRecordLoadPage: !1
		}) : (document.body.style.height = "auto", loadPage("LoginChgPwd.htm", "Login", c, {
			bRecordLoadPage: !1
		})), emptyNodes(id("Con")), setLoadPage("Content.htm", "Con")) : ESYSLOCKEDFOREVER == a || ESYSLOCKED == a ? (document.body.style.height = "auto", $.queryAuthLog(function(a) {
			$.authRltObj.authLog = a.unauth_log_list;
			$.authRltObj.client = a.curIP;
			c();
			loadLgLessPage("LoginAuthLog.htm", "Login", void 0, {
				bRecordLoadPage: !1
			})
		})) : !0 == OS.portable && !1 == OS.iPad && !1 == phoneSet.bContinuePCSet ? loadLgLessPage("PhoneApp.htm", "Con", void 0, {
			bRecordLoadPage: !1
		}) : (document.body.style.height = "auto", loadPage("Login.htm", "Login", c, {
			bRecordLoadPage: !1
		}))) : (document.body.style.height = !0 == OS.portable && !1 == OS.iPad && !1 == phoneSet.bContinuePCSet ? "100%" : _gPageHeightLg + "px", this.loadPageData.options = this.loadPageData.options || {}, this.loadPageData.options.bRecordLoadPage = !1, this.loadPage(this.loadPageData.url, this.loadPageData.id, function() {
			"function" == typeof h.loadPageData.handle && h.loadPageData.handle()
		}, this.loadPageData.options, function() {
			c();
			"function" == typeof h.loadPageData.handlePre && h.loadPageData.handlePre()
		}))
	};
	this.setLoadPage = function(a, c, b, d, e) {
		this.loadPageData.url = a;
		this.loadPageData.id = c;
		this.loadPageData.options = b;
		this.loadPageData.handle = d;
		this.loadPageData.handlePre = e
	};
	this.localSgInit = function() {
		try {
			this.sessionLS.init(), !0 == isIE && !1 == isIENormal &&
			function() {
				sessionLS.setExpire(3E3);
				window.setTimeout(arguments.callee, 1E3)
			}()
		} catch (a) {}
		this.getLgPwd()
	};
	this.auth = function() {
		$.auth($.pwd)
	};
	this.getLgPwd = function() {
		try {
			$.pwd = sessionLS.getItem(this.LGKEYSTR), 0 == gCloudAccountBR.pwdLen && (gCloudAccountBR.pwdLen = parseInt(sessionLS.getItem(this.LGKEYLEN)))
		} catch (a) {}
	};
	this.showLogin = function(a) {
		this.showLoginHideNodesDelayHd = a;
		this.loginChange(!0)
	};
	this.unloadLogin = function() {
		this.loginChange(!1)
	};
	this.ifrmOrgUrl = function(a) {
		return "/stok=" + encodeURIComponent($.session) + "?code=" + a
	};
	this.iFrmOnload = function(a, c, b) {
		var d;
		b = ENONE;
		a = id(a);
		var e, f;
		try {
			d = a.contentWindow ? a.contentWindow.document.body ? a.contentWindow.document.body.innerHTML : null : a.contentDocument.document.body ? a.contentDocument.document.body.innerHTML : null;
			if (/(<pre>)?(.+)(<\/pre>)+/.test(d) || /(<pre>)?(.+)/.test(d)) e = RegExp.$2;
			f = JSON.parse(e);
			b = f[ERR_CODE];
			b != ENONE && closeProgBar();
			c(b)
		} catch (g) {
			closeProgBar(), c(EINVFMT)
		}
	};
	this.windowSleep = function(a) {
		var c = new Date;
		for (a = c.getTime() + a; !(c = new Date, c.getTime() > a););
	};
	this.getCurrPcMac = function() {
		var a, c = $.getPeerMac();
		if (ENONE != c.errorno || "" == c.data) return "00-00-00-00-00-00";
		a = c.data.indexOf("\r\n");
		return c.data.substring(0, a)
	};
	this.cloneLocalMac = function() {
		var a = $.readEx(SYSTEM_DATA_ID),
			c = this.getCurrPcMac(),
			b = ENONE;
		a.mac[1] != c && (a.mac[1] = c, b = $.write($.toText(a), $.block));
		return b
	};
	this.logSave = function() {
		var a = $.domainUrl;
		a.lastIndexOf("/") == a.length - 1 && (a = a.substring(0, a.length - 1));
		location.href = a + $.orgURL("/syslog.txt?disposition=1");
		return !0
	};
	this.pageRedirect = function() {
		var a = window.top.location.href;
		USER_GROUP_REMOTE != $.authRltObj.group && !1 == /^((http:\/\/)*(\d{1,3}\.){3}\d{1,3})/g.test(a) && 0 > a.indexOf(gDomainDNS) && !1 == $.local && (window.top.location.href = $.httpTag + gDomainDNS)
	};
	this.pageOnload = function() {
		var a = [{
			tag: "link",
			url: "../web-static/dynaform/DataGrid.css"
		}],
			c = [{
				tag: "script",
				url: "../web-static/dynaform/DataGrid.js"
			}, {
				tag: "script",
				url: "../web-static/dynaform/menu.js"
			}],
			b = [{
				tag: "script",
				url: "../web-static/lib/ajax.js"
			}, {
				tag: "script",
				url: "../web-static/dynaform/uci.js"
			}, {
				tag: "script",
				url: "../web-static/language/cn/str.js"
			}, {
				tag: "script",
				url: "../web-static/language/cn/error.js"
			}, {
				tag: "script",
				url: "../web-static/lib/verify.js"
			}, {
				tag: "script",
				url: "../web-static/dynaform/macFactory.js"
			}];
		this.loadExternResource({
			scripts: [{
				tag: "script",
				url: "../web-static/lib/json.js"
			}, {
				tag: "script",
				url: "../web-static/lib/jquery-1.10.1.js"
			}],
			callBack: function() {
				this.loadExternResource({
					scripts: b,
					callBack: function() {
						var b = window.top.location.href;
						$Init();
						$.setexternJSP(replaceJSP);
						$.setExternPageHandle(loadPageHandleBg);
						$.setLoginErrHandle(showLogin);
						$.setPRHandle(pageRedirect);
						this.loadExternResource({
							scripts: c,
							links: a
						});
						this.compatibleShow();
						this.localSgInit();
						!0 == $.local ? this.loadPage("Content.htm", "Con") : !1 == /^((http:\/\/)*(\d{1,3}\.){3}\d{1,3})/g.test(b) && 0 <= b.indexOf(gDomainDNS) ? (b = {}, b[uciSystem.actionName.getDomainArray] = null, $.action(b, function(a) {
							ENONE == a[ERR_CODE] ? (a = a[uciSystem.dynData.domainArray], 1 < a.length ? (this.gDomainDetectArr = a, this.loadLgLessPage("RouterSelect.htm", "Con", void 0, {
								bRecordLoadPage: !1
							})) : this.loadPage("Content.htm", "Con")) : this.loadPage("Content.htm", "Con")
						})) : this.loadPage("Content.htm", "Con")
					}
				})
			}
		});
		document.oncontextmenu = function(a) {
			return !1
		};
		if (isIESix) try {
			document.execCommand("BackgroundImageCache", !1, !0)
		} catch (d) {}
	};
	this.loadExternResource = function(a) {
		var c, b, d, e, f = document.getElementsByTagName("head")[0];
		c = {
			links: null,
			scripts: null,
			callBack: null
		};
		for (var g in a) c[g] = a[g];
		a = c.links;
		b = c.scripts;
		d = c.callBack;
		if (void 0 != a) for (var h in a) c = document.createElement("link"), c.rel = "stylesheet", c.href = a[h].url, f.appendChild(c);
		if (void 0 != b) {
			var k;
			c = document.createElement("script");
			c.type = "text/javascript";
			if (void 0 != d) for (h in e = void 0 != c.readyState, k = function(a) {
				b[a].loadState = !0;
				for (var c in b) if (!1 == b[c].loadState) return;
				d()
			}, b) b[h].loadState = !1;
			for (h in b) c = document.createElement("script"), c.type = "text/javascript", void 0 != d && (e ? c.onreadystatechange = function(a) {
				return function() {
					if ("loaded" == this.readyState || "complete" == this.readyState) this.onreadystatechange = null, k(a)
				}
			}(h) : c.onload = function(a) {
				return function() {
					k(a)
				}
			}(h)), c.src = b[h].url, f.appendChild(c)
		}
	}
}

function Cover() {
	Style.call(this);
	this.CoverId = "Cover";
	this.CoverIdB = "CoverB";
	this.hideCover = function(a, c) {
		var b = id(this.CoverId);
		this.setStyle(b, {
			display: "none",
			visibility: "hidden"
		});
		this.setStyle(b, c);
		"function" == typeof a && a(b);
		emptyNodes(b)
	};
	this.showCover = function(a, c) {
		var b = id(this.CoverId);
		this.setStyle(b, {
			display: "block",
			visibility: "visible"
		});
		this.setStyle(b, c);
		$(b).css("opacity", "0.8");
		"undefined" != typeof a && a(b)
	};
	this.showCoverB = function(a, c) {
		var b = id(this.CoverIdB);
		void 0 == b && (b = document.createElement("div"), b.id = this.CoverIdB, document.body.appendChild(b));
		this.setStyle(b, {
			display: "block",
			visibility: "visible"
		});
		this.setStyle(b, c);
		$(b).css("opacity", "0.8");
		"undefined" != typeof a && a(b)
	};
	this.hideCoverB = function(a, c) {
		var b = id(this.CoverIdB);
		void 0 != b && (this.setStyle(b, {
			display: "none",
			visibility: "hidden"
		}), this.setStyle(b, c), "function" == typeof a && a(b), emptyNodes(b))
	}
}

function Style() {
	this.disableCol = "#b2b2b2";
	this.setStyle = function(a, c) {
		if (null != a && null != c && 1 == a.nodeType) for (var b in c) try {
			a.style[b] = c[b]
		} catch (d) {}
	};
	this.getNodeDefaultView = function(a, c) {
		var b = null;
		if (!a) return null;
		try {
			return b = a.currentStyle ? a.currentStyle : document.defaultView.getComputedStyle(a, null), void 0 != c ? b[c] : b
		} catch (d) {}
	}
}

function LocalStorageSD() {
	try {
		this.sessionLS = null == this.sessionStorage ? {
			file_name: "user_data_default_SD",
			dom: null,
			init: function() {
				var a = document.createElement("input");
				a.type = "hidden";
				a.addBehavior("#default#userData");
				document.body.appendChild(a);
				a.save(this.file_name);
				this.dom = a
			},
			setItem: function(a, b) {
				this.dom.setAttribute(a, b);
				this.dom.save(this.file_name)
			},
			getItem: function(a, b) {
				this.dom.load(this.file_name);
				return this.dom.getAttribute(a)
			},
			removeItem: function(a) {
				this.dom.removeAttribute(a);
				this.dom.save(this.file_name)
			},
			setExpire: function(a) {
				var b = new Date,
					b = new Date(b.getTime() + a);
				this.dom.load(this.file_name);
				this.dom.expires = b.toUTCString();
				this.dom.save(this.file_name)
			}
		} : sessionStorage
	} catch (a) {}
}

function Explorer() {
	this.isIETenLess = this.isIENormal = this.isIESeven = this.isIESix = this.isIE = !1;
	this.explorerInfo = navigator.userAgent;
	this.getIEInfo = function() {
		isIE = /msie ((\d+\.)+\d+)/i.test(explorerInfo) ? document.mode || RegExp.$1 : !1;
		!1 != isIE && (6 >= isIE ? this.isIESix = !0 : 7 == isIE ? this.isIESeven = !0 : 9 <= isIE && (this.isIENormal = !0), 10 >= isIE && (this.isIETenLess = !0), this.isIE = !0)
	};
	this.compatibleShow = function() {
		if (!0 == this.isIESix) {
			var a, c, b, d, e;
			0 <= document.cookie.indexOf("ieSixClosed") || (a = $("div.ieSixCompatible"), void 0 == a[0] && (a = el("div"), a.className = "ieSixCompatible", c = el("div"), c.className = "ieSixCpCon", b = el("i"), d = el("span"), d.className = "spanNote", d.innerHTML = label.IESixCpTip, e = el("span"), e.className = "spanClose", e.innerHTML = label.iknown, e.onclick = function() {
				document.cookie = "ieSixClosed=true";
				a.style.visibility = "hidden";
				a.style.top = "-9999px"
			}, c.appendChild(b), c.appendChild(d), c.appendChild(e), a.appendChild(c), document.body.appendChild(a)))
		}
	};
	this.createGroupRadio = function(a) {
		var c;
		if (void 0 == a) return c;
		!0 == this.isIE && !1 == this.isIENormal ? c = document.createElement("<input name='" + a + "' />") : (c = document.createElement("input"), c.name = a);
		return c
	};
	this.getIEInfo()
}

function Tool() {
	this.gAppPreUrl = "";
	Style.call(this);
	this.id = function(a) {
		if (void 0 != a) return document.getElementById(a)
	};
	this.el = function(a) {
		try {
			return document.createElement(a)
		} catch (c) {
			return null
		}
	};
	this.replaceJSP = function(a) {
		var c = null,
			b, d = /{%(\w+)\.(\w+)%}/i,
			c = d.exec(a);
		try {
			for (; null != c;) b = language[c[1]][c[2]], a = a.replace("{%" + c[1] + "." + c[2] + "%}", b), c = d.exec(a)
		} catch (e) {}
		try {
			a = a.replace(/{#appPreUrl#}/g, gAppPreUrl)
		} catch (f) {}
		return a
	};
	this.getoffset = function(a, c) {
		for (var b = a, d = {
			top: 0,
			left: 0
		}; b != c;) d.left += parseInt(b.offsetLeft), d.top += parseInt(b.offsetTop), b = b.offsetParent;
		return d
	};
	this.attachEvnt = function(a, c, b) {
		0 == c.indexOf("on") && (c = c.substring(2));
		document.body.attachEvent ? a.attachEvent("on" + c, b) : a.addEventListener(c, b, !1)
	};
	this.detachEvnt = function(a, c, b) {
		0 == c.indexOf("on") && (c = c.substring(2));
		document.body.attachEvent ? a.detachEvent("on" + c, b) : a.removeEventListener(c, b, !1)
	};
	this.stopProp = function(a) {
		a = a || window.event;
		void 0 != a && (a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0)
	};
	this.eventPreventDefault = function(a) {
		a = a || window.event;
		void 0 != a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
	};
	this.clearSelection = function() {
		window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
	};
	this.setDomCursorPos = function(a, c) {
		if (a.setSelectionRange) a.focus(), a.setSelectionRange(c, c);
		else if (a.createTextRange) {
			var b = a.createTextRange();
			b.collapse(!0);
			b.moveEnd("character", c);
			b.moveStart("character", c);
			b.select()
		}
	};
	this.getMousePos = function(a) {
		a = a || window.event;
		var c = document;
		return a.pageX || a.pageY ? {
			x: a.pageX,
			y: a.pageY
		} : {
			x: a.clientX + c.documentElement.scrollLeft - c.documentElement.clientLeft,
			y: a.clientY + c.documentElement.scrollTop - c.documentElement.clientTop
		}
	};
	this.isArray = function(a) {
		return "[object Array]" === Object.prototype.toString.call(a)
	};
	this.upDown = function(a, c, b, d, e) {
		if (void 0 != b && void 0 != d) {
			var f = this.el("label");
			f.className = d;
			f.onclick = function() {
				$("#" + c).slideToggle("normal", function() {
					f.className = f.className == b ? d : b;
					if (e) try {
						e()
					} catch (a) {}
				})
			};
			a.appendChild(f);
			return f
		}
	};
	this.arrowUpDown = function(a, c, b) {
		this.upDown(a, c, "arrowUp", "arrowDown", b)
	};
	this.getChildNode = function(a, c, b) {
		a = a.childNodes;
		var d = [],
			e = 0,
			f;
		f = c.split(" ");
		c = f[0];
		for (var g = f[1], h = 0, k = a.length; h < k; h++) f = a[h], 1 == f.nodeType && f.tagName.toLowerCase() == c && (void 0 != g && f.type == g ? (d[e] = f, e++) : void 0 == g && (d[e] = f, e++));
		return void 0 != b ? d[b] : d[0]
	};
	this.checkInHorize = function(a) {
		for (; null != a && "HTML" != a.nodeName.toUpperCase();) {
			if ("hidden" == this.getNodeDefaultView(a, "visibility") || "none" == this.getNodeDefaultView(a, "display")) return !1;
			a = a.parentNode
		}
		return !0
	};
	this.setUrlHash = function(a, c) {
		var b, d, e;
		b = "";
		var f = location.href;
		d = location.hash;
		void 0 != a && void 0 != c && 0 != a.length && (0 != d.length ? (e = d.indexOf(a), 0 <= e ? (b = d.substring(0, e), d = d.substring(e), e = d.indexOf("#"), 0 < e ? (d = d.substring(e), d = b + a + "=" + c + d) : d = b + a + "=" + c) : ("#" != d.substring(d.length - 1) && (b = "#"), d += b + a + "=" + c), location.href = f.substring(0, f.indexOf("#")) + d) : f.lastIndexOf("#") == f.length - 1 ? location.href += a + "=" + c : location.href += "#" + a + "=" + c)
	};
	this.getUrlHash = function(a) {
		var c = location.hash,
			b, d = "";
		if (0 < c.indexOf(a)) {
			var c = c.substring(1).split("#"),
				e;
			for (e in c) if (b = c[e].split("="), b[0] == a) {
				d = b[1];
				break
			}
		}
		return d
	};
	this.changeUrlHash = function(a) {
		var c = location.href,
			b = c.indexOf("#");
		void 0 != a && (location.href = 0 < b ? c.substring(0, b + 1) + a : c + "#" + a)
	};
	this.setInputCursor = function(a) {
		this.setDomCursorPos(a, a.value.length)
	};
	this.getCNStrLen = function(a) {
		return a.replace(/[^\x00-\xFF]/g, "xxx").length
	};
	this.getDisplayStrLen = function(a) {
		return a.replace(/[^\x00-\xFF]/g, "xx").length
	};
	this.getStrInMax = function(a, c) {
		var b = "",
			d, e = 0;
		d = a.replace(/[A-Z]/g, "xx");
		if (getDisplayStrLen(d) <= c) return a;
		for (var f = 1; f <= c; f++) {
			d = a.charAt(e);
			if ("" == d) break;
			1 < getDisplayStrLen(d) ? (f += getDisplayStrLen(d) - 1, b += d, beCut = !0) : !0 == /[A-Z]/g.test(d) ? (f++, b += d, beCut = !0) : b += d;
			e++
		}
		return b + "..."
	};
	this.EncodeURLIMG = document.createElement("img");
	this.escapeDBC = function(a) {
		var c = this.EncodeURLIMG;
		if (!a) return "";
		if (window.ActiveXObject) return execScript('SetLocale "zh-cn"', "vbscript"), a.replace(/[\d\D]/g, function(a) {
			window.vbsval = "";
			execScript('window.vbsval=Hex(Asc("' + a + '"))', "vbscript");
			return "%" + window.vbsval.slice(0, 2) + "%" + window.vbsval.slice(-2)
		});
		c.src = "nothing.png?separator=" + a;
		return c.src.split("?separator=").pop()
	};
	this.encodeURL = function(a) {
		return encodeURIComponent(a)
	};
	this.doNothing = function() {
		return !0
	};
	this.htmlEscape = function(a) {
		void 0 != a && (a = a.toString().replace(/[<>&"]/g, function(a) {
			switch (a) {
			case "<":
				return "&lt;";
			case ">":
				return "&gt;";
			case "&":
				return "&amp;";
			case '"':
				return "&quot;"
			}
		}));
		return a
	};
	this.orgAuthPwd = function(a) {
		return this.securityEncode(a, "RDpbLfCPsJZ7fiv", "yLwVl0zKqws7LgKPRQ84Mdt708T1qQ3Ha7xv3H7NyU84p21BriUWBU43odz3iP4rBL3cD02KZciXTysVXiV8ngg6vL48rPJyAUw0HurW20xqxv9aYb4M9wK1Ae0wlro510qXeU07kV57fQMc8L6aLgMLwygtc0F10a0Dg70TOoouyFhdysuRMO51yY5ZlOZZLEal1h0t9YQW0Ko7oBwmCAHoic4HYbUyVeU3sfQ1xtXcPcf1aT303wAQhv66qzW")
	};
	this.securityEncode = function(a, c, b) {
		var d = "",
			e, f, g, h, k = 187,
			m = 187;
		f = a.length;
		g = c.length;
		h = b.length;
		e = f > g ? f : g;
		for (var l = 0; l < e; l++) m = k = 187, l >= f ? m = c.charCodeAt(l) : l >= g ? k = a.charCodeAt(l) : (k = a.charCodeAt(l), m = c.charCodeAt(l)), d += b.charAt((k ^ m) % h);
		return d
	};
	this.simulateMouseC = function(a) {
		simulateMouseC = !0 == isIE && !1 == isIENormal ?
		function(a) {
			var b = document.createEventObject();
			b.sceenX = 100;
			b.sceenY = 0;
			b.clientX = 0;
			b.clientY = 0;
			b.ctrlKey = !1;
			b.altKey = !1;
			b.shiftKey = !1;
			b.button = 0;
			a.fireEvent("onclick", b)
		} : function() {};
		simulateMouseC(a)
	};
	this.emptyNodes = function(a) {
		for (; a && a.firstChild;) a.removeChild(a.firstChild)
	};
	this.netSpeedTrans = function(a) {
		a = parseInt(a);
		a = 1073741824 <= a ? (a / 1073741824).toFixed(0) + "GB/s" : 1048576 <= a ? (a / 1048576).toFixed(0) + "MB/s" : (a / 1024).toFixed(0) + "KB/s";
		return a.toString()
	};
	this.debugInfo = function(a) {
		console.log(a)
	};
	this.compareObj = function(a, c) {
		var b = !0,
			d;
		for (d in a) if ("object" == typeof a[d]) if (void 0 != c[d]) {
			if (b = compareObj(a[d], c[d]), !1 == b) return !1
		} else return !1;
		else if (a[d] != c[d]) return !1;
		return b
	};
	this.adaptCNABrowserInput = function(a) {
		try {
			"NO" != gBeInCNA && (id(a).onfocus = function() {
				var a = this,
					c = a.value;
				a.value = "";
				a.type = "password";
				$.setTimeout(function() {
					a.type = "text";
					a.value = c
				}, 0)
			})
		} catch (c) {}
	}
}

function Switch(a, c, b) {
	this.switchCon = id(a);
	this.switchBall = $("#" + a + " i.switchBall")[0];
	this.switchBg = $("#" + a + " i.switchBg")[0];
	this.callback = b;
	this.state = c;
	this.rightPos;
	"function" != typeof Switch.prototype.switchInit && (Switch.prototype.switchInit = function() {
		var a = this.state,
			b = this.switchBall,
			c = this.switchCon,
			g = this.switchBg;
		null != c && null != b && (this.rightPos = c.offsetWidth - b.offsetWidth, this.setState(a), this.callback && this.callback(a), b.onmousedown = this.draggableBind(), g.onclick = this.switchBgClick())
	}, Switch.prototype.setState = function(a) {
		var b = this.switchCon,
			c = this.switchBall;
		this.state = a;
		b.value = a;
		c.style.left = a * this.rightPos + "px";
		c.style.background = 1 == a ? "url(../web-static/images/routerBg.png) -441px -53px no-repeat" : "url(../web-static/images/routerBg.png) -424px -52px no-repeat"
	}, Switch.prototype.switchChgState = function(a) {
		a = 1 - a;
		this.setState(a);
		this.callback && this.callback(a)
	}, Switch.prototype.switchCHandle = function() {
		var a = this.state,
			b = this.switchBall,
			c = 1 == a ? -1 : 1,
			g = parseInt(b.style.left),
			h = this.rightPos,
			k = this;
		1 == a && 0 >= g || 0 == a && g >= h ? this.switchChgState(a) : (b.style.left = g + c * h / 8 + "px", window.setTimeout(function() {
			k.switchCHandle()
		}, 20))
	}, Switch.prototype.msMove = function(a, b, c) {
		b = b.x - c.x;
		c = this.switchCon.offsetWidth - a.offsetWidth;
		b = 0 < b ? b : 0;
		a.style.left = (b > c ? c : b) + "px"
	}, Switch.prototype.switchBgClick = function() {
		var a = this;
		return function(b) {
			b = b || window.event;
			a.switchBg == (b.target || b.srcElement) && a.switchCHandle()
		}
	}, Switch.prototype.draggableBind = function() {
		var a = this;
		return function(b) {
			b = b ? b : window.event;
			var c = getMousePos(b),
				g = b.target || b.srcElement,
				h = {
					x: c.x - g.offsetLeft
				};
			document.onmousemove = function(b) {
				b = b ? b : window.event;
				b = getMousePos(b);
				clearSelection();
				a.msMove(g, b, h)
			};
			document.onmouseup = function(b) {
				clearSelection();
				document.onmousemove = null;
				document.onmouseup = null;
				a.switchCHandle()
			};
			stopProp(b)
		}
	});
	this.switchInit()
}

function HighSet() {
	this.IMG_HS_LOADING_GREEN = "IMG_HS_LOADING_GREEN";
	this.IMG_HS_LOADING_BLUE = "IMG_HS_LOADING_BLUE";
	this.IMG_HS_LOADING_RED = "IMG_HS_LOADING_RED";
	this.IMG_HS_LOADING_YELLOW = "IMG_HS_LOADING_YELLOW";
	this.hsLoadingObj = {
		subBtnId: "",
		handleLoad: "",
		handleDelayHd: null,
		loadImgKey: IMG_HS_LOADING_BLUE,
		loadImgCol: {
			IMG_HS_LOADING_GREEN: "hsLoadingGreen.gif",
			IMG_HS_LOADING_BLUE: "hsLoadingBlue.gif",
			IMG_HS_LOADING_RED: "hsLoadingRed.gif",
			IMG_HS_LOADING_YELLOW: "hsLoadingYellow.gif"
		}
	};
	this.hsStatSet = function(a, c, b) {
		var d, e;
		void 0 == b ? (d = $("ul.gridStatus")[0], e = $("ul.gridStatus label")[0], statPic = $("ul.gridStatus i")[0]) : (d = $("#" + b)[0], e = $("#" + b + " label")[0], statPic = $("#" + b + " i")[0]);
		switch (a) {
		case "null":
			d.style.visibility = "hidden";
			break;
		case "correct":
			e.innerHTML = c;
			statPic.style.background = "url(../web-static/images/routerBg.png) -353px -122px no-repeat";
			d.style.visibility = "visible";
			break;
		case "error":
			e.innerHTML = c;
			statPic.style.background = "url(../web-static/images/routerBg.png) -306px -209px no-repeat";
			d.style.visibility = "visible";
			break;
		case "link":
			e.innerHTML = c;
			statPic.style.background = "url(../web-static/images/routerBg.png) -372px -123px no-repeat";
			d.style.visibility = "visible";
			break;
		case "exception":
			e.innerHTML = c;
			statPic.style.background = "url(../web-static/images/routerBg.png) -334px -123px no-repeat";
			d.style.visibility = "visible";
			break;
		default:
			d.style.visibility = "hidden"
		}
	};
	this.disInputTip = function(a, c) {
		null != a && void 0 != c && ("error" == c.toLowerCase() ? this.setStyle(a, {
			visibility: "visible",
			background: "url(../../web-static/images/wzd.png) no-repeat -116px -243px"
		}) : "ok" == c.toLowerCase() ? this.setStyle(a, {
			visibility: "visible",
			background: "url(../../web-static/images/wzd.png) no-repeat -95px -243px"
		}) : "warn" == c.toLowerCase() ? this.setStyle(a, {
			visibility: "visible",
			background: "url(../../web-static/images/wzd.png) no-repeat -137px -243px"
		}) : a.style.visibility = "hidden")
	};
	this.initHoverBd = function() {
		$("input.hoverBd").bind("focus", function() {
			this.parentNode.style.border = "1px solid #A0D468"
		}).bind("blur", function() {
			this.parentNode.style.border = "1px solid #FFFFFF"
		})
	};
	this.disableInput = function(a, c) {
		var b = "object" == typeof a ? a : id(a);
		b.disabled = c ? !0 : !1;
		b.style.color = c ? "#B2B2B2" : "#FFFFFF"
	};
	this.disableBtn = function(a, c) {
		var b = "object" == typeof a ? a : id(a),
			d = b.className;
		b.disabled != c && (b.disabled = c ? !0 : !1, b.className = c ? d.replace("subBtn", "subBtnDis") : d.replace("subBtnDis", "subBtn"))
	};
	this.disableClick = function(a, c, b) {
		a = "object" == typeof a ? a : id(a);
		b = null;
		null == a.disableTimes && (a.disableTimes = 0);
		if (!0 == c) return 0 >= a.disableTimes && (a.oldOnClick = a.onclick, a.onclick = null), b = a.oldOnClick, a.disableTimes++, b;
		a.disableTimes--;
		0 >= a.disableTimes && (null == a.onclick && (a.onclick = a.oldOnClick), a.oldOnClick = null);
		return null
	};
	this.setLoadingId = function(a, c) {
		this.hsLoadingObj.subBtnId = a;
		this.hsLoadingObj.loadImgKey = void 0 == c ? IMG_HS_LOADING_BLUE : c;
		this.hsLoadingObj.subBtnObj = id(a)
	};
	this.hsLoading = function(a, c) {
		var b = this.hsLoadingObj,
			d = id(b.subBtnId),
			e, f, g, h, k, m, l;
		null != d && d == b.subBtnObj && (k = d.parentNode, k.style.position = "relative", h = d.offsetWidth, e = d.offsetLeft, g = d.offsetTop, f = d.offsetHeight, l = $("#" + b.subBtnId + " ~ div.hsLoadingCon")[0], m = $("#" + b.subBtnId + " ~ div.hsLoadingCon img")[0], window.clearTimeout(b.handleDelayHd), !0 == a ? (d.style.visibility = "hidden", void 0 == l ? (l = el("div"), l.className = "hsLoadingCon", k.appendChild(l), l.style.width = h + "px", l.style.height = f + "px", l.style.top = g + "px", l.style.left = e + "px", m = el("img"), l.appendChild(m), m.onload = function() {
			m.style.height = f + "px";
			l.style.visibility = "visible"
		}, m.src = "../web-static/images/" + b.loadImgCol[b.loadImgKey]) : (m.style.height = f + "px", l.style.height = f + "px", l.style.width = h + "px", l.style.top = g + "px", l.style.left = e + "px", l.style.visibility = "visible")) : b.handleDelayHd = window.setTimeout(function() {
			b.subBtnId = "";
			d.style.visibility = "visible";
			void 0 != l && (l.style.visibility = "hidden");
			"function" == typeof c && c()
		}, 500))
	};
	this.hsSwitchState = function(a, c) {
		var b = $("#" + a + " ~ span.hsSwitchState")[0];
		null != b && (1 == c ? (b.innerHTML = statusStr.opened, b.style.color = "#86B157") : (b.innerHTML = statusStr.closed, b.style.color = "#FB6E52"))
	}
}

function Basic() {
	this.NET_STATE_INDEX = 0;
	this.LINK_EPTMGT_INDEX = 1;
	this.APPS_MGT_INDEX = 2;
	this.ROUTE_SET_INDEX = 3;
	this.contentPageLoad = function() {
		loadBasic()
	};
	this.gBasicMenu = {
		menuIndex: NET_STATE_INDEX,
		subMenuUrl: ""
	};
	this.setBasicMenu = function(a, c) {
		this.gBasicMenu.menuIndex = void 0 == a ? this.gBasicMenu.menuIndex : a;
		this.gBasicMenu.subMenuUrl = void 0 == c ? this.gBasicMenu.subMenuUrl : c
	};
	this.setBasicSubMenuUrl = function(a) {
		this.gBasicMenu.subMenuUrl = a
	};
	this.loadBasic = function(a, c, b) {
		this.basicAutoFit();
		this.setBasicMenu(a, c);
		loadPage("Basic.htm", "Con", b)
	};
	this.basicAutoFit = function() {
		var a = document.documentElement.clientHeight;
		852 > a ? document.body.style.height = "852px" : 900 < a && document.body.style.height;
		document.body.style.fontSize = "12px"
	}
}

function ShowTips() {
	this.alertTimeHd;
	this.shAltObjOrId;
	this.showAlert = function(a, c, b, d) {
		this.showCover(function() {
			var e = id("Error"),
				f = id("hsErr"),
				g, h = this;
			!0 == isIESix ? alert(a) : (this.shAltObjOrId = c, g = $("div.hsTip input.subBtn")[0], null == f && (f = document.createElement("div"), f.id = "hsErr", f.className = "hsTip", g = document.createElement("p"), g.className = "detail", f.appendChild(g), g = document.createElement("input"), g.type = "button", g.className = "subBtn ok", g.value = btn.ok, f.appendChild(g), e.appendChild(f)), getChildNode(f, "p").innerHTML = a, b && (f.style.marginLeft = "280px"), g.onclick = function() {
				"function" == typeof d && d();
				h.closeAlert(!0)
			}, e.style.visibility = "visible", e.style.display = "block", e.style.top = "90px", !1 == OS.portable ? setStyle(e, {
				position: "fixed"
			}) : setStyle(e, {
				position: "absolute"
			}), !1 == OS.iPhone && !1 == OS.iPad && g.focus(), this.alertTimeHd = $.setTimeout(function() {
				h.closeAlert()
			}, 3E4))
		})
	};
	this.closeAlert = function(a) {
		this.hideCover(function() {
			var c = id("Error"),
				b = this.shAltObjOrId;
			if (null != c) if (c.style.top = "-9999px", c.style.visibility = "hidden", clearTimeout(this.alertTimeHd), this.alertTimeHd = null, !0 != a || void 0 == b || "object" != typeof b && 0 == b.length) this.shAltObjOrId = "";
			else try {
				"object" != typeof b && (b = id(b)), b.focus(), b.select()
			} catch (d) {}
		})
	};
	this.shAltBaObjOrId;
	this.showAlertB = function(a, c) {
		showCover(function(b) {
			var d;
			this.shAltBaObjOrId = c;
			d = document.createElement("div");
			d.className = "baConfirmCon";
			document.body.appendChild(d);
			b = document.createElement("div");
			b.className = "baConfirm";
			d.appendChild(b);
			d = document.createElement("i");
			d.className = "baConfirmLogo";
			b.appendChild(d);
			d = document.createElement("span");
			d.className = "baConfirmQuestion";
			d.innerHTML = a;
			b.appendChild(d);
			d = document.createElement("input");
			d.className = "subBtn ok";
			d.value = btn.confirm;
			d.type = "button";
			d.onclick = function() {
				closeAlertB(!0)
			};
			b.appendChild(d)
		})
	};
	this.closeAlertB = function(a) {
		var c = this.shAltBaObjOrId;
		hideCover(function() {
			var b = $("div.baConfirmCon")[0];
			document.body.removeChild(b);
			if (!0 == a && void 0 != c && ("object" == typeof c || 0 != c.length)) try {
				"object" != typeof c && (c = id(c)), c.focus(), c.select()
			} catch (d) {}
		})
	};
	this.showAlertC = function(a, c, b, d) {
		this.showCover(function() {
			var e = id("Error"),
				f = id("hsErr"),
				g, h = this;
			!0 == isIESix ? alert(a) : (this.shAltObjOrId = c, g = $("div.hsTip input.subBtn")[0], null == f && (f = document.createElement("div"), f.id = "hsErr", f.className = "hsTip", g = document.createElement("i"), g.className = "alertImg", f.appendChild(g), g = document.createElement("p"), g.className = "detailImg", f.appendChild(g), g = document.createElement("input"), g.type = "button", g.className = "subBtn ok", g.value = btn.ok, f.appendChild(g), e.appendChild(f)), getChildNode(f, "p").innerHTML = a, b && (f.style.marginLeft = "280px"), g.onclick = function() {
				d && d();
				h.closeAlertC(!0)
			}, e.style.visibility = "visible", e.style.display = "block", e.style.top = "90px", !1 == OS.portable ? setStyle(e, {
				position: "fixed"
			}) : setStyle(e, {
				position: "absolute"
			}), !1 == OS.iPhone && !1 == OS.iPad && g.focus(), this.alertTimeHd = $.setTimeout(function() {
				h.closeAlertC()
			}, 5E3))
		})
	};
	this.closeAlertC = function(a) {
		this.hideCover(function() {
			var c = id("Error"),
				b = this.shAltObjOrId;
			if (null != c) if (c.style.top = "-9999px", c.style.visibility = "hidden", clearTimeout(this.alertTimeHd), this.alertTimeHd = null, !0 != a || void 0 == b || "object" != typeof b && 0 == b.length) this.shAltObjOrId = "";
			else try {
				"object" != typeof b && (b = id(b)), b.focus(), b.select()
			} catch (d) {}
		})
	};
	this.showConfirm = function(a, c) {
		this.showCover(function() {
			var b = id("Confirm"),
				d = id("hsConf"),
				e, f = this;
			!0 == isIESix ? (b = confirm(a), this.closeConfirm(), c(b)) : (null == d && (d = document.createElement("div"), d.id = "hsConf", d.className = "hsTip", e = document.createElement("p"), e.className = "detail", d.appendChild(e), e = document.createElement("input"), e.type = "button", e.className = "subBtn ok", e.value = btn.ok, d.appendChild(e), e = document.createElement("input"), e.type = "button", e.className = "subBtn cancel", e.value = btn.cancel, d.appendChild(e), b.appendChild(d)), e = $("#hsConf input"), e[0].onclick = function() {
				f.closeConfirm();
				c(!0)
			}, e[1].onclick = function() {
				f.closeConfirm();
				c(!1)
			}, getChildNode(d, "p").innerHTML = a, b.style.visibility = "visible", b.style.display = "block", b.style.top = "90px", !1 == OS.portable ? setStyle(b, {
				position: "fixed"
			}) : setStyle(b, {
				position: "absolute"
			}))
		})
	};
	this.closeConfirm = function() {
		this.hideCover(function() {
			var a = id("Confirm");
			null != a && (a.style.top = "-9999px", a.style.visibility = "hidden")
		})
	};
	this.showConfirmB = function(a, c) {
		this.showCover(function() {
			var b = id("Confirm"),
				d = id("hsConf"),
				e, f = this;
			!0 == isIESix ? (b = confirm(a), this.closeConfirm(), c(b)) : (null == d && (d = document.createElement("div"), d.id = "hsConf", d.className = "hsTip", e = document.createElement("i"), e.className = "confirmImg", d.appendChild(e), e = document.createElement("p"), e.className = "detailImg", d.appendChild(e), e = document.createElement("input"), e.type = "button", e.className = "subBtn ok", e.value = btn.cloudRetry, d.appendChild(e), e = document.createElement("input"), e.type = "button", e.className = "subBtn cancel", e.value = btn.cloudBack, d.appendChild(e), b.appendChild(d)), e = $("#hsConf input"), e[0].onclick = function() {
				f.closeConfirm();
				c(!0)
			}, e[1].onclick = function() {
				f.closeConfirm();
				c(!1)
			}, getChildNode(d, "p").innerHTML = a, b.style.visibility = "visible", b.style.display = "block", b.style.top = "90px", !1 == OS.portable ? setStyle(b, {
				position: "fixed"
			}) : setStyle(b, {
				position: "absolute"
			}))
		})
	};
	this.closeConfirmB = function() {
		this.hideCover(function() {
			var a = id("Confirm");
			null != a && (a.style.top = "-9999px", a.style.visibility = "hidden")
		})
	};
	this.showNote = function(a, c) {
		var b = id(a);
		void 0 != b && (void 0 != c && ($("#" + a + " div.noteCon p")[0].innerHTML = c), b.style.visibility = "visible")
	};
	this.showNoteB = function(a, c, b) {
		var d = id(a),
			e;
		void 0 != d && (e = $("#" + a + " i.tip")[0], a = $("#" + a + " span")[0], void 0 != c && (a.innerHTML = c), a.className = void 0 != b ? b : "note", e.style.visibility = "visible", d.style.visibility = "visible")
	};
	this.closeNote = function(a) {
		var c = id(a);
		void 0 != c && (c.style.visibility = "hidden");
		try {
			$("#" + a + " i.tip").css("visibility", "hidden")
		} catch (b) {}
	};
	this.showLoading = function(a, c, b, d) {
		closeLoading();
		showCover(function(e) {
			var f, g, h, k, m;
			e = $("#" + e.id);
			g = 0.7;
			void 0 != b && (f = b.loadConClass, h = b.loadClass, k = b.coverLoadingClass, m = b.detailClass, g = b.coverOpacity || 0);
			e.css("opacity", g);
			g = el("div");
			g.className = "LoadConCover";
			document.body.appendChild(g);
			e = el("div");
			e.className = f || "coverLoadCon";
			g.appendChild(e);
			f = el("div");
			f.className = h || "coverLoad";
			e.appendChild(f);
			void 0 == k ? (h = el("img"), h.className = "coverLoading", h.src = "../web-static/images/loadingRouteSet.gif") : (h = el("i"), h.className = k);
			f.appendChild(h);
			k = el("p");
			k.className = m || "coverLoadNote";
			k.innerHTML = void 0 == a ? label.checkingWait : a;
			f.appendChild(k);
			d = void 0 == d ? !0 : d;
			!0 == d && (m = el("input"), m.type = "button", m.className = "coverLoadClose cancelBtn", m.value = btn.cancel, m.onclick = function() {
				closeLoading(c)
			}, f.appendChild(m))
		})
	};
	this.closeLoading = function(a) {
		var c = $("div.LoadConCover")[0];
		null != c && ($("#" + this.CoverId).css("opacity", ""), document.body.removeChild(c), hideCover(a))
	};
	this.showPhWzdAlert = function(a, c) {
		this.showCover(function() {
			var b, d, e, f = this;
			b = id("phWzdAlertCon");
			null == b ? (b = document.createElement("div"), b.className = "phWzdAlertCon", b.id = "phWzdAlertCon", document.body.appendChild(b), d = document.createElement("img"), d.src = "../web-static/images/redWarn.png", b.appendChild(d), d = document.createElement("p"), b.appendChild(d), e = document.createElement("label"), b.appendChild(e), e.innerHTML = btn.confirm) : (d = $("#phWzdAlertCon p")[0], e = $("#phWzdAlertCon label")[0]);
			b.style.top = "150px";
			b.style.visibility = "visible";
			d.innerHTML = a;
			e.onclick = function() {
				"function" == typeof c && c();
				f.closePhWzdAlert()
			}
		})
	};
	this.closePhWzdAlert = function() {
		this.hideCover(function() {
			var a = id("phWzdAlertCon");
			null != a && (a.style.top = "-9999px")
		})
	}
}

function Select() {
	this.selectInitExtern = function(a, c, b, d, e) {
		selectInit(a, c, b, d, e, {
			className: "appSelOptsUl",
			colorN: "#FFFFFF",
			colorC: "#95AE31",
			fontColorN: "#3C3E43",
			fontColorC: "#FFFFFF",
			valueColor: "#FFFFFF",
			valueDisColor: "#95AE31",
			scrollBg: "#95AE31",
			scrollZIndex: "1009"
		})
	};
	this.selectInitEptMgt = function(a, c, b, d, e) {
		selectInit(a, c, b, d, e, {
			className: "eptMgtSelOptsUl",
			colorN: "#FFFFFF",
			colorC: "#F17E50",
			fontColorN: "#3C3E43",
			fontColorC: "#FFFFFF",
			valueColor: "#FFFFFF",
			valueDisColor: "#F17E50",
			scrollBg: "#F17E50",
			scrollZIndex: "1009"
		})
	};
	this.selectInit = function(a, c, b, d, e, f) {
		function g(a) {
			for (var b, c, d = a.childNodes, e = 0, f = d.length; e < f; e++) c = d[e], b = c.childNodes[0].style.visibility, c.style.backgroundColor = "visible" == b ? v : x, c.style.color = "visible" == b ? w : p;
			a.style.visibility = "hidden";
			a.style.top = "-9999px";
			a.parentNode.style.position = "static"
		}
		function h(b) {
			var c = id(a),
				e = b.parentNode,
				f = e.childNodes,
				g = $("#" + a + " span.value")[0];
			if (3 != b.childNodes[0].nodeType) {
				c.value = b.valueStr;
				g.value = b.valueStr;
				for (var h = 0, k = f.length; h < k; h++) f[h].childNodes[0].style.visibility = "hidden", f[h].style.backgroundColor = x, f[h].style.color = p;
				"visible" != b.childNodes[0].style.visibility && "undefined" != typeof d && d(b.valueStr, c);
				b.childNodes[0].style.visibility = "visible";
				b.style.backgroundColor = v;
				b.style.color = w;
				c = getChildNode(b, "span");
				c.className = "selCross";
				g.innerHTML = htmlEscape(b.childNodes[1].nodeValue);
				e.style.visibility = "hidden";
				e.style.top = "-9999px";
				e.parentNode.style.position = "static"
			}
		}
		function k(a) {
			for (var b = 0, c = a.length; b < c; b++) n = a[b], B = htmlEscape(getStrInMax(n.str.toString(), F)), t = "hidden", l = document.createElement("li"), void 0 == n.value && b == z || z == n.value ? (t = "visible", q.innerHTML = B, q.value = z, r.value = z, l.style.backgroundColor = v, l.style.color = w, l.innerHTML = "<span class='selCross' style='visibility:" + t + "'></span>" + B) : (l.style.color = p, l.innerHTML = "<span class='selCrossOut' style='visibility:" + t + "'></span>" + B), l.title = n.str, l.valueStr = void 0 != n.value ? n.value : b, l.className = "option", l.onclick = function(a) {
				a = a || window.event;
				h(this);
				stopProp(a)
			}, l.onmousemove = function(a) {
				a = a || window.event;
				a = a.srcElement || a.target;
				var b, c;
				if ("span" != a.tagName.toLowerCase()) {
					b = a.parentNode.childNodes;
					for (var d = 0, e = b.length; d < e; d++) c = b[d], c.style.backgroundColor = x, c.style.color = p, c = getChildNode(c, "span"), c.className = "selCrossOut";
					c = getChildNode(a, "span");
					c.className = "selCross";
					a.style.backgroundColor = v;
					a.style.color = w
				}
			}, u.appendChild(l)
		}
		function m(b) {
			var c = $("#" + s + a);
			$("ul." + s).each(function() {
				"visible" == this.style.visibility && g(this);
				return !0
			});
			c.css("visibility", "visible").css("top", "-1px");
			c[0].parentNode.style.position = "relative";
			stopProp(b)
		}
		var l, n, q, t = "hidden",
			u = document.createElement("ul"),
			r = id(a),
			s = "selOptsUl",
			x = "#FFFFFF",
			v = "#2BA2D8",
			p = "#3C3E43",
			w = "#FFFFFF",
			A = "#FFFFFF",
			G = "#B2B2B2",
			y, F, H, B, z = b;
		b = "#34A9DA";
		var C = 1001,
			D = 3,
			E = 3;
		void 0 != f && (s = f.className, x = f.colorN, v = f.colorC, p = f.fontColorN, w = f.fontColorC, A = f.valueColor, G = f.valueDisColor, b = void 0 == f.scrollBg ? b : f.scrollBg, C = void 0 == f.scrollZIndex ? C : f.scrollZIndex, D = void 0 == f.scrollMLeft ? D : f.scrollMLeft, E = void 0 == f.scrollMTop ? E : f.scrollMTop);
		f = r.parentNode;
		y = $("#" + a + " span.value");
		q = y[0];
		q.value = 0;
		H = parseInt(y.css("width"));
		y = (0.61 * parseInt(y.css("fontSize"))).toFixed(1);
		F = void 0 == e ? parseInt(H / y) : e;
		r.value = 0;
		u.className = s;
		u.id = s + a;
		f.appendChild(u);
		attachEvnt(document.body, "click", function() {
			var b = $("#" + s + a)[0];
			"undefined" != typeof b && g(b)
		});
		k(c);
		r.onclick = m;
		r.disable = function(a) {
			r.onclick = !0 == a ? null : m;
			q.style.color = !0 == a ? G : A
		};
		r.changeSel = function(b) {
			$("#" + s + a + " li");
			$("#" + s + a + " li").each(function() {
				if (this.valueStr == b) return h(this), !1
			})
		};
		r.resetOptions = function(a, b) {
			u.innerHTML = "";
			z = b || 0;
			k(a)
		};
		c = new NiceScroll(u.id);
		c.scrollTipOpacity(1);
		c.scrollTipSet({
			background: b
		});
		c.scrollBarSet({
			zIndex: C,
			mLeft: D,
			mTop: E
		});
		c.init()
	}
}

function Help() {
	var a = this;
	this.help = "Help";
	this.helpDetail = "helpDetail";
	this.helpContent = "helpContent";
	this.helpURL = "Help.htm";
	this.setHelpURL = function(a) {
		this.helpURL = a
	};
	this.helpInit = function() {
		var a = id(this.help),
			b, d, e = this;
		0 == a.innerHTML.length && (b = document.createElement("p"), b.className = "helpTop", b.onmousedown = this.draggableBind(this.help), a.appendChild(b), d = document.createElement("span"), d.className = "helpDes", d.innerHTML = label.help, b.appendChild(d), d = document.createElement("i"), d.onclick = function() {
			e.helpClose()
		}, d.className = "helpClose", b.appendChild(d), b = document.createElement("div"), b.id = "helpDetail", a.appendChild(b), b = document.createElement("div"), b.style.display = "none", b.id = this.helpContent, document.body.appendChild(b));
		loadPage(this.helpURL, this.helpContent)
	};
	this.touchMoveHd = function(c) {
		c = c || window.event;
		var b = c.touches[0].clientX,
			d = c.touches[0].clientY,
			e = id(a.help),
			b = b - a.mousePos.x,
			d = d - a.mousePos.y,
			f = document.body.clientWidth - e.offsetWidth,
			g = document.documentElement.scrollHeight - e.offsetHeight,
			b = 0 < b ? b : 0,
			d = 0 < d ? d : 0;
		e.style.left = (b > f ? f : b) + "px";
		e.style.top = (d > g ? g : d) + "px";
		eventPreventDefault(c);
		clearSelection(c)
	};
	this.touchEndHd = function(a) {
		detachEvnt(document, "touchmove", touchMoveHd);
		detachEvnt(document, "touchend", touchEndHd)
	};
	this.helpBind = function(a, b, d) {
		a && (a.onclick = function(a) {
			a = a || window.event;
			helpShow(b, a.target || a.srcElement, d)
		})
	};
	this.helpClose = function() {
		var a = id(this.help),
			b = id(this.helpDetail);
		null != b && null != a && (setStyle(a, {
			visibility: "hidden",
			top: "-9999px"
		}), b.innerHTML = "")
	};
	this.helpVisible = function(a) {
		var b = id(this.help),
			d = $(a).offset(),
			e = $("#basicContent").offset();
		setStyle(b, {
			visibility: "visible",
			top: e.top + "px",
			left: d.left - b.offsetWidth + a.offsetWidth + "px"
		})
	};
	this.helpDetailAppend = function(a) {
		var b = id(a);
		null != b && (a = id(this.helpDetail), a.innerHTML = b.outerHTML)
	};
	this.helpShow = function(a, b, d) {
		var e = $("#" + this.help + " p.helpTop");
		this.helpClose();
		e.attr("class", void 0 == d ? "helpTop" : "helpTop " + d);
		this.helpVisible(b);
		helpDetailAppend(a)
	};
	this.msMove = function(a, b, d) {
		var e = b.x - d.x;
		b = b.y - d.y;
		d = document.body.clientWidth - a.offsetWidth;
		var f = document.documentElement.scrollHeight - a.offsetHeight,
			e = 0 < e ? e : 0;
		b = 0 < b ? b : 0;
		a.style.left = (e > d ? d : e) + "px";
		a.style.top = (b > f ? f : b) + "px"
	};
	this.draggableBind = function(a) {
		var b = id(a);
		return function(a) {
			a = a ? a : window.event;
			a = getMousePos(a);
			var c = {
				x: a.x - b.offsetLeft,
				y: a.y - b.offsetTop
			};
			document.onmousemove = function(a) {
				a = a ? a : window.event;
				a = getMousePos(a);
				clearSelection();
				msMove(b, a, c)
			};
			document.onmouseup = function() {
				clearSelection();
				document.onmousemove = null;
				document.onmouseup = null
			}
		}
	};
	this.basicAppUpgradeInfoShow = function(a, b, d) {
		var e = id("basicAppUpgradeInfo"),
			f, g;
		a = $(a);
		var h = a.offset();
		null == e && (e = document.createElement("div"), e.id = "basicAppUpgradeInfo", document.body.appendChild(e), f = document.createElement("p"), f.className = "appsHelpTop", f.onmousedown = this.draggableBind(this.help), e.appendChild(f), g = document.createElement("span"), g.className = "helpDes", g.innerHTML = label.updateNoteStr, f.appendChild(g), g = document.createElement("i"), g.onclick = function() {
			e.style.display = "none";
			e.style.top = "-9999px"
		}, g.className = "helpClose", f.appendChild(g), f = document.createElement("div"), f.id = "basicAppUpgradeInfoDetail", f.className = "basicAppUpgradeInfoDetail", e.appendChild(f), f = new NiceScroll("basicAppUpgradeInfoDetail"), f.scrollTipOpacity(1), f.scrollTipSet({
			background: "#B0CB33"
		}), f.scrollBarSet({
			zIndex: "1004",
			mLeft: "10"
		}), f.init());
		e.style.top = h.top + a[0].offsetHeight + (d || 0) + "px";
		e.style.left = "515px";
		e.style.display = "block";
		id("basicAppUpgradeInfoDetail").innerHTML = "<pre>" + b + "</pre>"
	};
	this.basicAppUpgradeInfoClose = function() {
		var a = id("basicAppUpgradeInfo");
		null != a && (a.style.display = "none", a.style.top = "-9999px")
	}
}

function LanDetect() {
	this.lanDetectSuccess = !1;
	this.LAN_DETECT_TIME = 1E3;
	this.lanDetectTimeHd = null;
	this.lanDetectHandle = function(a) {
		!1 == $.result.timeout && !1 == this.lanDetectSuccess && (this.lanDetectSuccess = !0, clearTimeout(this.lanDetectTimeHd), a())
	};
	this.lanDetecting = function(a) {
		$.detect(function() {
			lanDetectHandle(a)
		});
		this.lanDetectTimeHd = $.setTimeout(function() {
			lanDetecting(a)
		}, this.LAN_DETECT_TIME)
	}
}

function ProgressBar() {
	this.progressBarHd = this.progressDeWidth = this.progressBar = null;
	this.initProgBar = function() {
		var a = id("ProgressBar"),
			c, b, d;
		null == a && (a = document.createElement("div"), a.id = "ProgressBar", document.body.appendChild(a), c = document.createElement("div"), c.className = "progressBarCon", a.appendChild(c), b = document.createElement("div"), b.className = "progressBarPCon", c.appendChild(b), d = document.createElement("p"), d.className = "progressBarPercent", b.appendChild(d), b = document.createElement("div"), b.className = "progressBarBg", c.appendChild(b), d = document.createElement("p"), d.className = "progressBarDe", b.appendChild(d), d = document.createElement("p"), d.className = "progressBarDes", c.appendChild(d));
		this.progressBar = a;
		this.progressDeWidth = 0
	};
	this.progRunning = function(a, c, b) {
		var d = $("div.progressBarBg"),
			e = $("p.progressBarDe"),
			f = $("p.progressBarPercent"),
			g = this.progressDeWidth + 2,
			h = parseInt(d.css("width")) - g - parseInt(e.css("paddingRight")),
			k = c / 100,
			m = 0,
			l = this;
		e.css("width", g + "px");
		h = parseFloat(h / 100);
		(function() {
			100 < m ? void 0 != b && b() : (!0 == a && (f[0].innerHTML = m + "%"), e.css("width", g + h * m + "px"), m++, l.progressBarHd = $.setTimeout(arguments.callee, k))
		})()
	};
	this.showProgBar = function(a, c, b, d) {
		this.showCover(function() {
			this.initProgBar();
			setStyle(this.progressBar, {
				display: "block",
				visibility: "visible",
				top: "0px"
			});
			void 0 == c && (c = statusStr.rebooting);
			d = void 0 == d ? !0 : d;
			$("div.progressBarPCon").css("visibility", !0 == d ? "visible" : "hidden");
			$("p.progressBarDes")[0].innerHTML = c;
			this.progRunning(d, a, b)
		})
	};
	this.initProgBarApps = function(a) {
		var c, b;
		null != this.progressBar && this.progressBar.parentNode.removeChild(this.progressBar);
		c = document.createElement("div");
		c.className = "ProgressBarApps";
		a.appendChild(c);
		b = document.createElement("p");
		b.className = "progressBarPercent";
		c.appendChild(b);
		a = document.createElement("div");
		a.className = "progressBarBg";
		c.appendChild(a);
		b = document.createElement("p");
		b.className = "progressBarDe";
		a.appendChild(b);
		this.progressBar = c;
		this.progressDeWidth = parseInt($(b).css("width"))
	};
	this.showProgBarApps = function(a, c, b) {
		var d = this;
		showCover(function(e) {
			$(e).css("opacity", "0");
			d.initProgBarApps(a);
			setStyle(d.progressBar, {
				display: "block",
				visibility: "visible",
				top: "0px"
			});
			d.progRunningP(!0, c, b, 1E3)
		})
	};
	this.progRunningP = function(a, c, b, d) {
		function e(c) {
			n = parseInt(c.count);
			q = c[ERR_CODE];
			ERR_PERCENT == n ? (t.closeProgBar(), "function" == typeof b && b(!1, q)) : (!0 == a && !1 == isNaN(n) && (100 <= n && (n = 100), g[0].innerHTML = n + "%"), k.css("width", m + l * n + "px"), 100 <= n && "function" == typeof b && b(!0))
		}
		var f = this.progressBar,
			g = $(f).find("p.progressBarPercent"),
			h = $(f).find("div.progressBarBg"),
			k = $(f).find("p.progressBarDe"),
			m = this.progressDeWidth + 2,
			l = parseInt(h.css("width")) - m - parseInt(k.css("paddingRight")),
			n = 0,
			q = ENONE,
			t = this;
		k.css("width", m + "px");
		l = parseFloat(l / 100);
		(function() {
			"function" == typeof c && c(e);
			t.progressBarHd = $.setTimeout(arguments.callee, d)
		})()
	};
	this.showProgBarP = function(a, c, b, d) {
		this.showCover(function() {
			this.initProgBar();
			setStyle(this.progressBar, {
				display: "block",
				visibility: "visible",
				top: "0px"
			});
			void 0 == a && (a = statusStr.rebooting);
			b = void 0 == b ? !0 : b;
			$("div.progressBarPCon").css("visibility", !0 == b ? "visible" : "hidden");
			$("p.progressBarDes")[0].innerHTML = a;
			this.progRunningP(b, c, d, 100)
		})
	};
	this.closeProgBar = function() {
		"function" == typeof hideCover && hideCover();
		setStyle(this.progressBar, {
			display: "none",
			visibility: "hidden",
			top: "-9999px"
		});
		clearTimeout(this.progressBarHd)
	}
}

function BlockGrid() {
	this._ops = {
		id: "",
		data: null,
		dataInfo: []
	};
	"function" != typeof BlockGrid.prototype.blockInit && (BlockGrid.prototype.blockInit = function(a) {
		this._optionsInit(a);
		this.create()
	}, BlockGrid.prototype._optionsInit = function(a) {
		var c, b;
		for (b in a) if (c = a[b], "undefined" != typeof this._ops[b]) if ("object" != typeof c || c instanceof Array || null == this._ops[b]) this._ops[b] = c;
		else for (var d in c) this._ops[b][d] = c[d]
	}, BlockGrid.prototype.create = function() {
		var a, c;
		this.con = id(this._ops.id);
		emptyNodes(this.con);
		for (var b = 0; b < this._ops.dataInfo.length; b++) {
			var d = this._ops.dataInfo[b],
				e = this._ops.data[b];
			a = document.createElement("li");
			a.onclick = function() {
				var a = $(this).find("i")[0],
					b = a.style.visibility;
				a.style.visibility = "visible" == b ? "hidden" : "visible"
			};
			a.innerHTML = d.str;
			c = document.createElement("i");
			a.appendChild(c);
			e == d.value && (c.style.visibility = "visible");
			this.con.appendChild(a)
		}
	}, BlockGrid.prototype.getData = function() {
		for (var a = $("#" + this._ops.id).find("i"), c = [], b, d = 0; d < a.length; d++) b = this._ops.dataInfo[d], b = "visible" == a[d].style.visibility ? b.value : b.unValue, c.push(b);
		return c
	})
}

function TimeControlSet() {
	this.ENABLED = "1";
	this.DISABLED = "0";
	this.ACTION_ADD = 0;
	this.ACTION_EDIT = 1;
	this.gTimeLimitItem = this.gTimeLimitKeyName = this.blockGrid = null;
	this.gTimeLimitAction = this.ACTION_ADD;
	this.netCtrlListCreate = function(a, c, b, d, e) {
		var f = id("netControlList"),
			g, h, k, m = document,
			l, n, q, t = 0,
			u = uciHostsInfo.optName.name,
			r = uciHostsInfo.optName.startTime,
			s = uciHostsInfo.optName.endTime,
			x = [label.Mon, label.Tue, label.Wen, label.Thu, label.Fri, label.Sta, label.Sun];
		emptyNodes(f);
		g = m.createElement("ul");
		f.appendChild(g);
		e = void 0 == e ? !1 : e;
		for (var v in a) {
			var p = "";
			t++;
			for (var w in a[v]) q = w, l = a[v][w];
			h = m.createElement("li");
			$(h).hover(function() {
				$(this).find("i").css("visibility", "visible")
			}, function() {
				$(this).find("i").css("visibility", "hidden")
			});
			g.appendChild(h);
			k = m.createElement("i");
			k.onclick = function(a, b) {
				return function() {
					c(a, b)
				}
			}(q, a);
			h.appendChild(k);
			h.onclick = function(a, c, f) {
				return function(g) {
					g = g || window.event;
					if (c != (g.target || g.srcElement)) {
						g = a[u];
						var h = a[r],
							k = a[s];
						gTimeLimitAction = ACTION_EDIT;
						gTimeLimitItem = a;
						gTimeLimitKeyName = f;
						n = objToWeekList(a);
						setNetControlPanel(g, h, k, n, b, d, e);
						netControlPanelDis(!0);
						beEdit = !0
					}
				}
			}(l, k, q);
			k = m.createElement("pre");
			k.innerHTML = htmlEscape(getStrInMax(l[u], 16));
			h.appendChild(k);
			k = m.createElement("span");
			k.innerHTML = !0 == e ? l[r] + label.wlanOn + " / " + l[s] + label.wlanOff : label.limitTime + label.colon + l[r] + " - " + l[s];
			h.appendChild(k);
			k = m.createElement("span");
			n = objToWeekList(l);
			for (var A in n) n[A] == ENABLED && (p += x[A] + label.sep);
			0 < p.length && (p = p.substring(0, p.length - 1));
			k.innerHTML = label.repeat + label.colon + p;
			h.appendChild(k)
		}
		f.num = t
	};
	this.objToWeekList = function(a) {
		var c = [],
			b = [uciHostsInfo.optName.mon, uciHostsInfo.optName.tue, uciHostsInfo.optName.wed, uciHostsInfo.optName.thu, uciHostsInfo.optName.fri, uciHostsInfo.optName.sat, uciHostsInfo.optName.sun],
			d;
		for (d in b) a[b[d]] == ENABLED ? c.push(ENABLED) : c.push(DISABLED);
		return c
	};
	this.weekListToObj = function(a, c) {
		var b = [uciHostsInfo.optName.mon, uciHostsInfo.optName.tue, uciHostsInfo.optName.wed, uciHostsInfo.optName.thu, uciHostsInfo.optName.fri, uciHostsInfo.optName.sat, uciHostsInfo.optName.sun],
			d;
		for (d in c) a[b[d]] = c[d]
	};
	this.initTimeOptions = function(a, c) {
		for (var b, d = 0; d < c; d++) b = d, 10 > d && (b = "0" + d), b = {
			str: b,
			value: b
		}, a.push(b)
	};
	this.setNetControlPanel = function(a, c, b, d, e, f, g) {
		var h = c.split(":");
		c = b.split(":");
		b = h[0];
		var h = h[1],
			k = c[0];
		c = c[1];
		netControlPanelInit(e, f, g);
		id("netControlName").value = a;
		id("beginHour").changeSel(b);
		id("beginMinute").changeSel(h);
		id("endHour").changeSel(k);
		id("endMinute").changeSel(c);
		blockGrid = new BlockGrid;
		blockGrid.blockInit({
			id: "netControlWeek",
			data: d,
			dataInfo: [{
				str: label.MonB,
				value: ENABLED,
				unValue: DISABLED
			}, {
				str: label.TueB,
				value: ENABLED,
				unValue: DISABLED
			}, {
				str: label.WenB,
				value: ENABLED,
				unValue: DISABLED
			}, {
				str: label.ThuB,
				value: ENABLED,
				unValue: DISABLED
			}, {
				str: label.FriB,
				value: ENABLED,
				unValue: DISABLED
			}, {
				str: label.StaB,
				value: ENABLED,
				unValue: DISABLED
			}, {
				str: label.SunB,
				value: ENABLED,
				unValue: DISABLED
			}]
		})
	};
	this.netControlPanelDis = function(a) {
		var c = id("VigNetControlCon");
		!0 === a ? showCoverB(function() {
			c.style.visibility = "visible";
			c.style.top = "150px"
		}) : hideCoverB(function() {
			c.style.visibility = "hidden";
			c.style.top = "-9999px"
		})
	};
	this.netControlPanelInit = function(a, c, b) {
		var d = id("VigNetControlCon"),
			e = [],
			f = [],
			g;
		null == d ? (d = document.createElement("div"), d.className = "VigNetControlCon", d.id = "VigNetControlCon", document.body.appendChild(d)) : emptyNodes(d);
		!0 == (void 0 == b ? !1 : b) ? (b = label.beginClock, g = label.endClock) : (b = label.beginTime, g = label.endTime);
		d.innerHTML = '<div class="vigNetControl" id="vigNetControl"><ul class="netControlLine"><label class="desc">' + label.periodDesc + '</label><input type="text" class="text timeDesc" id="netControlName" maxlength="32"></ul><ul class="netControlLine"><label class="desc">' + b + '</label><li class="netControlText"><span class="netSelectSpan"><span id="beginHour" class="select netSelect"><span class="value hsTimeCon"></span><i class="arrow eptArrow"></i></span></span><label>' + label.hour + '</label></li><li class="netControlText"><span class="netSelectSpan"><span id="beginMinute" class="select netSelect"><span class="value hsTimeCon"></span><i class="arrow eptArrow"></i></span></span><label>' + label.minute + '</label></li></ul><ul class="netControlLine"><label class="desc">' + g + '</label><li class="netControlText"><span class="netSelectSpan"><span id="endHour" class="select netSelect"><span class="value hsTimeCon"></span><i class="arrow eptArrow"></i></span></span><label>' + label.hour + '</label></li><li class="netControlText"><span class="netSelectSpan"><span id="endMinute" class="select netSelect"><span class="value hsTimeCon"></span><i class="arrow eptArrow"></i></span></span><label>' + label.minute + '</label></li></ul><ul class="netControlLine"><label class="desc">' + label.repeat + '</label><ul class="netControlWeek" id="netControlWeek"></ul></ul><div class="netControlBtn"><input type="button" class="subBtn eptBtnA" value="' + btn.ok + '" id="btnSaveWeek"><input type="button" class="cancelBtn eptBtnA" value="' + btn.cancel + '" id="btnCancelWeek"></div></div>';
		initTimeOptions(e, 24);
		initTimeOptions(f, 60);
		id("btnSaveWeek").onclick = a;
		id("btnCancelWeek").onclick = function() {
			netControlPanelDis(!1);
			beEdit = !1
		};
		"function" != typeof c && (c = selectInitEptMgt);
		c("beginHour", e, "0");
		c("beginMinute", f, "0");
		c("endHour", e, "0");
		c("endMinute", f, "0")
	}
}

function Slp() {
	this.ROLE_LOCAL = 0;
	this.ROLE_REMOTE = 1;
	this._gMedia = this._gController = "";
	this._gRole = ROLE_LOCAL;
	this.setController = function(a) {
		_gController = a
	};
	this.getController = function() {
		return _gController
	};
	this.setMedia = function(a) {
		_gMedia = a
	};
	this.getMedia = function() {
		return _gMedia
	};
	this.setRole = function(a) {
		_gRole = a
	};
	this.getRole = function() {
		return _gRole
	};
	this.initImagePath = function(a) {
		for (var c in imagePath) imagePath[c] = a + "/" + imagePath[c]
	};
	this.cloneObj = function(a) {
		var c = {};
		if ("object" != typeof a) return a;
		a.constructor == Array && (c = []);
		for (var b in a) c[b] = cloneObj(a[b]);
		return c
	};
	this.hideLeadingZeros = function(a) {
		return a.replace(/0*(\d+)/g, "$1")
	};
	this.calcNextIndex = function(a, c) {
		if (null == a || !(a instanceof Array)) return -1;
		var b = [],
			d;
		for (d in a) {
			var e = a[d][".name"];
			"undefined" != typeof e && "string" == typeof e && (e = e.replace(/^.*_(\d+)$/g, "$1"), b[e] = !0)
		}
		e = b.length;
		if (!/\D/g.test(c) && c >= e) return c;
		for (d = /\D/g.test(c) ? 1 : c; d <= e; d++) if ("undefined" == typeof b[d]) return d;
		return e + 1
	};
	this.formatTableData = function(a) {
		var c = [];
		if (null == a || !(a instanceof Array)) return c;
		for (var b in a) {
			var d = a[b],
				e;
			for (e in d) d[e][SEC_NAME] = e, c[b] = d[e]
		}
		return c
	}
}

function CloudCommon() {
	this.cloudAccountEmailList = [{
		key: "gmail.com",
		value: "https://mail.google.com"
	}, {
		key: "live.com",
		value: "http://mail.live.com"
	}, {
		key: "live.cn",
		value: "http://mail.live.com"
	}, {
		key: "hotmail.com",
		value: "http://mail.live.com"
	}, {
		key: "outlook.com",
		value: "http://mail.live.com"
	}, {
		key: "qq.com",
		value: "http://mail.qq.com"
	}, {
		key: "126.com",
		value: "http://mail.126.com"
	}, {
		key: "163.com",
		value: "http://mail.163.com"
	}, {
		key: "yeah.net",
		value: "http://mail.yeah.net"
	}, {
		key: "sina.com",
		value: "http://mail.sina.com.cn"
	}, {
		key: "sohu.com",
		value: "http://mail.sohu.com"
	}, {
		key: "21cn.com",
		value: "http://mail.21cn.com"
	}, {
		key: "sina.com.cn",
		value: "http://mail.sina.com.cn"
	}, {
		key: "tom.com",
		value: "http://mail.tom.com"
	}, {
		key: "sogou.com",
		value: "http://mail.sogou.com"
	}, {
		key: "foxmail.com",
		value: "http://mail.foxmail.com"
	}, {
		key: "188.com",
		value: "http://mail.188.com"
	}, {
		key: "wo.cn",
		value: "http://mail.wo.cn"
	}, {
		key: "189.cn",
		value: "http://mail.189.cn"
	}, {
		key: "139.com",
		value: "http://mail.10086.cn"
	}, {
		key: "eyou.com",
		value: "http://www.eyou.com"
	}, {
		key: "aliyun.com",
		value: "http://mail.aliyun.com"
	}, {
		key: "263.net",
		value: "http://mail.263.net"
	}, {
		key: "2980.com",
		value: "http://www.2980.com"
	}];
	this.emailLinkCheck = function(a) {
		for (var c in cloudAccountEmailList) {
			var b = cloudAccountEmailList[c];
			if (0 < a.indexOf(b.key)) return b.value
		}
		return null
	};
	this.gCloudColObj = {
		cloudBackHd: null,
		cloudBackBRHd: null,
		account: ""
	};
	this.cloudSetBackHd = function(a) {
		gCloudColObj.cloudBackHd = a
	};
	this.cloudGoBack = function() {
		var a = gCloudColObj.cloudBackHd;
		"function" == typeof a && a()
	};
	this.cloudSetBackBRHd = function(a) {
		gCloudColObj.cloudBackBRHd = a
	};
	this.cloudGoBackBR = function(a) {
		var c = gCloudColObj.cloudBackBRHd;
		hideCloudPage();
		"function" == typeof c && c(a)
	};
	this.gCloudAccountBR = {
		bodyHeight: 0,
		account: "",
		pwd: "",
		CAPTCHAR: "",
		accountType: "",
		success: !1,
		noteF: "",
		noteS: "",
		pwdLen: 0,
		softVersion: "",
		bFWzd: !1
	};
	this.showCloudPage = function(a) {
		var c = id(this.cloudPageId);
		null == c && (c = el("div"), c.id = this.cloudPageId, document.body.appendChild(c));
		loadPage(a, "CloudAccountPage", function(a) {
			ENONE == a[ERR_CODE] && cloudPageSetNodes(!0)
		}, {
			bClearPageTickArray: !1
		})
	};
	this.hideCloudPage = function() {
		try {
			var a = id(this.cloudPageId);
			emptyNodes(a);
			a.style.height = "0px";
			cloudPageSetNodes(!1)
		} catch (c) {}
	};
	this.cloudPageSetNodes = function(a) {
		var c = "none",
			b = "none",
			d, e = document.body.childNodes;
		!0 == a ? (b = "block", c = "none", gCloudAccountBR.bodyHeight = parseInt(document.body.offsetHeight), document.body.style.height = "auto") : (b = "none", c = "block", document.body.style.height = gCloudAccountBR.bodyHeight + "px");
		for (var f in e) d = e[f], void 0 != d.nodeName && "DIV" == d.nodeName.toUpperCase() && (d.id == this.cloudPageId ? setStyle(d, {
			display: b
		}) : "Con" == d.id ? !0 == a ? (d.style.visibility = "hidden", d.style.position = "absolute", d.style.top = "-9999px") : (d.style.visibility = "visible", d.style.position = "static", d.style.top = "0px") : d.id == this.loginId && d.id == this.coverId || setStyle(d, {
			display: c
		}));
		id(this.loginId).style.display = "none";
		id(this.coverId).style.display = "none"
	};
	this.cloudErrHandle = function(a) {
		switch (parseInt(a)) {
		case EINVCLOUDERRORGENERIC:
		case EINVCLOUDERRORPARSEJSON:
		case EINVCLOUDERRORPARSEJSONNULL:
		case EINVCLOUDERRORSERVERINTERNALERROR:
		case EINVCLOUDERRORPERMISSIONDENIED:
		case EINVCLOUDERRORPARSEJSONID:
			showStr = errStr.invNetworkErr;
			break;
		case EINVERRORPERMISSIONDENIED:
			showStr = errStr.invPermissionDeny;
			break;
		case EINVCLOUDERRORMETHODNOTFOUND:
		case EINVCLOUDERRORPARAMSNOTFOUND:
		case EINVCLOUDERRORPARAMSWRONGTYPE:
		case EINVCLOUDERRORPARAMSWRONGRANGE:
		case EINVCLOUDERRORINVALIDPARAMS:
			showStr = errStr.invRequestFail;
			break;
		case EINVCLOUDERRORBINDDEVICEERROR:
			showStr = errStr.invTPIDLgFail;
			break;
		case EINVCLOUDERRORUNBINDDEVICEERROR:
			showStr = errStr.invTPIDUnBindFail;
			break;
		case EINVCLOUDERRORHWIDNOTFOUND:
		case EINVCLOUDERRORFWIDNOTSUPPORTDEVICE:
			showStr = label.cloudDeviceInfoExpt;
			break;
		case EINVCLOUDERRORDEVICEALIASFORMATERROR:
			showStr = errStr.invRouterNameFormat;
			break;
		case EINVCLOUDERRORACCOUNTUSERNAMEFORMATERROR:
			showStr = errStr.invCloudAccountFmtErr;
			break;
		case EINVCLOUDERRORACCOUNTACTIVEMAILSENDFAIL:
		case EINVCLOUDERRORRESETMAILSENDFAIL:
			showStr = errStr.invCAPTCHASendFail;
			break;
		case EINVCLOUDERRORTOKENEXPRIED:
		case EINVCLOUDERRORTOKENINCORRECT:
			showStr = errStr.invTPIDTimeout;
			break;
		case EINVCLOUDERRORACCOUNTACTIVEFAIL:
		case EINVCLOUDERRORACCOUNTACTIVETIMEOUT:
			showStr = errStr.invAccountCheckFail;
			break;
		case EINVCLOUDERRORRESETPWDTIMEOUT:
		case EINVCLOUDERRORRESETPWDFAIL:
			showStr = errStr.invAccountRstPwdFail;
			break;
		default:
			return {
				result: !0
			}
		}
		return {
			result: !1,
			tip: showStr
		}
	}
}

function CloudAction() {
	this.cloudActionQueryStatusWaitHd = this.cloudActionQueryStatusHd = null;
	this.cloudActionQueryStoped = this.cloudActionStatusQuering = !1;
	this.CLOUD_STATUS_QUERY_TIMEOUT = 1E3;
	this.CLOUD_STATUS_QUERY_TIMEOUT_WAIT = 2E4;
	this.cloudCloseLoadingHandle = null;
	this._cloudExptStopHandle = function() {
		clearTimeout(cloudActionQueryStatusWaitHd);
		closeLoading();
		"function" == typeof cloudCloseLoadingHandle && cloudCloseLoadingHandle();
		_setCloudCloseLoadingHandle(null)
	};
	this._cloudQueryErrHandle = function(a, c) {
		var b = "";
		switch (parseInt(a)) {
		case ENONE:
			return !0;
		default:
			b = errStr.invRequestFail
		}
		_cloudExptStopHandle();
		showAlert(b, c);
		return !1
	};
	this._cloudGetActnErrHandle = function(a, c) {
		var b = "";
		switch (parseInt(a)) {
		case ENONE:
			return !0;
		case EINVSENDREQMSGFAILED:
			b = errStr.invSendReqMsgFailed;
			break;
		case ESYSBUSY:
		case EINVLASTOPTIONISNOTFINISHED:
			b = errStr.invLastOptionIsNotFinished;
			break;
		case ESYSTEM:
			b = errStr.invRequestFail;
			break;
		case ENOMEMORY:
			b = errStr.invMemoryOut;
			break;
		case EINVGETDATAFAILED:
			b = errStr.invGetDataFailed;
			break;
		case EINVPARAMETER:
			b = errStr.invParameter;
			break;
		case EINVREQUESTTIMEOUT:
			b = errStr.invRequestTimeout;
			break;
		case EINVDEVICEIDNOTEXIST:
		case EINVERRORDEVICEIDFORMATERROR:
		case EINVILLEGALDEVICE:
			b = label.cloudDeviceInfoExpt;
			break;
		default:
			b = cloudErrHandle(a);
			if (!1 == b.result) {
				b = b.tip;
				break
			}
			if ("function" == typeof c) return _cloudExptStopHandle(), c(a), !1;
			b = errStr.invRequestFail
		}
		_cloudExptStopHandle();
		showAlert(b);
		return !1
	};
	this.cloudAccountQueryStop = function() {
		cloudActionQueryStoped = !0;
		cloudActionStatusQuering = !1;
		clearTimeout(cloudActionQueryStatusHd);
		clearTimeout(cloudActionQueryStatusWaitHd);
		_cloudExptStopHandle()
	};
	this._cloudStatusDataOrg = function(a) {
		var c = {},
			b = cloudClientStatus;
		c[b.fileName] = {};
		c[b.fileName][KEY_NAME] = a;
		return c
	};
	this._setCloudCloseLoadingHandle = function(a) {
		cloudCloseLoadingHandle = a
	};
	this._cloudAccountStatus = function(a, c, b) {
		cloudActionStatusQuering = !0;
		$.query(_cloudStatusDataOrg(a), function(d) {
			if (_cloudGetActnErrHandle(d[ERR_CODE])) {
				var e = cloudClientStatus,
					f = parseInt(d[e.fileName][a][e.optName.actionStatus]),
					e = e.optValue.queryStatus;
				switch (f) {
				case e.idle:
				case e.max:
					_cloudGetActnErrHandle(EINVSENDREQMSGFAILED);
					break;
				case e.timeout:
					"function" == typeof b ? b() : _cloudGetActnErrHandle(EINVREQUESTTIMEOUT);
					break;
				case e.prepare:
				case e.trying:
					cloudActionQueryStatusHd = $.setTimeout(function() {
						_cloudAccountStatus(a, c, b)
					}, CLOUD_STATUS_QUERY_TIMEOUT);
					return;
				case e.failed:
				case e.success:
					c(d);
					break;
				default:
					_cloudGetActnErrHandle(void 0)
				}
				closeLoading(cloudCloseLoadingHandle);
				_setCloudCloseLoadingHandle(null);
				cloudActionStatusQuering = !1;
				clearTimeout(cloudActionQueryStatusWaitHd)
			}
		})
	};
	this._cloudActionQueryStatus = function(a, c, b, d, e) {
		!0 != cloudActionQueryStoped && (!0 == cloudActionStatusQuering && !1 == b ? _cloudGetActnErrHandle(EINVLASTOPTIONISNOTFINISHED) : (cloudActionStatusQuering = !1, clearTimeout(cloudActionQueryStatusHd), clearTimeout(cloudActionQueryStatusWaitHd), cloudActionQueryStatusWaitHd = $.setTimeout(function() {
			cloudActionStatusQuering = !1;
			clearTimeout(cloudActionQueryStatusHd);
			"function" == typeof d ? d() : _cloudGetActnErrHandle(EINVREQUESTTIMEOUT)
		}, CLOUD_STATUS_QUERY_TIMEOUT_WAIT), _cloudAccountStatus(a, c, function() {
			clearTimeout(cloudActionQueryStatusWaitHd);
			"function" == typeof e ? e() : _cloudGetActnErrHandle(EINVREQUESTTIMEOUT)
		})))
	};
	this.cloudAccountState = function(a, c) {
		var b = {},
			d = uciCloudConfig;
		b[d.fileName] = {};
		b[d.fileName][d.actionName.getAccountStat] = {};
		b[d.fileName][d.actionName.getAccountStat][d.optName.username] = a;
		cloudActionQueryStoped = !1;
		$.action(b, function(a) {
			if (!0 != cloudActionQueryStoped && !0 == _cloudGetActnErrHandle(a[ERR_CODE], c)) {
				var b = cloudClientStatus;
				_cloudActionQueryStatus(b.secName.getAccountStat, function(a) {
					_cloudQueryErrHandle(a[b.fileName][b.secName.getAccountStat][b.optName.errCode]) && (a = {}, a[d.fileName] = {}, a[d.fileName][KEY_NAME] = d.secName.deviceStatus, $.action(a, function(a) {
						!0 == _cloudGetActnErrHandle(a[ERR_CODE], c) && c(d.optValue.regestStatus == a[d.fileName][d.secName.deviceStatus])
					}, !0))
				}, !0)
			}
		}, !0)
	};
	this.cloudAccountRstPwdCheckCAPTCHA = function(a, c, b) {
		var d, e = {},
			f = uciCloudConfig;
		e[f.fileName] = {};
		d = e[f.fileName][f.actionName.checkResetPwdVerifyCode] = {};
		d[f.optName.username] = a;
		d[f.optName.verifyCode] = c;
		cloudActionQueryStoped = !1;
		$.action(e, function(a) {
			if (!0 != cloudActionQueryStoped && !0 == _cloudGetActnErrHandle(a[ERR_CODE], b)) {
				var c = cloudClientStatus;
				_cloudActionQueryStatus(c.secName.checkResetPwdVerifyCode, function(a) {
					b(a[c.fileName][c.secName.checkResetPwdVerifyCode][c.optName.errCode])
				}, !0)
			}
		}, !0)
	};
	this.cloudAccountRstPwdAC = function(a, c, b, d) {
		var e, f = {},
			g = uciCloudConfig;
		f[g.fileName] = {};
		e = f[g.fileName][g.actionName.getResetPwdVerifyCode] = {};
		e[g.optName.username] = a;
		e[g.optName.accountType] = c;
		cloudActionQueryStoped = !1;
		_setCloudCloseLoadingHandle(d);
		$.action(f, function(a) {
			if (!0 != cloudActionQueryStoped && !0 == _cloudGetActnErrHandle(a[ERR_CODE], b)) {
				var c = cloudClientStatus;
				_cloudActionQueryStatus(c.secName.getResetPwdVerifyCode, function(a) {
					b(a[c.fileName][c.secName.getResetPwdVerifyCode][c.optName.errCode])
				}, !0)
			}
		}, !0)
	};
	this.cloudAccountRstPwd = function(a, c, b, d, e, f) {
		var g, h = {},
			k = uciCloudConfig;
		h[k.fileName] = {};
		g = h[k.fileName][k.actionName.resetPassword] = {};
		g[k.optName.username] = a;
		g[k.optName.verifyCode] = b;
		g[k.optName.password] = c;
		g[k.optName.accountType] = d;
		cloudActionQueryStoped = !1;
		$.action(h, function(a) {
			if (!0 != cloudActionQueryStoped && !0 == _cloudGetActnErrHandle(a[ERR_CODE], e)) {
				var b = cloudClientStatus;
				_cloudActionQueryStatus(b.secName.resetPassword, function(a) {
					e(a[b.fileName][b.secName.resetPassword][b.optName.errCode])
				}, !0, f)
			}
		}, !0)
	};
	this.cloudAccountBind = function(a, c, b, d) {
		var e, f = {},
			g = uciCloudConfig;
		f[g.fileName] = {};
		e = f[g.fileName][g.actionName.bind] = {};
		e[g.optName.username] = a;
		e[g.optName.password] = c;
		cloudActionQueryStoped = !1;
		$.action(f, function(a) {
			if (!0 != cloudActionQueryStoped && !0 == _cloudGetActnErrHandle(a[ERR_CODE], b)) {
				var c = cloudClientStatus;
				_cloudActionQueryStatus(c.secName.bind, function(a) {
					b(a[c.fileName][c.secName.bind][c.optName.errCode])
				}, !0, d)
			}
		}, !0)
	};
	this.cloudAccountGetRegistAC = function(a, c, b, d) {
		var e, f = {},
			g = uciCloudConfig;
		f[g.fileName] = {};
		e = f[g.fileName][g.actionName.getRegVerifyCode] = {};
		e[g.optName.username] = a;
		e[g.optName.accountType] = c;
		cloudActionQueryStoped = !1;
		_setCloudCloseLoadingHandle(d);
		$.action(f, function(a) {
			if (!0 != cloudActionQueryStoped && !0 == _cloudGetActnErrHandle(a[ERR_CODE], b)) {
				var c = cloudClientStatus;
				_cloudActionQueryStatus(c.secName.getRegVerifyCode, function(a) {
					b(a[c.fileName][c.secName.getRegVerifyCode][c.optName.errCode])
				}, !0)
			}
		}, !0)
	};
	this.cloudAccountRegist = function(a, c, b, d, e, f) {
		var g, h = {},
			k = uciCloudConfig;
		h[k.fileName] = {};
		g = h[k.fileName][k.actionName.register] = {};
		g[k.optName.username] = a;
		g[k.optName.accountType] = c;
		g[k.optName.verifyCode] = d;
		g[k.optName.password] = b;
		cloudActionQueryStoped = !1;
		$.action(h, function(a) {
			if (!0 != cloudActionQueryStoped && !0 == _cloudGetActnErrHandle(a[ERR_CODE], e)) {
				var b = cloudClientStatus;
				_cloudActionQueryStatus(b.secName.register, function(a) {
					e(a[b.fileName][b.secName.register][b.optName.errCode])
				}, !0, f)
			}
		}, !0)
	};
	this.cloudAccountUnind = function(a, c) {
		var b = {},
			d = uciCloudConfig;
		b[d.fileName] = {};
		b[d.fileName][d.actionName.unbind] = {};
		cloudActionQueryStoped = !1;
		$.action(b, function(b) {
			if (!0 != cloudActionQueryStoped && !0 == _cloudGetActnErrHandle(b[ERR_CODE], a)) {
				var d = cloudClientStatus;
				_cloudActionQueryStatus(d.secName.unbind, function(b) {
					a(b[d.fileName][d.secName.unbind][d.optName.errCode])
				}, !0, c)
			}
		}, !0)
	};
	this.cloudAccountModifyPwd = function(a, c, b, d, e) {
		var f, g = {},
			h = uciCloudConfig;
		g[h.fileName] = {};
		f = g[h.fileName][h.actionName.modifyAccountPwd] = {};
		f[h.optName.oldPassword] = a;
		f[h.optName.newPassword] = c;
		cloudActionQueryStoped = !1;
		$.action(g, function(a) {
			if (!0 != cloudActionQueryStoped) if (!0 == _cloudGetActnErrHandle(a[ERR_CODE], b)) {
				var c = cloudClientStatus;
				_cloudActionQueryStatus(c.secName.modifyAccountPwd, function(a) {
					b(a[c.fileName][c.secName.modifyAccountPwd][c.optName.errCode])
				}, !0, d, e)
			} else hsLoading(!1)
		}, !0)
	};
	this.getAppsUninstalledInfo = function(a, c, b, d, e) {
		var f, g = {};
		g[uciAppInfo.fileName] = {};
		f = g[uciAppInfo.fileName][uciAppInfo.actionName.getUninstalledInfo] = {};
		f[uciAppInfo.dynOptName.start] = a;
		f[uciAppInfo.dynOptName.end] = c;
		cloudActionQueryStoped = !1;
		$.action(g, function(a) {
			if (!0 != cloudActionQueryStoped && !0 == _cloudGetActnErrHandle(a[ERR_CODE], b)) {
				var c = cloudClientStatus;
				_cloudActionQueryStatus(c.secName.getNotInstalledApps, function(a) {
					b(a[c.fileName][c.secName.getNotInstalledApps][c.optName.errCode])
				}, !0, d, e)
			}
		}, !0)
	};
	this.getAppsCanUpdateInfo = function(a, c, b, d, e) {
		var f, g = {};
		g[uciAppInfo.fileName] = {};
		f = g[uciAppInfo.fileName][uciAppInfo.actionName.getUpdateInfo] = {};
		f[uciAppInfo.dynOptName.start] = a;
		f[uciAppInfo.dynOptName.end] = c;
		cloudActionQueryStoped = !1;
		$.action(g, function(a) {
			if (!0 != cloudActionQueryStoped && !0 == _cloudGetActnErrHandle(a[ERR_CODE], b)) {
				var c = cloudClientStatus;
				_cloudActionQueryStatus(c.secName.getCanUpdateApps, function(a) {
					b(a[c.fileName][c.secName.getCanUpdateApps][c.optName.errCode])
				}, !0, d, e)
			}
		}, !0)
	}
}

function CloudUpgradePush() {
	this.pageCloudPush = !0;
	this.gOnlineUpgradeNote = "";
	this.upgradeErrCBCloudPush = null;
	this.gOnlineUpgradeFail = !1;
	this.errHandleCloudPush = function(a) {
		switch (a) {
		case ENONE:
			return !0;
		case EFWNOTSUPPORTED:
		case EFILETOOBIG:
		case EFWEXCEPTION:
			gOnlineUpgradeNote = errStr.fwFmtErr;
			break;
		case EFWNOTINFLANDBL:
		case EFWNEWEST:
			gOnlineUpgradeNote = errStr.fwNotSupported;
			break;
		case EINVMEMORYOUT:
		case EINVDOWNLOADFWFAILED:
		case EINVSENDREQMSGFAILED:
		case EINVREQUESTTIMEOUT:
		case EINVCONNECTTINGCLOUDSERVER:
		case EINVLASTOPTIONISNOTFINISHED:
		case ESYSBUSY:
			gOnlineUpgradeNote = errStr.fwDownLoadFailed;
			break;
		case EINVDEVICEIDNOTEXIST:
		case EINVERRORDEVICEIDFORMATERROR:
		case EINVILLEGALDEVICE:
			gOnlineUpgradeNote = label.cloudDeviceInfoExpt;
			break;
		default:
			gOnlineUpgradeNote = errStr.fwUpgradeFailed
		}
		$.setTimeout(upgradeFailHdCloudPush, 10);
		return !1
	};
	this.setUpgradeErrCBCloudPush = function(a) {
		this.upgradeErrCBCloudPush = a
	};
	this.upgradeFailHdCloudPush = function() {
		"function" == typeof this.upgradeErrCBCloudPush && (this.upgradeErrCBCloudPush(), this.upgradeErrCBCloudPush = null)
	};
	this.checkOnlineUpgrading = function(a) {
		var c = cloudClientStatus.fileName,
			b = {};
		b[c] = {};
		b[c][KEY_NAME] = cloudClientStatus.secName.clientInfo;
		!0 == $.local ? a() : $.query(b, function(b) {
			ENONE == b[ERR_CODE] ? (b = parseInt(b[c][cloudClientStatus.secName.clientInfo][cloudClientStatus.optName.fwDownloadStatus]), uciCloudConfig.optValue.cloudDownloading == b ? onlineUpgradeProgress() : a()) : a()
		})
	};
	this.onlineUpgradeProgress = function() {
		var a = cloudClientStatus.fileName;
		showProgBarP(statusStr.fwDownloading, function(c) {
			var b = {},
				d = {};
			b[a] = {};
			b[a][KEY_NAME] = cloudClientStatus.secName.clientInfo;
			$.query(b, function(b) {
				if (!0 == errHandleCloudPush(b[ERR_CODE])) {
					b = b[a][cloudClientStatus.secName.clientInfo];
					var f = parseInt(b[cloudClientStatus.optName.fwDownloadStatus]);
					d.count = uciCloudConfig.optValue.cloudDownloading == f || uciCloudConfig.optValue.cloudComplete == f ? parseInt(b[cloudClientStatus.optName.fwDownloadProgress]) : uciCloudConfig.optValue.cloudOutline == f ? ERR_PERCENT : 0
				} else d.count = ERR_PERCENT;
				d[ERR_CODE] = ENONE;
				c(d)
			}, !0)
		}, !0, function(a) {
			closeProgBar();
			!0 == a ? showProgBar(REBOOT_SECONDS, label.upgrading, function() {
				var a = window.location.href,
					c = a.indexOf("?");
				0 <= c && (a = a.substring(0, c));
				location.href = a
			}) : (gOnlineUpgradeNote = statusStr.fwDownLoadErr, upgradeFailHdCloudPush())
		})
	};
	this.checkFWVerSuccessCloudPush = function() {
		var a = uciCloudConfig.fileName,
			c = {};
		c[a] = {};
		c[a][uciCloudConfig.actionName.downloadFw] = null;
		$.action(c, function(a) {
			!0 == errHandleCloudPush(a[ERR_CODE]) && onlineUpgradeProgress()
		})
	};
	this.onlineUpgradeCheck = function(a, c, b) {
		function d() {
			var e = {};
			e[f] = {};
			e[f][KEY_NAME] = cloudClientStatus.secName.checkFwVer;
			$.query(e, function(e) {
				if (!0 == a(e[ERR_CODE])) switch (parseInt(e[f][cloudClientStatus.secName.checkFwVer][cloudClientStatus.optName.actionStatus])) {
				case 0:
				case 5:
					"function" == typeof c && c(e[f][cloudClientStatus.secName.checkFwVer][cloudClientStatus.optName.errCode]);
					break;
				case 4:
					"function" == typeof b && b();
					break;
				default:
					$.setTimeout(d, 500)
				} else "function" == typeof c && c()
			})
		}
		var e = uciCloudConfig.fileName,
			f = cloudClientStatus.fileName,
			g = {};
		g[e] = {};
		g[e][uciCloudConfig.actionName.checkFwVersion] = null;
		$.action(g, function(b) {
			!0 == a(b[ERR_CODE]) && d()
		})
	};
	this.onlineUpgrade = function(a, c) {
		this.upgradeErrCBCloudPush = a;
		this.gOnlineUpgradeNote = "";
		this.onlineUpgradeCheck(errHandleCloudPush, function() {
			gOnlineUpgradeNote = statusStr.fwDownLoadErr;
			upgradeFailHdCloudPush()
		}, function() {
			"function" == typeof c && c();
			checkFWVerSuccessCloudPush()
		})
	}
}

function Phone() {
	this.OS = {
		windows: !1,
		windowsPhone: !1,
		unixPC: !1,
		iPad: !1,
		iPhone: !1,
		iMacPC: !1,
		iPod: !1,
		android: !1,
		nokia: !1,
		player: !1,
		Android_UC: !1,
		portable: !1,
		checkDeviceMode: function() {
			var a = navigator.platform,
				c = navigator.userAgent;
			if (void 0 != a) if (0 <= a.indexOf("Win")) 0 <= c.indexOf("Windows Phone") ? this.portable = this.windows = this.windowsPhone = !0 : (this.windows = !0, this.portable = !1);
			else if (0 <= c.indexOf("NOKIA")) this.portable = this.nokia = !0;
			else if (0 <= c.indexOf("Android")) this.portable = this.android = !0;
			else if (0 <= a.indexOf("iPad")) this.portable = this.iPad = !0;
			else if (0 <= a.indexOf("iPhone")) this.portable = this.iPhone = !0;
			else if (0 <= a.indexOf("iPod")) this.portable = this.iPod = !0;
			else if (0 <= c.indexOf("Wii") || 0 <= c.indexOf("PLASTATION")) this.portable = this.player = !0;
			else if (0 <= a.indexOf("Mac")) this.iMacPC = !0, this.portable = !1;
			else {
				if (0 <= a.indexOf("X11") || 0 <= a.indexOf("Linux") && 0 > a.indexOf("arm")) this.unixPC = !0, this.portable = !1
			} else 0 <= c.indexOf("Android") ? this.portable = this.android = !0 : this.portable = 1024 <= document.body.clientWidth || 1024 <= document.body.clientHeight ? !1 : !0
		}
	};
	this.phoneSet = {
		bContinuePCSet: !1,
		bPhoneWizardSet: !1
	};
	OS.checkDeviceMode()
}(function() {
	Phone.call(window);
	Tool.call(window);
	PageFunc.call(window);
	Cover.call(window);
	Explorer.call(window);
	LocalStorageSD.call(window);
	HighSet.call(window);
	Basic.call(window);
	ShowTips.call(window);
	Select.call(window);
	LanDetect.call(window);
	ProgressBar.call(window);
	Help.call(window);
	BlockGrid.call(window);
	TimeControlSet.call(window);
	Slp.call(window);
	CloudUpgradePush.call(window);
	CloudAction.call(window);
	CloudCommon.call(window)
})();
