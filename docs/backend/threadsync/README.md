## 什么是线程同步

线程同步就是协调多个线程共享资源的访问，使多个线程按照既定的规则得出它们的执行顺序，然后按这个顺序执行代码，确保数据一致性和操作正确性



## 为什么需要线程同步

- 操作正确性：多个线程同时修改共享数据时，操作顺序不确定会导致结果错误
- 数据一致性：当某个线程正在修改共享数据时，而另一个线程同时读取到了这个数据并也要做修改时，会导致读取到的数据不是最新的数据



## 线程同步会遇到的问题

- 性能开销：特别是在高并发的情况下，如果多个线程频繁争夺同一把锁，会导致上下文切换和阻塞
- 资源饥饿：某些线程因优先级低，或者因为锁的竞争激烈，长期无获取资源
- 死锁：多个线程因互相持有对方所需的锁且互相等待对方释放锁而陷入无限等待



## 如何实现线程同步

#### 一、synchronized关键字

- 简介：synchronized使用了java的内置锁机制，不同的使用方法，对应的内置锁也会不同。这个锁只能由一个线程占用，此时其他线程如果尝试获取这把锁，就会进入阻塞状态，直到获取这把锁



- 使用方法：
  - 修饰实例方法：锁对象是当前实例，同一时间仅允许一个线程访问该对象实例的任意synchronized实例方法
  
    ```java
    public synchronized void increment() {
        count++; 
    }
    ```
  
    
  
  - 修饰静态方法：锁对象是当前类的class对象，同一时间仅允许一个线程访问该类的任意synchronized静态方法
  
    ```java
    public static synchronized void staticIncrement() {
        staticCount++; 
    }
    ```
  
    
  
  - 同步代码块：可指定任意一个对象实例作为锁（如Object lock = new Object()），同一时间仅允许一个线程持有该锁对象的监视器
  
    ```java
    public void blockSync() {
        synchronized (lock) { // 显式指定锁对象
            count++;
        }
    }
    ```



- 缺陷：
  - 线程阻塞与资源浪费：线程在等待获取锁时，无法指定获取锁的超时时间，这样可能会导致线程因锁竞争而陷入永久阻塞，而且线程在等待获得锁时无法被中断，这样会导致线程占用空间，造成资源浪费。
  - 高并发：遇到高并发的场景时，锁竞争也会更激烈，此时jvm会将锁升级成重量级锁，重量级锁会导致性能降低
  - 死锁风险：如果是多个synchronized 块嵌套的代码，线程可能因竞争不同的锁顺序而引发死锁





#### 二、ReentrantLock

- 简介：ReentrantLock是Java并发包（java.util.concurrent.locks）中提供的一种可重入的互斥锁，相比synchronized关键字，它提供了更灵活的锁控制机制，适用于复杂的线程同步场景



- 底层实现AQS（AbstractQueuedSynchronizer）：AQS的核心思想是通过一个FIFO队列来管理线程的请求，确保线程按照先后顺序获得锁资源。其核心组件包括如下：

  - 同步状态(state)：state 是一个 volatile int 类型的变量，在ReentrantLock的实现里用来表示表示锁的持有次数，也可以叫锁的重入次数

  - FIFO 等待队列(wait queue)：这个队列是用来管理被阻塞等待锁的线程的。在锁不可用时，线程会被加入到这个队列里，直到锁释放，队列中的线程才会**按顺序**被唤醒

    

- ReentrantLock 如何使用 AQS(如何实现AQS里的方法)：

  - tryAcquire：这个方法用来尝试获得锁。如果当前线程已经拥有锁，那么调用这个方法可以重入锁并把state加1。如果当前锁没有被线程占用，则尝试将state设置为1，表示当前线程获得了这个锁
  - tryRelease：当线程释放锁时，tryRelease会减小state的值，如果state为0，则表示锁已经被完全释放，可以通知等待队列里的下一个等待线程
  - acquire：这是一个阻塞方法，如果当前锁不可用，调用该方法的线程会被加入到等待队列中，并且会一直阻塞直到锁被释放
  - release：该方法会尝试释放锁，并可能唤醒队列中的下一个等待线程

  

- 使用方法：

  - 基本加锁与释放

    ```java
    ReentrantLock lock = new ReentrantLock();
    
    public void accessResource() {
        lock.lock();  // 获取锁
        try {
            // 业务代码
        } finally {
            lock.unlock();  // 需手动释放锁
        }
    }
    ```

  - 公平锁与非公平锁：ReentrantLock可以在构造函数中指定是公平锁还是非公平锁

    - 公平锁：按线程请求顺序分配锁，底层源码是通过hasQueuedPredecessors()进行队列检查，只有当队列为空或当前线程是队列头部时，才允许抢锁。可以避免资源饥饿但性能较低

      ```java
      ReentrantLock fairLock = new ReentrantLock(true);  // 公平锁
      ```

    - 非公平锁：允许新请求的线程直接获取锁，线程直接尝试通过CAS(源码是compareAndSetState(0, acquires))抢锁，如果抢不到，则与公平锁一样进入队列等待。因为唤醒被挂起的线程开销大，如果是高并发竞争锁的情况下，这样能够保证高吞吐量、高性能

      ```java
      ReentrantLock lock = new ReentrantLock();  // 默认非公平
      ```
  
  
  
  - 尝试获取锁：
  
    ```java
    if(lock.tryLock()) {  //立即尝试获取锁（非阻塞）
        try{
            //业务逻辑代码
        }finally {
            lock.unlock();
        }
    }else {
        //未获取锁时的逻辑代码
    }
    ```
  
  
  
  - 超时获取锁：
  
    ```java
    try{
        if(lock.tryLock(1, TimeUnit.SECONDS)) {
            try {
                 //业务逻辑代码
            }finally  {
                lock.unlock();
            }
        }else {
            //超时后的处理
        }
    }
    ```
  
    

- 缺陷：

  - 性能开销：在低竞争的场景下，ReentrantLock的性能开销比synchronized 关键字更高，因为是基于AQS的实现，涉及复杂的队列管理逻辑
  - 需手动管理锁的释放：必须在代码里显式调用lock() 和 unlock()，若忘记在 finally 块中释放锁（例如因异常未执行 unlock），会导致锁泄漏和死锁




#### 三、原子类（Atomic Classes）

- 简介：原子类，其特性是操作具有原子性。原子性意味着这些操作是不可分割的，要么全部执行，要么完全不执行，不会被中断或干扰，即使是在多线程的环境下



- CAS（Compare-And-Swap）：又叫比较并交换，是一种无锁的原子操作，由硬件层面提供了支持，而不需要使用传统的加锁机制，因此也不会发生上下文切换和线程阻塞，性能更高。它的核心参数有三个：**内存地址（V）**，**预期原值（A）**，**新值（B）**，当有一个线程尝试调用CAS方法，其操作逻辑是：1.**先检查内存地址（V）的值是否等于预期原值（A）**；2.**如果相等，将V的值更新为B，返回成功**；3.**如果不相等，不更新，返回失败**。原子类依赖于CAS，原子类内部会利用CAS来保证对变量的原子更新



- 使用方法：

  以AtomicInteger为例子，使用线程池模拟1000个线程对同一个AtomicInteger变量做加1的操作，使用AtomicInteger保证线程安全：

  ```java
  public class AtomicCounterDemo {
      private static final int TASKS = 1000;
      private static final int THREAD_POOL_SIZE = 10;
      private static AtomicInteger counter = new AtomicInteger(0);
      
      public static void main(String[] args) throws InterruptedException {
          //创建固定大小线程池
          ExecutorService executor = Executors.newFixedThreadPool(THREAD_POOL_SIZE);
          
          //使用CountDownLatch等待所有任务完成
          CountDownLatch latch = new CountDownLatch(TASKS);
          
          for(int i = 0; i < TASKS; i++) {
              executor.submit(() -> {
                  counter.incrementAndGet(); //原子自增
                  latch.countDown(); //每个任务完成后减1
              })
          }
          
          //等待所有任务完成
          latch.await();
          
          //关闭线程池
          executor.shutdown();
          
          //打印结果
          System.out.println("最终结果: " + counter.get()); 
      }
  }
  ```

  

- 缺陷：

  - 功能局限：原子类仅支持基础操作（如 incrementAndGet），无法实现复杂逻辑（如阻塞等待条件）
  - ABA问题：这个属于是CAS的缺陷，线程A读取变量的值为A，这时这个变量被其他线程修改为B，最后又改回A。此时线程A的CAS操作认为变量没有发生变化，实际上它已经被修改过



#### 四、CountDownLatch

- 简介：在某些用到多线程的场景下，需要先对所有子线程的执行结果进行汇总处理，然后主线程才能继续往下执行。这个时候就需要用到CountDownLatch，它的工作机制就是提供一个计数器，当计数器不为0时，线程会被阻塞等待



- 核心组件：

  - 计数器：一个int型的计数器，在构造函数里指定它的大小
  - await()：调用这个方法的线程，如果当前计数器大于0，该线程会被阻塞等待
  - counttDown()：线程调用这个方法时，计数器值减1，计数器到0时唤醒所有等待线程

  

- 使用方法：

  ```java
  public class CountDownLatchDemo {
      public static void main(String[] args) throws InterruptedException {
          int taskCount = 5;
          
          ExecutorService executor = Executors.newFixedThreadPool(taskCount);
          
          CountDownLatch count = new CountDownLatch(taskCount);
          
          for(int i = 0; i < taskCount; i++) {
              executor.submit(() -> {
                  try{
                      System.out.println("业务逻辑代码");
                      Thread.sleep((long)(Math.random() * 2000)); //模拟耗时操作
                  }catch (InterruptedException e){
                      Thread.currentThread().interrupt();
                  }finally {
                      latch.countDown(); //当前任务完成，计数器减1
                  }
              });
          }
          
          lacth.await(); //阻塞直到所有任务执行完成
          
          //关闭线程池
          executor.shutdown();
          
      }
  }
  ```

