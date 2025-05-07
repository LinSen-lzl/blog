<template><div><h2 id="mysql的存储引擎" tabindex="-1"><a class="header-anchor" href="#mysql的存储引擎" aria-hidden="true">#</a> MySQL的存储引擎</h2>
<h4 id="一、什么是存储引擎" tabindex="-1"><a class="header-anchor" href="#一、什么是存储引擎" aria-hidden="true">#</a> 一、什么是存储引擎</h4>
<p>MySQL的存储引擎是负责用于管理数据存储、检索和操作的核心组件，数据库使用存储引擎进行创建、查询、更新和删除数据，不同的存储引擎提供不同的存储机制、索引技巧、锁级别、事务等功能。存储引擎是基于表的，而非数据库。</p>
<p><img src="/img/mysql_structure.jpg" alt="ms"></p>
<h4 id="二、常用的存储引擎" tabindex="-1"><a class="header-anchor" href="#二、常用的存储引擎" aria-hidden="true">#</a> 二、常用的存储引擎</h4>
<p><strong>1、InnoDB（推荐）</strong></p>
<p>在MySQL5.5版本之后，InnoDB成为默认引擎，InnoDB是MySQL的默认事务型引擎，与其他存储引擎相比，由于它的ACID事务支持、行级锁和崩溃恢复等机制，更适合用于处理高并发、大数据量的场景</p>
<p>特性：</p>
<ul>
<li>
<p>ACID事务支持：事务处理中的 ACID 使得InnoDB确保了数据库操作的可靠性和完整性</p>
<ul>
<li>
<p>原子性（Atomicity）：事务中的所有操作是一个不可分割的整体，要么全部执行成功，要么全部失败</p>
</li>
<li>
<p>一致性（Consistency）：事务执行前后，数据库必须保持业务规则的一致性（比如转账， A 原有 200 元，B 有 300 元；转账后 A 100 元，B 400 元，A 和 B 的账户总额保持不变）</p>
</li>
<li>
<p>隔离性（Isolation）：当多个事务并发执行时，彼此操作互相隔离，避免数据混乱，以下是MySQL提供的4种隔离级别，按隔离性弱到强从上到下排序，隔离性越强，并发性能越低</p>
<ul>
<li>读未提交（READ UNCOMMITTED）：允许读取其他事务未提交的修改（脏读），以及允许不可重复读和幻读</li>
<li>读已提交（READ COMMITTED）：只能读取其他事务已提交的修改（不允许脏读），但允许不可重复读和幻读</li>
<li>可重复读（REPEATABLE READ）：同一事务内多次读取同一数据结果一致（解决脏读、不可重复读），可能出现幻读，这是InnoDB的默认隔离级别</li>
<li>串行化（SERIALIZABLE）：所有事务串行执行（类似单线程），完全隔离。不允许脏读、不可重复读、幻读。性能最低</li>
</ul>
</li>
<li>
<p>持久性（Durability）：事务提交后，对数据的修改永久生效，即时系统崩溃也不会丢失</p>
</li>
</ul>
</li>
<li>
<p>高并发处理能力：得益于行级锁和MVCC，使InnoDB既能支持大量并发写入，又能保证高效读的性能</p>
<ul>
<li>行级锁：与表级锁相比，行级锁仅锁定被操作的行，而非整个表，大幅减少锁竞争，提升并发性能。行级锁属于共享锁（读锁）和排他锁（写锁）</li>
<li>MVCC：
<ul>
<li>前置问题：在传统锁机制中，读操作需要加共享锁，写操作需要加排他锁，但因为共享锁和排他锁不兼容，导致读写操作互斥，导致读阻塞写、写阻塞读。</li>
<li>MVCC的出现解决了以上的问题，在读操作上采用<strong>快照读</strong>，即读的是基于事务开始时生成的<strong>数据快照</strong>，无需加锁，直接访问历史版本数据。写操作修改数据时，会生成新版本的快照并保留旧版本（通过Undo Log）。由此读操作不受写操作影响，写操作也不会被读操作阻塞</li>
</ul>
</li>
</ul>
</li>
<li>
<p>高性能存储结构：</p>
</li>
</ul>
<p><strong>2、MyISAM</strong></p>
<p><strong>3、Memory</strong></p>
<h4 id="三、总结" tabindex="-1"><a class="header-anchor" href="#三、总结" aria-hidden="true">#</a> 三、总结</h4>
<p>现在在使用MySQL数据库一般都采用InnoDB，另外的两个MyISAM和Memory被MongoDB和Redis等NoSQL的DBMS所取代</p>
</div></template>


