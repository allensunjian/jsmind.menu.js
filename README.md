# jsmind.menu.js
开源项目jsmind.js的右键扩展插件


###  jsmind.menu.js 文档
 -  #### 说明：该文档是遵循开源规范开发的第一版jsmind插件。
 - #### 功能：包含了 1、完整的右键功能 2、可配置右键功能选项 3、可配置的右键样式重写 4、v1.0.1 版本加入中台操作 5、v1.0.2 版本加入清楚mind默认事件函数preventMindEventDefault
 - #### 依赖 ： jsmind.js   https://github.com/hizzgdev/jsmind
 - 作者： Allen.sun
 - 日期： 2019-12-05
 - #####[v1.0.1版本更新介绍](#jsmind.menu.js  v1.0.1版 文档) 2019-12-9

###正式的介绍

引入顺序：
jsmind.js
jsmind.menu.js

配置menu之前 需要先了解jsmind的配置 http://hizzgdev.github.io/jsmind/developer.html

了解了jsmind功能和配置之后 引入jsmind.menu.js 顺序如： 【引入顺序】

正式开始介绍menu的配置：

初级版：
```javascript
  {                   
    menuOpts:{  // 这里加入一个专门配置menu的对象
      showMenu: true, //showMenu 为 true 则打开右键功能 ，反之关闭
	}
  };
```
简单的配置之后简单版的功能已经形成，我们去看一下：

![](https://github.com/allensunjian/image/blob/master/jsmind.js/1.png)

简单版，分别提供了三个基本功能： 编辑节点(edit node)，添加子节点(append child)，删除节点(delete node)。

#### 想要更多的功能怎么办？

可以根据需要自行配置需要的功能：

```javascript
menuOpts:{
      showMenu: true,
      injectionList: ['edit', 'addChild', 'addBrother', 'delete','showAll','hideAll', 'screenshot', 'showNode', 'hideNode'],  //这是完整的功能列表
    },
```
我们再去看下 实例：

![](https://github.com/allensunjian/image/blob/master/jsmind.js/2.png)

对应的功能分别是： 
- edit node 编辑节点
- append child 新增子节点
- append brother 新增兄弟节点
- delete node 删除节点
- show all 展开全部节点
- hide all 隐藏全部节点
- load mind picture 下载导图 （需要依赖插件jsmind.screenshot.js）
- show target node 展开选中的节点
- hide target node 关闭选中的节点

#### 为什么选项都是英文的呢？答案是与国际接轨...
如果想自定义一个选项，可以尽享如下配置
```javascript
  menuOpts:{
      showMenu: true,
      injectionList: [
          {target:'edit',text: '编辑节点'}, 
          {target:'addChild',text: '添加子节点'},
          {target:'addBrother',text: '添加兄弟节点'},
      ],
    }
```
以下是效果哦~

![](https://github.com/allensunjian/image/blob/master/jsmind.js/3.png)

是不是很满意？

#### 我们的项目需要知道我点了那个选项！这个咋办！
这个我已经都考虑到了~
这样进行配置，你将会得到你想知道的一切！

```javascript
    menuOpts:{
      showMenu: true,
      injectionList: [
          {target:'edit',text: '编辑节点',
              callback: function (node) {
              console.log(node)
              }
          },
          {target:'addChild',text: '添加子节点',
              callback: function (node) {
                  console.log(node)
              }
          },
          {target:'addBrother',text: '添加兄弟节点',
              callback: function (node) {
                  console.log(node)
              }
          }
      ],
    },
```

您可以亲自去试一下~，简单配置一个callback即可

#### 这个右键我们产品觉得太丑了！我改如何重写？

这个.....这个.....试试添加一个style属性你会得到惊喜

```javascript
menuOpts:{
      showMenu: true,
      tipContent: '这是一个新增的提示',
      style: {
          menu:{
				// 控制menu容器的样式
				background: 'red' //添加一个红色的北京
          },
          menuItem:{
                   // 控制条目的样式
				   'font-weight': 700 //文字加粗效果
          },
      }
    },
```

效果这样的！

![](https://github.com/allensunjian/image/blob/master/jsmind.js/4.png)

还是很丑？？ 哈哈那你就自己添加样式属性吧！ 注意事项：样式属性需要时JSON格式的

#### 还有其他人性化的设置吗？

![](https://github.com/allensunjian/image/blob/master/jsmind.js/5.png)

这是什么？

再不选中节点的情况下，单机右键,选中 编辑节点 就会有这样的提示~，原因是 插件没有捕获到节点而无法进行下一步操作，所以说，在没选中节点的情况下，部分功能是无法使用的。

圆规正传，我们是不是可以自定义提示语呢？

可以的

```javascript
    menuOpts:{
      showMenu: true,
      style: {
          menu:{
            background: 'red'
          },
          menuItem:{
            'font-weight': 800
          },
      },
	tipContent: '我要自定义一个提示！！！',
    },
```

就可以啦！

![](https://github.com/allensunjian/image/blob/master/jsmind.js/6.png)





-------------------------------------------END?----------------------------------------------------

no!!!!!

我们有更多的事情去做！

### jsmind.menu.js  v1.0.1版 文档
##### 在 v1.0.1版本中新增了：
- switchMidStage /* Boolean */ 中台开关
- newNodeText /* String */ 新增节点的默认显示名称


说明： switchMidStage为true时，全部的右键功能都会被相应回调函数的参数next控制，执行next则程序会继续往下执行，否则操作会被终止。 不同回调函数中的next对参数的要求略有不同。

解决的问题：针对操作之前的动作进行一次拦截，并主动权交给调用方，比如新增一个节点，需要赋值一个有意义的ID，而不是一个随机产生的ID。包括很多异步操作。
```javascript
menuOpts:{
      showMenu: true,
      switchMidStage: true, //开启中台
      newNodeText:'新的节点',
      injectionList: [
          {target:'edit',text: '编辑节点',
              callback: function (node,next) {
              fn()
              console.log(node)
              }
          },
          {target:'addChild',text: '添加子节点',
              callback: function (node,next) {
			  //next 需要接收一个ID
              console.log(node);
               var r = confirm('bulabulabula')
                   r && fn(Math.random(0, 1000));

              }
          },
          {target:'addBrother',text: '添加兄弟节点',
              callback: function (node,next) {
			  		  //next 需要接收一个ID
                  var r = confirm('bulabulabula')
                  r && fn(Math.random(0, 1000));
              }
          },
          {target:'delete',text: '删除节点',
              callback: function (node,next) {
                  console.log(node)
                  fn();

              }
          },
          {target:'showAll',text: '展开全部节点',
              callback: function (node,next) {
                  console.log(node)
                  fn();

              }
          },
          {target:'hideAll',text: '收起全部节点',
              callback: function (node,next) {
                  console.log(node)
                  fn();

              }
          },
          {target:'screenshot',text: '下载导图',
              callback: function (node,next) {
                  console.log(node)
                  fn();

              }
          },
          {target:'showNode',text: '展开节点',
              callback: function (node ,next) {
                  console.log(node)
                  fn();

              }
          },
          {target:'hideNode',text: '关闭节点',
              callback: function (node,next) {
                  console.log(node)
                  fn();

              }
          },
      ],
      tipContent: '我要自定义一个提示！！！！',
      style: {
          menu:{
            background: 'red'
          },
          menuItem:{
            'font-weight': 800,
          },
      }
    },
```
