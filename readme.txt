1.��start.bat���Կ�ʼ�༭���롣��build���԰����ɴ���ļ�������dist�ļ����档
2.mock�� .roadhogrc.mock�������ɼ����ݣ��ں�̨�Ľӿڻ�û�п�ʼд��ʱ��Ȼ����config.local��������޸�Զ�̽����ַ��
3.api�ĵ�������eolinkerд�ģ����Ե�www.eolinker.com�����Ŀ¼�ģ�eolinker_export_xx.export���ļ�,����������

ui�����https://mobile.ant.design/components/icon-cn/
����ĵ���https://github.com/dvajs/dva
��Ŀ�ṹ��

assets���þ�̬��Դ��ͼƬ����̬css֮��ġ�
baseΪ��������extends�̳�һЩ�࣬Ȼ��ʵ�����еķ�ʽ�����ص�BaseComponents��
componentsΪ��Ŀ�����������
--antdComponentΪ������롣�����������ؿ���ֱ�����á�
--lazyComponentΪ����������������õ������������һ������Ȼ��ȵ����سɹ�֮������á����ӿ��������ݼ��أ�
������:DatePicker�����300k��Ȼ��·�����õĻ�����ȵ���300k����֮��ҳ�����ʾ������ɰ�����loading������,ʹ�������ؿ����ȼ��������������ʾ����ҳ�����ݣ�Ȼ��ȵ���300k������֮�����ʹ��DatePicker���ܣ����������������ò�ȫ����ref�������⣬������ο�ScrollListView���������
configΪ�����ļ���(�û����ֱ��غʹ������)
coreΪ���Ĵ���Ŀ¼��д��һ��BaseComponent��ȫ����·�ɼ̳�����
data����һЩ���ݣ��������п���Ϣ������λ����Ϣ
extentds����һЩʵ�������ļ�����д������ķ��������Է��õ�BaseComponent��prototype�ϻᱻֱ��ʵ����������ͨ��this.**���ʵ���
helpsΪ���õĹ��ߺ�����
modelsΪȫ�����ݡ�������localStorage�ϡ���΢�Ŵ��localStorageʱ���е�ˣ��������ñ������ѡ�������cookie�ϣ�
routesΪ·���ļ������·�ɣ�������routes�ļ��е���·��Ȼ����router.js���á�
vendor.js��ȡһЩ���õ��ļ���Ӧ�õ��ļ��ᱻ�����common.js�ļ���common.css�ϡ�


*�������΢�����������html�ļ������������������html��ǩ����manifest="IGNORE.manifest",���Կɲ����Խ����
����HTML5 W3C�淶������������manifest header 404/410ʱ�����漴ʧЧ
���� http://www.w3.org/TR/html5/browsers.html#downloading-or-updating-an-application-cache "5.7.4 Downloading or updating an application cache > 5.If fetching the manifest fails due to a 404 or 410"��
�÷������������Լ�������ƺͻ�������Ӧ��Ҳ����Ч��




