<template><div><h2 id="什么是websocket" tabindex="-1"><a class="header-anchor" href="#什么是websocket" aria-hidden="true">#</a> 什么是WebSocket？</h2>
<p>是一种协议，设计用于提供低延迟、全双工和长期运行的连接</p>
<ul>
<li>
<p>全双工：通信的两个参与方（客户端和服务端）可以同时发送和接收数据，不需要等待对方的响应或传输完成</p>
</li>
<li>
<p>单工：单向传输，数据只能由服务端发送给客户端，无法反向通信</p>
</li>
<li>
<p>半双工：双向传输，但同一时间只能进行一个方向的数据传输（要么发送，要么接收）</p>
</li>
</ul>
<h4 id="http与websocket对比" tabindex="-1"><a class="header-anchor" href="#http与websocket对比" aria-hidden="true">#</a> <strong>http与websocket对比</strong></h4>
<p>http：通信方式属于半双工，服务器必须等待客户端请求后才能返回数据，无法主动推送</p>
<p>websocket：通信方式属于全双工，建立连接后，客户端和服务器可随时主动发送数据</p>
<p><img src="/img/websocket-vs-http.jpg" alt="websocket"></p>
<p>websocket的出现就是为了解决实时通信的问题</p>
<h2 id="什么是实时通信" tabindex="-1"><a class="header-anchor" href="#什么是实时通信" aria-hidden="true">#</a> 什么是实时通信？</h2>
<p>传统通信：需要用户主动请求来获取更新数据，通常存在一定的延迟</p>
<p>实时通信：即时消息传递、音视频通话、在线回忆和实时数据传输等，可以实现即时的数据传输和交流，不需要用户主动请求或刷新来获取更新数据</p>
<h2 id="在没有websocket之前的实时通信" tabindex="-1"><a class="header-anchor" href="#在没有websocket之前的实时通信" aria-hidden="true">#</a> 在没有WebSocket之前的实时通信</h2>
<p>轮询：客户端定期向服务器发送请求，如前端设置定时器定时调用后端的接口（这种做法会产生大量的请求和响应）</p>
<p>长轮询：在客户端发出请求后，连接并不会即时关闭，后端接口的程序会运行一段时间，保持连接打开，等待新数据响应后再完成调用并关闭连接（虽然解决了无效轮询的数量，但还是需要频繁建立和关闭连接）</p>
<p>Comet：保持长连接，在返回请求后继续保持连接打开，和长轮询一样</p>
<h2 id="websocket的优势" tabindex="-1"><a class="header-anchor" href="#websocket的优势" aria-hidden="true">#</a> WebSocket的优势</h2>
<p>双向实时通信：允许在单个、长时间的连接上进行双向实时通信。在需要快速实时更新的应用程序里，比http更加高效</p>
<p>降低延迟：连接一旦建立便会保持开放，数据可以在客户端和服务器之间以比http更低的延迟进行传输</p>
<p>更高效的资源利用：可以减少重复请求和响应的开销，因为它的连接只需要一次</p>
<h2 id="websocket的心跳机制" tabindex="-1"><a class="header-anchor" href="#websocket的心跳机制" aria-hidden="true">#</a> WebSocket的心跳机制</h2>
<h4 id="为什么需要心跳机制" tabindex="-1"><a class="header-anchor" href="#为什么需要心跳机制" aria-hidden="true">#</a> 为什么需要心跳机制？</h4>
<p>心跳机制是保持websocket长连接的关键，在客户端和服务端建立连接之后，服务端和客户端之间会通过心跳包来保持连接状态，以防止连接因为长时间没数据传输而被切断，心跳包是一种特殊的数据包，不包含任何实际数据，仅用来维持连接状态</p>
<p>心跳包由客户端和服务端之间定期发送一个空的数据帧，以确保双方之间的连接仍然有效，避免长时间没有数据传输而被中断，如果在一段时间内没有收到对方的心跳包，就可以认为连接已经断开</p>
<h2 id="使用websocket实现实时通信示例" tabindex="-1"><a class="header-anchor" href="#使用websocket实现实时通信示例" aria-hidden="true">#</a> 使用WebSocket实现实时通信示例</h2>
<p>涉及的技术栈：</p>
<ul>
<li>
<p>后端：springboot</p>
</li>
<li>
<p>前端：thymeleaf</p>
</li>
</ul>
<h5 id="_1-引入依赖" tabindex="-1"><a class="header-anchor" href="#_1-引入依赖" aria-hidden="true">#</a> 1.引入依赖</h5>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-boot-starter-websocket<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-boot-starter-thymeleaf<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span>

<span class="token comment">&lt;!-- 集成前端库 --></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.webjars<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>sockjs-client<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>1.5.1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.webjars<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>stomp-websocket<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>2.3.4<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_2-websocket配置类" tabindex="-1"><a class="header-anchor" href="#_2-websocket配置类" aria-hidden="true">#</a> 2.WebSocket配置类</h5>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token annotation punctuation">@EnableWebSocketMessageBroker</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">WebSocketConfig</span> <span class="token keyword">implements</span> <span class="token class-name">WebSocketMessageBrokerConfigurer</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">configureMessageBroker</span><span class="token punctuation">(</span><span class="token class-name">MessageBrokerRegistry</span> config<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        config<span class="token punctuation">.</span><span class="token function">enableSimpleBroker</span><span class="token punctuation">(</span><span class="token string">"/topic"</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//客户端订阅的地址前缀</span>
        config<span class="token punctuation">.</span><span class="token function">setApplicationDestinationPrefixes</span><span class="token punctuation">(</span><span class="token string">"/app"</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//服务端接收消息的前缀</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">registerStompEndpoints</span><span class="token punctuation">(</span><span class="token class-name">StompEndpointRegistry</span> registry<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        registry<span class="token punctuation">.</span><span class="token function">addEndpoint</span><span class="token punctuation">(</span><span class="token string">"/stomp"</span><span class="token punctuation">)</span> <span class="token comment">//WebSocket连接端点</span>
                <span class="token punctuation">.</span><span class="token function">withSockJS</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>      <span class="token comment">//支持SockJS协议</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_3-消息模板类" tabindex="-1"><a class="header-anchor" href="#_3-消息模板类" aria-hidden="true">#</a> 3.消息模板类</h5>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Message</span> <span class="token punctuation">{</span>

    <span class="token comment">//消息</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> content<span class="token punctuation">;</span>
    <span class="token comment">//发送人</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> sender<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getContent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> content<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setContent</span><span class="token punctuation">(</span><span class="token class-name">String</span> content<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>content <span class="token operator">=</span> content<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getSender</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> sender<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setSender</span><span class="token punctuation">(</span><span class="token class-name">String</span> sender<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>sender <span class="token operator">=</span> sender<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_4-controller" tabindex="-1"><a class="header-anchor" href="#_4-controller" aria-hidden="true">#</a> 4.Controller</h5>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token annotation punctuation">@Controller</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">WebsocketController</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@MessageMapping</span><span class="token punctuation">(</span><span class="token string">"/send"</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@SendTo</span><span class="token punctuation">(</span><span class="token string">"/topic/messages"</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">Message</span> <span class="token function">broadcastMessage</span><span class="token punctuation">(</span><span class="token class-name">Message</span> message<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> message<span class="token punctuation">;</span> <span class="token comment">// 转发包含sender(发送者)的消息</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_5-前端页面-index-html" tabindex="-1"><a class="header-anchor" href="#_5-前端页面-index-html" aria-hidden="true">#</a> 5.前端页面(index.html)</h5>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name"><span class="token namespace">xmlns:</span>th</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://www.thymeleaf.org<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>UTF-8<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">></span></span>学习websocket<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name"><span class="token namespace">th:</span>src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>@{/webjars/sockjs-client/1.5.1/sockjs.min.js}<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name"><span class="token namespace">th:</span>src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>@{/webjars/stomp-websocket/2.3.4/stomp.min.js}<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>实时通信<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>messages<span class="token punctuation">"</span></span> <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value css language-css"><span class="token property">height</span><span class="token punctuation">:</span> 300px<span class="token punctuation">;</span> <span class="token property">overflow-y</span><span class="token punctuation">:</span> scroll<span class="token punctuation">;</span> <span class="token property">border</span><span class="token punctuation">:</span> 1px solid #ccc<span class="token punctuation">;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h3</span><span class="token punctuation">></span></span>用户名：<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>username<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h3</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>message<span class="token punctuation">"</span></span> <span class="token attr-name">placeholder</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>输入消息<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">onclick</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value javascript language-javascript"><span class="token function">sendMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">></span></span>发送<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>



<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name"><span class="token namespace">th:</span>inline</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>javascript<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
    <span class="token comment">// 随机生成用户名</span>
    <span class="token keyword">function</span> <span class="token function">generateRandomUsername</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token string">'User'</span> <span class="token operator">+</span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span>Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token number">100000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 全局保存用户名</span>
    <span class="token keyword">var</span> username <span class="token operator">=</span> <span class="token function">generateRandomUsername</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    document<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"DOMContentLoaded"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">'username'</span><span class="token punctuation">)</span><span class="token punctuation">.</span>textContent <span class="token operator">=</span> username<span class="token punctuation">;</span>
        <span class="token function">connect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 连接初始化</span>
    <span class="token keyword">var</span> stompClient <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">function</span> <span class="token function">connect</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">var</span> socket <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SockJS</span><span class="token punctuation">(</span><span class="token string">'/stomp'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        stompClient <span class="token operator">=</span> Stomp<span class="token punctuation">.</span><span class="token function">over</span><span class="token punctuation">(</span>socket<span class="token punctuation">)</span><span class="token punctuation">;</span>
        stompClient<span class="token punctuation">.</span><span class="token function">connect</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">frame</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'Connected as: '</span> <span class="token operator">+</span> username<span class="token punctuation">)</span><span class="token punctuation">;</span>
            stompClient<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token string">'/topic/messages'</span><span class="token punctuation">,</span> onMessageReceived<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">function</span> <span class="token function">sendMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">var</span> messageInput <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">'message'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">var</span> message <span class="token operator">=</span> messageInput<span class="token punctuation">.</span>value<span class="token punctuation">.</span><span class="token function">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>message <span class="token operator">&amp;&amp;</span> stompClient<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">var</span> chatMessage <span class="token operator">=</span> <span class="token punctuation">{</span>
                <span class="token literal-property property">content</span><span class="token operator">:</span> message<span class="token punctuation">,</span>
                <span class="token literal-property property">sender</span><span class="token operator">:</span> username
            <span class="token punctuation">}</span><span class="token punctuation">;</span>
            stompClient<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token string">"/app/send"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>chatMessage<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            messageInput<span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token string">''</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">function</span> <span class="token function">onMessageReceived</span><span class="token punctuation">(</span><span class="token parameter">payload</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">var</span> message <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>payload<span class="token punctuation">.</span>body<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">var</span> messages <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">'messages'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">var</span> messageElement <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span><span class="token string">'div'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        messageElement<span class="token punctuation">.</span>textContent <span class="token operator">=</span> message<span class="token punctuation">.</span>sender <span class="token operator">+</span> <span class="token string">": "</span> <span class="token operator">+</span> message<span class="token punctuation">.</span>content<span class="token punctuation">;</span>
        messages<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>messageElement<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_6-结果演示" tabindex="-1"><a class="header-anchor" href="#_6-结果演示" aria-hidden="true">#</a> 6.结果演示</h5>
<hr>
<p><img src="/img/websocket_r1.jpg" alt="websocket_r1"></p>
<p><img src="/img/websocket_r2.jpg" alt="websocket_r2"></p>
</div></template>


