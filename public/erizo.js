(function(b, a) {
    b.version = "0.9.6";
    b.protocol = 1;
    b.transports = [];
    b.j = [];
    b.sockets = {};
    b.connect = function(c, d) {
        var e = b.util.parseUri(c),
            g, i;
        a && a.location && (e.protocol = e.protocol || a.location.protocol.slice(0, -1), e.host = e.host || (a.document ? a.document.domain : a.location.hostname), e.port = e.port || a.location.port);
        g = b.util.uniqueUri(e);
        var j = {
            host: e.host,
            secure: "https" == e.protocol,
            port: e.port || ("https" == e.protocol ? 443 : 80),
            query: e.query || ""
        };
        b.util.merge(j, d);
        if (j["force new connection"] || !b.sockets[g]) i = new b.Socket(j);
        !j["force new connection"] && i && (b.sockets[g] = i);
        i = i || b.sockets[g];
        return i.of(1 < e.path.length ? e.path : "")
    }
})("object" === typeof module ? module.exports : this.io = {}, this);
(function(b, a) {
    var c = b.util = {},
        d = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
        e = "source,protocol,authority,userInfo,user,password,host,port,relative,path,directory,file,query,anchor".split(",");
    c.parseUri = function(a) {
        for (var a = d.exec(a || ""), b = {}, f = 14; f--;) b[e[f]] = a[f] || "";
        return b
    };
    c.uniqueUri = function(b) {
        var d = b.protocol,
            f = b.host,
            b = b.port;
        "document" in
        a ? (f = f || document.domain, b = b || ("https" == d && "https:" !== document.location.protocol ? 443 : document.location.port)) : (f = f || "localhost", !b && "https" == d && (b = 443));
        return (d || "http") + "://" + f + ":" + (b || 80)
    };
    c.query = function(a, b) {
        var f = c.chunkQuery(a || ""),
            h = [];
        c.merge(f, c.chunkQuery(b || ""));
        for (var d in f) f.hasOwnProperty(d) && h.push(d + "=" + f[d]);
        return h.length ? "?" + h.join("&") : ""
    };
    c.chunkQuery = function(a) {
        for (var b = {}, a = a.split("&"), f = 0, h = a.length, d; f < h; ++f) d = a[f].split("="), d[0] && (b[d[0]] = d[1]);
        return b
    };
    var g = !1;
    c.load = function(b) {
        if ("document" in a && "complete" === document.readyState || g) return b();
        c.on(a, "load", b, !1)
    };
    c.on = function(a, b, f, h) {
        a.attachEvent ? a.attachEvent("on" + b, f) : a.addEventListener && a.addEventListener(b, f, h)
    };
    c.request = function(a) {
        if (a && "undefined" != typeof XDomainRequest) return new XDomainRequest;
        if ("undefined" != typeof XMLHttpRequest && (!a || c.ua.hasCORS)) return new XMLHttpRequest;
        if (!a) try {
            return new(window[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
        } catch (b) {}
        return null
    };
    "undefined" !=
    typeof window && c.load(function() {
        g = !0
    });
    c.defer = function(a) {
        if (!c.ua.webkit || "undefined" != typeof importScripts) return a();
        c.load(function() {
            setTimeout(a, 100)
        })
    };
    c.merge = function(a, b, f, h) {
        var h = h || [],
            f = "undefined" == typeof f ? 2 : f,
            d;
        for (d in b) b.hasOwnProperty(d) && 0 > c.indexOf(h, d) && ("object" !== typeof a[d] || !f ? (a[d] = b[d], h.push(b[d])) : c.merge(a[d], b[d], f - 1, h));
        return a
    };
    c.mixin = function(a, b) {
        c.merge(a.prototype, b.prototype)
    };
    c.inherit = function(a, b) {
        function f() {}
        f.prototype = b.prototype;
        a.prototype = new f
    };
    c.isArray = Array.isArray || function(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    };
    c.intersect = function(a, b) {
        for (var f = [], h = a.length > b.length ? a : b, d = a.length > b.length ? b : a, e = 0, g = d.length; e < g; e++) ~c.indexOf(h, d[e]) && f.push(d[e]);
        return f
    };
    c.indexOf = function(a, b, f) {
        for (var h = a.length, f = 0 > f ? 0 > f + h ? 0 : f + h : f || 0; f < h && a[f] !== b; f++);
        return h <= f ? -1 : f
    };
    c.toArray = function(a) {
        for (var b = [], f = 0, h = a.length; f < h; f++) b.push(a[f]);
        return b
    };
    c.ua = {};
    c.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function() {
        try {
            var a =
                new XMLHttpRequest
        } catch (b) {
            return !1
        }
        return void 0 != a.withCredentials
    }();
    c.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent)
})("undefined" != typeof io ? io : module.exports, this);
(function(b, a) {
    function c() {}
    b.EventEmitter = c;
    c.prototype.on = function(b, c) {
        this.$events || (this.$events = {});
        this.$events[b] ? a.util.isArray(this.$events[b]) ? this.$events[b].push(c) : this.$events[b] = [this.$events[b], c] : this.$events[b] = c;
        return this
    };
    c.prototype.addListener = c.prototype.on;
    c.prototype.once = function(a, b) {
        function c() {
            i.removeListener(a, c);
            b.apply(this, arguments)
        }
        var i = this;
        c.listener = b;
        this.on(a, c);
        return this
    };
    c.prototype.removeListener = function(b, c) {
        if (this.$events && this.$events[b]) {
            var g =
                this.$events[b];
            if (a.util.isArray(g)) {
                for (var i = -1, j = 0, f = g.length; j < f; j++)
                    if (g[j] === c || g[j].listener && g[j].listener === c) {
                        i = j;
                        break
                    }
                if (0 > i) return this;
                g.splice(i, 1);
                g.length || delete this.$events[b]
            } else(g === c || g.listener && g.listener === c) && delete this.$events[b]
        }
        return this
    };
    c.prototype.removeAllListeners = function(a) {
        this.$events && this.$events[a] && (this.$events[a] = null);
        return this
    };
    c.prototype.listeners = function(b) {
        this.$events || (this.$events = {});
        this.$events[b] || (this.$events[b] = []);
        a.util.isArray(this.$events[b]) ||
            (this.$events[b] = [this.$events[b]]);
        return this.$events[b]
    };
    c.prototype.emit = function(b) {
        if (!this.$events) return !1;
        var c = this.$events[b];
        if (!c) return !1;
        var g = Array.prototype.slice.call(arguments, 1);
        if ("function" == typeof c) c.apply(this, g);
        else if (a.util.isArray(c))
            for (var c = c.slice(), i = 0, j = c.length; i < j; i++) c[i].apply(this, g);
        else return !1;
        return !0
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a) {
    function c(a) {
        return 10 > a ? "0" + a : a
    }

    function d(a) {
        j.lastIndex = 0;
        return j.test(a) ? '"' + a.replace(j, function(a) {
            var b = k[a];
            return "string" === typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + a + '"'
    }

    function e(a, b) {
        var g, k, i, j, p = f,
            s, r = b[a];
        r instanceof Date && (r = isFinite(a.valueOf()) ? a.getUTCFullYear() + "-" + c(a.getUTCMonth() + 1) + "-" + c(a.getUTCDate()) + "T" + c(a.getUTCHours()) + ":" + c(a.getUTCMinutes()) + ":" + c(a.getUTCSeconds()) + "Z" : null);
        "function" === typeof m && (r = m.call(b, a,
            r));
        switch (typeof r) {
            case "string":
                return d(r);
            case "number":
                return isFinite(r) ? "" + r : "null";
            case "boolean":
            case "null":
                return "" + r;
            case "object":
                if (!r) return "null";
                f += h;
                s = [];
                if ("[object Array]" === Object.prototype.toString.apply(r)) {
                    j = r.length;
                    for (g = 0; g < j; g += 1) s[g] = e(g, r) || "null";
                    i = 0 === s.length ? "[]" : f ? "[\n" + f + s.join(",\n" + f) + "\n" + p + "]" : "[" + s.join(",") + "]";
                    f = p;
                    return i
                }
                if (m && "object" === typeof m) {
                    j = m.length;
                    for (g = 0; g < j; g += 1) "string" === typeof m[g] && (k = m[g], (i = e(k, r)) && s.push(d(k) + (f ? ": " : ":") + i))
                } else
                    for (k in r) Object.prototype.hasOwnProperty.call(r,
                        k) && (i = e(k, r)) && s.push(d(k) + (f ? ": " : ":") + i);
                i = 0 === s.length ? "{}" : f ? "{\n" + f + s.join(",\n" + f) + "\n" + p + "}" : "{" + s.join(",") + "}";
                f = p;
                return i
        }
    }
    if (a && a.parse) return b.JSON = {
        parse: a.parse,
        stringify: a.stringify
    };
    var g = b.JSON = {},
        i = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        j = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        f, h, k = {
            "\u0008": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\u000c": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        m;
    g.stringify = function(a, b, c) {
        var d;
        h = f = "";
        if ("number" === typeof c)
            for (d = 0; d < c; d += 1) h += " ";
        else "string" === typeof c && (h = c);
        if ((m = b) && "function" !== typeof b && ("object" !== typeof b || "number" !== typeof b.length)) throw Error("JSON.stringify");
        return e("", {
            "": a
        })
    };
    g.parse = function(a, b) {
        function f(a, h) {
            var c, d, e = a[h];
            if (e && "object" === typeof e)
                for (c in e) Object.prototype.hasOwnProperty.call(e, c) && (d = f(e, c), void 0 !== d ? e[c] = d : delete e[c]);
            return b.call(a, h, e)
        }
        var h, a = "" + a;
        i.lastIndex =
            0;
        i.test(a) && (a = a.replace(i, function(a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return h = eval("(" + a + ")"), "function" === typeof b ? f({
            "": h
        }, "") : h;
        throw new SyntaxError("JSON.parse");
    }
})("undefined" != typeof io ? io : module.exports, "undefined" !== typeof JSON ? JSON : void 0);
(function(b, a) {
    var c = b.parser = {},
        d = c.packets = "disconnect,connect,heartbeat,message,json,event,ack,error,noop".split(","),
        e = c.reasons = ["transport not supported", "client not handshaken", "unauthorized"],
        g = c.advice = ["reconnect"],
        i = a.JSON,
        j = a.util.indexOf;
    c.encodePacket = function(a) {
        var b = j(d, a.type),
            f = a.id || "",
            c = a.endpoint || "",
            t = a.ack,
            q = null;
        switch (a.type) {
            case "error":
                var u = a.reason ? j(e, a.reason) : "",
                    a = a.advice ? j(g, a.advice) : "";
                if ("" !== u || "" !== a) q = u + ("" !== a ? "+" + a : "");
                break;
            case "message":
                "" !== a.data &&
                    (q = a.data);
                break;
            case "event":
                q = {
                    name: a.name
                };
                a.args && a.args.length && (q.args = a.args);
                q = i.stringify(q);
                break;
            case "json":
                q = i.stringify(a.data);
                break;
            case "connect":
                a.qs && (q = a.qs);
                break;
            case "ack":
                q = a.ackId + (a.args && a.args.length ? "+" + i.stringify(a.args) : "")
        }
        b = [b, f + ("data" == t ? "+" : ""), c];
        null !== q && void 0 !== q && b.push(q);
        return b.join(":")
    };
    c.encodePayload = function(a) {
        var b = "";
        if (1 == a.length) return a[0];
        for (var f = 0, c = a.length; f < c; f++) b += "\ufffd" + a[f].length + "\ufffd" + a[f];
        return b
    };
    var f = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
    c.decodePacket = function(a) {
        var b = a.match(f);
        if (!b) return {};
        var c = b[2] || "",
            a = b[5] || "",
            o = {
                type: d[b[1]],
                endpoint: b[4] || ""
            };
        c && (o.id = c, o.ack = b[3] ? "data" : !0);
        switch (o.type) {
            case "error":
                b = a.split("+");
                o.reason = e[b[0]] || "";
                o.advice = g[b[1]] || "";
                break;
            case "message":
                o.data = a || "";
                break;
            case "event":
                try {
                    var j = i.parse(a);
                    o.name = j.name;
                    o.args = j.args
                } catch (q) {}
                o.args = o.args || [];
                break;
            case "json":
                try {
                    o.data = i.parse(a)
                } catch (u) {}
                break;
            case "connect":
                o.qs = a || "";
                break;
            case "ack":
                if (b = a.match(/^([0-9]+)(\+)?(.*)/))
                    if (o.ackId =
                        b[1], o.args = [], b[3]) try {
                        o.args = b[3] ? i.parse(b[3]) : []
                    } catch (v) {}
        }
        return o
    };
    c.decodePayload = function(a) {
        if ("\ufffd" == a.charAt(0)) {
            for (var b = [], f = 1, d = ""; f < a.length; f++) "\ufffd" == a.charAt(f) ? (b.push(c.decodePacket(a.substr(f + 1).substr(0, d))), f += Number(d) + 1, d = "") : d += a.charAt(f);
            return b
        }
        return [c.decodePacket(a)]
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a) {
    function c(a, b) {
        this.socket = a;
        this.sessid = b
    }
    b.Transport = c;
    a.util.mixin(c, a.EventEmitter);
    c.prototype.onData = function(b) {
        this.clearCloseTimeout();
        (this.socket.connected || this.socket.connecting || this.socket.reconnecting) && this.setCloseTimeout();
        if ("" !== b && (b = a.parser.decodePayload(b)) && b.length)
            for (var c = 0, g = b.length; c < g; c++) this.onPacket(b[c]);
        return this
    };
    c.prototype.onPacket = function(a) {
        this.socket.setHeartbeatTimeout();
        if ("heartbeat" == a.type) return this.onHeartbeat();
        if ("connect" ==
            a.type && "" == a.endpoint) this.onConnect();
        "error" == a.type && "reconnect" == a.advice && (this.open = !1);
        this.socket.onPacket(a);
        return this
    };
    c.prototype.setCloseTimeout = function() {
        if (!this.closeTimeout) {
            var a = this;
            this.closeTimeout = setTimeout(function() {
                a.onDisconnect()
            }, this.socket.closeTimeout)
        }
    };
    c.prototype.onDisconnect = function() {
        this.close && this.open && this.close();
        this.clearTimeouts();
        this.socket.onDisconnect();
        return this
    };
    c.prototype.onConnect = function() {
        this.socket.onConnect();
        return this
    };
    c.prototype.clearCloseTimeout =
        function() {
            this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null)
        };
    c.prototype.clearTimeouts = function() {
        this.clearCloseTimeout();
        this.reopenTimeout && clearTimeout(this.reopenTimeout)
    };
    c.prototype.packet = function(b) {
        this.send(a.parser.encodePacket(b))
    };
    c.prototype.onHeartbeat = function() {
        this.packet({
            type: "heartbeat"
        })
    };
    c.prototype.onOpen = function() {
        this.open = !0;
        this.clearCloseTimeout();
        this.socket.onOpen()
    };
    c.prototype.onClose = function() {
        this.open = !1;
        this.socket.onClose();
        this.onDisconnect()
    };
    c.prototype.prepareUrl = function() {
        var b = this.socket.options;
        return this.scheme() + "://" + b.host + ":" + b.port + "/" + b.resource + "/" + a.protocol + "/" + this.name + "/" + this.sessid
    };
    c.prototype.ready = function(a, b) {
        b.call(this)
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a, c) {
    function d(b) {
        this.options = {
            port: 80,
            secure: !1,
            document: "document" in c ? document : !1,
            resource: "socket.io",
            transports: a.transports,
            "connect timeout": 1E4,
            "try multiple transports": !0,
            reconnect: !0,
            "reconnection delay": 500,
            "reconnection limit": Infinity,
            "reopen delay": 3E3,
            "max reconnection attempts": 10,
            "sync disconnect on unload": !0,
            "auto connect": !0,
            "flash policy port": 10843
        };
        a.util.merge(this.options, b);
        this.reconnecting = this.connecting = this.open = this.connected = !1;
        this.namespaces = {};
        this.buffer = [];
        this.doBuffer = !1;
        if (this.options["sync disconnect on unload"] && (!this.isXDomain() || a.util.ua.hasCORS)) {
            var d = this;
            a.util.on(c, "unload", function() {
                d.disconnectSync()
            }, !1)
        }
        this.options["auto connect"] && this.connect()
    }

    function e() {}
    b.Socket = d;
    a.util.mixin(d, a.EventEmitter);
    d.prototype.of = function(b) {
        this.namespaces[b] || (this.namespaces[b] = new a.SocketNamespace(this, b), "" !== b && this.namespaces[b].packet({
            type: "connect"
        }));
        return this.namespaces[b]
    };
    d.prototype.publish = function() {
        this.emit.apply(this,
            arguments);
        var a, b;
        for (b in this.namespaces) this.namespaces.hasOwnProperty(b) && (a = this.of(b), a.$emit.apply(a, arguments))
    };
    d.prototype.handshake = function(b) {
        function c(a) {
            if (a instanceof Error) d.onError(a.message);
            else b.apply(null, a.split(":"))
        }
        var d = this,
            f = this.options,
            f = ["http" + (f.secure ? "s" : "") + ":/", f.host + ":" + f.port, f.resource, a.protocol, a.util.query(this.options.query, "t=" + +new Date)].join("/");
        if (this.isXDomain() && !a.util.ua.hasCORS) {
            var h = document.getElementsByTagName("script")[0],
                k = document.createElement("script");
            k.src = f + "&jsonp=" + a.j.length;
            h.parentNode.insertBefore(k, h);
            a.j.push(function(a) {
                c(a);
                k.parentNode.removeChild(k)
            })
        } else {
            var m = a.util.request();
            m.open("GET", f, !0);
            m.withCredentials = !0;
            m.onreadystatechange = function() {
                4 == m.readyState && (m.onreadystatechange = e, 200 == m.status ? c(m.responseText) : !d.reconnecting && d.onError(m.responseText))
            };
            m.send(null)
        }
    };
    d.prototype.getTransport = function(b) {
        for (var b = b || this.transports, c = 0, d; d = b[c]; c++)
            if (a.Transport[d] && a.Transport[d].check(this) && (!this.isXDomain() || a.Transport[d].xdomainCheck())) return new a.Transport[d](this,
                this.sessionid);
        return null
    };
    d.prototype.connect = function(b) {
        if (this.connecting) return this;
        var c = this;
        this.handshake(function(d, f, h, e) {
            function m(a) {
                c.transport && c.transport.clearTimeouts();
                c.transport = c.getTransport(a);
                if (!c.transport) return c.publish("connect_failed");
                c.transport.ready(c, function() {
                    c.connecting = !0;
                    c.publish("connecting", c.transport.name);
                    c.transport.open();
                    c.options["connect timeout"] && (c.connectTimeoutTimer = setTimeout(function() {
                        if (!c.connected && (c.connecting = !1, c.options["try multiple transports"])) {
                            c.remainingTransports ||
                                (c.remainingTransports = c.transports.slice(0));
                            for (var a = c.remainingTransports; 0 < a.length && a.splice(0, 1)[0] != c.transport.name;);
                            a.length ? m(a) : c.publish("connect_failed")
                        }
                    }, c.options["connect timeout"]))
                })
            }
            c.sessionid = d;
            c.closeTimeout = 1E3 * h;
            c.heartbeatTimeout = 1E3 * f;
            c.transports = e ? a.util.intersect(e.split(","), c.options.transports) : c.options.transports;
            c.setHeartbeatTimeout();
            m(c.transports);
            c.once("connect", function() {
                clearTimeout(c.connectTimeoutTimer);
                b && "function" == typeof b && b()
            })
        });
        return this
    };
    d.prototype.setHeartbeatTimeout = function() {
        clearTimeout(this.heartbeatTimeoutTimer);
        var a = this;
        this.heartbeatTimeoutTimer = setTimeout(function() {
            a.transport.onClose()
        }, this.heartbeatTimeout)
    };
    d.prototype.packet = function(a) {
        this.connected && !this.doBuffer ? this.transport.packet(a) : this.buffer.push(a);
        return this
    };
    d.prototype.setBuffer = function(a) {
        this.doBuffer = a;
        !a && this.connected && this.buffer.length && (this.transport.payload(this.buffer), this.buffer = [])
    };
    d.prototype.disconnect = function() {
        if (this.connected ||
            this.connecting) this.open && this.of("").packet({
            type: "disconnect"
        }), this.onDisconnect("booted");
        return this
    };
    d.prototype.disconnectSync = function() {
        a.util.request().open("GET", this.resource + "/" + a.protocol + "/" + this.sessionid, !0);
        this.onDisconnect("booted")
    };
    d.prototype.isXDomain = function() {
        var a = c.location.port || ("https:" == c.location.protocol ? 443 : 80);
        return this.options.host !== c.location.hostname || this.options.port != a
    };
    d.prototype.onConnect = function() {
        this.connected || (this.connected = !0, this.connecting = !1, this.doBuffer || this.setBuffer(!1), this.emit("connect"))
    };
    d.prototype.onOpen = function() {
        this.open = !0
    };
    d.prototype.onClose = function() {
        this.open = !1;
        clearTimeout(this.heartbeatTimeoutTimer)
    };
    d.prototype.onPacket = function(a) {
        this.of(a.endpoint).onPacket(a)
    };
    d.prototype.onError = function(a) {
        if (a && a.advice && "reconnect" === a.advice && (this.connected || this.connecting)) this.disconnect(), this.options.reconnect && this.reconnect();
        this.publish("error", a && a.reason ? a.reason : a)
    };
    d.prototype.onDisconnect = function(a) {
        var b =
            this.connected,
            c = this.connecting;
        this.open = this.connecting = this.connected = !1;
        if (b || c) this.transport.close(), this.transport.clearTimeouts(), b && (this.publish("disconnect", a), "booted" != a && this.options.reconnect && !this.reconnecting && this.reconnect())
    };
    d.prototype.reconnect = function() {
        function a() {
            if (c.connected) {
                for (var f in c.namespaces) c.namespaces.hasOwnProperty(f) && "" !== f && c.namespaces[f].packet({
                    type: "connect"
                });
                c.publish("reconnect", c.transport.name, c.reconnectionAttempts)
            }
            clearTimeout(c.reconnectionTimer);
            c.removeListener("connect_failed", b);
            c.removeListener("connect", b);
            c.reconnecting = !1;
            delete c.reconnectionAttempts;
            delete c.reconnectionDelay;
            delete c.reconnectionTimer;
            delete c.redoTransports;
            c.options["try multiple transports"] = h
        }

        function b() {
            if (c.reconnecting) {
                if (c.connected) return a();
                if (c.connecting && c.reconnecting) return c.reconnectionTimer = setTimeout(b, 1E3);
                c.reconnectionAttempts++ >= f ? c.redoTransports ? (c.publish("reconnect_failed"), a()) : (c.on("connect_failed", b), c.options["try multiple transports"] = !0, c.transport = c.getTransport(), c.redoTransports = !0, c.connect()) : (c.reconnectionDelay < d && (c.reconnectionDelay *= 2), c.connect(), c.publish("reconnecting", c.reconnectionDelay, c.reconnectionAttempts), c.reconnectionTimer = setTimeout(b, c.reconnectionDelay))
            }
        }
        this.reconnecting = !0;
        this.reconnectionAttempts = 0;
        this.reconnectionDelay = this.options["reconnection delay"];
        var c = this,
            f = this.options["max reconnection attempts"],
            h = this.options["try multiple transports"],
            d = this.options["reconnection limit"];
        this.options["try multiple transports"] = !1;
        this.reconnectionTimer = setTimeout(b, this.reconnectionDelay);
        this.on("connect", b)
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function(b, a) {
    function c(a, b) {
        this.socket = a;
        this.name = b || "";
        this.flags = {};
        this.json = new d(this, "json");
        this.ackPackets = 0;
        this.acks = {}
    }

    function d(a, b) {
        this.namespace = a;
        this.name = b
    }
    b.SocketNamespace = c;
    a.util.mixin(c, a.EventEmitter);
    c.prototype.$emit = a.EventEmitter.prototype.emit;
    c.prototype.of = function() {
        return this.socket.of.apply(this.socket, arguments)
    };
    c.prototype.packet = function(a) {
        a.endpoint = this.name;
        this.socket.packet(a);
        this.flags = {};
        return this
    };
    c.prototype.send = function(a, b) {
        var c = {
            type: this.flags.json ?
                "json" : "message",
            data: a
        };
        "function" == typeof b && (c.id = ++this.ackPackets, c.ack = !0, this.acks[c.id] = b);
        return this.packet(c)
    };
    c.prototype.emit = function(a) {
        var b = Array.prototype.slice.call(arguments, 1),
            c = b[b.length - 1],
            d = {
                type: "event",
                name: a
            };
        "function" == typeof c && (d.id = ++this.ackPackets, d.ack = "data", this.acks[d.id] = c, b = b.slice(0, b.length - 1));
        d.args = b;
        return this.packet(d)
    };
    c.prototype.disconnect = function() {
        "" === this.name ? this.socket.disconnect() : (this.packet({
            type: "disconnect"
        }), this.$emit("disconnect"));
        return this
    };
    c.prototype.onPacket = function(b) {
        function c() {
            d.packet({
                type: "ack",
                args: a.util.toArray(arguments),
                ackId: b.id
            })
        }
        var d = this;
        switch (b.type) {
            case "connect":
                this.$emit("connect");
                break;
            case "disconnect":
                if ("" === this.name) this.socket.onDisconnect(b.reason || "booted");
                else this.$emit("disconnect", b.reason);
                break;
            case "message":
            case "json":
                var j = ["message", b.data];
                "data" == b.ack ? j.push(c) : b.ack && this.packet({
                    type: "ack",
                    ackId: b.id
                });
                this.$emit.apply(this, j);
                break;
            case "event":
                j = [b.name].concat(b.args);
                "data" == b.ack && j.push(c);
                this.$emit.apply(this, j);
                break;
            case "ack":
                this.acks[b.ackId] && (this.acks[b.ackId].apply(this, b.args), delete this.acks[b.ackId]);
                break;
            case "error":
                if (b.advice) this.socket.onError(b);
                else "unauthorized" == b.reason ? this.$emit("connect_failed", b.reason) : this.$emit("error", b.reason)
        }
    };
    d.prototype.send = function() {
        this.namespace.flags[this.name] = !0;
        this.namespace.send.apply(this.namespace, arguments)
    };
    d.prototype.emit = function() {
        this.namespace.flags[this.name] = !0;
        this.namespace.emit.apply(this.namespace,
            arguments)
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a, c) {
    function d(b) {
        a.Transport.apply(this, arguments)
    }
    b.websocket = d;
    a.util.inherit(d, a.Transport);
    d.prototype.name = "websocket";
    d.prototype.open = function() {
        var b = a.util.query(this.socket.options.query),
            d = this,
            i;
        i || (i = c.MozWebSocket || c.WebSocket);
        this.websocket = new i(this.prepareUrl() + b);
        this.websocket.onopen = function() {
            d.onOpen();
            d.socket.setBuffer(!1)
        };
        this.websocket.onmessage = function(a) {
            d.onData(a.data)
        };
        this.websocket.onclose = function() {
            d.onClose();
            d.socket.setBuffer(!0)
        };
        this.websocket.onerror =
            function(a) {
                d.onError(a)
            };
        return this
    };
    d.prototype.send = function(a) {
        this.websocket.send(a);
        return this
    };
    d.prototype.payload = function(a) {
        for (var b = 0, c = a.length; b < c; b++) this.packet(a[b]);
        return this
    };
    d.prototype.close = function() {
        this.websocket.close();
        return this
    };
    d.prototype.onError = function(a) {
        this.socket.onError(a)
    };
    d.prototype.scheme = function() {
        return this.socket.options.secure ? "wss" : "ws"
    };
    d.check = function() {
        return "WebSocket" in c && !("__addTask" in WebSocket) || "MozWebSocket" in c
    };
    d.xdomainCheck = function() {
        return !0
    };
    a.transports.push("websocket")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function(b, a) {
    function c() {
        a.Transport.websocket.apply(this, arguments)
    }
    b.flashsocket = c;
    a.util.inherit(c, a.Transport.websocket);
    c.prototype.name = "flashsocket";
    c.prototype.open = function() {
        var b = this,
            c = arguments;
        WebSocket.__addTask(function() {
            a.Transport.websocket.prototype.open.apply(b, c)
        });
        return this
    };
    c.prototype.send = function() {
        var b = this,
            c = arguments;
        WebSocket.__addTask(function() {
            a.Transport.websocket.prototype.send.apply(b, c)
        });
        return this
    };
    c.prototype.close = function() {
        WebSocket.__tasks.length =
            0;
        a.Transport.websocket.prototype.close.call(this);
        return this
    };
    c.prototype.ready = function(b, e) {
        function g() {
            var a = b.options,
                f = a["flash policy port"],
                h = ["http" + (a.secure ? "s" : "") + ":/", a.host + ":" + a.port, a.resource, "static/flashsocket", "WebSocketMain" + (b.isXDomain() ? "Insecure" : "") + ".swf"];
            c.loaded || ("undefined" === typeof WEB_SOCKET_SWF_LOCATION && (WEB_SOCKET_SWF_LOCATION = h.join("/")), 843 !== f && WebSocket.loadFlashPolicyFile("xmlsocket://" + a.host + ":" + f), WebSocket.__initialize(), c.loaded = !0);
            e.call(i)
        }
        var i =
            this;
        if (document.body) return g();
        a.util.load(g)
    };
    c.check = function() {
        return "undefined" == typeof WebSocket || !("__initialize" in WebSocket) || !swfobject ? !1 : 10 <= swfobject.getFlashPlayerVersion().major
    };
    c.xdomainCheck = function() {
        return !0
    };
    "undefined" != typeof window && (WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = !0);
    a.transports.push("flashsocket")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports);
if ("undefined" != typeof window) var swfobject = function() {
    function b() {
        if (!B) {
            try {
                var a = n.getElementsByTagName("body")[0].appendChild(n.createElement("span"));
                a.parentNode.removeChild(a)
            } catch (b) {
                return
            }
            B = !0;
            for (var a = E.length, f = 0; f < a; f++) E[f]()
        }
    }

    function a(a) {
        B ? a() : E[E.length] = a
    }

    function c(a) {
        if (typeof x.addEventListener != p) x.addEventListener("load", a, !1);
        else if (typeof n.addEventListener != p) n.addEventListener("load", a, !1);
        else if (typeof x.attachEvent != p) t(x, "onload", a);
        else if ("function" == typeof x.onload) {
            var b =
                x.onload;
            x.onload = function() {
                b();
                a()
            }
        } else x.onload = a
    }

    function d() {
        var a = n.getElementsByTagName("body")[0],
            b = n.createElement(s);
        b.setAttribute("type", r);
        var f = a.appendChild(b);
        if (f) {
            var c = 0;
            (function() {
                if (typeof f.GetVariable != p) {
                    var h = f.GetVariable("$version");
                    h && (h = h.split(" ")[1].split(","), l.pv = [parseInt(h[0], 10), parseInt(h[1], 10), parseInt(h[2], 10)])
                } else if (10 > c) {
                    c++;
                    setTimeout(arguments.callee, 10);
                    return
                }
                a.removeChild(b);
                f = null;
                e()
            })()
        } else e()
    }

    function e() {
        var a = z.length;
        if (0 < a)
            for (var b = 0; b <
                a; b++) {
                var c = z[b].id,
                    h = z[b].callbackFn,
                    d = {
                        success: !1,
                        id: c
                    };
                if (0 < l.pv[0]) {
                    var e = o(c);
                    if (e)
                        if (q(z[b].swfVersion) && !(l.wk && 312 > l.wk)) v(c, !0), h && (d.success = !0, d.ref = g(c), h(d));
                        else if (z[b].expressInstall && i()) {
                        d = {};
                        d.data = z[b].expressInstall;
                        d.width = e.getAttribute("width") || "0";
                        d.height = e.getAttribute("height") || "0";
                        e.getAttribute("class") && (d.styleclass = e.getAttribute("class"));
                        e.getAttribute("align") && (d.align = e.getAttribute("align"));
                        for (var k = {}, e = e.getElementsByTagName("param"), m = e.length, t = 0; t <
                            m; t++) "movie" != e[t].getAttribute("name").toLowerCase() && (k[e[t].getAttribute("name")] = e[t].getAttribute("value"));
                        j(d, k, c, h)
                    } else f(e), h && h(d)
                } else if (v(c, !0), h) {
                    if ((c = g(c)) && typeof c.SetVariable != p) d.success = !0, d.ref = c;
                    h(d)
                }
            }
    }

    function g(a) {
        var b = null;
        if ((a = o(a)) && "OBJECT" == a.nodeName) typeof a.SetVariable != p ? b = a : (a = a.getElementsByTagName(s)[0]) && (b = a);
        return b
    }

    function i() {
        return !F && q("6.0.65") && (l.win || l.mac) && !(l.wk && 312 > l.wk)
    }

    function j(a, b, f, c) {
        F = !0;
        I = c || null;
        K = {
            success: !1,
            id: f
        };
        var d = o(f);
        if (d) {
            "OBJECT" ==
            d.nodeName ? (D = h(d), G = null) : (D = d, G = f);
            a.id = M;
            if (typeof a.width == p || !/%$/.test(a.width) && 310 > parseInt(a.width, 10)) a.width = "310";
            if (typeof a.height == p || !/%$/.test(a.height) && 137 > parseInt(a.height, 10)) a.height = "137";
            n.title = n.title.slice(0, 47) + " - Flash Player Installation";
            c = l.ie && l.win ? ["Active"].concat("").join("X") : "PlugIn";
            c = "MMredirectURL=" + x.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + c + "&MMdoctitle=" + n.title;
            b.flashvars = typeof b.flashvars != p ? b.flashvars + ("&" + c) : c;
            l.ie && l.win && 4 !=
                d.readyState && (c = n.createElement("div"), f += "SWFObjectNew", c.setAttribute("id", f), d.parentNode.insertBefore(c, d), d.style.display = "none", function() {
                    d.readyState == 4 ? d.parentNode.removeChild(d) : setTimeout(arguments.callee, 10)
                }());
            k(a, b, f)
        }
    }

    function f(a) {
        if (l.ie && l.win && 4 != a.readyState) {
            var b = n.createElement("div");
            a.parentNode.insertBefore(b, a);
            b.parentNode.replaceChild(h(a), b);
            a.style.display = "none";
            (function() {
                4 == a.readyState ? a.parentNode.removeChild(a) : setTimeout(arguments.callee, 10)
            })()
        } else a.parentNode.replaceChild(h(a),
            a)
    }

    function h(a) {
        var b = n.createElement("div");
        if (l.win && l.ie) b.innerHTML = a.innerHTML;
        else if (a = a.getElementsByTagName(s)[0])
            if (a = a.childNodes)
                for (var f = a.length, c = 0; c < f; c++) !(1 == a[c].nodeType && "PARAM" == a[c].nodeName) && 8 != a[c].nodeType && b.appendChild(a[c].cloneNode(!0));
        return b
    }

    function k(a, b, c) {
        var f, h = o(c);
        if (l.wk && 312 > l.wk) return f;
        if (h)
            if (typeof a.id == p && (a.id = c), l.ie && l.win) {
                var d = "",
                    e;
                for (e in a) a[e] != Object.prototype[e] && ("data" == e.toLowerCase() ? b.movie = a[e] : "styleclass" == e.toLowerCase() ? d +=
                    ' class="' + a[e] + '"' : "classid" != e.toLowerCase() && (d += " " + e + '="' + a[e] + '"'));
                e = "";
                for (var k in b) b[k] != Object.prototype[k] && (e += '<param name="' + k + '" value="' + b[k] + '" />');
                h.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + d + ">" + e + "</object>";
                H[H.length] = a.id;
                f = o(a.id)
            } else {
                k = n.createElement(s);
                k.setAttribute("type", r);
                for (var m in a) a[m] != Object.prototype[m] && ("styleclass" == m.toLowerCase() ? k.setAttribute("class", a[m]) : "classid" != m.toLowerCase() && k.setAttribute(m, a[m]));
                for (d in b) b[d] !=
                    Object.prototype[d] && "movie" != d.toLowerCase() && (a = k, e = d, m = b[d], c = n.createElement("param"), c.setAttribute("name", e), c.setAttribute("value", m), a.appendChild(c));
                h.parentNode.replaceChild(k, h);
                f = k
            }
        return f
    }

    function m(a) {
        var b = o(a);
        b && "OBJECT" == b.nodeName && (l.ie && l.win ? (b.style.display = "none", function() {
            if (4 == b.readyState) {
                var c = o(a);
                if (c) {
                    for (var f in c) "function" == typeof c[f] && (c[f] = null);
                    c.parentNode.removeChild(c)
                }
            } else setTimeout(arguments.callee, 10)
        }()) : b.parentNode.removeChild(b))
    }

    function o(a) {
        var b =
            null;
        try {
            b = n.getElementById(a)
        } catch (c) {}
        return b
    }

    function t(a, b, c) {
        a.attachEvent(b, c);
        C[C.length] = [a, b, c]
    }

    function q(a) {
        var b = l.pv,
            a = a.split(".");
        a[0] = parseInt(a[0], 10);
        a[1] = parseInt(a[1], 10) || 0;
        a[2] = parseInt(a[2], 10) || 0;
        return b[0] > a[0] || b[0] == a[0] && b[1] > a[1] || b[0] == a[0] && b[1] == a[1] && b[2] >= a[2] ? !0 : !1
    }

    function u(a, b, c, f) {
        if (!l.ie || !l.mac) {
            var h = n.getElementsByTagName("head")[0];
            if (h) {
                c = c && "string" == typeof c ? c : "screen";
                f && (J = y = null);
                if (!y || J != c) f = n.createElement("style"), f.setAttribute("type", "text/css"),
                    f.setAttribute("media", c), y = h.appendChild(f), l.ie && l.win && typeof n.styleSheets != p && 0 < n.styleSheets.length && (y = n.styleSheets[n.styleSheets.length - 1]), J = c;
                l.ie && l.win ? y && typeof y.addRule == s && y.addRule(a, b) : y && typeof n.createTextNode != p && y.appendChild(n.createTextNode(a + " {" + b + "}"))
            }
        }
    }

    function v(a, b) {
        if (N) {
            var c = b ? "visible" : "hidden";
            B && o(a) ? o(a).style.visibility = c : u("#" + a, "visibility:" + c)
        }
    }

    function w(a) {
        return null != /[\\\"<>\.;]/.exec(a) && typeof encodeURIComponent != p ? encodeURIComponent(a) : a
    }
    var p = "undefined",
        s = "object",
        r = "application/x-shockwave-flash",
        M = "SWFObjectExprInst",
        x = window,
        n = document,
        A = navigator,
        O = !1,
        E = [function() {
            O ? d() : e()
        }],
        z = [],
        H = [],
        C = [],
        D, G, I, K, B = !1,
        F = !1,
        y, J, N = !0,
        l = function() {
            var a = typeof n.getElementById != p && typeof n.getElementsByTagName != p && typeof n.createElement != p,
                b = A.userAgent.toLowerCase(),
                c = A.platform.toLowerCase(),
                f = c ? /win/.test(c) : /win/.test(b),
                c = c ? /mac/.test(c) : /mac/.test(b),
                b = /webkit/.test(b) ? parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1,
                h = !+"\v1",
                d = [0, 0, 0],
                e = null;
            if (typeof A.plugins != p && typeof A.plugins["Shockwave Flash"] == s) {
                if ((e = A.plugins["Shockwave Flash"].description) && !(typeof A.mimeTypes != p && A.mimeTypes[r] && !A.mimeTypes[r].enabledPlugin)) O = !0, h = !1, e = e.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), d[0] = parseInt(e.replace(/^(.*)\..*$/, "$1"), 10), d[1] = parseInt(e.replace(/^.*\.(.*)\s.*$/, "$1"), 10), d[2] = /[a-zA-Z]/.test(e) ? parseInt(e.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
            } else if (typeof x[["Active"].concat("Object").join("X")] != p) try {
                var k = new(window[["Active"].concat("Object").join("X")])("ShockwaveFlash.ShockwaveFlash");
                if (k && (e = k.GetVariable("$version"))) h = !0, e = e.split(" ")[1].split(","), d = [parseInt(e[0], 10), parseInt(e[1], 10), parseInt(e[2], 10)]
            } catch (m) {}
            return {
                w3: a,
                pv: d,
                wk: b,
                ie: h,
                win: f,
                mac: c
            }
        }();
    (function() {
        l.w3 && ((typeof n.readyState != p && "complete" == n.readyState || typeof n.readyState == p && (n.getElementsByTagName("body")[0] || n.body)) && b(), B || (typeof n.addEventListener != p && n.addEventListener("DOMContentLoaded", b, !1), l.ie && l.win && (n.attachEvent("onreadystatechange", function() {
            "complete" == n.readyState && (n.detachEvent("onreadystatechange",
                arguments.callee), b())
        }), x == top && function() {
            if (!B) {
                try {
                    n.documentElement.doScroll("left")
                } catch (a) {
                    setTimeout(arguments.callee, 0);
                    return
                }
                b()
            }
        }()), l.wk && function() {
            B || (/loaded|complete/.test(n.readyState) ? b() : setTimeout(arguments.callee, 0))
        }(), c(b)))
    })();
    (function() {
        l.ie && l.win && window.attachEvent("onunload", function() {
            for (var a = C.length, b = 0; b < a; b++) C[b][0].detachEvent(C[b][1], C[b][2]);
            a = H.length;
            for (b = 0; b < a; b++) m(H[b]);
            for (var c in l) l[c] = null;
            l = null;
            for (var f in swfobject) swfobject[f] = null;
            swfobject =
                null
        })
    })();
    return {
        registerObject: function(a, b, c, f) {
            if (l.w3 && a && b) {
                var h = {};
                h.id = a;
                h.swfVersion = b;
                h.expressInstall = c;
                h.callbackFn = f;
                z[z.length] = h;
                v(a, !1)
            } else f && f({
                success: !1,
                id: a
            })
        },
        getObjectById: function(a) {
            if (l.w3) return g(a)
        },
        embedSWF: function(b, c, f, h, d, e, m, o, g, t) {
            var u = {
                success: !1,
                id: c
            };
            l.w3 && !(l.wk && 312 > l.wk) && b && c && f && h && d ? (v(c, !1), a(function() {
                f += "";
                h += "";
                var a = {};
                if (g && typeof g === s)
                    for (var l in g) a[l] = g[l];
                a.data = b;
                a.width = f;
                a.height = h;
                l = {};
                if (o && typeof o === s)
                    for (var n in o) l[n] = o[n];
                if (m &&
                    typeof m === s)
                    for (var r in m) l.flashvars = typeof l.flashvars != p ? l.flashvars + ("&" + r + "=" + m[r]) : r + "=" + m[r];
                if (q(d)) n = k(a, l, c), a.id == c && v(c, !0), u.success = !0, u.ref = n;
                else {
                    if (e && i()) {
                        a.data = e;
                        j(a, l, c, t);
                        return
                    }
                    v(c, !0)
                }
                t && t(u)
            })) : t && t(u)
        },
        switchOffAutoHideShow: function() {
            N = !1
        },
        ua: l,
        getFlashPlayerVersion: function() {
            return {
                major: l.pv[0],
                minor: l.pv[1],
                release: l.pv[2]
            }
        },
        hasFlashPlayerVersion: q,
        createSWF: function(a, b, c) {
            if (l.w3) return k(a, b, c)
        },
        showExpressInstall: function(a, b, c, f) {
            l.w3 && i() && j(a, b, c, f)
        },
        removeSWF: function(a) {
            l.w3 &&
                m(a)
        },
        createCSS: function(a, b, c, f) {
            l.w3 && u(a, b, c, f)
        },
        addDomLoadEvent: a,
        addLoadEvent: c,
        getQueryParamValue: function(a) {
            var b = n.location.search || n.location.hash;
            if (b) {
                /\?/.test(b) && (b = b.split("?")[1]);
                if (null == a) return w(b);
                for (var b = b.split("&"), c = 0; c < b.length; c++)
                    if (b[c].substring(0, b[c].indexOf("=")) == a) return w(b[c].substring(b[c].indexOf("=") + 1))
            }
            return ""
        },
        expressInstallCallback: function() {
            if (F) {
                var a = o(M);
                a && D && (a.parentNode.replaceChild(D, a), G && (v(G, !0), l.ie && l.win && (D.style.display = "block")),
                    I && I(K));
                F = !1
            }
        }
    }
}();
(function() {
    if (!("undefined" == typeof window || window.WebSocket)) {
        var b = window.console;
        if (!b || !b.log || !b.error) b = {
            log: function() {},
            error: function() {}
        };
        swfobject.hasFlashPlayerVersion("10.0.0") ? ("file:" == location.protocol && b.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://..."), WebSocket = function(a, b, d, e, g) {
                var i = this;
                i.__id = WebSocket.__nextId++;
                WebSocket.__instances[i.__id] = i;
                i.readyState = WebSocket.CONNECTING;
                i.bufferedAmount = 0;
                i.__events = {};
                b ? "string" == typeof b && (b = [b]) : b = [];
                setTimeout(function() {
                    WebSocket.__addTask(function() {
                        WebSocket.__flash.create(i.__id, a, b, d || null, e || 0, g || null)
                    })
                }, 0)
            }, WebSocket.prototype.send = function(a) {
                if (this.readyState == WebSocket.CONNECTING) throw "INVALID_STATE_ERR: Web Socket connection has not been established";
                a = WebSocket.__flash.send(this.__id, encodeURIComponent(a));
                if (0 > a) return !0;
                this.bufferedAmount += a;
                return !1
            }, WebSocket.prototype.close = function() {
                this.readyState == WebSocket.CLOSED ||
                    this.readyState == WebSocket.CLOSING || (this.readyState = WebSocket.CLOSING, WebSocket.__flash.close(this.__id))
            }, WebSocket.prototype.addEventListener = function(a, b) {
                a in this.__events || (this.__events[a] = []);
                this.__events[a].push(b)
            }, WebSocket.prototype.removeEventListener = function(a, b) {
                if (a in this.__events)
                    for (var d = this.__events[a], e = d.length - 1; 0 <= e; --e)
                        if (d[e] === b) {
                            d.splice(e, 1);
                            break
                        }
            }, WebSocket.prototype.dispatchEvent = function(a) {
                for (var b = this.__events[a.type] || [], d = 0; d < b.length; ++d) b[d](a);
                (b = this["on" +
                    a.type]) && b(a)
            }, WebSocket.prototype.__handleEvent = function(a) {
                "readyState" in a && (this.readyState = a.readyState);
                "protocol" in a && (this.protocol = a.protocol);
                if ("open" == a.type || "error" == a.type) a = this.__createSimpleEvent(a.type);
                else if ("close" == a.type) a = this.__createSimpleEvent("close");
                else if ("message" == a.type) a = this.__createMessageEvent("message", decodeURIComponent(a.message));
                else throw "unknown event type: " + a.type;
                this.dispatchEvent(a)
            }, WebSocket.prototype.__createSimpleEvent = function(a) {
                if (document.createEvent &&
                    window.Event) {
                    var b = document.createEvent("Event");
                    b.initEvent(a, !1, !1);
                    return b
                }
                return {
                    type: a,
                    bubbles: !1,
                    cancelable: !1
                }
            }, WebSocket.prototype.__createMessageEvent = function(a, b) {
                if (document.createEvent && window.MessageEvent && !window.opera) {
                    var d = document.createEvent("MessageEvent");
                    d.initMessageEvent("message", !1, !1, b, null, null, window, null);
                    return d
                }
                return {
                    type: a,
                    data: b,
                    bubbles: !1,
                    cancelable: !1
                }
            }, WebSocket.CONNECTING = 0, WebSocket.OPEN = 1, WebSocket.CLOSING = 2, WebSocket.CLOSED = 3, WebSocket.__flash = null, WebSocket.__instances = {}, WebSocket.__tasks = [], WebSocket.__nextId = 0, WebSocket.loadFlashPolicyFile = function(a) {
                WebSocket.__addTask(function() {
                    WebSocket.__flash.loadManualPolicyFile(a)
                })
            }, WebSocket.__initialize = function() {
                if (!WebSocket.__flash)
                    if (WebSocket.__swfLocation && (window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation), window.WEB_SOCKET_SWF_LOCATION) {
                        var a = document.createElement("div");
                        a.id = "webSocketContainer";
                        a.style.position = "absolute";
                        WebSocket.__isFlashLite() ? (a.style.left = "0px", a.style.top = "0px") : (a.style.left =
                            "-100px", a.style.top = "-100px");
                        var c = document.createElement("div");
                        c.id = "webSocketFlash";
                        a.appendChild(c);
                        document.body.appendChild(a);
                        swfobject.embedSWF(WEB_SOCKET_SWF_LOCATION, "webSocketFlash", "1", "1", "10.0.0", null, null, {
                            hasPriority: !0,
                            swliveconnect: !0,
                            allowScriptAccess: "always"
                        }, null, function(a) {
                            a.success || b.error("[WebSocket] swfobject.embedSWF failed")
                        })
                    } else b.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf")
            }, WebSocket.__onFlashInitialized = function() {
                setTimeout(function() {
                    WebSocket.__flash =
                        document.getElementById("webSocketFlash");
                    WebSocket.__flash.setCallerUrl(location.href);
                    WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
                    for (var a = 0; a < WebSocket.__tasks.length; ++a) WebSocket.__tasks[a]();
                    WebSocket.__tasks = []
                }, 0)
            }, WebSocket.__onFlashEvent = function() {
                setTimeout(function() {
                    try {
                        for (var a = WebSocket.__flash.receiveEvents(), c = 0; c < a.length; ++c) WebSocket.__instances[a[c].webSocketId].__handleEvent(a[c])
                    } catch (d) {
                        b.error(d)
                    }
                }, 0);
                return !0
            }, WebSocket.__log = function(a) {
                b.log(decodeURIComponent(a))
            },
            WebSocket.__error = function(a) {
                b.error(decodeURIComponent(a))
            }, WebSocket.__addTask = function(a) {
                WebSocket.__flash ? a() : WebSocket.__tasks.push(a)
            }, WebSocket.__isFlashLite = function() {
                if (!window.navigator || !window.navigator.mimeTypes) return !1;
                var a = window.navigator.mimeTypes["application/x-shockwave-flash"];
                return !a || !a.enabledPlugin || !a.enabledPlugin.filename ? !1 : a.enabledPlugin.filename.match(/flashlite/i) ? !0 : !1
            }, window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION || (window.addEventListener ? window.addEventListener("load",
                function() {
                    WebSocket.__initialize()
                }, !1) : window.attachEvent("onload", function() {
                WebSocket.__initialize()
            }))) : b.error("Flash Player >= 10.0.0 is required.")
    }
})();
(function(b, a, c) {
    function d(b) {
        b && (a.Transport.apply(this, arguments), this.sendBuffer = [])
    }

    function e() {}
    b.XHR = d;
    a.util.inherit(d, a.Transport);
    d.prototype.open = function() {
        this.socket.setBuffer(!1);
        this.onOpen();
        this.get();
        this.setCloseTimeout();
        return this
    };
    d.prototype.payload = function(b) {
        for (var c = [], d = 0, f = b.length; d < f; d++) c.push(a.parser.encodePacket(b[d]));
        this.send(a.parser.encodePayload(c))
    };
    d.prototype.send = function(a) {
        this.post(a);
        return this
    };
    d.prototype.post = function(a) {
        function b() {
            if (4 ==
                this.readyState)
                if (this.onreadystatechange = e, f.posting = !1, 200 == this.status) f.socket.setBuffer(!1);
                else f.onClose()
        }

        function d() {
            this.onload = e;
            f.socket.setBuffer(!1)
        }
        var f = this;
        this.socket.setBuffer(!0);
        this.sendXHR = this.request("POST");
        c.XDomainRequest && this.sendXHR instanceof XDomainRequest ? this.sendXHR.onload = this.sendXHR.onerror = d : this.sendXHR.onreadystatechange = b;
        this.sendXHR.send(a)
    };
    d.prototype.close = function() {
        this.onClose();
        return this
    };
    d.prototype.request = function(b) {
        var c = a.util.request(this.socket.isXDomain()),
            d = a.util.query(this.socket.options.query, "t=" + +new Date);
        c.open(b || "GET", this.prepareUrl() + d, !0);
        if ("POST" == b) try {
            c.setRequestHeader ? c.setRequestHeader("Content-type", "text/plain;charset=UTF-8") : c.contentType = "text/plain"
        } catch (f) {}
        return c
    };
    d.prototype.scheme = function() {
        return this.socket.options.secure ? "https" : "http"
    };
    d.check = function(b, d) {
        try {
            var e = a.util.request(d),
                f = c.XDomainRequest && e instanceof XDomainRequest,
                h = (b && b.options && b.options.secure ? "https:" : "http:") != c.location.protocol;
            if (e && (!f ||
                    !h)) return !0
        } catch (k) {}
        return !1
    };
    d.xdomainCheck = function() {
        return d.check(null, !0)
    }
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function(b, a) {
    function c(b) {
        a.Transport.XHR.apply(this, arguments)
    }
    b.htmlfile = c;
    a.util.inherit(c, a.Transport.XHR);
    c.prototype.name = "htmlfile";
    c.prototype.get = function() {
        this.doc = new(window[["Active"].concat("Object").join("X")])("htmlfile");
        this.doc.open();
        this.doc.write("<html></html>");
        this.doc.close();
        this.doc.parentWindow.s = this;
        var b = this.doc.createElement("div");
        b.className = "socketio";
        this.doc.body.appendChild(b);
        this.iframe = this.doc.createElement("iframe");
        b.appendChild(this.iframe);
        var c =
            this,
            b = a.util.query(this.socket.options.query, "t=" + +new Date);
        this.iframe.src = this.prepareUrl() + b;
        a.util.on(window, "unload", function() {
            c.destroy()
        })
    };
    c.prototype._ = function(a, b) {
        this.onData(a);
        try {
            var c = b.getElementsByTagName("script")[0];
            c.parentNode.removeChild(c)
        } catch (i) {}
    };
    c.prototype.destroy = function() {
        if (this.iframe) {
            try {
                this.iframe.src = "about:blank"
            } catch (a) {}
            this.doc = null;
            this.iframe.parentNode.removeChild(this.iframe);
            this.iframe = null;
            CollectGarbage()
        }
    };
    c.prototype.close = function() {
        this.destroy();
        return a.Transport.XHR.prototype.close.call(this)
    };
    c.check = function() {
        if ("undefined" != typeof window && ["Active"].concat("Object").join("X") in window) try {
            return new(window[["Active"].concat("Object").join("X")])("htmlfile") && a.Transport.XHR.check()
        } catch (b) {}
        return !1
    };
    c.xdomainCheck = function() {
        return !1
    };
    a.transports.push("htmlfile")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a, c) {
    function d() {
        a.Transport.XHR.apply(this, arguments)
    }

    function e() {}
    b["xhr-polling"] = d;
    a.util.inherit(d, a.Transport.XHR);
    a.util.merge(d, a.Transport.XHR);
    d.prototype.name = "xhr-polling";
    d.prototype.open = function() {
        a.Transport.XHR.prototype.open.call(this);
        return !1
    };
    d.prototype.get = function() {
        function a() {
            if (4 == this.readyState)
                if (this.onreadystatechange = e, 200 == this.status) f.onData(this.responseText), f.get();
                else f.onClose()
        }

        function b() {
            this.onerror = this.onload = e;
            f.onData(this.responseText);
            f.get()
        }

        function d() {
            f.onClose()
        }
        if (this.open) {
            var f = this;
            this.xhr = this.request();
            c.XDomainRequest && this.xhr instanceof XDomainRequest ? (this.xhr.onload = b, this.xhr.onerror = d) : this.xhr.onreadystatechange = a;
            this.xhr.send(null)
        }
    };
    d.prototype.onClose = function() {
        a.Transport.XHR.prototype.onClose.call(this);
        if (this.xhr) {
            this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = e;
            try {
                this.xhr.abort()
            } catch (b) {}
            this.xhr = null
        }
    };
    d.prototype.ready = function(b, c) {
        var d = this;
        a.util.defer(function() {
            c.call(d)
        })
    };
    a.transports.push("xhr-polling")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function(b, a, c) {
    function d(b) {
        a.Transport["xhr-polling"].apply(this, arguments);
        this.index = a.j.length;
        var c = this;
        a.j.push(function(a) {
            c._(a)
        })
    }
    var e = c.document && "MozAppearance" in c.document.documentElement.style;
    b["jsonp-polling"] = d;
    a.util.inherit(d, a.Transport["xhr-polling"]);
    d.prototype.name = "jsonp-polling";
    d.prototype.post = function(b) {
        function c() {
            d();
            f.socket.setBuffer(!1)
        }

        function d() {
            f.iframe && f.form.removeChild(f.iframe);
            try {
                t = document.createElement('<iframe name="' + f.iframeId + '">')
            } catch (a) {
                t =
                    document.createElement("iframe"), t.name = f.iframeId
            }
            t.id = f.iframeId;
            f.form.appendChild(t);
            f.iframe = t
        }
        var f = this,
            h = a.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
        if (!this.form) {
            var e = document.createElement("form"),
                m = document.createElement("textarea"),
                o = this.iframeId = "socketio_iframe_" + this.index,
                t;
            e.className = "socketio";
            e.style.position = "absolute";
            e.style.top = "0px";
            e.style.left = "0px";
            e.style.display = "none";
            e.target = o;
            e.method = "POST";
            e.setAttribute("accept-charset", "utf-8");
            m.name = "d";
            e.appendChild(m);
            document.body.appendChild(e);
            this.form = e;
            this.area = m
        }
        this.form.action = this.prepareUrl() + h;
        d();
        this.area.value = a.JSON.stringify(b);
        try {
            this.form.submit()
        } catch (q) {}
        this.iframe.attachEvent ? t.onreadystatechange = function() {
            "complete" == f.iframe.readyState && c()
        } : this.iframe.onload = c;
        this.socket.setBuffer(!0)
    };
    d.prototype.get = function() {
        var b = this,
            c = document.createElement("script"),
            d = a.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
        this.script && (this.script.parentNode.removeChild(this.script),
            this.script = null);
        c.async = !0;
        c.src = this.prepareUrl() + d;
        c.onerror = function() {
            b.onClose()
        };
        d = document.getElementsByTagName("script")[0];
        d.parentNode.insertBefore(c, d);
        this.script = c;
        e && setTimeout(function() {
            var a = document.createElement("iframe");
            document.body.appendChild(a);
            document.body.removeChild(a)
        }, 100)
    };
    d.prototype._ = function(a) {
        this.onData(a);
        this.open && this.get();
        return this
    };
    d.prototype.ready = function(b, c) {
        var d = this;
        if (!e) return c.call(this);
        a.util.load(function() {
            c.call(d)
        })
    };
    d.check = function() {
        return "document" in
            c
    };
    d.xdomainCheck = function() {
        return !0
    };
    a.transports.push("jsonp-polling")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
var Erizo = Erizo || {};
Erizo.EventDispatcher = function(b) {
    var a = {};
    b.dispatcher = {};
    b.dispatcher.eventListeners = {};
    a.addEventListener = function(a, d) {
        void 0 === b.dispatcher.eventListeners[a] && (b.dispatcher.eventListeners[a] = []);
        b.dispatcher.eventListeners[a].push(d)
    };
    a.removeEventListener = function(a, d) {
        var e;
        e = b.dispatcher.eventListeners[a].indexOf(d); - 1 !== e && b.dispatcher.eventListeners[a].splice(e, 1)
    };
    a.dispatchEvent = function(a) {
        var d;
        L.Logger.debug("Event: " + a.type);
        for (d in b.dispatcher.eventListeners[a.type])
            if (b.dispatcher.eventListeners[a.type].hasOwnProperty(d)) b.dispatcher.eventListeners[a.type][d](a)
    };
    return a
};
Erizo.LicodeEvent = function(b) {
    var a = {};
    a.type = b.type;
    return a
};
Erizo.RoomEvent = function(b) {
    var a = Erizo.LicodeEvent(b);
    a.streams = b.streams;
    a.message = b.message;
    return a
};
Erizo.StreamEvent = function(b) {
    var a = Erizo.LicodeEvent(b);
    a.stream = b.stream;
    a.msg = b.msg;
    a.bandwidth = b.bandwidth;
    return a
};
Erizo.PublisherEvent = function(b) {
    return Erizo.LicodeEvent(b)
};
Erizo = Erizo || {};
Erizo.FcStack = function() {
    return {
        addStream: function() {}
    }
};
Erizo = Erizo || {};
Erizo.BowserStack = function(b) {
    var a = {},
        c = webkitRTCPeerConnection;
    a.pc_config = {
        iceServers: []
    };
    a.con = {
        optional: [{
            DtlsSrtpKeyAgreement: !0
        }]
    };
    void 0 !== b.stunServerUrl && a.pc_config.iceServers.push({
        url: b.stunServerUrl
    });
    (b.turnServer || {}).url && a.pc_config.iceServers.push({
        username: b.turnServer.username,
        credential: b.turnServer.password,
        url: b.turnServer.url
    });
    void 0 === b.audio && (b.audio = !0);
    void 0 === b.video && (b.video = !0);
    a.mediaConstraints = {
        offerToReceiveVideo: b.video,
        offerToReceiveAudio: b.audio
    };
    a.peerConnection =
        new c(a.pc_config, a.con);
    b.remoteDescriptionSet = !1;
    var d = function(a) {
        if (b.maxVideoBW) {
            var c = a.match(/m=video.*\r\n/);
            c == null && (c = a.match(/m=video.*\n/));
            if (c && c.length > 0) var d = c[0] + "b=AS:" + b.maxVideoBW + "\r\n",
                a = a.replace(c[0], d)
        }
        if (b.maxAudioBW) {
            c = a.match(/m=audio.*\r\n/);
            c == null && (c = a.match(/m=audio.*\n/));
            if (c && c.length > 0) {
                d = c[0] + "b=AS:" + b.maxAudioBW + "\r\n";
                a = a.replace(c[0], d)
            }
        }
        return a
    };
    a.close = function() {
        a.state = "closed";
        a.peerConnection.close()
    };
    b.localCandidates = [];
    a.peerConnection.onicecandidate =
        function(c) {
            if (c.candidate) {
                if (!c.candidate.candidate.match(/a=/)) c.candidate.candidate = "a=" + c.candidate.candidate;
                b.remoteDescriptionSet ? b.callback({
                    type: "candidate",
                    candidate: c.candidate
                }) : b.localCandidates.push(c.candidate)
            } else console.log("End of candidates.", a.peerConnection.localDescription)
        };
    a.peerConnection.onaddstream = function(b) {
        if (a.onaddstream) a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function(b) {
        if (a.onremovestream) a.onremovestream(b)
    };
    var e = function(a) {
            console.log("Error in Stack ",
                a)
        },
        g, i = function(c) {
            c.sdp = d(c.sdp);
            console.log("Set local description", c.sdp);
            g = c;
            a.peerConnection.setLocalDescription(g, function() {
                console.log("The final LocalDesc", a.peerConnection.localDescription);
                b.callback(a.peerConnection.localDescription)
            }, e)
        },
        j = function(c) {
            c.sdp = d(c.sdp);
            b.callback(c);
            g = c;
            a.peerConnection.setLocalDescription(c)
        };
    a.createOffer = function(b) {
        b === true ? a.peerConnection.createOffer(i, e, a.mediaConstraints) : a.peerConnection.createOffer(i, e)
    };
    a.addStream = function(b) {
        a.peerConnection.addStream(b)
    };
    b.remoteCandidates = [];
    a.processSignalingMessage = function(c) {
        console.log("Process Signaling Message", c);
        if (c.type === "offer") {
            c.sdp = d(c.sdp);
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(c));
            a.peerConnection.createAnswer(j, null, a.mediaConstraints);
            b.remoteDescriptionSet = true
        } else if (c.type === "answer") {
            console.log("Set remote description", c.sdp);
            c.sdp = d(c.sdp);
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(c), function() {
                b.remoteDescriptionSet = true;
                for (console.log("Candidates to be added: ",
                        b.remoteCandidates.length); b.remoteCandidates.length > 0;) {
                    console.log("Candidate :", b.remoteCandidates[b.remoteCandidates.length - 1]);
                    a.peerConnection.addIceCandidate(b.remoteCandidates.shift(), function() {}, e)
                }
                for (; b.localCandidates.length > 0;) b.callback({
                    type: "candidate",
                    candidate: b.localCandidates.shift()
                })
            }, function() {
                console.log("Error Setting Remote Description")
            })
        } else if (c.type === "candidate") {
            console.log("Message with candidate");
            try {
                var h;
                h = typeof c.candidate === "object" ? c.candidate : JSON.parse(c.candidate);
                h.candidate = h.candidate.replace(/a=/g, "");
                h.sdpMLineIndex = parseInt(h.sdpMLineIndex);
                h.sdpMLineIndex = h.sdpMid == "audio" ? 0 : 1;
                var k = new RTCIceCandidate(h);
                console.log("Remote Candidate", k);
                b.remoteDescriptionSet ? a.peerConnection.addIceCandidate(k, function() {}, e) : b.remoteCandidates.push(k)
            } catch (m) {
                L.Logger.error("Error parsing candidate", c.candidate)
            }
        }
    };
    return a
};
Erizo = Erizo || {};
Erizo.FirefoxStack = function(b) {
    var a = {},
        c = mozRTCPeerConnection,
        d = mozRTCSessionDescription,
        e = mozRTCIceCandidate;
    a.pc_config = {
        iceServers: []
    };
    void 0 !== b.stunServerUrl && a.pc_config.iceServers.push({
        url: b.stunServerUrl
    });
    (b.turnServer || {}).url && a.pc_config.iceServers.push({
        username: b.turnServer.username,
        credential: b.turnServer.password,
        url: b.turnServer.url
    });
    void 0 === b.audio && (b.audio = !0);
    void 0 === b.video && (b.video = !0);
    a.mediaConstraints = {
        offerToReceiveAudio: b.audio,
        offerToReceiveVideo: b.video,
        mozDontOfferDataChannel: !0
    };
    var g = function(a) {
            L.Logger.error("Error in Stack ", a)
        },
        i = !1;
    a.peerConnection = new c(a.pc_config, a.con);
    b.localCandidates = [];
    a.peerConnection.onicecandidate = function(a) {
        if (a.candidate) {
            i = true;
            if (!a.candidate.candidate.match(/a=/)) a.candidate.candidate = "a=" + a.candidate.candidate;
            if (b.remoteDescriptionSet) b.callback({
                type: "candidate",
                candidate: a.candidate
            });
            else {
                b.localCandidates.push(a.candidate);
                console.log("Local Candidates stored: ", b.localCandidates.length, b.localCandidates)
            }
        } else console.log("End of candidates.")
    };
    a.peerConnection.onaddstream = function(b) {
        if (a.onaddstream) a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function(b) {
        if (a.onremovestream) a.onremovestream(b)
    };
    var j = function(a) {
            if (b.video && b.maxVideoBW) {
                var c = a.match(/m=video.*\r\n/);
                c == null && (c = a.match(/m=video.*\n/));
                if (c && c.length > 0) var f = c[0] + "b=AS:" + b.maxVideoBW + "\r\n",
                    a = a.replace(c[0], f)
            }
            if (b.audio && b.maxAudioBW) {
                c = a.match(/m=audio.*\r\n/);
                c == null && (c = a.match(/m=audio.*\n/));
                if (c && c.length > 0) {
                    f = c[0] + "b=AS:" + b.maxAudioBW + "\r\n";
                    a = a.replace(c[0],
                        f)
                }
            }
            return a
        },
        f, h = function(a) {
            a.sdp = j(a.sdp);
            a.sdp = a.sdp.replace(/a=ice-options:google-ice\r\n/g, "");
            b.callback(a);
            f = a
        },
        k = function(c) {
            c.sdp = j(c.sdp);
            c.sdp = c.sdp.replace(/a=ice-options:google-ice\r\n/g, "");
            b.callback(c);
            f = c;
            a.peerConnection.setLocalDescription(f)
        };
    a.createOffer = function(b) {
        b === true ? a.peerConnection.createOffer(h, g, a.mediaConstraints) : a.peerConnection.createOffer(h, g)
    };
    a.addStream = function(b) {
        a.peerConnection.addStream(b)
    };
    b.remoteCandidates = [];
    b.remoteDescriptionSet = !1;
    a.close = function() {
        a.state =
            "closed";
        a.peerConnection.close()
    };
    a.processSignalingMessage = function(c) {
        if (c.type === "offer") {
            c.sdp = j(c.sdp);
            a.peerConnection.setRemoteDescription(new d(c), function() {
                a.peerConnection.createAnswer(k, function(a) {
                    L.Logger.error("Error", a)
                }, a.mediaConstraints);
                b.remoteDescriptionSet = true
            }, function(a) {
                L.Logger.error("Error setting Remote Description", a)
            })
        } else if (c.type === "answer") {
            console.log("Set remote and local description", c.sdp);
            c.sdp = j(c.sdp);
            a.peerConnection.setLocalDescription(f, function() {
                a.peerConnection.setRemoteDescription(new d(c),
                    function() {
                        b.remoteDescriptionSet = true;
                        for (L.Logger.info("Remote Description successfully set"); b.remoteCandidates.length > 0 && i;) {
                            L.Logger.info("Setting stored remote candidates");
                            a.peerConnection.addIceCandidate(b.remoteCandidates.shift())
                        }
                        for (; b.localCandidates.length > 0;) {
                            L.Logger.info("Sending Candidate from list");
                            b.callback({
                                type: "candidate",
                                candidate: b.localCandidates.shift()
                            })
                        }
                    },
                    function(a) {
                        L.Logger.error("Error Setting Remote Description", a)
                    })
            }, function(a) {
                L.Logger.error("Failure setting Local Description",
                    a)
            })
        } else if (c.type === "candidate") try {
            var h;
            h = typeof c.candidate === "object" ? c.candidate : JSON.parse(c.candidate);
            h.candidate = h.candidate.replace(/ generation 0/g, "");
            h.candidate = h.candidate.replace(/ udp /g, " UDP ");
            h.sdpMLineIndex = parseInt(h.sdpMLineIndex);
            var g = new e(h);
            if (b.remoteDescriptionSet && i)
                for (a.peerConnection.addIceCandidate(g); b.remoteCandidates.length > 0;) {
                    L.Logger.info("Setting stored remote candidates");
                    a.peerConnection.addIceCandidate(b.remoteCandidates.shift())
                } else b.remoteCandidates.push(g)
        } catch (q) {
            L.Logger.error("Error parsing candidate",
                c.candidate, q)
        }
    };
    return a
};
Erizo = Erizo || {};
Erizo.ChromeStableStack = function(b) {
    var a = {},
        c = webkitRTCPeerConnection;
    a.pc_config = {
        iceServers: []
    };
    a.con = {
        optional: [{
            DtlsSrtpKeyAgreement: !0
        }]
    };
    void 0 !== b.stunServerUrl && a.pc_config.iceServers.push({
        url: b.stunServerUrl
    });
    (b.turnServer || {}).url && a.pc_config.iceServers.push({
        username: b.turnServer.username,
        credential: b.turnServer.password,
        url: b.turnServer.url
    });
    void 0 === b.audio && (b.audio = !0);
    void 0 === b.video && (b.video = !0);
    a.mediaConstraints = {
        mandatory: {
            OfferToReceiveVideo: b.video,
            OfferToReceiveAudio: b.audio
        }
    };
    var d =
        function(a) {
            console.log("Error in Stack ", a)
        };
    a.peerConnection = new c(a.pc_config, a.con);
    var e = function(a) {
        if (b.video && b.maxVideoBW) {
            var a = a.replace(/b=AS:.*\r\n/g, ""),
                c = a.match(/m=video.*\r\n/);
            c == null && (c = a.match(/m=video.*\n/));
            if (c && c.length > 0) var f = c[0] + "b=AS:" + b.maxVideoBW + "\r\n",
                a = a.replace(c[0], f)
        }
        if (b.audio && b.maxAudioBW) {
            c = a.match(/m=audio.*\r\n/);
            c == null && (c = a.match(/m=audio.*\n/));
            if (c && c.length > 0) {
                f = c[0] + "b=AS:" + b.maxAudioBW + "\r\n";
                a = a.replace(c[0], f)
            }
        }
        return a
    };
    a.close = function() {
        a.state =
            "closed";
        a.peerConnection.close()
    };
    b.localCandidates = [];
    a.peerConnection.onicecandidate = function(a) {
        if (a.candidate) {
            if (!a.candidate.candidate.match(/a=/)) a.candidate.candidate = "a=" + a.candidate.candidate;
            a = {
                sdpMLineIndex: a.candidate.sdpMLineIndex,
                sdpMid: a.candidate.sdpMid,
                candidate: a.candidate.candidate
            };
            if (b.remoteDescriptionSet) b.callback({
                type: "candidate",
                candidate: a
            });
            else {
                b.localCandidates.push(a);
                L.Logger.info("Storing candidate: ", b.localCandidates.length, a)
            }
        } else console.log("End of candidates.")
    };
    a.peerConnection.onaddstream = function(b) {
        if (a.onaddstream) a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function(b) {
        if (a.onremovestream) a.onremovestream(b)
    };
    var g, i, j = function(a) {
            a.sdp = e(a.sdp);
            a.sdp = a.sdp.replace(/a=ice-options:google-ice\r\n/g, "");
            b.callback({
                type: a.type,
                sdp: a.sdp
            });
            g = a
        },
        f = function(c) {
            c.sdp = e(c.sdp);
            b.callback({
                type: c.type,
                sdp: c.sdp
            });
            g = c;
            a.peerConnection.setLocalDescription(c)
        };
    a.updateSpec = function(c, f) {
        if (c.maxVideoBW || c.maxAudioBW) {
            if (c.maxVideoBW) {
                L.Logger.debug("Maxvideo Requested",
                    c.maxVideoBW, "limit", b.limitMaxVideoBW);
                if (c.maxVideoBW > b.limitMaxVideoBW) c.maxVideoBW = b.limitMaxVideoBW;
                b.maxVideoBW = c.maxVideoBW;
                L.Logger.debug("Result", b.maxVideoBW)
            }
            if (c.maxAudioBW) {
                if (c.maxAudioBW > b.limitMaxAudioBW) c.maxAudioBW = b.limitMaxAudioBW;
                b.maxAudioBW = c.maxAudioBW
            }
            g.sdp = e(g.sdp);
            a.peerConnection.setLocalDescription(g, function() {
                    i.sdp = e(i.sdp);
                    a.peerConnection.setRemoteDescription(new RTCSessionDescription(i), function() {
                        b.remoteDescriptionSet = true;
                        b.callback({
                            type: "updatestream",
                            sdp: g.sdp
                        })
                    })
                },
                function(a) {
                    L.Logger.error("Error updating configuration", a);
                    f("error")
                })
        }
        if (c.minVideoBW) {
            L.Logger.debug("MinVideo Changed to ", c.minVideoBW);
            b.callback({
                type: "updatestream",
                minVideoBW: c.minVideoBW
            })
        }
    };
    a.createOffer = function(b) {
        b === true ? a.peerConnection.createOffer(j, d, a.mediaConstraints) : a.peerConnection.createOffer(j, d)
    };
    a.addStream = function(b) {
        a.peerConnection.addStream(b)
    };
    b.remoteCandidates = [];
    b.remoteDescriptionSet = !1;
    a.processSignalingMessage = function(c) {
        if (c.type === "offer") {
            c.sdp = e(c.sdp);
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(c), function() {
                a.peerConnection.createAnswer(f, function(a) {
                    L.Logger.error("Error: ", a)
                }, a.mediaConstraints);
                b.remoteDescriptionSet = true
            }, function(a) {
                L.Logger.error("Error setting Remote Description", a)
            })
        } else if (c.type === "answer") {
            console.log("Set remote and local description", c.sdp);
            c.sdp = e(c.sdp);
            i = c;
            a.peerConnection.setLocalDescription(g, function() {
                a.peerConnection.setRemoteDescription(new RTCSessionDescription(c), function() {
                    b.remoteDescriptionSet =
                        true;
                    for (console.log("Candidates to be added: ", b.remoteCandidates.length, b.remoteCandidates); b.remoteCandidates.length > 0;) a.peerConnection.addIceCandidate(b.remoteCandidates.shift());
                    for (console.log("Local candidates to send:", b.localCandidates.length); b.localCandidates.length > 0;) b.callback({
                        type: "candidate",
                        candidate: b.localCandidates.shift()
                    })
                })
            })
        } else if (c.type === "candidate") try {
            var d;
            d = typeof c.candidate === "object" ? c.candidate : JSON.parse(c.candidate);
            d.candidate = d.candidate.replace(/a=/g, "");
            d.sdpMLineIndex = parseInt(d.sdpMLineIndex);
            var m = new RTCIceCandidate(d);
            b.remoteDescriptionSet ? a.peerConnection.addIceCandidate(m) : b.remoteCandidates.push(m)
        } catch (o) {
            L.Logger.error("Error parsing candidate", c.candidate)
        }
    };
    return a
};
Erizo = Erizo || {};
Erizo.ChromeCanaryStack = function(b) {
    var a = {},
        c = webkitRTCPeerConnection;
    a.pc_config = {
        iceServers: []
    };
    a.con = {
        optional: [{
            DtlsSrtpKeyAgreement: !0
        }]
    };
    void 0 !== b.stunServerUrl && a.pc_config.iceServers.push({
        url: b.stunServerUrl
    });
    (b.turnServer || {}).url && a.pc_config.iceServers.push({
        username: b.turnServer.username,
        credential: b.turnServer.password,
        url: b.turnServer.url
    });
    if (void 0 === b.audio || b.nop2p) b.audio = !0;
    if (void 0 === b.video || b.nop2p) b.video = !0;
    a.mediaConstraints = {
        mandatory: {
            OfferToReceiveVideo: b.video,
            OfferToReceiveAudio: b.audio
        }
    };
    a.roapSessionId = 103;
    a.peerConnection = new c(a.pc_config, a.con);
    a.peerConnection.onicecandidate = function(c) {
        L.Logger.debug("PeerConnection: ", b.session_id);
        if (c.candidate) a.iceCandidateCount += 1;
        else if (L.Logger.debug("State: " + a.peerConnection.iceGatheringState), void 0 === a.ices && (a.ices = 0), a.ices += 1, 1 <= a.ices && a.moreIceComing) a.moreIceComing = !1, a.markActionNeeded()
    };
    var d = function(a) {
        if (b.maxVideoBW) {
            var c = a.match(/m=video.*\r\n/);
            if (c && 0 < c.length) var d = c[0] + "b=AS:" + b.maxVideoBW + "\r\n",
                a = a.replace(c[0],
                    d)
        }
        if (b.maxAudioBW && (c = a.match(/m=audio.*\r\n/)) && 0 < c.length) d = c[0] + "b=AS:" + b.maxAudioBW + "\r\n", a = a.replace(c[0], d);
        return a
    };
    a.processSignalingMessage = function(b) {
        L.Logger.debug("Activity on conn " + a.sessionId);
        b = JSON.parse(b);
        a.incomingMessage = b;
        "new" === a.state ? "OFFER" === b.messageType ? (b = {
                sdp: b.sdp,
                type: "offer"
            }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.state = "offer-received", a.markActionNeeded()) : a.error("Illegal message for this state: " + b.messageType + " in state " +
                a.state) : "offer-sent" === a.state ? "ANSWER" === b.messageType ? (b = {
                sdp: b.sdp,
                type: "answer"
            }, L.Logger.debug("Received ANSWER: ", b.sdp), b.sdp = d(b.sdp), a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.sendOK(), a.state = "established") : "pr-answer" === b.messageType ? (b = {
                sdp: b.sdp,
                type: "pr-answer"
            }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b))) : "offer" === b.messageType ? a.error("Not written yet") : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state) :
            "established" === a.state && ("OFFER" === b.messageType ? (b = {
                sdp: b.sdp,
                type: "offer"
            }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.state = "offer-received", a.markActionNeeded()) : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state))
    };
    a.addStream = function(b) {
        a.peerConnection.addStream(b);
        a.markActionNeeded()
    };
    a.removeStream = function() {
        a.markActionNeeded()
    };
    a.close = function() {
        a.state = "closed";
        a.peerConnection.close()
    };
    a.markActionNeeded = function() {
        a.actionNeeded = !0;
        a.doLater(function() {
            a.onstablestate()
        })
    };
    a.doLater = function(a) {
        window.setTimeout(a, 1)
    };
    a.onstablestate = function() {
        var b;
        if (a.actionNeeded) {
            if ("new" === a.state || "established" === a.state) a.peerConnection.createOffer(function(b) {
                b.sdp = d(b.sdp);
                L.Logger.debug("Changed", b.sdp);
                b.sdp !== a.prevOffer ? (a.peerConnection.setLocalDescription(b), a.state = "preparing-offer", a.markActionNeeded()) : L.Logger.debug("Not sending a new offer")
            }, null, a.mediaConstraints);
            else if ("preparing-offer" === a.state) {
                if (a.moreIceComing) return;
                a.prevOffer = a.peerConnection.localDescription.sdp;
                L.Logger.debug("Sending OFFER: " + a.prevOffer);
                a.sendMessage("OFFER", a.prevOffer);
                a.state = "offer-sent"
            } else if ("offer-received" === a.state) a.peerConnection.createAnswer(function(b) {
                a.peerConnection.setLocalDescription(b);
                a.state = "offer-received-preparing-answer";
                a.iceStarted ? a.markActionNeeded() : (L.Logger.debug((new Date).getTime() + ": Starting ICE in responder"), a.iceStarted = !0)
            }, null, a.mediaConstraints);
            else if ("offer-received-preparing-answer" === a.state) {
                if (a.moreIceComing) return;
                b = a.peerConnection.localDescription.sdp;
                a.sendMessage("ANSWER", b);
                a.state = "established"
            } else a.error("Dazed and confused in state " + a.state + ", stopping here");
            a.actionNeeded = !1
        }
    };
    a.sendOK = function() {
        a.sendMessage("OK")
    };
    a.sendMessage = function(b, c) {
        var d = {};
        d.messageType = b;
        d.sdp = c;
        "OFFER" === b ? (d.offererSessionId = a.sessionId, d.answererSessionId = a.otherSessionId, d.seq = a.sequenceNumber += 1, d.tiebreaker = Math.floor(429496723 * Math.random() + 1)) : (d.offererSessionId = a.incomingMessage.offererSessionId, d.answererSessionId =
            a.sessionId, d.seq = a.incomingMessage.seq);
        a.onsignalingmessage(JSON.stringify(d))
    };
    a.error = function(a) {
        throw "Error in RoapOnJsep: " + a;
    };
    a.sessionId = a.roapSessionId += 1;
    a.sequenceNumber = 0;
    a.actionNeeded = !1;
    a.iceStarted = !1;
    a.moreIceComing = !0;
    a.iceCandidateCount = 0;
    a.onsignalingmessage = b.callback;
    a.peerConnection.onopen = function() {
        if (a.onopen) a.onopen()
    };
    a.peerConnection.onaddstream = function(b) {
        if (a.onaddstream) a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function(b) {
        if (a.onremovestream) a.onremovestream(b)
    };
    a.peerConnection.oniceconnectionstatechange = function(b) {
        if (a.oniceconnectionstatechange) a.oniceconnectionstatechange(b.currentTarget.iceConnectionState)
    };
    a.onaddstream = null;
    a.onremovestream = null;
    a.state = "new";
    a.markActionNeeded();
    return a
};
Erizo = Erizo || {};
Erizo.sessionId = 103;
Erizo.Connection = function(b) {
    var a = {};
    b.session_id = Erizo.sessionId += 1;
    a.browser = Erizo.getBrowser();
    if ("undefined" !== typeof module && module.exports) L.Logger.error("Publish/subscribe video/audio streams not supported in erizofc yet"), a = Erizo.FcStack(b);
    else if ("mozilla" === a.browser) L.Logger.debug("Firefox Stack"), a = Erizo.FirefoxStack(b);
    else if ("bowser" === a.browser) L.Logger.debug("Bowser Stack"), a = Erizo.BowserStack(b);
    else if ("chrome-stable" === a.browser) L.Logger.debug("Stable!"), a = Erizo.ChromeStableStack(b);
    else throw L.Logger.debug("None!"), "WebRTC stack not available";
    a.updateSpec || (a.updateSpec = function(a, b) {
        L.Logger.error("Update Configuration not implemented in this browser");
        b && b("unimplemented")
    });
    return a
};
Erizo.getBrowser = function() {
    var b = "none";
    null !== window.navigator.userAgent.match("Firefox") ? b = "mozilla" : null !== window.navigator.userAgent.match("Bowser") ? b = "bowser" : null !== window.navigator.userAgent.match("Chrome") ? 26 <= window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1] && (b = "chrome-stable") : null !== window.navigator.userAgent.match("Safari") ? b = "bowser" : null !== window.navigator.userAgent.match("AppleWebKit") && (b = "bowser");
    return b
};
Erizo.GetUserMedia = function(b, a, c) {
    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (b.screen) switch (L.Logger.debug("Screen access requested"), Erizo.getBrowser()) {
        case "mozilla":
            L.Logger.debug("Screen sharing in Firefox");
            var d = {};
            void 0 != b.video.mandatory ? (d.video = b.video, d.video.mediaSource = "window") : d = {
                video: {
                    mediaSource: "window"
                }
            };
            navigator.getMedia(d, a, c);
            break;
        case "chrome-stable":
            L.Logger.debug("Screen sharing in Chrome");
            d = "okeephmleflklcdebijnponpabbmmgeo";
            b.extensionId && (L.Logger.debug("extensionId supplied, using " + b.extensionId), d = b.extensionId);
            L.Logger.debug("Screen access on chrome stable, looking for extension");
            try {
                chrome.runtime.sendMessage(d, {
                    getStream: !0
                }, function(d) {
                    var e = {};
                    if (d == void 0) {
                        L.Logger.debug("Access to screen denied");
                        c({
                            code: "Access to screen denied"
                        })
                    } else {
                        d = d.streamId;
                        if (b.video.mandatory != void 0) {
                            e.video = b.video;
                            e.video.mandatory.chromeMediaSource = "desktop";
                            e.video.mandatory.chromeMediaSourceId =
                                d
                        } else e = {
                            video: {
                                mandatory: {
                                    chromeMediaSource: "desktop",
                                    chromeMediaSourceId: d
                                }
                            }
                        };
                        navigator.getMedia(e, a, c)
                    }
                })
            } catch (e) {
                L.Logger.debug("Lynckia screensharing plugin is not accessible ");
                c({
                    code: "no_plugin_present"
                });
                break
            }
            break;
        default:
            L.Logger.debug("This browser does not support screenSharing")
    } else "undefined" !== typeof module && module.exports ? L.Logger.error("Video/audio streams not supported in erizofc yet") : navigator.getMedia(b, a, c)
};
Erizo = Erizo || {};
Erizo.Stream = function(b) {
    var a = Erizo.EventDispatcher(b),
        c;
    a.stream = b.stream;
    a.url = b.url;
    a.recording = b.recording;
    a.room = void 0;
    a.showing = !1;
    a.local = !1;
    a.video = b.video;
    a.audio = b.audio;
    a.screen = b.screen;
    a.videoSize = b.videoSize;
    a.extensionId = b.extensionId;
    if (void 0 !== a.videoSize && (!(a.videoSize instanceof Array) || 4 != a.videoSize.length)) throw Error("Invalid Video Size");
    if (void 0 === b.local || !0 === b.local) a.local = !0;
    a.getID = function() {
        return b.streamID
    };
    a.getAttributes = function() {
        return b.attributes
    };
    a.setAttributes =
        function() {
            L.Logger.error("Failed to set attributes data. This Stream object has not been published.")
        };
    a.updateLocalAttributes = function(a) {
        b.attributes = a
    };
    a.hasAudio = function() {
        return b.audio
    };
    a.hasVideo = function() {
        return b.video
    };
    a.hasData = function() {
        return b.data
    };
    a.hasScreen = function() {
        return b.screen
    };
    a.sendData = function() {
        L.Logger.error("Failed to send data. This Stream object has not that channel enabled.")
    };
    a.init = function() {
        try {
            if ((b.audio || b.video || b.screen) && void 0 === b.url) {
                L.Logger.debug("Requested access to local media");
                var c = b.video;
                (!0 == c || !0 == b.screen) && void 0 !== a.videoSize ? c = {
                    mandatory: {
                        minWidth: a.videoSize[0],
                        minHeight: a.videoSize[1],
                        maxWidth: a.videoSize[2],
                        maxHeight: a.videoSize[3]
                    }
                } : !0 == b.screen && void 0 === c && (c = !0);
                var e = {
                    video: c,
                    audio: b.audio,
                    fake: b.fake,
                    screen: b.screen,
                    extensionId: a.extensionId
                };
                L.Logger.debug(e);
                Erizo.GetUserMedia(e, function(b) {
                    L.Logger.info("User has granted access to local media.");
                    a.stream = b;
                    b = Erizo.StreamEvent({
                        type: "access-accepted"
                    });
                    a.dispatchEvent(b)
                }, function(b) {
                    L.Logger.error("Failed to get access to local media. Error code was " +
                        b.code + ".");
                    b = Erizo.StreamEvent({
                        type: "access-denied"
                    });
                    a.dispatchEvent(b)
                })
            } else {
                var g = Erizo.StreamEvent({
                    type: "access-accepted"
                });
                a.dispatchEvent(g)
            }
        } catch (i) {
            L.Logger.error("Error accessing to local media", i)
        }
    };
    a.close = function() {
        a.local && (void 0 !== a.room && a.room.unpublish(a), a.hide(), void 0 !== a.stream && a.stream.stop(), a.stream = void 0)
    };
    a.play = function(b, c) {
        c = c || {};
        a.elementID = b;
        if (a.hasVideo() || this.hasScreen()) {
            if (void 0 !== b) {
                var g = new Erizo.VideoPlayer({
                    id: a.getID(),
                    stream: a,
                    elementID: b,
                    options: c
                });
                a.player = g;
                a.showing = !0
            }
        } else a.hasAudio && (g = new Erizo.AudioPlayer({
            id: a.getID(),
            stream: a,
            elementID: b,
            options: c
        }), a.player = g, a.showing = !0)
    };
    a.stop = function() {
        a.showing && void 0 !== a.player && (a.player.destroy(), a.showing = !1)
    };
    a.show = a.play;
    a.hide = a.stop;
    c = function() {
        if (void 0 !== a.player && void 0 !== a.stream) {
            var b = a.player.video,
                c = document.defaultView.getComputedStyle(b),
                g = parseInt(c.getPropertyValue("width"), 10),
                i = parseInt(c.getPropertyValue("height"), 10),
                j = parseInt(c.getPropertyValue("left"), 10),
                c = parseInt(c.getPropertyValue("top"),
                    10),
                f = document.getElementById(a.elementID),
                h = document.defaultView.getComputedStyle(f),
                f = parseInt(h.getPropertyValue("width"), 10),
                h = parseInt(h.getPropertyValue("height"), 10),
                k = document.createElement("canvas");
            k.id = "testing";
            k.width = f;
            k.height = h;
            k.setAttribute("style", "display: none");
            k.getContext("2d").drawImage(b, j, c, g, i);
            return k
        }
        return null
    };
    a.getVideoFrameURL = function(a) {
        var b = c();
        return null !== b ? a ? b.toDataURL(a) : b.toDataURL() : null
    };
    a.getVideoFrame = function() {
        var a = c();
        return null !== a ? a.getContext("2d").getImageData(0,
            0, a.width, a.height) : null
    };
    a.updateConfiguration = function(b, c) {
        if (void 0 !== b)
            if (a.pc) a.pc.updateSpec(b, c);
            else return "This stream has not been published, ignoring"
    };
    return a
};
Erizo = Erizo || {};
Erizo.Room = function(b) {
    var a = Erizo.EventDispatcher(b),
        c, d, e, g, i, j;
    a.remoteStreams = {};
    a.localStreams = {};
    a.roomID = "";
    a.socket = {};
    a.state = 0;
    a.p2p = !1;
    a.addEventListener("room-disconnected", function() {
        var b, c;
        a.state = 0;
        for (b in a.remoteStreams) a.remoteStreams.hasOwnProperty(b) && (c = a.remoteStreams[b], j(c), delete a.remoteStreams[b], c = Erizo.StreamEvent({
            type: "stream-removed",
            stream: c
        }), a.dispatchEvent(c));
        a.remoteStreams = {};
        for (b in a.localStreams) a.localStreams.hasOwnProperty(b) && (c = a.localStreams[b], c.pc.close(),
            delete a.localStreams[b]);
        try {
            a.socket.disconnect()
        } catch (d) {
            L.Logger.debug("Socket already disconnected")
        }
        a.socket = void 0
    });
    j = function(a) {
        void 0 !== a.stream && (a.hide(), a.pc && a.pc.close(), a.local && a.stream.stop())
    };
    g = function(a, b) {
        a.local ? d("sendDataStream", {
            id: a.getID(),
            msg: b
        }) : L.Logger.error("You can not send data through a remote stream")
    };
    i = function(a, b) {
        a.local ? (a.updateLocalAttributes(b), d("updateStreamAttributes", {
            id: a.getID(),
            attrs: b
        })) : L.Logger.error("You can not update attributes in a remote stream")
    };
    c = function(c, h, k) {
        console.log(c);
        a.socket = io.connect(c.host, {
            reconnect: !1,
            secure: c.secure,
            "force new connection": !0
        });
        a.socket.on("onAddStream", function(b) {
            var c = Erizo.Stream({
                streamID: b.id,
                local: !1,
                audio: b.audio,
                video: b.video,
                data: b.data,
                screen: b.screen,
                attributes: b.attributes
            });
            a.remoteStreams[b.id] = c;
            b = Erizo.StreamEvent({
                type: "stream-added",
                stream: c
            });
            a.dispatchEvent(b)
        });
        a.socket.on("signaling_message_erizo", function(b) {
            var c;
            (c = b.peerId ? a.remoteStreams[b.peerId] : a.localStreams[b.streamId]) &&
            c.pc.processSignalingMessage(b.mess)
        });
        a.socket.on("signaling_message_peer", function(b) {
            var c = a.localStreams[b.streamId];
            c ? c.pc[b.peerSocket].processSignalingMessage(b.msg) : (c = a.remoteStreams[b.streamId], c.pc || m(c, b.peerSocket), c.pc.processSignalingMessage(b.msg))
        });
        a.socket.on("publish_me", function(b) {
            var c = a.localStreams[b.streamId];
            void 0 === c.pc && (c.pc = {});
            c.pc[b.peerSocket] = Erizo.Connection({
                callback: function(a) {
                    e("signaling_message", {
                        streamId: b.streamId,
                        peerSocket: b.peerSocket,
                        msg: a
                    })
                },
                audio: c.hasAudio(),
                video: c.hasVideo(),
                stunServerUrl: a.stunServerUrl,
                turnServer: a.turnServer
            });
            c.pc[b.peerSocket].oniceconnectionstatechange = function(a) {
                if (a === "disconnected") {
                    c.pc[b.peerSocket].close();
                    delete c.pc[b.peerSocket]
                }
            };
            c.pc[b.peerSocket].addStream(c.stream);
            c.pc[b.peerSocket].createOffer()
        });
        var m = function(c, f) {
            c.pc = Erizo.Connection({
                callback: function(a) {
                    e("signaling_message", {
                        streamId: c.getID(),
                        peerSocket: f,
                        msg: a
                    })
                },
                stunServerUrl: a.stunServerUrl,
                turnServer: a.turnServer,
                maxAudioBW: b.maxAudioBW,
                maxVideoBW: b.maxVideoBW,
                limitMaxAudioBW: b.maxAudioBW,
                limitMaxVideoBW: b.maxVideoBW
            });
            c.pc.onaddstream = function(b) {
                L.Logger.info("Stream subscribed");
                c.stream = b.stream;
                b = Erizo.StreamEvent({
                    type: "stream-subscribed",
                    stream: c
                });
                a.dispatchEvent(b)
            }
        };
        a.socket.on("onBandwidthAlert", function(b) {
            L.Logger.info("Bandwidth Alert on", b.streamID, "message", b.message, "BW:", b.bandwidth);
            if (b.streamID) {
                var c = a.remoteStreams[b.streamID],
                    b = Erizo.StreamEvent({
                        type: "bandwidth-alert",
                        stream: c,
                        msg: b.message,
                        bandwidth: b.bandwidth
                    });
                c.dispatchEvent(b)
            }
        });
        a.socket.on("onDataStream", function(b) {
            var c = a.remoteStreams[b.id],
                b = Erizo.StreamEvent({
                    type: "stream-data",
                    msg: b.msg,
                    stream: c
                });
            c.dispatchEvent(b)
        });
        a.socket.on("onUpdateAttributeStream", function(b) {
            var c = a.remoteStreams[b.id],
                f = Erizo.StreamEvent({
                    type: "stream-attributes-update",
                    attrs: b.attrs,
                    stream: c
                });
            c.updateLocalAttributes(b.attrs);
            c.dispatchEvent(f)
        });
        a.socket.on("onRemoveStream", function(b) {
            var c = a.remoteStreams[b.id];
            delete a.remoteStreams[b.id];
            j(c);
            b = Erizo.StreamEvent({
                type: "stream-removed",
                stream: c
            });
            a.dispatchEvent(b)
        });
        a.socket.on("disconnect", function() {
            L.Logger.info("Socket disconnected");
            if (0 !== a.state) {
                var b = Erizo.RoomEvent({
                    type: "room-disconnected"
                });
                a.dispatchEvent(b)
            }
        });
        a.socket.on("connection_failed", function() {
            L.Logger.info("ICE Connection Failed");
            if (0 !== a.state) {
                var b = Erizo.RoomEvent({
                    type: "stream-failed"
                });
                a.dispatchEvent(b)
            }
        });
        a.socket.on("error", function(a) {
            L.Logger.error("Cannot connect to Erizo-Controller (socket.io error)", a);
            k(a)
        });
        d("token", c, h, k)
    };
    d = function(b,
        c, d, e) {
        a.socket.emit(b, c, function(a, b) {
            "success" === a ? void 0 !== d && d(b) : "error" === a ? void 0 !== e && e(b) : void 0 !== d && d(a, b)
        })
    };
    e = function(b, c, d, e) {
        a.socket.emit(b, c, d, function(a, b) {
            void 0 !== e && e(a, b)
        })
    };
    a.connect = function() {
        var f = L.Base64.decodeBase64(b.token);
        0 !== a.state && L.Logger.error("Room already connected");
        a.state = 1;
        c(JSON.parse(f), function(c) {
            var f = 0,
                d = [],
                e, g, i;
            e = c.streams || [];
            a.p2p = c.p2p;
            g = c.id;
            a.stunServerUrl = c.stunServerUrl;
            a.turnServer = c.turnServer;
            a.state = 2;
            b.defaultVideoBW = c.defaultVideoBW;
            b.maxVideoBW = c.maxVideoBW;
            for (f in e) e.hasOwnProperty(f) && (i = e[f], c = Erizo.Stream({
                streamID: i.id,
                local: !1,
                audio: i.audio,
                video: i.video,
                data: i.data,
                screen: i.screen,
                attributes: i.attributes
            }), d.push(c), a.remoteStreams[i.id] = c);
            a.roomID = g;
            L.Logger.info("Connected to room " + a.roomID);
            f = Erizo.RoomEvent({
                type: "room-connected",
                streams: d
            });
            a.dispatchEvent(f)
        }, function(b) {
            L.Logger.error("Not Connected! Error: " + b);
            b = Erizo.RoomEvent({
                type: "room-error"
            });
            a.dispatchEvent(b)
        })
    };
    a.disconnect = function() {
        var b = Erizo.RoomEvent({
            type: "room-disconnected"
        });
        a.dispatchEvent(b)
    };
    a.publish = function(c, d, k) {
        d = d || {};
        d.maxVideoBW = d.maxVideoBW || b.defaultVideoBW;
        d.maxVideoBW > b.maxVideoBW && (d.maxVideoBW = b.maxVideoBW);
        void 0 === d.minVideoBW && (d.minVideoBW = 0);
        d.minVideoBW > b.defaultVideoBW && (d.minVideoBW = b.defaultVideoBW);
        if (c.local && void 0 === a.localStreams[c.getID()])
            if (c.hasAudio() || c.hasVideo() || c.hasScreen())
                if (void 0 !== c.url || void 0 !== c.recording) {
                    var m, o;
                    c.url ? (m = "url", o = c.url) : (m = "recording", o = c.recording);
                    e("publish", {
                        state: m,
                        data: c.hasData(),
                        audio: c.hasAudio(),
                        video: c.hasVideo(),
                        attributes: c.getAttributes()
                    }, o, function(b, d) {
                        if (b !== null) {
                            L.Logger.info("Stream published");
                            c.getID = function() {
                                return b
                            };
                            c.sendData = function(a) {
                                g(c, a)
                            };
                            c.setAttributes = function(a) {
                                i(c, a)
                            };
                            a.localStreams[b] = c;
                            c.room = a;
                            k && k(b)
                        } else {
                            L.Logger.error("Error when publishing the stream", d);
                            k && k(void 0, d)
                        }
                    })
                } else a.p2p ? (b.maxAudioBW = d.maxAudioBW, b.maxVideoBW = d.maxVideoBW, e("publish", {
                        state: "p2p",
                        data: c.hasData(),
                        audio: c.hasAudio(),
                        video: c.hasVideo(),
                        screen: c.hasScreen(),
                        attributes: c.getAttributes()
                    },
                    void 0,
                    function(b, d) {
                        if (b === null) {
                            L.Logger.error("Error when publishing the stream", d);
                            k && k(void 0, d)
                        }
                        L.Logger.info("Stream published");
                        c.getID = function() {
                            return b
                        };
                        if (c.hasData()) c.sendData = function(a) {
                            g(c, a)
                        };
                        c.setAttributes = function(a) {
                            i(c, a)
                        };
                        a.localStreams[b] = c;
                        c.room = a
                    })) : e("publish", {
                    state: "erizo",
                    data: c.hasData(),
                    audio: c.hasAudio(),
                    video: c.hasVideo(),
                    screen: c.hasScreen(),
                    minVideoBW: d.minVideoBW,
                    attributes: c.getAttributes()
                }, void 0, function(m, o) {
                    if (m === null) {
                        L.Logger.error("Error when publishing the stream: ",
                            o);
                        k && k(void 0, o)
                    } else {
                        L.Logger.info("Stream published");
                        c.getID = function() {
                            return m
                        };
                        if (c.hasData()) c.sendData = function(a) {
                            g(c, a)
                        };
                        c.setAttributes = function(a) {
                            i(c, a)
                        };
                        a.localStreams[m] = c;
                        c.room = a;
                        c.pc = Erizo.Connection({
                            callback: function(a) {
                                console.log("Sending message", a);
                                e("signaling_message", {
                                    streamId: c.getID(),
                                    msg: a
                                }, void 0, function() {})
                            },
                            stunServerUrl: a.stunServerUrl,
                            turnServer: a.turnServer,
                            maxAudioBW: d.maxAudioBW,
                            maxVideoBW: d.maxVideoBW,
                            limitMaxAudioBW: b.maxAudioBW,
                            limitMaxVideoBW: b.maxVideoBW,
                            audio: c.hasAudio(),
                            video: c.hasVideo()
                        });
                        c.pc.addStream(c.stream);
                        c.pc.createOffer();
                        k && k(m)
                    }
                });
        else c.hasData() && e("publish", {
            state: "data",
            data: c.hasData(),
            audio: !1,
            video: !1,
            screen: !1,
            attributes: c.getAttributes()
        }, void 0, function(b, d) {
            if (b === null) {
                L.Logger.error("Error publishing stream ", d);
                k && k(void 0, d)
            } else {
                L.Logger.info("Stream published");
                c.getID = function() {
                    return b
                };
                c.sendData = function(a) {
                    g(c, a)
                };
                c.setAttributes = function(a) {
                    i(c, a)
                };
                a.localStreams[b] = c;
                c.room = a;
                k && k(b)
            }
        })
    };
    a.startRecording =
        function(a, b) {
            L.Logger.debug("Start Recording streamaa1111: " + a.getID());
            d("startRecorder", {
                to: a.getID()
            }, function(a, c) {
                null === a ? (L.Logger.error("Error on start recording", c), b && b(void 0, c)) : (L.Logger.info("Start recording", a), b && b(a))
            })
        };
    a.stopRecording = function(a, b) {
        d("stopRecorder", {
            id: a
        }, function(a, c) {
            null === a ? (L.Logger.error("Error on stop recording", c), b && b(void 0, c)) : (L.Logger.info("Stop recording"), b && b(!0))
        })
    };
    a.unpublish = function(b, c) {
        if (b.local) {
            d("unpublish", b.getID(), function(a, b) {
                null ===
                    a ? (L.Logger.error("Error unpublishing stream", b), c && c(void 0, b)) : (L.Logger.info("Stream unpublished"), c && c(!0))
            });
            var e = b.room.p2p;
            b.room = void 0;
            if ((b.hasAudio() || b.hasVideo() || b.hasScreen()) && void 0 === b.url && !e) b.pc.close(), b.pc = void 0;
            delete a.localStreams[b.getID()];
            b.getID = function() {};
            b.sendData = function() {};
            b.setAttributes = function() {}
        }
    };
    a.subscribe = function(b, c, d) {
        c = c || {};
        if (!b.local) {
            if (b.hasVideo() || b.hasAudio() || b.hasScreen()) a.p2p ? (e("subscribe", {
                streamId: b.getID()
            }), d && d(!0)) : e("subscribe", {
                streamId: b.getID(),
                audio: c.audio,
                video: c.video,
                data: c.data,
                browser: Erizo.getBrowser()
            }, void 0, function(g, i) {
                null === g ? (L.Logger.error("Error subscribing to stream ", i), d && d(void 0, i)) : (L.Logger.info("Subscriber added"), b.pc = Erizo.Connection({
                    callback: function(a) {
                        L.Logger.info("Sending message", a);
                        e("signaling_message", {
                            streamId: b.getID(),
                            msg: a,
                            browser: b.pc.browser
                        }, void 0, function() {})
                    },
                    nop2p: !0,
                    audio: c.audio,
                    video: c.video,
                    stunServerUrl: a.stunServerUrl,
                    turnServer: a.turnServer
                }), b.pc.onaddstream = function(c) {
                    L.Logger.info("Stream subscribed");
                    b.stream = c.stream;
                    c = Erizo.StreamEvent({
                        type: "stream-subscribed",
                        stream: b
                    });
                    a.dispatchEvent(c)
                }, b.pc.createOffer(!0), d && d(!0))
            });
            else if (b.hasData() && !1 !== c.data) e("subscribe", {
                streamId: b.getID(),
                data: c.data
            }, void 0, function(c, h) {
                if (null === c) L.Logger.error("Error subscribing to stream ", h), d && d(void 0, h);
                else {
                    L.Logger.info("Stream subscribed");
                    var e = Erizo.StreamEvent({
                        type: "stream-subscribed",
                        stream: b
                    });
                    a.dispatchEvent(e);
                    d && d(!0)
                }
            });
            else {
                L.Logger.info("Subscribing to anything");
                return
            }
            L.Logger.info("Subscribing to: " +
                b.getID())
        }
    };
    a.unsubscribe = function(b, c) {
        void 0 !== a.socket && (b.local || d("unsubscribe", b.getID(), function(a, d) {
            null === a ? c && c(void 0, d) : (j(b), c && c(!0))
        }, function() {
            L.Logger.error("Error calling unsubscribe.")
        }))
    };
    a.getStreamsByAttribute = function(b, c) {
        var d = [],
            e, g;
        for (e in a.remoteStreams) a.remoteStreams.hasOwnProperty(e) && (g = a.remoteStreams[e], void 0 !== g.getAttributes() && void 0 !== g.getAttributes()[b] && g.getAttributes()[b] === c && d.push(g));
        return d
    };
    return a
};
var L = L || {};
L.Logger = function(b) {
    return {
        DEBUG: 0,
        TRACE: 1,
        INFO: 2,
        WARNING: 3,
        ERROR: 4,
        NONE: 5,
        enableLogPanel: function() {
            b.Logger.panel = document.createElement("textarea");
            b.Logger.panel.setAttribute("id", "licode-logs");
            b.Logger.panel.setAttribute("style", "width: 100%; height: 100%; display: none");
            b.Logger.panel.setAttribute("rows", 20);
            b.Logger.panel.setAttribute("cols", 20);
            b.Logger.panel.setAttribute("readOnly", !0);
            document.body.appendChild(b.Logger.panel)
        },
        setLogLevel: function(a) {
            a > b.Logger.NONE ? a = b.Logger.NONE : a <
                b.Logger.DEBUG && (a = b.Logger.DEBUG);
            b.Logger.logLevel = a
        },
        log: function(a) {
            var c = "";
            if (!(a < b.Logger.logLevel)) {
                a === b.Logger.DEBUG ? c += "DEBUG" : a === b.Logger.TRACE ? c += "TRACE" : a === b.Logger.INFO ? c += "INFO" : a === b.Logger.WARNING ? c += "WARNING" : a === b.Logger.ERROR && (c += "ERROR");
                for (var c = c + ": ", d = [], e = 0; e < arguments.length; e++) d[e] = arguments[e];
                d = d.slice(1);
                d = [c].concat(d);
                if (void 0 !== b.Logger.panel) {
                    c = "";
                    for (e = 0; e < d.length; e++) c += d[e];
                    b.Logger.panel.value = b.Logger.panel.value + "\n" + c
                } else console.log.apply(console,
                    d)
            }
        },
        debug: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.DEBUG].concat(a))
        },
        trace: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.TRACE].concat(a))
        },
        info: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.INFO].concat(a))
        },
        warning: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.WARNING].concat(a))
        },
        error: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.ERROR].concat(a))
        }
    }
}(L);
L = L || {};
L.Base64 = function() {
    var b, a, c, d, e, g, i, j, f;
    b = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9,+,/".split(",");
    a = [];
    for (e = 0; e < b.length; e += 1) a[b[e]] = e;
    g = function(a) {
        c = a;
        d = 0
    };
    i = function() {
        var a;
        if (!c || d >= c.length) return -1;
        a = c.charCodeAt(d) & 255;
        d += 1;
        return a
    };
    j = function() {
        if (!c) return -1;
        for (;;) {
            if (d >= c.length) return -1;
            var b = c.charAt(d);
            d += 1;
            if (a[b]) return a[b];
            if ("A" === b) return 0
        }
    };
    f = function(a) {
        a = a.toString(16);
        1 === a.length && (a =
            "0" + a);
        return unescape("%" + a)
    };
    return {
        encodeBase64: function(a) {
            var c, d, f;
            g(a);
            a = "";
            c = Array(3);
            d = 0;
            for (f = !1; !f && -1 !== (c[0] = i());)
                if (c[1] = i(), c[2] = i(), a += b[c[0] >> 2], -1 !== c[1] ? (a += b[c[0] << 4 & 48 | c[1] >> 4], -1 !== c[2] ? (a += b[c[1] << 2 & 60 | c[2] >> 6], a += b[c[2] & 63]) : (a += b[c[1] << 2 & 60], a += "=", f = !0)) : (a += b[c[0] << 4 & 48], a += "=", a += "=", f = !0), d += 4, 76 <= d) a += "\n", d = 0;
            return a
        },
        decodeBase64: function(a) {
            var b, c;
            g(a);
            a = "";
            b = Array(4);
            for (c = !1; !c && -1 !== (b[0] = j()) && -1 !== (b[1] = j());) b[2] = j(), b[3] = j(), a += f(b[0] << 2 & 255 | b[1] >> 4), -1 !==
                b[2] ? (a += f(b[1] << 4 & 255 | b[2] >> 2), -1 !== b[3] ? a += f(b[2] << 6 & 255 | b[3]) : c = !0) : c = !0;
            return a
        }
    }
}(L);
(function() {
    function b() {
        (new L.ElementQueries).init()
    }
    this.L = this.L || {};
    this.L.ElementQueries = function() {
        function a(a) {
            a || (a = document.documentElement);
            a = getComputedStyle(a, "fontSize");
            return parseFloat(a) || 16
        }

        function b(c, d) {
            var e = d.replace(/[0-9]*/, ""),
                d = parseFloat(d);
            switch (e) {
                case "px":
                    return d;
                case "em":
                    return d * a(c);
                case "rem":
                    return d * a();
                case "vw":
                    return d * document.documentElement.clientWidth / 100;
                case "vh":
                    return d * document.documentElement.clientHeight / 100;
                case "vmin":
                case "vmax":
                    return d *
                        (0, Math["vmin" === e ? "min" : "max"])(document.documentElement.clientWidth / 100, document.documentElement.clientHeight / 100);
                default:
                    return d
            }
        }

        function d(a) {
            this.element = a;
            this.options = [];
            var d, e, g, i = 0,
                j = 0,
                q, u, v, w, p;
            this.addOption = function(a) {
                this.options.push(a)
            };
            var s = ["min-width", "min-height", "max-width", "max-height"];
            this.call = function() {
                i = this.element.offsetWidth;
                j = this.element.offsetHeight;
                v = {};
                d = 0;
                for (e = this.options.length; d < e; d++) g = this.options[d], q = b(this.element, g.value), u = "width" == g.property ? i :
                    j, p = g.mode + "-" + g.property, w = "", "min" == g.mode && u >= q && (w += g.value), "max" == g.mode && u <= q && (w += g.value), v[p] || (v[p] = ""), w && -1 === (" " + v[p] + " ").indexOf(" " + w + " ") && (v[p] += " " + w);
                for (var a in s) v[s[a]] ? this.element.setAttribute(s[a], v[s[a]].substr(1)) : this.element.removeAttribute(s[a])
            }
        }

        function e(a, b) {
            a.elementQueriesSetupInformation ? a.elementQueriesSetupInformation.addOption(b) : (a.elementQueriesSetupInformation = new d(a), a.elementQueriesSetupInformation.addOption(b), new ResizeSensor(a, function() {
                a.elementQueriesSetupInformation.call()
            }));
            a.elementQueriesSetupInformation.call()
        }

        function g(a) {
            for (var b, a = a.replace(/'/g, '"'); null !== (b = j.exec(a));)
                if (5 < b.length) {
                    var c = b[1] || b[5],
                        d = b[2],
                        g = b[3];
                    b = b[4];
                    var i = void 0;
                    document.querySelectorAll && (i = document.querySelectorAll.bind(document));
                    !i && "undefined" !== typeof $$ && (i = $$);
                    !i && "undefined" !== typeof jQuery && (i = jQuery);
                    if (!i) throw "No document.querySelectorAll, jQuery or Mootools's $$ found.";
                    for (var c = i(c), i = 0, q = c.length; i < q; i++) e(c[i], {
                        mode: d,
                        property: g,
                        value: b
                    })
                }
        }

        function i(a) {
            var b = "";
            if (a)
                if ("string" ===
                    typeof a) a = a.toLowerCase(), (-1 !== a.indexOf("min-width") || -1 !== a.indexOf("max-width")) && g(a);
                else
                    for (var c = 0, d = a.length; c < d; c++) 1 === a[c].type ? (b = a[c].selectorText || a[c].cssText, -1 !== b.indexOf("min-height") || -1 !== b.indexOf("max-height") ? g(b) : (-1 !== b.indexOf("min-width") || -1 !== b.indexOf("max-width")) && g(b)) : 4 === a[c].type && i(a[c].cssRules || a[c].rules)
        }
        var j = /,?([^,\n]*)\[[\s\t]*(min|max)-(width|height)[\s\t]*[~$\^]?=[\s\t]*"([^"]*)"[\s\t]*]([^\n\s\{]*)/mgi;
        this.init = function() {
            for (var a = 0, b = document.styleSheets.length; a <
                b; a++) i(document.styleSheets[a].cssText || document.styleSheets[a].cssRules || document.styleSheets[a].rules)
        }
    };
    window.addEventListener ? window.addEventListener("load", b, !1) : window.attachEvent("onload", b);
    this.L.ResizeSensor = function(a, b) {
        function d(a, b) {
            window.OverflowEvent ? a.addEventListener("overflowchanged", function(a) {
                b.call(this, a)
            }) : (a.addEventListener("overflow", function(a) {
                b.call(this, a)
            }), a.addEventListener("underflow", function(a) {
                b.call(this, a)
            }))
        }

        function e() {
            this.q = [];
            this.add = function(a) {
                this.q.push(a)
            };
            var a, b;
            this.call = function() {
                a = 0;
                for (b = this.q.length; a < b; a++) this.q[a].call()
            }
        }

        function g(a, b) {
            function c() {
                var b = !1,
                    d = a.resizeSensor.offsetWidth,
                    e = a.resizeSensor.offsetHeight;
                i != d && (q.width = d - 1 + "px", u.width = d + 1 + "px", b = !0, i = d);
                j != e && (q.height = e - 1 + "px", u.height = e + 1 + "px", b = !0, j = e);
                return b
            }
            if (a.resizedAttached) {
                if (a.resizedAttached) {
                    a.resizedAttached.add(b);
                    return
                }
            } else a.resizedAttached = new e, a.resizedAttached.add(b);
            var g = function() {
                c() && a.resizedAttached.call()
            };
            a.resizeSensor = document.createElement("div");
            a.resizeSensor.className = "resize-sensor";
            a.resizeSensor.style.cssText = "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1;";
            a.resizeSensor.innerHTML = '<div class="resize-sensor-overflow" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1;"><div></div></div><div class="resize-sensor-underflow" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1;"><div></div></div>';
            a.appendChild(a.resizeSensor);
            if ("absolute" !== (a.currentStyle ? a.currentStyle.position : window.getComputedStyle ? window.getComputedStyle(a, null).getPropertyValue("position") : a.style.position)) a.style.position = "relative";
            var i = -1,
                j = -1,
                q = a.resizeSensor.firstElementChild.firstChild.style,
                u = a.resizeSensor.lastElementChild.firstChild.style;
            c();
            d(a.resizeSensor, g);
            d(a.resizeSensor.firstElementChild, g);
            d(a.resizeSensor.lastElementChild, g)
        }
        if ("array" === typeof a || "undefined" !== typeof jQuery && a instanceof jQuery || "undefined" !== typeof Elements &&
            a instanceof Elements)
            for (var i = 0, j = a.length; i < j; i++) g(a[i], b);
        else g(a, b)
    }
})();
Erizo = Erizo || {};
Erizo.View = function() {
    var b = Erizo.EventDispatcher({});
    b.url = "http://chotis2.dit.upm.es:3000";
    return b
};
Erizo = Erizo || {};
Erizo.VideoPlayer = function(b) {
    var a = Erizo.View({});
    a.id = b.id;
    a.stream = b.stream.stream;
    a.elementID = b.elementID;
    a.destroy = function() {
        a.video.pause();
        delete a.resizer;
        a.parentNode.removeChild(a.div)
    };
    a.resize = function() {
        var c = a.container.offsetWidth,
            d = a.container.offsetHeight;
        if (b.stream.screen || !1 === b.options.crop) 0.5625 * c < d ? (a.video.style.width = c + "px", a.video.style.height = 0.5625 * c + "px", a.video.style.top = -(0.5625 * c / 2 - d / 2) + "px", a.video.style.left = "0px") : (a.video.style.height = d + "px", a.video.style.width = 16 /
            9 * d + "px", a.video.style.left = -(16 / 9 * d / 2 - c / 2) + "px", a.video.style.top = "0px");
        else if (c !== a.containerWidth || d !== a.containerHeight) 0.75 * c > d ? (a.video.style.width = c + "px", a.video.style.height = 0.75 * c + "px", a.video.style.top = -(0.75 * c / 2 - d / 2) + "px", a.video.style.left = "0px") : (a.video.style.height = d + "px", a.video.style.width = 4 / 3 * d + "px", a.video.style.left = -(4 / 3 * d / 2 - c / 2) + "px", a.video.style.top = "0px");
        a.containerWidth = c;
        a.containerHeight = d
    };
    L.Logger.debug("Creating URL from stream " + a.stream);
    a.stream_url = (window.URL ||
        webkitURL).createObjectURL(a.stream);
    a.div = document.createElement("div");
    a.div.setAttribute("id", "player_" + a.id);
    a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; background-color: black; overflow: hidden;");
    a.loader = document.createElement("img");
    a.loader.setAttribute("style", "width: 16px; height: 16px; position: absolute; top: 50%; left: 50%; margin-top: -8px; margin-left: -8px");
    a.loader.setAttribute("id", "back_" + a.id);
    a.loader.setAttribute("src", a.url + "/assets/loader.gif");
    a.video = document.createElement("video");
    a.video.setAttribute("id", "stream" + a.id);
    a.video.setAttribute("style", "width: 100%; height: 100%; position: absolute");
    a.video.setAttribute("autoplay", "autoplay");
    b.stream.local && (a.video.volume = 0);
    void 0 !== a.elementID ? (document.getElementById(a.elementID).appendChild(a.div), a.container = document.getElementById(a.elementID)) : (document.body.appendChild(a.div), a.container = document.body);
    a.parentNode = a.div.parentNode;
    a.div.appendChild(a.loader);
    a.div.appendChild(a.video);
    a.containerWidth = 0;
    a.containerHeight = 0;
    a.resizer = new L.ResizeSensor(a.container, a.resize);
    a.resize();
    a.bar = new Erizo.Bar({
        elementID: "player_" + a.id,
        id: a.id,
        stream: b.stream,
        media: a.video,
        options: b.options
    });
    a.div.onmouseover = function() {
        a.bar.display()
    };
    a.div.onmouseout = function() {
        a.bar.hide()
    };
    a.video.src = a.stream_url;
    return a
};
Erizo = Erizo || {};
Erizo.AudioPlayer = function(b) {
    var a = Erizo.View({}),
        c, d;
    a.id = b.id;
    a.stream = b.stream.stream;
    a.elementID = b.elementID;
    L.Logger.debug("Creating URL from stream " + a.stream);
    a.stream_url = (window.URL || webkitURL).createObjectURL(a.stream);
    a.audio = document.createElement("audio");
    a.audio.setAttribute("id", "stream" + a.id);
    a.audio.setAttribute("style", "width: 100%; height: 100%; position: absolute");
    a.audio.setAttribute("autoplay", "autoplay");
    b.stream.local && (a.audio.volume = 0);
    b.stream.local && (a.audio.volume = 0);
    void 0 !== a.elementID ? (a.destroy = function() {
        a.audio.pause();
        a.parentNode.removeChild(a.div)
    }, c = function() {
        a.bar.display()
    }, d = function() {
        a.bar.hide()
    }, a.div = document.createElement("div"), a.div.setAttribute("id", "player_" + a.id), a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; overflow: hidden;"), document.getElementById(a.elementID).appendChild(a.div), a.container = document.getElementById(a.elementID), a.parentNode = a.div.parentNode, a.div.appendChild(a.audio), a.bar = new Erizo.Bar({
        elementID: "player_" +
            a.id,
        id: a.id,
        stream: b.stream,
        media: a.audio,
        options: b.options
    }), a.div.onmouseover = c, a.div.onmouseout = d) : (a.destroy = function() {
        a.audio.pause();
        a.parentNode.removeChild(a.audio)
    }, document.body.appendChild(a.audio), a.parentNode = document.body);
    a.audio.src = a.stream_url;
    return a
};
Erizo = Erizo || {};
Erizo.Bar = function(b) {
    var a = Erizo.View({}),
        c, d;
    a.elementID = b.elementID;
    a.id = b.id;
    a.div = document.createElement("div");
    a.div.setAttribute("id", "bar_" + a.id);
    a.bar = document.createElement("div");
    a.bar.setAttribute("style", "width: 100%; height: 15%; max-height: 30px; position: absolute; bottom: 0; right: 0; background-color: rgba(255,255,255,0.62)");
    a.bar.setAttribute("id", "subbar_" + a.id);
    a.link = document.createElement("a");
    a.link.setAttribute("href", "http://www.lynckia.com/");
    a.link.setAttribute("target", "_blank");
    a.logo = document.createElement("img");
    a.logo.setAttribute("style", "width: 100%; height: 100%; max-width: 30px; position: absolute; top: 0; left: 2px;");
    a.logo.setAttribute("alt", "Lynckia");
    a.logo.setAttribute("src", a.url + "/assets/star.svg");
    d = function(b) {
        "block" !== b ? b = "none" : clearTimeout(c);
        a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; bottom: 0; right: 0; display:" + b)
    };
    a.display = function() {
        d("block")
    };
    a.hide = function() {
        c = setTimeout(d, 1E3)
    };
    document.getElementById(a.elementID).appendChild(a.div);
    a.div.appendChild(a.bar);
    a.bar.appendChild(a.link);
    a.link.appendChild(a.logo);
    if (!b.stream.screen && (void 0 === b.options || void 0 === b.options.speaker || !0 === b.options.speaker)) a.speaker = new Erizo.Speaker({
        elementID: "subbar_" + a.id,
        id: a.id,
        stream: b.stream,
        media: b.media
    });
    a.display();
    a.hide();
    return a
};
Erizo = Erizo || {};
Erizo.Speaker = function(b) {
    var a = Erizo.View({}),
        c, d, e, g = 50;
    a.elementID = b.elementID;
    a.media = b.media;
    a.id = b.id;
    a.stream = b.stream;
    a.div = document.createElement("div");
    a.div.setAttribute("style", "width: 40%; height: 100%; max-width: 32px; position: absolute; right: 0;z-index:0;");
    a.icon = document.createElement("img");
    a.icon.setAttribute("id", "volume_" + a.id);
    a.icon.setAttribute("src", a.url + "/assets/sound48.png");
    a.icon.setAttribute("style", "width: 80%; height: 100%; position: absolute;");
    a.div.appendChild(a.icon);
    a.stream.local ? (d = function() {
        a.media.muted = !0;
        a.icon.setAttribute("src", a.url + "/assets/mute48.png");
        a.stream.stream.getAudioTracks()[0].enabled = !1
    }, e = function() {
        a.media.muted = !1;
        a.icon.setAttribute("src", a.url + "/assets/sound48.png");
        a.stream.stream.getAudioTracks()[0].enabled = !0
    }, a.icon.onclick = function() {
        a.media.muted ? e() : d()
    }) : (a.picker = document.createElement("input"), a.picker.setAttribute("id", "picker_" + a.id), a.picker.type = "range", a.picker.min = 0, a.picker.max = 100, a.picker.step = 10, a.picker.value =
        g, a.picker.setAttribute("orient", "vertical"), a.div.appendChild(a.picker), a.media.volume = a.picker.value / 100, a.media.muted = !1, a.picker.oninput = function() {
            0 < a.picker.value ? (a.media.muted = !1, a.icon.setAttribute("src", a.url + "/assets/sound48.png")) : (a.media.muted = !0, a.icon.setAttribute("src", a.url + "/assets/mute48.png"));
            a.media.volume = a.picker.value / 100
        }, c = function(b) {
            a.picker.setAttribute("style", "background: transparent; width: 32px; height: 100px; position: absolute; bottom: 90%; z-index: 1;" + a.div.offsetHeight +
                "px; right: 0px; -webkit-appearance: slider-vertical; display: " + b)
        }, d = function() {
            a.icon.setAttribute("src", a.url + "/assets/mute48.png");
            g = a.picker.value;
            a.picker.value = 0;
            a.media.volume = 0;
            a.media.muted = !0
        }, e = function() {
            a.icon.setAttribute("src", a.url + "/assets/sound48.png");
            a.picker.value = g;
            a.media.volume = a.picker.value / 100;
            a.media.muted = !1
        }, a.icon.onclick = function() {
            a.media.muted ? e() : d()
        }, a.div.onmouseover = function() {
            c("block")
        }, a.div.onmouseout = function() {
            c("none")
        }, c("none"));
    document.getElementById(a.elementID).appendChild(a.div);
    return a
};