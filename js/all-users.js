(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
})({
    1: [function (require, module, exports) {
        var VoteUpModel = require("./models/voteUp");
        jQuery(document).ready(function (o) {
            "use strict";
            o("body").hasClass("sticky-nav") && window.setTimeout(function () {
                if (0 !== location.hash.length) {
                    var i = o("body").hasClass("admin-bar") ? 135 : 92;
                    window.scrollTo(window.scrollX, window.scrollY - i)
                }
            }, 2), o(".day-header, .page-header, .page-description, .status-pending, .author-list-header").next(".status-publish").addClass("no-border"), o(".loop-listing-wrap.status-publish, .loop-listing-wrap.submission-comment").hover(function () {
                o(this).addClass("listing-hover").next(".loop-listing-wrap").addClass("no-border")
            }, function () {
                o(this).removeClass("listing-hover").next(".loop-listing-wrap").removeClass("no-border")
            }).on("click", function () {
                window.location.href = o(this).find(".comment-link a").attr("href")
            }), o(".loop-listing-wrap a").on("click", function (o) {
                o.stopPropagation()
            }), o.each(o(".riwp-vote-box.status-publish, .riwp-vote-box.approved"), function (o, i) {
                new VoteUpModel(i)
            })
        });
    }, {
        "./models/voteUp": 2
    }],
    2: [function (require, module, exports) {
        var $ = jQuery,
            VoteUpModelView = require("../views/voteUp");
        module.exports = Backbone.Model.extend({
            initialize: function (t) {
                "use strict";
                this.el = $(t), this.set("upVotes", this.el.attr("data-upVotes"));
                var e = this.el.attr("id").split("-");
                "post" === e[0] ? this.set("postId", e[1]) : "comment" === e[0] && this.set("commentId", e[1]), this.set("type", e[0]), this.view = new VoteUpModelView(this)
            },
            sync: function (t) {
                "use strict";
                var e = this,
                    s = _.extend({
                        url: wpRankItLocalsAll.ajaxUrl,
                        dataType: "json",
                        data: {
                            nonce: wpRankItLocalsAll.nonce,
                            action: "wprankit_" + t
                        }
                    });
                "post" === e.get("type") ? s.data.postId = e.get("postId") : "comment" === e.get("type") && (s.data.commentId = e.get("commentId")), "read" === t ? s.type = "get" : (s.type = "post", s.data.method = t), $.ajax(s).success(function (t) {
                    e.set("upVotes", t)
                })
            }
        });
    }, {
        "../views/voteUp": 3
    }],
    3: [function (require, module, exports) {
        "use strict";
        var $ = jQuery;
        module.exports = Backbone.View.extend({
            initialize: function (e) {
                this.model = e, this.listenTo(this.model, "change", this.renderChange), _.templateSettings = {
                    interpolate: /\{\{(.+?)\}\}/g
                }, this.template = _.template($("#vote-up-box").html()), this.render()
            },
            events: {
                "click .wpri-vote-up": "voteUp",
                "click .wpri-vote-down": "voteDown"
            },
            render: function () {
                return this.$el.prepend(this.template(this.model.toJSON())).addClass("has-votebox"), "post" === this.model.get("type") && wpRankItLocalsAll.postVotes.indexOf(this.model.get("postId")) > -1 ? this.$el.find(".wprmi-vote-box").removeClass("not-voted").addClass("voted") : "comment" === this.model.get("type") && wpRankItLocalsAll.commentVotes.indexOf(this.model.get("commentId")) > -1 && this.$el.find(".wprmi-vote-box").removeClass("not-voted").addClass("voted"), this
            },
            renderChange: function () {
                var e = this.model.get("upVotes"),
                    t = this.$el.find(".submit-voters");
                if (this.$el.find(".score").text(e), t.length && this.model.get("postId")) {
                    this.$el.find("#votes-number").text(e);
                    var o = $(t.find("[data-user-id=" + wpRankItLocalsAll.userId + "]"));
                    this.$el.hasClass("voted") ? o.length ? o.show() : t.append('<a href="' + wpRankItLocalsAll.userLink + '" data-user-id="' + wpRankItLocalsAll.userId + '">' + wpRankItLocalsAll.userImg + "</a>") : o.hide()
                }
                return this
            },
            voteUp: function (e) {
                e.stopPropagation(), "1" === wpRankItLocalsAll.userCanVote ? (this.model.sync("voteup"), this.$el.find(".wprmi-vote-box").removeClass("not-voted").addClass("voted")) : "1" === wpRankItLocalsAll.userLoggedIn ? $("[data-remodal-id=not-authorized]").remodal().open() : wpRankItLocalsAll.loginUrl ? window.location.replace(wpRankItLocalsAll.loginUrl) : $("[data-remodal-id=login]").remodal().open()
            },
            voteDown: function (e) {
                e.stopPropagation(), "1" === wpRankItLocalsAll.userCanVote ? (this.model.sync("votedown"), this.$el.find(".wprmi-vote-box").removeClass("voted").addClass("not-voted")) : "1" === wpRankItLocalsAll.userLoggedIn && $("[data-remodal-id=not-authorized]").remodal().open()
            }
        });
    }, {}]
}, {}, [1]);