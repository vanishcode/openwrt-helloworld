include $(TOPDIR)/rules.mk

PKG_NAME:=helloworld
PKG_VERSION:=1.0.0
PKG_RELEASE:=1

include $(INCLUDE_DIR)/package.mk

define Package/helloworld
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:=HelloWorld App (C++ & React)
  DEPENDS:=+libstdcpp +rpcd +rpcd-mod-file +uhttpd
endef

define Package/helloworld/description
  A HelloWorld application using C++ backend and React frontend.
endef

# 准备编译环境：将 src 拷贝到编译目录
define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
	$(CP) ./src/* $(PKG_BUILD_DIR)/
endef

# 安装文件到最终的打包目录
define Package/helloworld/install
	# 安装 C++ 二进制文件
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/helloworld $(1)/usr/bin/

	# 拷贝整个 root 目录（包含 rpcd 脚本和前端页面）到系统根目录
	$(CP) ./root/* $(1)/

	# 确保 rpcd 脚本具有可执行权限
	chmod +x $(1)/usr/libexec/rpcd/helloworld
endef

$(eval $(call BuildPackage,helloworld))
