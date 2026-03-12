'use strict';
'require view';
'require dom';

return view.extend({
    render: function() {
        // 从 LuCI 全局环境获取当前的 Session Token
        var currentToken = L.env.sessionid || '';
        
        // 将 Token 作为参数拼接到 iframe 的 src 中
        var iframe = E('iframe', {
            src: '/helloworld/index.html?token=' + currentToken,
            style: 'width: 100%; min-height: 800px; border: none; overflow: hidden;'
        });

        return E('div', { class: 'cbi-map' }, [ iframe ]);
    },
    
    handleSaveApply: null,
    handleSave: null,
    handleReset: null
});
