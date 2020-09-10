raysonsupportos
=============
雷盛售后系统前端部分


所需软件
-----

1、Nginx v1.16.1

2、Git v2.17.1

3、Go v1.13 linux/amd64

4、Mysql


域名绑定、301转向及nginx配置
-----

1、新建配置文件: ``sudo nano /etc/nginx/sites-available/raysonsupport.com``

2、编辑配置文件及保存: 

    server {
        listen 443 ssl http2;
        server_name raysonsupport.com;
        ssl_certificate raysonsupport.pem;
        ssl_certificate_key raysonsupport.key;
        index index.html;
        root /srv/raysonsupportweb/;
        add_header Strict-Transport-Security "max-age=15768000" always;
        ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5:!DH;
        ssl_prefer_server_ciphers on;
        location ~ /api/(.*)$ {
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For  $proxy_add_x_forwarded_for;
            proxy_pass http://127.0.0.1:9001;
        }
        location /search.html {
            auth_basic "请输入账号密码";
            auth_basic_user_file search;
        }
        location /cangguan.html {
            auth_basic "请输入账号密码";
            auth_basic_user_file cangguan;
        }
        location /roger.html {
            auth_basic "请输入账号密码";
            auth_basic_user_file roger;
        }
        location /anlytics.html {
            auth_basic "请输入账号密码";
            auth_basic_user_file cangguan;
        }
    }
    server {
        listen 443 ssl http2;
        server_name www.raysonsupport.com;
        ssl_certificate raysonsupport.pem;
        ssl_certificate_key raysonsupport.key;
        return 301 https://raysonsupport.com$request_uri;
    }
    server {
        listen 80;
        server_name raysonsupport.com www.raysonsupport.com;
        return 301 https://raysonsupport.com$request_uri;
    }

3、建立链接: ``sudo ln -s /etc/nginx/sites-available/raysonsupport.com /etc/nginx/sites-enabled/``

4、重启nginx: ``sudo service nginx restart``


下载源码到服务器
-----
A. 前端部分：将前端源码下载到/srv/目录下

1、``cd /srv``

2、``git clone git@github.com:zackwong/raysonsupportweb.git``

B. 后端部分：将前端源码下载到/srv/go/src/目录下

1、新建目录/srv/go/src

2、``cd /srv/go/src``

3、``git clone git@github.com:zackwong/raysonsupportos.git``


数据库建立
-----

1、将后端部分raysonsupportos/beifen/mysql/raysondata.sql文件所有代码复制

2、把复制的代码粘贴到数据库管理软件中的命令窗口，并且执行


删除项目多余文件
-----

删除后端部分raysonsupportos中beifen文件夹。


程序启动
-----
A. 确保在`/srv/go/src/raysonsupportos`依次执行如下命令:

1、``cd /srv/go/src/raysonsupportos``

2、``export GOPATH=/srv/go``该命令只对当前终端有效，打开新的终端需要再次执行该命令

3、``go get -v``该命令用于下载raysonsupportos的所有依赖，这些依赖将被下载到GOPATH/src（即 /srv/go/src）目录下，所以/srv/go/src目录下最好都只放go语言的程序

4、``go build``

B. 此时目录下将生成raysonsupportos可执行文件，在`/srv/src/raysonsupportos`目录下执行如下命令启动服务(二选一):

1、前台启动: ``./raysonsupportos /srv/go/src/raysonsupportos/data/conf/conf.yaml``，前台启动指的是跟当前终端绑定启动，日志直接通过终端输出来，终端关了程序也就停了。

2、后台启动（首选此项）: ``nohup ./raysonsupportos /srv/go/src/raysonsupportos/data/conf/conf.yaml > access.log 2>&1 &``，后台启动就算终端断开连接程序也会继续运行 日志会存到access.log里。

若在``/srv/src/raysonsupportos``目录下启动服务将使用默认的``/srv/src/raysonsupportos/data/conf/conf.yaml``作为配置文件。

注意：前台启动可以用来快速测试能不能启动成功，最终还是要使用后台启动。


检查程序是否启动
-----
1、查看日志``tail -f access.log``

2、日志有如下输出说明启动成功:

```text
read config file from: /srv/src/raysonsupportos/data/conf/conf.yaml
parse config success
run mode: prod
app name: raysonsupportos
log file path: data/log/access.log
2019/10/03 16:04:21 [Info] Successfully connected to the database
2019/10/03 16:04:21 [Info] Success started server and listen 9001 ports
```

源代码更新后，程序需重新启动
-----
1、按照程序启动栏目A执行

2-1、通过命令``ps -ef|grep rayson``查看服务是否启动

```text
root     11899(此数字为PID) 10964  0 22:00 tty1     00:00:00 ./raysonsupportos /srv/go/src/raysonsupportos/data/conf/conf.yaml
root     12315 12230  0 22:31 pts/0    00:00:00 grep --color=auto rayson
`````

2-2、若启动则通过命令``kill -9 PID``将进程杀掉，此处实际命令为``kill -9 11899``

3、按照程序启动栏目B执行


部分代码说明
---------

1、修改搜索结果每页显示条数，在前端raysonsupportweb/assets/util.js文件，找到const defaultPageSize = 20，数字20代表显示条数。

2、修改搜索日期和保修日期下拉菜单显示年份，在前端raysonsupportweb/assets/util.js文件，找到minYear: 2019, maxYear: 2026，其中minYear表示开始年份，maxYear结束年份，月份和日期系统自动显示，不需修改。


开发者
---------

* Zack Wong &lt;hzzzoo@126.com&gt;
