import { useEffect, useState } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState('');
  const [token, setToken] = useState('');

  // 组件挂载时，从 URL 参数中获取 LuCI 传来的 Token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (urlToken) {
      setToken(urlToken);
    } else {
      setStatus('未检测到登录状态，请先登录 Luci 路由器后台。');
    }
  }, []);

  const handleSave = async () => {
    if (!token) {
      setStatus('无有效 Token，无法发起请求。');
      return;
    }

    try {
      const response = await fetch('/ubus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "call",
          params: [
            token,                // 使用 URL 中提取的真实 Token
            "helloworld",
            "set_text",
            { text: inputText }
          ]
        })
      });

      const result = await response.json();

      // 增加严谨的数组越界和状态码判断
      if (result.error) {
        setStatus(`调用失败：${result.error.message} (代码: ${result.error.code})`);
      } else if (Array.isArray(result.result)) {
        const ubusStatus = result.result[0];

        if (ubusStatus === 2) {
          setStatus('保存成功！内容已写入 /tmp/test.txt');
        } else {
          setStatus(`后端报错：未知的 Ubus 状态码 ${ubusStatus}`);
        }
      } else {
        setStatus('保存异常，接口返回了无法解析的格式。');
      }
    } catch (error) {
      setStatus('网络错误或接口无响应。');
      console.log(error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>HelloWorld</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="请输入要保存的内容"
          style={{ padding: '8px', width: '300px' }}
        />
        <button type="button" onClick={handleSave} style={{ padding: '8px 16px', marginLeft: '10px' }}>
          保存并应用
        </button>
      </div>
      {status && (
        <p style={{ color: status.includes('成功') ? 'green' : 'red', fontWeight: 'bold' }}>
          {status}
        </p>
      )}
    </div>
  );
}

export default App;