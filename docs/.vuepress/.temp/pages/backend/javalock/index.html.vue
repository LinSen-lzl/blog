<template><div><h2 id="为什么要写这篇文章" tabindex="-1"><a class="header-anchor" href="#为什么要写这篇文章" aria-hidden="true">#</a> 为什么要写这篇文章？</h2>
<p>上一篇文章中提到了锁（synchronized、ReentrantLock等）是线程同步的一种实现方式，但也只是提了一嘴。逐渐了解更多关于锁的机制后，发现锁的种类是多样的，如悲观锁、乐观锁，公平锁、非公平锁等，而且它是不仅仅存在于java语言这个层面的。然后这里我想到的问题是，为什么要给这个锁取这么一个名字，它是要从什么样的角度去解决实际场景问题的，然后要怎么给这些锁分门别类，以便于有一个更好的理解</p>
<h2 id="锁的分类维度" tabindex="-1"><a class="header-anchor" href="#锁的分类维度" aria-hidden="true">#</a> 锁的分类维度</h2>
<p>结合现有所有已知的锁，能够按照以下的层面进行分类：</p>
<ul>
<li>按并发策略分类：在多线程对共享资源进行<strong>并发竞争访问</strong>时，锁<strong>如何应对这种竞争冲突</strong></li>
<li>按公平性分类：在多个线程请求锁时，锁<strong>如何对这些线程的请求顺序进行处理</strong></li>
<li>按可重入性分类：可重入性在锁的层面的描述就是<strong>一个线程已经持有了一把锁后，能否重复获取这把锁</strong></li>
<li>按共享性分类：只<strong>对共享资源进行读操作</strong>的前提下，是否允许<strong>多个线程同时持有锁</strong>访问共享资源</li>
</ul>
<h2 id="按并发策略分类-悲观锁与乐观锁" tabindex="-1"><a class="header-anchor" href="#按并发策略分类-悲观锁与乐观锁" aria-hidden="true">#</a> 按并发策略分类（悲观锁与乐观锁）</h2>
<h4 id="一、悲观锁" tabindex="-1"><a class="header-anchor" href="#一、悲观锁" aria-hidden="true">#</a> 一、悲观锁</h4>
<ul>
<li>
<p>定义：悲观锁认为每次访问共享资源都会发生冲突，因此必须先加锁独占资源</p>
</li>
<li>
<p>实例：</p>
<ul>
<li>mysql的行级锁：SELECT...FOR UPDATE，也叫排他锁</li>
<li>Java：synchronized关键字、ReentranLock</li>
<li>分布式锁：Redis的SETNX、ZooKeeper的分布式锁</li>
</ul>
</li>
<li>
<p>特点：</p>
<ul>
<li>线程资源访问前必须获取锁，否则阻塞或等待</li>
<li>保证强一致性，但性能开销较大</li>
<li>可能引发死锁（需注意锁顺序和释放机制）</li>
</ul>
</li>
<li>
<p>适用场景：写操作频繁、冲突概率较高的场景（如金融交易、库存扣减）</p>
</li>
</ul>
<h4 id="二、乐观锁" tabindex="-1"><a class="header-anchor" href="#二、乐观锁" aria-hidden="true">#</a> 二、乐观锁</h4>
<ul>
<li>
<p>定义：乐观锁认为访问共享资源时发生冲突的概率较低，都是先直接操作资源，提交时再检测是否冲突</p>
</li>
<li>
<p>实例：</p>
<ul>
<li>mysql更新操作的where条件：执行 UPDATE 语句提交结果时，在 WHERE 条件中校验值是否改变</li>
<li>CAS：java原子类</li>
</ul>
</li>
<li>
<p>特点：</p>
<ul>
<li>无锁化设计，通过重试机制解决冲突（如CAS自旋）</li>
<li>性能高，但需处理冲突回滚逻辑</li>
<li>可能产生ABA问题</li>
</ul>
</li>
<li>
<p>适用场景：读多写少、冲突概率较低的场景（如评论计数，状态更新）</p>
</li>
</ul>
<h2 id="按公平性分类-公平锁与非公平锁" tabindex="-1"><a class="header-anchor" href="#按公平性分类-公平锁与非公平锁" aria-hidden="true">#</a> 按公平性分类（公平锁与非公平锁）</h2>
<h4 id="一、公平锁" tabindex="-1"><a class="header-anchor" href="#一、公平锁" aria-hidden="true">#</a> 一、公平锁</h4>
<ul>
<li>
<p>定义：当多个线程请求公平锁时，按照先到先得的顺序分配锁资源。新线程请求锁时，若已有其他线程在等待，则必须进入等待队列排队</p>
</li>
<li>
<p>实现示例：</p>
<ul>
<li>Java：ReentrantLock的公平模式（new ReentrantLock(true)）</li>
</ul>
</li>
<li>
<p>特点：</p>
<ul>
<li>能够避免线程饥饿，不会出现某些线程长期等待的情况</li>
<li>因为严格的排队机制降低了并发效率，造成吞吐量较低</li>
<li>性能开销大，必须唤醒等待队列中的第一个等待线程，导致频繁的上下文切换</li>
</ul>
</li>
<li>
<p>适用场景：需要严格保证线程执行顺序、对公平性要求高于性能的场景（如任务调度）</p>
</li>
</ul>
<h4 id="二、非公平锁" tabindex="-1"><a class="header-anchor" href="#二、非公平锁" aria-hidden="true">#</a> 二、非公平锁</h4>
<ul>
<li>
<p>定义：顾名思义，非公平锁允许线程插队竞争锁资源，即使是已有线程在等待队列中。新线程可以直接尝试获取锁，若失败再进入队列等待</p>
</li>
<li>
<p>实现示例：</p>
<ul>
<li>Java：ReentrantLock的非公平模式（new ReentrantLock()）、synchronized</li>
</ul>
</li>
<li>
<p>特点：</p>
<ul>
<li>高吞吐量，减少线程的切换次数，新线程能直接获得锁</li>
<li>在冲突概率较低的场景，性能优于公平锁</li>
<li>在高并发的场景，新线程的持续插队可能导致等待队列中的线程长期无法获得锁，造成线程饥饿</li>
</ul>
</li>
<li>
<p>适用场景：高并发、性能优先的场景</p>
</li>
</ul>
<h2 id="按可重入性分类-可重入锁与不可重入锁" tabindex="-1"><a class="header-anchor" href="#按可重入性分类-可重入锁与不可重入锁" aria-hidden="true">#</a> 按可重入性分类（可重入锁与不可重入锁）</h2>
<h4 id="一、可重入锁" tabindex="-1"><a class="header-anchor" href="#一、可重入锁" aria-hidden="true">#</a> 一、可重入锁</h4>
<ul>
<li>
<p>定义：一个线程在持有一把锁后，可以重复获取这把锁，且需要对应数量的释放操作才能完全释放锁</p>
</li>
<li>
<p>实现实例：</p>
<ul>
<li>Java：synchronized、ReentrantLock</li>
</ul>
</li>
<li>
<p>特点：</p>
<ul>
<li>可重入的特性可以避免线程因递归调用或嵌套同步导致死锁</li>
<li>锁的释放需与获取次数匹配（如获取3次，需释放3次）</li>
</ul>
</li>
<li>
<p>适用场景：需要递归调用、嵌套同步代码块的场景</p>
</li>
</ul>
<h4 id="二、非可重入锁" tabindex="-1"><a class="header-anchor" href="#二、非可重入锁" aria-hidden="true">#</a> 二、非可重入锁</h4>
<ul>
<li>
<p>定义：一个线程在持有一把锁后，如果再次重复请求获得锁，会导致死锁</p>
</li>
<li>
<p>实现实例：</p>
<ul>
<li>Java：StampedLock（非完全可重入，写锁不可重入，读锁可重入）</li>
</ul>
</li>
<li>
<p>特点：</p>
<ul>
<li>重复获得锁会直接阻塞或失败，导致死锁</li>
<li>需要在代码里手动避免可重入</li>
</ul>
</li>
<li>
<p>适合场景：资源需要被单次分配的场景，不允许同一线程重复获取</p>
</li>
</ul>
<h2 id="按共享性分类-共享锁与排他锁" tabindex="-1"><a class="header-anchor" href="#按共享性分类-共享锁与排他锁" aria-hidden="true">#</a> 按共享性分类（共享锁与排他锁）</h2>
<h4 id="一、共享锁" tabindex="-1"><a class="header-anchor" href="#一、共享锁" aria-hidden="true">#</a> 一、共享锁</h4>
<ul>
<li>
<p>定义：共享锁允许多个线程同时持有锁，但仅限于对共享资源进行读操作</p>
</li>
<li>
<p>实现实例：</p>
<ul>
<li>
<p>Java：ReentrantReadWriteLock.ReadLock</p>
</li>
<li>
<p>mysql的读锁：SELECT ... LOCK IN SHARE MODE</p>
</li>
</ul>
</li>
<li>
<p>特点：</p>
<ul>
<li>共享锁能够实现多个线程同时读取数据</li>
<li>共享锁与独占锁互斥，当有线程持有共享锁时，独占锁无法被获取（写操作被阻塞）</li>
</ul>
</li>
<li>
<p>适合场景：对资源读多写少的场景（如读取缓存）</p>
</li>
</ul>
<h4 id="二、排他锁" tabindex="-1"><a class="header-anchor" href="#二、排他锁" aria-hidden="true">#</a> 二、排他锁</h4>
<ul>
<li>定义：又叫独占锁。无论是否读写操作，独占锁同一时间只允许一个线程持有锁，其他线程无论读写均被阻塞</li>
<li>实现实例：
<ul>
<li>Java：synchronized、ReentrantLock</li>
<li>mysql的行级锁：SELECT ... FOR UPDATE</li>
<li>分布式锁：Redis的SETNX</li>
</ul>
</li>
<li>特点：
<ul>
<li>排他锁被占用时，其他线程无法获取</li>
<li>排他锁能确保写操作的原子性和一致性</li>
<li>在高并发写操作的场景下，吞吐量会降低</li>
</ul>
</li>
<li>适合场景：写操作频繁、对数据一致性要求高的场景（如账户扣款、库存扣减）</li>
</ul>
</div></template>


