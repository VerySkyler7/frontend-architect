## 来源
http://www.zhufengpeixun.com/grow/html/125.11.docker.html

## 1.docker 安装
1.1 安装命令
```
<!-- docker需要依赖的软件 -->
yum install -y yum-utils   device-mapper-persistent-data   lvm2
<!-- 指定docker的安装源 -->
yum-config-manager     --add-repo     https://download.docker.com/linux/centos/docker-ce.repo
<!-- 安装docker -->
yum install docker-ce docker-ce-cli containerd.io -y
```
1.2 启动docker
```
systemctl start docker
```
1.3 查看docker版本
```
docker version
```

2. docker 命令