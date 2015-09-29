1. 使用nginx.conf启动nginx服务器
2. 打开charles, 设置mac proxy 
3. host文件，

host如下：
```
192.168.0.101 test.com
```

4. 在手机端设置wifi连接的代理服务器为局域网mac的ip地址和proxy端口，

然后访问test.com，此时charles会提示是否允许手机连接，选“是”，就可以访问了。
