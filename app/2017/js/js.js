;
(function($, w, d) {

    var defaultvote = 150; //每个节目最初预算
    var needadd = false;
    var isstart = 1;

    /* 设置投票专区距离顶部的距离(canvas的宽度) */
    /* ================================================== */
    setTop();

    function setTop() {
        var win_w = $(window).outerWidth();
        var win_h = $(window).outerHeight();
        var top = 185 * (win_w / 1366);
        $("#showslist").css({ "top": top });
    }
    $(window).resize(function(event) {
        setTop();
    });

    /*  点击开始获取数据的server-send */
    /* ================================================== */
    var getdata = 0;
    $("#start_btn").click(function(event) {
        var _this = this;
        $(this).attr("disabled", "disabled").prop({ "disabled": true });
        setTimeout(function() {
            $(_this).removeAttr("disabled").prop({ "disabled": false });
        }, 2000); //一分钟之后才能恢复点击
        if (!$(_this).hasClass('start')) { //点击开始
            $(_this).addClass('start');
            $(_this).html('结束');
            timeGetdata();
        } else { //点击结束        
            clearTimeout(getdata);
            $(_this).remove();
            gameOver();
        }
    });

    function gameOver() {
        $.ajax({ //结束时最后一次请求
            url: $(".list_content").data("server"),
            type: 'post',
            dataType: 'json',
            data: { events: 0 },            
            timeout: 5000,
            success: function(data) {
                setVote(data);
                //判断是否已经结束投票
                if (data.champion || data.champion != "") {
                    //source.close(); //断开请求
                    for (var j = 0; j < data.champion.length; j++) {
                        if (data.champion[j] || data.champion[j] != 0) {
                            for (var x = 0; x < data.champion[j].length; x++) {
                                $("li#order_" + data.champion[j][x]).addClass('champion_' + (j + 1));
                            }
                        }
                    }
                }
            },
            error: function(data) {
                console.log("后台程序错误！或者延迟");
                gameOver();//如果超过延迟就继续发送请求
            }
        });
    }

    function timeGetdata() {
        $.ajax({ //开始请求数据
            url: $(".list_content").data("server"),
            type: 'post',
            dataType: 'json',
            data: { events: isstart },
            timeout: 1900,
            success: function(data) {
                setVote(data);
            },
            error: function(data) {
                console.log("后台程序错误！或者延迟");
            }
        });
        getdata = setTimeout(function() {
            isstart = 3;
            timeGetdata();
        }, 2000);
    }

    /* 投票器 */
    /* ================================================== */
    function setVote(data) {
        for (var i = 0; i < data.list.length; i++) {
            if (data.list[i].votes > defaultvote - 20) {
                needadd = true;
            }
            var num_w = (parseFloat(data.list[i].votes) / defaultvote * 100).toFixed(2);
            $("li#order_" + data.list[i].order).find(".gressing").css({ "width": num_w + "%" });
            $("li#order_" + data.list[i].order).find(".nownumb").html(data.list[i].votes + "票");
        }
        if (needadd) {
            defaultvote += 20;
            needadd = false;
        }
    }

    /* 弹幕 */
    /* ================================================== */
    // var tm = 0;
    // var danmutime = 0;
    // $("#danmu").danmu({
    //     left: 0,
    //     top: 0,
    //     height: "100%",
    //     width: "100%",
    //     speed: 30000, //弹幕速度，飞过区域的毫秒数 
    //     sumtime: 10000000, //弹幕运行总时间
    //     font_size_small: 32,
    //     font_size_big: 42,
    //     opacity: "1"
    // });
    // $("#danmu_btn").click(function(event) {
    //     $(this).attr("disabled", "disabled").prop({
    //         disabled: true
    //     });
    //     setTimeout(function() {
    //         $(event.target).removeAttr('disabled').prop({
    //             disabled: false
    //         });
    //     }, 500);
    //     if (!$(this).hasClass('active')) {
    //         $('#danmu').danmu('danmu_start');
    //         timeTanmu();
    //         $(this).addClass('active').html('停止');
    //     } else {
    //         $('#danmu').danmu('danmu_stop');
    //         clearTimeout(tm);
    //         $(this).removeClass('active').html('弹幕');
    //     }
    // });

    // function timeTanmu() {
    //     var color = ["#e8352c", "#f53e13", "#f857a3", "#fc9633", "#ff7f02"];
    //     $.ajax({
    //         url: $("#danmu_btn").data("starturl"),
    //         type: 'post',
    //         dataType: 'json',
    //         data: { start: 0 },
    //         success: function(data) {
    //             for (var i = 0; i < data.length; i++) {
    //                 if ($('#danmu').data("nowtime") >= 10000000) {
    //                     $('#danmu').danmu('danmu_stop');
    //                     $('#danmu').danmu('danmu_start');
    //                 }
    //                 var randtime = Math.floor(Math.random() * 100);
    //                 console.log($('#danmu').data("nowtime"), randtime)
    //                 var newd = {
    //                     "text": data[i],
    //                     "color": color[Math.floor(Math.random() * 5)],
    //                     "size": Math.floor(Math.random() * 2),
    //                     "position": "0",
    //                     "time": $('#danmu').data("nowtime") + randtime
    //                 };
    //                 $('#danmu').danmu("add_danmu", newd);
    //             }
    //         },
    //         error: function(data) {
    //             alert("弹幕数据接收错误！");
    //             clearTimeout(tm);
    //         }
    //     });
    //     tm = setTimeout(function() { timeTanmu(); }, 15000);
    // }

    // function timedCount() {
    //     $("#time").text($('#danmu').data("nowtime"));
    //     t = setTimeout("timedCount()", 50)

    // }

    /* 烟火效果 */
    /* ================================================== */
    fireWorks();

    function fireWorks() {
        // Options
        var options = {
            startingHue: 120, //其实色调
            clickLimiter: 6, //最多出现的烟花数量
            timerInterval: 8, //多长时间发送一枚烟花
            showTargets: false, //是否开启点击提示
            rocketSpeed: 20, //烟花发送速度
            rocketAcceleration: 80, //移动加速度
            particleFriction: 0.95, //烟花数量
            particleGravity: 1, //烟花分散的方向
            particleMinCount: 25, //烟花最少数量
            particleMaxCount: 40, //烟花最多数量
            particleMinRadius: 2, // 烟花最小半径
            particleMaxRadius: 3 // 烟花最大半径
        };

        // Local variables
        var fireworks = [];
        var particles = [];
        var mouse = { down: false, x: 0, y: 0 };
        var currentHue = options.startingHue;
        var clickLimiterTick = 0;
        var timerTick = 0;
        var cntRocketsLaunched = 0;

        // Helper function for canvas animations
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function(cb) {
                    window.setTimeout(callback, 1000 / 60);
                }
        })();

        // Helper function to return random numbers within a specified range
        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        // Helper function to calculate the distance between 2 points
        function calculateDistance(p1x, p1y, p2x, p2y) {
            var xDistance = p1x - p2x;
            var yDistance = p1y - p2y;
            return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
        }

        // Setup some basic variables
        var canvas = document.getElementById('fire_canvas');
        var canvasCtx = canvas.getContext('2d');
        var canvasWidth = $(window).outerWidth() - 10;
        var canvasHeight = $(window).outerHeight() - 10;

        // Resize canvas
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Firework class
        function Firework(sx, sy, tx, ty) {
            // Set coordinates (x/y = actual, sx/sy = starting, tx/ty = target)
            this.x = this.sx = sx;
            this.y = this.sy = sy;
            this.tx = tx;
            this.ty = ty;

            // Calculate distance between starting and target point
            this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
            this.distanceTraveled = 0;

            // To simulate a trail effect, the last few coordinates will be stored
            this.coordinates = [];
            this.coordinateCount = 3;

            // Populate coordinate array with initial data
            while (this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }

            // Some settings, you can adjust them if you'd like to do so.
            this.angle = Math.atan2(ty - sy, tx - sx);
            this.speed = options.rocketSpeed;
            this.acceleration = options.rocketAcceleration;
            this.brightness = random(50, 80);
            this.hue = currentHue;
            this.targetRadius = 1;
            this.targetDirection = false; // false = Radius is getting bigger, true = Radius is getting smaller

            // Increase the rockets launched counter
            cntRocketsLaunched++;
        };

        // This method should be called each frame to update the firework
        Firework.prototype.update = function(index) {
            // Update the coordinates array
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);

            // Cycle the target radius (used for the pulsing target circle)
            if (!this.targetDirection) {
                if (this.targetRadius < 8)
                    this.targetRadius += 0.15;
                else
                    this.targetDirection = true;
            } else {
                if (this.targetRadius > 1)
                    this.targetRadius -= 0.15;
                else
                    this.targetDirection = false;
            }

            // Speed up the firework (could possibly travel faster than the speed of light) 
            this.speed *= this.acceleration;

            // Calculate the distance the firework has travelled so far (based on velocities)
            var vx = Math.cos(this.angle) * this.speed;
            var vy = Math.sin(this.angle) * this.speed;
            this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

            // If the distance traveled (including velocities) is greater than the initial distance
            // to the target, then the target has been reached. If that's not the case, keep traveling.
            if (this.distanceTraveled >= this.distanceToTarget) {
                createParticles(this.tx, this.ty);
                fireworks.splice(index, 1);
            } else {
                this.x += vx;
                this.y += vy;
            }
        };

        // Draws the firework
        Firework.prototype.draw = function() {
            var lastCoordinate = this.coordinates[this.coordinates.length - 1];

            // Draw the rocket
            canvasCtx.beginPath();
            canvasCtx.moveTo(lastCoordinate[0], lastCoordinate[1]);
            canvasCtx.lineTo(this.x, this.y);
            canvasCtx.strokeStyle = 'hsl(' + this.hue + ',100%,' + this.brightness + '%)';
            canvasCtx.stroke();

            // Draw the target (pulsing circle)
            if (options.showTargets) {
                canvasCtx.beginPath();
                canvasCtx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
                canvasCtx.stroke();
            }
        };

        // Particle class
        function Particle(x, y) {
            // Set the starting point
            this.x = x;
            this.y = y;

            // To simulate a trail effect, the last few coordinates will be stored
            this.coordinates = [];
            this.coordinateCount = 5;

            // Populate coordinate array with initial data
            while (this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }

            // Set a random angle in all possible directions (radians)
            this.angle = random(0, Math.PI * 2);
            this.speed = random(1, 10);

            // Add some friction and gravity to the particle
            this.friction = options.particleFriction;
            this.gravity = options.particleGravity;

            // Change the hue to a random number
            this.hue = random(currentHue - 1, currentHue + 1);
            this.brightness = random(50, 80);
            this.alpha = 1;

            // Set how fast the particles decay
            this.decay = random(0.01, 0.03);
        }

        // Updates the particle, should be called each frame
        Particle.prototype.update = function(index) {
            // Update the coordinates array
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);

            // Slow it down (based on friction)
            this.speed *= this.friction;

            // Apply velocity to the particle
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;

            // Fade out the particle, and remove it if alpha is low enough
            this.alpha -= this.decay;
            if (this.alpha <= this.decay) {
                particles.splice(index, 1);
            }
        }

        // Draws the particle
        Particle.prototype.draw = function() {
            var lastCoordinate = this.coordinates[this.coordinates.length - 1];
            var radius = Math.round(random(options.particleMinRadius, options.particleMaxRadius));

            // Create a new shiny gradient
            var gradient = canvasCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
            gradient.addColorStop(0.0, 'white');
            gradient.addColorStop(0.1, 'yellow');
            gradient.addColorStop(0.1, 'hsla(' + this.hue + ',100%,' + this.brightness + '%,' + this.alpha + ')');
            gradient.addColorStop(0.8, 'red');

            // Draw the gradient
            canvasCtx.beginPath();
            canvasCtx.fillStyle = gradient;
            canvasCtx.arc(this.x, this.y, radius, Math.PI * 2, false);
            canvasCtx.fill();
        }

        // Create a bunch of particles at the given position
        function createParticles(x, y) {
            var particleCount = Math.round(random(options.particleMinCount, options.particleMaxCount));
            while (particleCount--) {
                particles.push(new Particle(x, y));
            }
        }

        // Add an event listener to the window so we're able to react to size changes
        window.addEventListener('resize', function(e) {
            canvas.width = canvasWidth = $(window).outerWidth() - 10;
            canvas.height = canvasHeight = $(window).outerHeight() - 10;
        });

        // Add event listeners to the canvas to handle mouse interactions
        canvas.addEventListener('mousemove', function(e) {
            e.preventDefault();
            mouse.x = e.pageX - canvas.offsetLeft;
            mouse.y = e.pageY - canvas.offsetTop;
        });

        canvas.addEventListener('mousedown', function(e) {
            e.preventDefault();
            mouse.down = true;
        });

        canvas.addEventListener('mouseup', function(e) {
            e.preventDefault();
            mouse.down = false;
        });

        // Main application / script, called when the window is loaded
        function gameLoop() {
            // This function will rund endlessly by using requestAnimationFrame (or fallback to setInterval)
            requestAnimFrame(gameLoop);

            // Increase the hue to get different colored fireworks over time
            currentHue += 0.5;

            // 'Clear' the canvas at a specific opacity, by using 'destination-out'. This will create a trailing effect.
            canvasCtx.globalCompositeOperation = 'destination-out';
            canvasCtx.fillStyle = 'rgba(255,255,255,0.1)';
            canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
            canvasCtx.globalCompositeOperation = 'lighter';

            // Loop over all existing fireworks (they should be updated & drawn)
            var i = fireworks.length;
            while (i--) {
                fireworks[i].draw();
                fireworks[i].update(i);
            }

            // Loop over all existing particles (they should be updated & drawn)
            var i = particles.length;
            while (i--) {
                particles[i].draw();
                particles[i].update(i);
            }

            // Draw some text
            canvasCtx.fillStyle = 'white';
            canvasCtx.font = '0px Arial';
            canvasCtx.fillText('Rockets launched: ' + cntRocketsLaunched, 10, 24);

            // Launch fireworks automatically to random coordinates, if the user does not interact with the scene
            if (timerTick >= options.timerInterval) {
                if (!mouse.down) {
                    fireworks.push(new Firework(canvasWidth / 2, canvasHeight, random(0, canvasWidth), random(0, canvasHeight / 2)));
                    timerTick = 0;
                }
            } else {
                timerTick++;
            }

            // Limit the rate at which fireworks can be spawned by mouse
            if (clickLimiterTick >= options.clickLimiter) {
                if (mouse.down) {
                    fireworks.push(new Firework(canvasWidth / 2, canvasHeight, mouse.x, mouse.y));
                    clickLimiterTick = 0;
                }
            } else {
                clickLimiterTick++;
            }
        }

        window.onload = gameLoop();
    }

})(jQuery, window, document);
