## 什么是WebSocket？

是一种协议，设计用于提供低延迟、全双工和长期运行的连接

- 全双工：通信的两个参与方（客户端和服务端）可以同时发送和接收数据，不需要等待对方的响应或传输完成


- 单工：单向传输，数据只能由服务端发送给客户端，无法反向通信

- 半双工：双向传输，但同一时间只能进行一个方向的数据传输（要么发送，要么接收）



#### **http与websocket对比**

http：通信方式属于半双工，服务器必须等待客户端请求后才能返回数据，无法主动推送

websocket：通信方式属于全双工，建立连接后，客户端和服务器可随时主动发送数据



![websocket](/img/websocket-vs-http.jpg)


websocket的出现就是为了解决实时通信的问题


## 什么是实时通信？

传统通信：需要用户主动请求来获取更新数据，通常存在一定的延迟

实时通信：即时消息传递、音视频通话、在线回忆和实时数据传输等，可以实现即时的数据传输和交流，不需要用户主动请求或刷新来获取更新数据



## 在没有WebSocket之前的实时通信

轮询：客户端定期向服务器发送请求，如前端设置定时器定时调用后端的接口（这种做法会产生大量的请求和响应）

长轮询：在客户端发出请求后，连接并不会即时关闭，后端接口的程序会运行一段时间，保持连接打开，等待新数据响应后再完成调用并关闭连接（虽然解决了无效轮询的数量，但还是需要频繁建立和关闭连接）

Comet：保持长连接，在返回请求后继续保持连接打开，和长轮询一样



## WebSocket的优势

双向实时通信：允许在单个、长时间的连接上进行双向实时通信。在需要快速实时更新的应用程序里，比http更加高效

降低延迟：连接一旦建立便会保持开放，数据可以在客户端和服务器之间以比http更低的延迟进行传输

更高效的资源利用：可以减少重复请求和响应的开销，因为它的连接只需要一次



## WebSocket的心跳机制

#### 为什么需要心跳机制？

心跳机制是保持websocket长连接的关键，在客户端和服务端建立连接之后，服务端和客户端之间会通过心跳包来保持连接状态，以防止连接因为长时间没数据传输而被切断，心跳包是一种特殊的数据包，不包含任何实际数据，仅用来维持连接状态

心跳包由客户端和服务端之间定期发送一个空的数据帧，以确保双方之间的连接仍然有效，避免长时间没有数据传输而被中断，如果在一段时间内没有收到对方的心跳包，就可以认为连接已经断开







## 使用WebSocket实现实时通信示例

涉及的技术栈：

- 后端：springboot

- 前端：thymeleaf


##### 1.引入依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

<!-- 集成前端库 -->
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>sockjs-client</artifactId>
    <version>1.5.1</version>
</dependency>

<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>stomp-websocket</artifactId>
    <version>2.3.4</version>
</dependency>
```

##### 2.WebSocket配置类

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); //客户端订阅的地址前缀
        config.setApplicationDestinationPrefixes("/app"); //服务端接收消息的前缀
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/stomp") //WebSocket连接端点
                .withSockJS();      //支持SockJS协议
    }

}
```

##### 3.消息模板类
```java
public class Message {

    //消息
    private String content;
    //发送人
    private String sender;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

}
```


##### 4.Controller

```java
@Controller
public class WebsocketController {

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public Message broadcastMessage(Message message) {
        return message; // 转发包含sender(发送者)的消息
    }

}
```

##### 5.前端页面(index.html)

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>学习websocket</title>
    <script th:src="@{/webjars/sockjs-client/1.5.1/sockjs.min.js}"></script>
    <script th:src="@{/webjars/stomp-websocket/2.3.4/stomp.min.js}"></script>
</head>
<body>
<h1>实时通信</h1>
<div id="messages" style="height: 300px; overflow-y: scroll; border: 1px solid #ccc;"></div>
<div>
    <h3>用户名：<span id="username"></span></h3>
    <input type="text" id="message" placeholder="输入消息">
    <button onclick="sendMessage()">发送</button>
</div>



<script th:inline="javascript">
    // 随机生成用户名
    function generateRandomUsername() {
        return 'User' + Math.floor(Math.random() * 100000);
    }

    // 全局保存用户名
    var username = generateRandomUsername();

    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById('username').textContent = username;
        connect();
    });

    // 连接初始化
    var stompClient = null;
    function connect() {
        var socket = new SockJS('/stomp');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function(frame) {
            console.log('Connected as: ' + username);
            stompClient.subscribe('/topic/messages', onMessageReceived);
        });
    }

    function sendMessage() {
        var messageInput = document.getElementById('message');
        var message = messageInput.value.trim();
        if (message && stompClient) {
            var chatMessage = {
                content: message,
                sender: username
            };
            stompClient.send("/app/send", {}, JSON.stringify(chatMessage));
            messageInput.value = '';
        }
    }

    function onMessageReceived(payload) {
        var message = JSON.parse(payload.body);
        var messages = document.getElementById('messages');
        var messageElement = document.createElement('div');
        messageElement.textContent = message.sender + ": " + message.content;
        messages.appendChild(messageElement);
    }
</script>
</body>
</html>
```

##### 6.结果演示

------

![websocket_r1](/img/websocket_r1.jpg)



![websocket_r2](/img/websocket_r2.jpg)

