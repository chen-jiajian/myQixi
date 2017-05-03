 $(function() {
    
        var container = $("#content");
        var swipe = Swipe(container);
        var visualWidth = container.width();
        var visualHeight=container.height();
        var boy=BoyWalk();
         // 获取数据
        var getValue = function(className) {
            var $elem = $('' + className + '')
            // 走路的路线坐标
            return {
                height: $elem.height(),
                top: $elem.position().top
            };
        };
        // 桥的Y轴
        var bridgeY = function() {
            var data = getValue('.c_background_middle');
            return data.top;
        }();
        // 页面滚动到指定的位置
        function scrollTo(time, proportionX) {
            var distX = container.width() * proportionX;
            swipe.scrollTo(distX, time);
            
        }
        
        //小女孩 //
        var girl = {
            elem: $('.girl'),
            getHeight: function() {
                return this.elem.height();
            },
            getOffset: function() {
                return this.elem.offset();
            },
            setOffset: function() {
                this.elem.css({
                    left: visualWidth / 2,
                    top: bridgeY - this.getHeight()
                });
            },
             getWidth: function() {
                return this.elem.width();
            }
        };

        // 修正小女孩位置
        girl.setOffset();
        // 音乐配置
        var audioConfig = {
            enable: true, // 是否开启音乐
            playURl: 'music/happy.wav', // 正常播放地址
            cycleURL: 'music/circulation.wav' // 正常循环播放地址
        };
        //飞鸟
         var bird = {
            elem: $(".bird"),
            fly: function() {
                this.elem.addClass('birdFly')
                this.elem.transition({
                    right: container.width()
                }, 15000, 'linear');
            }
        };
        /////////
        //背景音乐 //
        /////////
        function Hmlt5Audio(url, isloop) {
            var audio = new Audio(url);
            audio.autoPlay = true;
            audio.loop = isloop || false;
            audio.play();
            return {
                end: function(callback) {
                    audio.addEventListener('ended', function() {
                        callback();
                    }, false);
                }
            };
        }
        $('#btn_start').click(function(){
            // 太阳公转
            $("#sun").addClass('rotation');
            // 飘云
            $(".cloud:first").addClass('cloud1Move');
            $(".cloud:last").addClass('cloud2Move');
            /*音乐*/
            var audio1 = Hmlt5Audio(audioConfig.playURl);
            audio1.end(function() {
                Hmlt5Audio(audioConfig.cycleURL, true);
            });
            //走路到中心
            boy.walkTo(5000,0.5,0)
            
            .then(function(){
                 scrollTo(10000, 1);//滑动的的时间，滑动距离的比例
                 
            })
            
            //第二次走
            .then(function(){
                return boy.walkTo(10000,0.5);//必须限制有先后关系的一定要用return
            })
            .then(function() {
                //暂停走路
                boy.stopWalk();
            }).then(function(){
                //开门
                return boy.openDoor(2000);          
            }).then(function(){
                //亮灯
                boy.lamp().bright();              
            }).then(function(){
                //进商店
                return boy.toShop();
            }).then(function(){
                //取花
                return boy.talkFlower();
            }).then(function(){
                //出商店
                return boy.outShop();
            }).then(function(){
                //暂停走路
                 boy.stopWalk();
            }).then(function(){
                //小鸟飞过
                bird.fly();
                // 关门
                return boy.closeDoor(2000);
            }).then(function() {
                // 灯暗
                 boy.lamp().dark();
            }).then(function() {
                // 继续走
                 scrollTo(5000,2);
                 return boy.walkTo(5000, 0.15);
            }).then(function() {
                // 往桥上走
               return boy.walkTo(2000, 0.25, (girl.getOffset().top ) / visualHeight);
            }).then(function() {
                // 走到女孩身边
                var boyWidth = $("#boy").width();
                var girlLeft = girl.getOffset().left;
                var pro = ( girlLeft - boyWidth)/visualWidth;   
               return boy.walkTo(2500, pro);
            }).then(function() {
                boy.stopWalk();
            })

            // 第一次走路到桥底边left,top
             //scrollTo(1,2)
            /*boy.walkTo(2000, 0.15)
            .then(function() {
                // 第二次走路到桥上left,top
                console.log(bridgeY);
                return boy.walkTo(1500, 0.25, (bridgeY - girl.getHeight()) / visualHeight);
            })
            .then(function() {
                // 实际走路的比例
                var proportionX = (girl.getOffset().left - boy.getWidth() + girl.getWidth() / 5) / visualWidth;
                // 第三次桥上直走到小女孩面前
                return boy.walkTo(1500, proportionX);
            }).then(function() {
                // 图片还原原地停止状态
                //boy.resetOriginal();
            });*/
            
        });
        $('#btn_stop').click(function(){
            boy.closeDoor(2000);
        })
    });