~function (global) {
  var tankGame = this
  global.tankGame = tankGame
  var destType = {up: 0, right: 1, down: 2, left: 3} // 表示坦克方向
  var mineTank // 当前用户的坦克
  var bullet // 子弹
  var config = {
    bounUp: 0, // 坦克的绘制边界
    bounLeft: 0, 
    bountRight: 0,
    boutnDown: 0
  }// 坦克游戏的配置
  var start // 游戏的的开始时间
  var tankStartTime // 坦克开始移动的时间

  // 坦克4个方向的图片
  config.tankImgs = {
    up: _getImgObj('./img/tank2-up.jpg'),
    right: _getImgObj('./img/tank2-right.jpg'),
    down: _getImgObj('./img/tank2-down.jpg'),
    left: _getImgObj('./img/tank2-left.jpg')
  }
  var $ = document.querySelector.bind(global.document)
  this.destType = destType // 方向
  // this.canMove = false // 为false时坦克不移动, true时移动


  this.tanks = [] // 所有坦克保存在这时

  // 坦克的构造函数
  function Tank (options) {
    console.log(tankGame)
    // 当前用户的坦克
    this.id = tankGame.uuid() // 唯一的id
    this.name = '' // 用户名
    this.speed = 10 // 速度
    this.direction = destType.up
    this.life = 1 // 生命数
    this.lifeVal = 1 // 生命值
    this.bullets = [] // 当前坦克的子弹
    this.canMove = false // 为false时坦克不移动, true时移动
    this.x = 0 // 坐标
    this.y = 0
    this.w = 80 // 宽
    this.h = 80 // 高
    for (key in options) {
      if (options.hasOwnProperty(key) || !options[key]) {
        continue
      }
      this[key] = options[key]
    }
  }

  /**
   * 用户进行配置的方法
   * @param  {Object} options 配置对象
   * @return {booleam}         如果配置失败，返回false,通常返回true
   */
  this.config = function (options) {
    true
  }

  this.uuid = function () {
      var i, random;
      var uuid = ''

      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16)
      }
      return uuid
    }
  /**
   * 给自己的坦克添加一个要发射的子弹
   */
  this.addBullet = function () {

  }

  /**
   * 添加一个其他人的坦克
   */
  this.addTank = function () {

  }

  /**
   * 绘制单个子弹
   * @param  {Object} bullet 一个子弹对象
   */
  this.drawBullet = function (bullet) {

  }

  /**
   * 绘制一组子弹对象
   * @param  {[Array]} bullets 一组bullet
   */
  this.drawBullets = function (bullets) {
    bullets.forEach(function (bullet) {
      this.drawBullet(bullet)
    })
  }

  /**
   * 绘制一个坦克
   * @param  {Object} tank 一个坦克对象
   */
  this.drawTank = function (diff, tank) {
    // console.log(diff, tank)
    var deg = tank.direction * 90 * Math.PI / 180
    var x = tank.x
    var y = tank.y
    var img
    console.log(tank.direction)
    // 根据坦克的方向展示不同的图片
    switch (tank.direction) {
      case 0 : // 上
      img = config.tankImgs.up
      break
      case 1 :
      img = config.tankImgs.right
      break
      case 2 :
      img = config.tankImgs.down
      break
      case 3 :
      img = config.tankImgs.left
      break
    }

    // 控制是否要移动
    if (this.mineTank.canMove) {
      switch (tank.direction) {
        case 0 : // 上
        y -= tank.speed * diff / 1000
        y = y < config.bounUp ? config.bounUp : y
        break
        case 1 :
        x += tank.speed * diff / 1000
        // console.log(config.bountRight)
        // x = x > 200 ? 200 : x
        x = x > config.bountRight ? config.bountRight : x
        break
        case 2 :
        y += tank.speed * diff / 1000
        // y = y > 200 ? 200 : y
        y = y > config.bountDown ? config.bountDown : y
        break
        case 3 :
        x -= tank.speed * diff / 1000
        x = x < config.bounLeft ? config.bounLeft : x
        break
      }
    }
    tank.x = x
    tank.y = y
    this.ctx.drawImage(img, tank.x, tank.y, tank.w, tank.h)
    this.drawBullets(tank.bullets)
  }

  /**
   * 绘制一组坦克对象
   * @param  {Array} tanks 数组
   */
  this.drawTanks = function (diff) {
    this.tanks.forEach(this.drawTank.bind(this, diff))
  }.bind(this)

  /**
   * 注册事件
   * @return {[type]} [description]
   */
  this.bindEvents = function () {
    this.oCanvas.addEventListener('keydown', this.keydown.bind(this))
    this.oCanvas.addEventListener('keyup', this.keyup.bind(this))
  }.bind(this)

  this.keyup = function (e) {
     // W/S/D/A
     if ([87, 68, 83, 65].indexOf(e.keyCode) !== -1) {
       tankStartTime = undefined
       this.mineTank.canMove = false
     }
  }

  this.keydown = function (e) {
    var direction = this.destType.up
    switch(e.keyCode) {
      case 87: // W
      direction = this.destType.up
      break
      case 68: // D
      direction = this.destType.right
      break
      case 83: // S
      direction = this.destType.down
      break
      case 65: // A
      direction = this.destType.left
      break
    }

    this.mineTank.direction = direction
    this.mineTank.canMove = true
  }.bind(this)
  /**
   * 启动一个游戏
   * @param  {[Object]} options 配置选项
   * @return {[type]}         [description]
   */
  this.start = function (options) {
    var oCanvas = $(options.el)
    if (!oCanvas.getContext) {
      console.log('浏览器！不支持canvas')
      return
    }
    var ctx = oCanvas.getContext('2d')
    this.oCanvas = oCanvas
    this.ctx = ctx
    this.oCanvas.focus()
    // 初始化当前用户的坦克
    mineTank = new Tank()

    // 让坦克的绘制边界为canvas的宽高
    config.bountRight = oCanvas.width - mineTank.w
    config.bountDown = oCanvas.height - mineTank.h


    this.tanks.push(mineTank)
    this.mineTank = mineTank // 当前用户坦克
    this.bindEvents()

    global.requestAnimationFrame(_animatedCallback)

  }.bind(this)
  

  function _animatedCallback (timeStamp) {
    tankGame.oCanvas.height = tankGame.oCanvas.height
    if (tankGame.mineTank.canMove) {
      var diffTank // 两将_animatedCallback之间的时间差
      tankStartTime = !tankStartTime ? timeStamp : tankStartTime
      diffTank = timeStamp - tankStartTime
    }
    tankGame.drawTanks(diffTank)
    start = !start ? timeStamp : start
    global.requestAnimationFrame(_animatedCallback)
  }

  function _getImgObj (src) {
    var oImg = new Image()
    oImg.src = src
    return oImg
  }

}.bind({})(window);

// options选项
// el: string, 需要进行绘制的canvas元素，选择器
