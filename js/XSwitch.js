(function ($) {
    $.fn.XSwitch = function (options) {
        return this.each(function () {
            var _this = $(this),
                instance = _this.data('XSwitch');

            if (!instance) {
                instance = new XSwitch(_this, options);
                _this.data('XSwitch', instance);
            }

            if ($.type(options) === 'string') {
                return instance[options]();
            }
        });
    }

    $.fn.XSwitch.defaults = {
        selectors: {
            sections: '.sections',
            section: '.section',
            page: '.pages',
            active: '.active'
        },
        index: 0,
        easing: 'ease',
        duration: 500,
        loop: false,
        pagination: true,
        keyboard: true,
        direction: 'vertical',
        callback: ''
    }


    var _prefix = (function (temp) {
        var aPrefix = ['webkit', 'moz', 'o', 'ms'],
            props = '';
        for (var i = 0, len = aPrefix.length; i < len; i ++) {
            props = aPrefix[i] + 'Transition';
            if (temp.style[props] !== undefined) {
                return '-' + aPrefix[i].toLowerCase() + '-';
            }
            return false;
        }
    })(document.createElement('div'));

    var XSwitch = (function () {
        function XSwitch(element, options) {

            this.settings = $.extend(true, $.fn.XSwitch.defaults, options);
            this.element = element;
            this.init();
        }
        XSwitch.prototype = {

            init: function () {
                var _this = this;
                this.selectors = this.settings.selectors;

                this.sections = this.element.find(this.selectors.sections);
                this.section = this.sections.find(this.selectors.section);


                this.direction = this.settings.direction === 'vertical' ? true : false;

                this.pagesCount = this.pagesCount();

                this.index = (this.settings.index >=0 && this.settings.index < this.pagesCount) ? this.settings.index : 0;

                this.canScroll = true;


                if (!this.direction) {
                    _initLayout(_this);
                }

                if (this.settings.pagination) {
                    _initPaging(_this);
                }

                _initEvent(_this);
            },

            pagesCount: function () {
                return this.section.size();
            },

            switchLength: function () {
                return this.duration ? this.element.height() : this.element.width();
            },

            prve: function () {
                var _this = this;

                if (this.index > 0) {
                    this.index --;
                } else if (this.settings.loop) {
                    this.index = this.pagesCount - 1;
                }
                _scrollPage(_this);
            },

            next: function () {
                var _this = this;
                if (this.index < this.pagesCount) {
                    this.index ++;
                } else if (this.settings.loop) {
                    this.index = 0;
                }
                _scrollPage(_this);
            }
        };

        function _initLayout(_this) {
            var width = (_this.pagesCount * 100) + '%',
                cellWidth = (100 / _this.pagesCount).toFixed(2) + '%';

            _this.sections.width(width);
            _this.section.width(cellWidth).css('float', 'left');
        }
        var liArr = [
                {
                    url:'business_produce.html',
                    text:'金乌生产'
                },
                {
                    url:'business_operation.html',
                    text:'金乌运维'
                },
                {
                    url:'business_rentSale.html',
                    text:'金乌租售'
                },
                {
                    url:'business_engry.html',
                    text:'金乌储能'
                },
                {
                    url:'business_sellingElectricity.html',
                    text:'金乌售电'
                },
                {
                    url:'business_development.html',
                    text:'金乌开发'
                },
            ];
        function _initPaging(_this) {

            var pagesClass = _this.selectors.page.substring(1),
                pageHtml = '<ul class="' + pagesClass + '">';
            _this.activeClass = _this.selectors.active.substring(1);

            for (var i = 0, len = _this.pagesCount; i < len; i ++) {
                pageHtml += '<li><a href="'+liArr[i].url+'" class="clearfix"><span class="li_title float_lf">'+liArr[i].text+'</span><span class="li_dian float_lf"></span></a></li>';
            }
            pageHtml += '</ul>';

            _this.element.append(pageHtml);
            var pages = _this.element.find(_this.selectors.page);
            _this.pageItem = pages.find('li');
            _this.pageItem.eq(_this.index).addClass(_this.activeClass);
            if (_this.direction) {
                pages.addClass('vertical');
            } else {
                pages.addClass('horizontal');
            }
        }

        function _initEvent(_this) {

            _this.element.on('click', _this.selectors.page + ' li', function () {
                _this.index = $(this).index();
                _scrollPage(_this);
            });
            var winW = $(window).width();
            if(winW>768){
                _this.element.on('mousewheel DOMMouseScroll', function (e) {
                    if (!_this.canScroll) {
                        return;
                    }

                    var delta = -e.originalEvent.detail || -e.originalEvent.deltaY || e.originalEvent.wheelDelta;

                    if (delta > 0 && (_this.index && !_this.settings.loop || _this.settings.loop)) {
                        _this.prve();
                    } else if (delta < 0 && (_this.index < (_this.pagesCount - 1) && !_this.settings.loop || _this.settings.loop)) {
                        _this.next();
                    }
                });
            }else{
                var startx,starty;

                function getAngle(angx, angy) {
                    return Math.atan2(angy, angx) * 180 / Math.PI;
                };

//根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
                function getDirection(startx, starty, endx, endy) {
                    var angx = endx - startx;
                    var angy = endy - starty;
                    var result = 0;

                    //如果滑动距离太短
                    if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
                        return result;
                    }

                    var angle = getAngle(angx, angy);
                    if (angle >= -135 && angle <= -45) {
                        result = 1;
                    } else if (angle > 45 && angle < 135) {
                        result = 2;
                    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                        result = 3;
                    } else if (angle >= -45 && angle <= 45) {
                        result = 4;
                    }

                    return result;
                }

                //手指接触屏幕
                document.addEventListener("touchstart", function(e){
                    startx = e.touches[0].pageX;
                    starty = e.touches[0].pageY;
                }, false);
//手指离开屏幕
                document.addEventListener("touchend", function(e) {
                    var endx, endy;
                    endx = e.changedTouches[0].pageX;
                    endy = e.changedTouches[0].pageY;
                    var direction = getDirection(startx, starty, endx, endy);
                    switch (direction) {
                        case 0:
                            // alert("未滑动！");
                            break;
                        case 1:
                            // alert("向上！");
                            _this.next();
                            break;
                        case 2:
                            // alert("向下！");
                            _this.prve();
                            break;
                        case 3:
                            // alert("向左！");
                            break;
                        case 4:
                            // alert("向右！");
                            break;
                        default:
                    }
                }, false);
            }


            if (_this.settings.keyboard) {
                $(window).on('keydown', function (e) {
                    var keyCode = e.keyCode;
                    if (keyCode === 37 || keyCode === 38) {
                        _this.prve();
                    } else if (keyCode === 39 || keyCode === 40) {
                        _this.next();
                    }
                });
            }

            $(window).resize(function () {
                var currentLength = _this.switchLength(),
                    offset = _this.settings.direction ? _this.section.eq(_this.index).offset().top : _this.section.eq(_this.index).offset().left;

                if (Math.abs(offset) > currentLength / 2 && _this.index < (_this.pagesCount - 1)) {
                    _this.index ++;
                }
                if (_this.index) {
                    _scrollPage(_this);
                }
            });

            _this.sections.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function () {
                _this.canScroll = true;
                if (_this.settings.callback && type(_this.settings.callback) === 'function') {
                    _this.settings.callback();
                }
            });
        }

        function _scrollPage(_this) {
            var dest = _this.section.eq(_this.index).position();
            if (!dest) {
                return;
            }
            _this.canScroll = false;
            if (_prefix) {
                _this.sections.css(_prefix + 'transition', 'all ' + _this.settings.duration + 'ms ' + _this.settings.easing);
                var translate = _this.direction ? 'translateY(-' + dest.top + 'px)' : 'translateX(-' + dest.left + 'px)';
                _this.sections.css(_prefix + 'transform', translate);
            } else {
                var animateCss = _this.direction ? {top: -dest.top} : {left: -dest.left};
                _this.sections.animate(animateCss, _this.settings.duration, function () {
                    _this.canScroll = true;
                    if (_this.settings.callback && type(_this.settings.callback) === 'function') {
                        _this.settings.callback();
                    }
                });
            }

            if (_this.settings.pagination) {
                _this.pageItem.eq(_this.index).addClass(_this.activeClass).siblings('li').removeClass(_this.activeClass);
            }
        }
        return XSwitch;
    })();

})(jQuery);

$(function () {
    $('[data-XSwitch]').XSwitch();
})
