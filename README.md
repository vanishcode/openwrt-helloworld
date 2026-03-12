# helloworld

build openwrt luci app run in docker

```shell
docker pull openwrt/sdk:rockchip-armv8-25.12.0

cd /workspace/openwrt

docker run --rm -it --platform linux/amd64 -v $(pwd)/helloworld:/builder/package/helloworld openwrt/sdk:rockchip-armv8-25.12.0 /bin/bash

make menuconfig

make package/helloworld/compile V=s

cp ./bin/packages/aarch64_generic/base/helloworld-1.0.0-r1.apk ./package/helloworld/dist/

scp -O ./helloworld/dist/helloworld-1.0.0-r1.apk root@192.168.2.1:/tmp/
```
