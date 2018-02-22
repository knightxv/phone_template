1.打开start.bat可以开始编辑代码。打开build可以把生成打包文件，放置dist文件里面。
2.mock， .roadhogrc.mock可以生成假数据，在后台的接口还没有开始写的时候，然后在config.local里面可以修改远程接入地址。
3.api文档是利用eolinker写的，可以到www.eolinker.com导入根目录的（eolinker_export_xx.export）文件,方便升级。

ui组件：https://mobile.ant.design/components/icon-cn/
框架文档：https://github.com/dvajs/dva
项目结构：

assets放置静态资源。图片，静态css之类的。
base为公共包。extends继承一些类，然后实现其中的方式并挂载到BaseComponents上
components为项目公用组件包。
--antdComponent为组件代码。若不想懒加载可以直接引用。
--lazyComponent为懒加载组件。被引用的组件，会生成一个包，然后等到加载成功之后才引用。（加快首屏数据加载）
（比如:DatePicker组件有300k，然后路由引用的话，会等到这300k加载之后页面才显示，会造成白屏（loading过长）,使用懒加载可以先加载其他组件，显示其他页面数据，然后等到这300k加载完之后才能使用DatePicker功能，不过会造成组件引用不全，和ref引用问题，遇到请参考ScrollListView解决方案）
config为配置文件。(用户区分本地和打包环境)
core为核心代码目录（写了一个BaseComponent，全部的路由继承它）
data放置一些数据，比如银行卡信息，地理位置信息
extentds放置一些实例化的文件。（写在里面的方法和属性放置到BaseComponent的prototype上会被直接实例出来，并通过this.**访问到）
helps为公用的工具函数。
models为全局数据。放置在localStorage上。（微信存放localStorage时间有点端，若想永久保存可以选择放置在cookie上）
routes为路由文件。添加路由，定义在routes文件夹底下路由然后由router.js引用。
vendor.js提取一些公用的文件，应用的文件会被打包在common.js文件和common.css上。


*如果遇到微信浏览器缓存html文件的情况（可以试试在html标签加上manifest="IGNORE.manifest",试试可不可以解决）
根据HTML5 W3C规范，解析器下载manifest header 404/410时，缓存即失效
（见 http://www.w3.org/TR/html5/browsers.html#downloading-or-updating-an-application-cache "5.7.4 Downloading or updating an application cache > 5.If fetching the manifest fails due to a 404 or 410"）
该方法对其它有自己缓存机制和缓存规则的应用也有奇效。




