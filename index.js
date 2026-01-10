const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// 配置信息
const ZEABUR_TOKEN = process.env.ZEABUR_TOKEN || "sk-cwn4274ldchwz6m2b7mk7xrpb66ej";
const SERVICE_ID = process.env.SERVICE_ID || "service-69620260d9479ab33ad43fcb";

app.get('/', (req, res) => {
    res.send(`
        <html>
            <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#f0f2f5;">
                <div style="background:white;padding:2rem;border-radius:1rem;box-shadow:0 0.5rem 1rem rgba(0,0,0,0.1);text-align:center;">
                    <h2>Zeabur Controller v1.3.1</h2>
                    <p>Service: ${SERVICE_ID}</p>
                    <button onclick="control('resume')" style="background:#0070f3;color:white;border:none;padding:1rem 2rem;border-radius:0.5rem;cursor:pointer;margin:0.5rem;font-weight:bold;">启动服务</button>
                    <button onclick="control('suspend')" style="background:#ff4d4f;color:white;border:none;padding:1rem 2rem;border-radius:0.5rem;cursor:pointer;margin:0.5rem;font-weight:bold;">停止服务</button>
                    <p id="msg" style="margin-top:1rem;color:#666;"></p>
                </div>
                <script>
                    async function control(action) {
                        const m = document.getElementById('msg');
                        m.innerText = '正在发送请求...';
                        try {
                            const res = await fetch('/api/control?action=' + action);
                            const data = await res.json();
                            m.innerText = data.success ? '✅ 操作成功' : '❌ 失败: ' + data.error;
                        } catch(e) { m.innerText = '❌ 请求异常'; }
                    }
                </script>
            </body>
        </html>
    `);
});

app.get('/api/control', async (req, res) => {
    const action = req.query.action;
    const query = \`mutation { \${action}Service(_id: "${SERVICE_ID}") }\`;
    try {
        const response = await axios.post('https://api.zeabur.com/graphql', { query }, {
            headers: { 'Authorization': \`Bearer \${ZEABUR_TOKEN}\` }
        });
        res.json({ success: !response.data.errors, error: response.data.errors?.[0].message });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.listen(port, () => console.log(\`App listening on port \${port}\`));