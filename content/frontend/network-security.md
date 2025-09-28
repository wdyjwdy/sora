---
title: Security
category: Network
---

## XSS

跨站脚本攻击 (Cross-Site Scripting, XSS)

### 攻击方式

- 储存型
  1. 攻击者利用漏洞，将恶意脚本上传到网站数据库
  2. 用户访问该网页，脚本执行，获取用户 Cookie
- 反射型
  1. 攻击者诱导用户点击恶意链接
  2. 向网站注入恶意脚本，获取用户 Cookie
- DOM型
  1. 在页面传输过程中，篡改页面，注入恶意脚本，获取用户 Cookie

### 防护策略

- 防止脚本注入
  1. 服务器：对输入进行过滤

- 防止脚本执行
  1. CSP：禁止加载跨域资源

     ```http
     Content-Security-Policy: default-src 'self'
     <meta http-equiv="content-security-policy" content="default-src 'self'" />
     ```

  2. HttpOnly：禁止 JS 获取 Cookie

     ```http
     Set-Cookie: HttpOnly
     ```

- 防止发送用户信息
  1. CSP：禁止表单提交

     ```http
     Content-Security-Policy: form-action 'none'
     ```

## CSRF

跨站请求伪造 (Cross-Site Request Forgery, CSRF)

### 攻击方式

1. 用户登录 `bank.com`，并留下 `cookie`
2. 欺骗用户访问 `danger.com`
3. `danger.com` 向 `bank.com` 发送请求，浏览器会携带 `bank.com` 的 `cookie`

```html
// 伪造 GET
<img src='bank.com/send?user:xxc&money:100'>

// 伪造 POST
<form action='bank.com/send'>
	<input name='user' value='xxc'>
	<input name='money' value='100'>
</from>
<script>{ form.submit() }</script>

// 诱导链接
<a href='bank.com/send?user:xxc&money:100'>girl</>
```

### 防护策略

- 防止跨域Cookie
  1. SameSite：防止 Cookie 跨域

     ```http
     Set-Cookie: SameSite=Strict
     ```

- 同源检测
  1. Referer：请求的来源，包含路径
  2. Origin：请求的来源，只包含域名
  3. CSRF Token：请求时携带 Token，第三方站点无法获取 Token
