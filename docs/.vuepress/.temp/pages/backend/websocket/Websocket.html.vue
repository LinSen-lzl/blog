<template><div><h2 id="什么是websocket" tabindex="-1"><a class="header-anchor" href="#什么是websocket" aria-hidden="true">#</a> 什么是WebSocket？</h2>
<p>是一种协议，设计用于提供低延迟、全双工和长期运行的连接</p>
<p>全双工：通信的两个参与方（客户端和服务端）可以同时发送和接收数据，不需要等待对方的响应或传输完成</p>
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
<h2 id="websocket的广播、单播和多播的介绍和使用场景的说明" tabindex="-1"><a class="header-anchor" href="#websocket的广播、单播和多播的介绍和使用场景的说明" aria-hidden="true">#</a> WebSocket的广播、单播和多播的介绍和使用场景的说明</h2>
<p>单播（指定一个人）：点对点，私信私聊</p>
<p>广播（所有人）：公共公告，发布订阅</p>
<p>多播，组播（特定人群）：聊天群，多人聊天</p>
<hr>
<h2 id="springboot的websocket入门实战" tabindex="-1"><a class="header-anchor" href="#springboot的websocket入门实战" aria-hidden="true">#</a> Springboot的websocket入门实战</h2>
<p>涉及的技术栈：springboot（整合websocket依赖）、socketjs、stompjs（一个简单的面向文本的消息传递协议）</p>
<h5 id="_1" tabindex="-1"><a class="header-anchor" href="#_1" aria-hidden="true">#</a> 1.</h5>
</div></template>


