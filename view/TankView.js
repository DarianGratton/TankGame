function TankView(tankController) {
    this.tankController = tankController;

    this.canvas = document.getElementById('player1tank');
    this.ctx = this.canvas.getContext('2d');
    this.resetCanvas();

    this.tank = {
        height: 75,
        width: 40
    }

    this.turret = {
        x: this.tank.height / 2,
        y: this.tank.width / 2,
        radius: 12,
        angle: Math.random() * Math.PI * 2
    }

    this.bullets = [];
    this.deltaX = 0;
    this.mouseX = 0;
    this.mouseY = 0;
}

TankView.prototype = {

    init: function () {
        this.addListeners();
    },

    addListeners: function () {

        window.addEventListener('mousemove', (event) => {
            this.tankController.calculateAngle(event);
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });

        $(document).keydown((event) => {
            switch (event.which) {
                case 37: // left arrow key 
                    if (this.turret.x + this.deltaX > 50) {
                        this.deltaX -= 5;
                    }
                    break;
                case 39: // right arrow key
                    if ((this.turret.x + this.deltaX) < (window.innerWidth - 50)) {
                        this.deltaX += 5;
                    }
                    break;
            }
        });

        $("#gameSpace").click(() => {
            this.createBullet();
        });
    },

    resetCanvas: function () {
        this.canvas.width = window.innerWidth * 0.99;
        this.canvas.height = window.innerHeight * 0.80;
    },

    renderGun: function () {
        this.ctx.setTransform(1, 0, 0, 1, this.turret.x + this.deltaX, this.turret.y);

        this.ctx.rotate(this.turret.angle);

        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.rect(0, 0, 60, 0);
        this.ctx.stroke();
    },

    renderTurret: function () {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.beginPath();
        this.ctx.arc(this.turret.x + this.deltaX, this.turret.y, this.turret.radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.strokeStyle = '#000000';
        this.ctx.fill();
    },

    renderTank: function () {
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.rect(0 + this.deltaX, 0, this.tank.height, this.tank.width);
        this.ctx.stroke();
    },

    insideWindow(x, y) {
        return x < this.canvas.width &&
            y < this.canvas.height &&
            x > 0 &&
            y > 0;
    },

    createBullet: function () {
        let angle = this.turret.angle;
        let vx = this.mouseX - (this.turret.x + this.deltaX);
        let vy = this.mouseY - this.turret.y;
        let mouseDist = Math.sqrt(Math.sqrt(Math.abs(vx - (this.turret.x + this.deltaX)))
            + Math.sqrt(Math.abs(vy - this.turret.y)));
        let x = this.turret.x + this.deltaX;
        let y = this.turret.y;

        this.bullets.push({
            x: x,
            y: y,
            mouseDist: mouseDist,
            angle: angle
        });
    },

    updateBulletsPosition: function(bullet, index) {
    
        if (this.insideWindow(bullet.x, bullet.y)) {
            bullet.x += bullet.mouseDist * Math.cos(bullet.angle);
            bullet.y += bullet.mouseDist * Math.sin(bullet.angle);
    
            this.ctx.beginPath()
            this.ctx.arc(bullet.x, bullet.y, this.turret.radius / 2, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fill();
        } else {
            this.bullets.splice(index, 1);
        }

    }, 

    draw: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.renderTurret();
        this.renderTank();
        
        for (let i = 0; i < this.bullets.length; ++i) {
            this.updateBulletsPosition(this.bullets[i], i);
        }

        this.renderGun();
    }
}
