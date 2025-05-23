<template><div><h2 id="mysql的数据结构" tabindex="-1"><a class="header-anchor" href="#mysql的数据结构" aria-hidden="true">#</a> MySQL的数据结构</h2>
<h4 id="一、b-tree" tabindex="-1"><a class="header-anchor" href="#一、b-tree" aria-hidden="true">#</a> 一、B-Tree</h4>
<p>前置问题：随着数据规模的增涨和磁盘I/O次数增多，传统的数据结构（如二叉搜索树、链表、哈希表等）逐渐显得不足。为了<strong>满足在磁盘上高效地对数据进行增删改查</strong>，<strong>同时减少I/O次数</strong>，由此设计出了B-Tree。</p>
<p>介绍：B-Tree是一种<strong>多路平衡树</strong>，每个节点可以拥有多个子节点，每个磁盘块中包括了<strong>关键字</strong>和<strong>子节点的指针</strong>，与传统的二叉树对比，减少树了的高度，降低磁盘访问次数（因为树越矮，查找路径越短，访问的节点越少）。能够高效管理大量数据并支持快速插入、删除、查找操作。</p>
<p>结构示意图：</p>
<p><img src="/img/B-Tree.jpg" alt="b-tree"></p>
<h4 id="二、b-tree" tabindex="-1"><a class="header-anchor" href="#二、b-tree" aria-hidden="true">#</a> 二、B+Tree</h4>
<h4 id="三、哈希表" tabindex="-1"><a class="header-anchor" href="#三、哈希表" aria-hidden="true">#</a> 三、哈希表</h4>
<h2 id="mysql的存储引擎" tabindex="-1"><a class="header-anchor" href="#mysql的存储引擎" aria-hidden="true">#</a> MySQL的存储引擎</h2>
<h4 id="一、什么是存储引擎" tabindex="-1"><a class="header-anchor" href="#一、什么是存储引擎" aria-hidden="true">#</a> 一、什么是存储引擎</h4>
<p>MySQL的存储引擎是负责用于管理数据存储、检索和操作的核心组件，数据库使用存储引擎进行创建、查询、更新和删除数据，不同的存储引擎提供不同的存储机制、索引技巧、锁级别、事务等功能。存储引擎是基于表的，而非数据库。</p>
<p><img src="/img/mysql_structure.jpg" alt="ms"></p>
<h4 id="二、常用的存储引擎" tabindex="-1"><a class="header-anchor" href="#二、常用的存储引擎" aria-hidden="true">#</a> 二、常用的存储引擎</h4>
<p><strong>1、InnoDB（推荐）</strong></p>
<p>在MySQL5.5版本之后，InnoDB成为默认引擎，InnoDB是MySQL的默认事务型引擎，与其他存储引擎相比，由于它的ACID事务支持、行级锁和崩溃恢复等机制，更适合用于处理高并发、大数据量的场景</p>
<p>InnoDB的特性：</p>
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
<li>行级锁：与表级锁相比，行级锁仅锁定被操作的行，而非整个表，大幅减少锁竞争，提升并发性能。行级锁的读属于共享锁，写属于排他锁</li>
<li>MVCC：
<ul>
<li>前置问题：在传统锁机制中，读操作需要加共享锁，写操作需要加排他锁，但因为共享锁和排他锁不兼容，导致读写操作互斥，导致读阻塞写、写阻塞读。</li>
<li>MVCC的出现解决了以上的问题，在读操作上采用<strong>快照读</strong>，即读的是基于事务开始时生成的<strong>数据快照</strong>，无需加锁，直接访问历史版本数据。写操作修改数据时，会生成新版本的快照并保留旧版本（通过Undo Log）。由此读操作不受写操作影响，写操作也不会被读操作阻塞</li>
</ul>
</li>
</ul>
</li>
<li>
<p>高性能存储结构：InnoDB的存储结构是其高性能的核心基础，通过优化数据组织、索引设计、内存管理和日志机制，显著提升了读写效率与并发能力</p>
<ul>
<li>
<p>聚簇索引：聚簇索引是<strong>B+树的其中一种实现</strong>，聚簇索引是一种数据存储方式，即索引的叶子节点直接存储完整数据行（而非指向数据的指针），也就是所谓的索引即数据，数据即索引；InnoDB表的主键索引就是聚簇索引的实现，根据主键查询时无需<strong>回表</strong>（根据数据的主键再走一次聚簇索引的查询），直接定位数据，速度极快</p>
<p><img src="/img/ClusteredIndex.jpg" alt="ci"></p>
</li>
<li>
<p>二级索引：又叫辅助索引、非聚簇索引，<strong>也是B+树的一种实现</strong>，因此也与聚簇索引有着相同的数据结构，但是叶子结点存储并不是完整的数据行，而是主键值，所以通过二级索引查找完整的数据行时，先通过二级索引的字段找到叶子结点的字段，然后还需要再通过主键走聚簇索引的查询，这个过程称为<strong>回表</strong>；二级索引用于非主键的索引</p>
<p><img src="/img/SecondaryIndex.jpg" alt="si"></p>
</li>
<li>
<p>缓冲池：InnoDB是以<strong>页</strong>（<strong>数据页</strong>）为单位来管理存储空间的，在对表的增删改查操作本质上是在访问页面。由于磁盘I/O需要消耗的时间很多，而在内存中操作，效率则会高很多。缓冲池是一块分配在内存中的连续区域，用来缓存从磁盘读取的页，减少磁盘I/O操作，显著提升效率；缓冲池的缓存策略主要是通过<strong>预读机制</strong>（<strong>位置</strong>）和<strong>淘汰策略</strong>（<strong>频次</strong>），位置决定效率，频次决定优先级顺序</p>
</li>
</ul>
</li>
<li>
<p>高可靠性设计：高可靠性设计核心在于 确保数据完整性与服务连续性，即使在硬件故障或意外崩溃时，仍能保障数据不丢失、业务不受损</p>
<ul>
<li>Redo Log：记录事务对数据页的物理修改，对任意数据页的修改操作都会生成Redo Log，这样即使MySQL发生故障导致内存中的数据丢失、导致已提交事务作出的更改丢失，也可以根据Redo Log，来重放未写入磁盘的已提交事务</li>
<li>Undo Log：事务的acid中的原子性底层就是通过Undo Log实现的。Undo Log主要记录了数据的逻辑变化，比如一条INSERT语句，对应一条DELETE的Undo Log，一条UPDATE语句，对应一条相反的UPDATE的Undo Log，这样在发生错误时，就能回滚到事务之前的数据状态。另外，Undo Log也实现了MVCC，Undo Log保存了事务发生之前的数据的一个历史版本，也可以用于回滚</li>
<li>外键约束：外键约束用来确保表与表之间的数据一致性。其机制就是子表中的一个或多个字段的值必须匹配父表的主键或唯一键。通过规则限制子表数据的插入、更新和删除操作，确保父子表数据逻辑一致</li>
</ul>
</li>
</ul>
<p><strong>2、MyISAM</strong></p>
<p>MyISAM是5.5版本之前的默认存储引擎，与InnoDB相比，MyISAM不支持事务、行级锁、MVCC等高级特性，但它具有简单、高效、易于维护等特点，适用于一些对数据完整性要求不高、读多写少的场景，如博客文章、实时性要求低的数据分析表等</p>
<p>MyISAM的特性：</p>
<ul>
<li>
<p>表级锁：字面意思，表级锁就是对整张表加锁的并发控制机制，与行级锁相比，表级锁也一样<strong>读锁属于共享锁</strong>，<strong>写锁属于排他锁</strong>，但由于<strong>缺少MVCC支持</strong>，读写操作相互阻塞。在读操作上，允许多个线程同时对整张表加读锁并发读取，但任何写操作必须等到所有读锁释放才能执行；在写操作上，在一个线程持有写锁时，其他线程既不能读也不能写</p>
</li>
<li>
<p>不支持事务：无法保证数据一致性，系统崩溃可能导致数据损坏或丢失</p>
</li>
<li>
<p>全文索引：全文索引是为大文本字段（如CHAR、VARCHAR、TEXT等）提供高效关键字检索的一种特殊索引。与B+树类型的索引不同，全文索引基于<strong>倒排索引</strong>实现，能按一个个的词（token）来快速查找包含指定词汇的记录</p>
</li>
<li>
<p>存储结构：</p>
<ul>
<li>文件组成：分为3个部分，.frm：表结构定义文件；.myd：数据文件；.myi：索引文件，与InnoDB的区别就是InnoDB是数据和索引存储在了一起（.ibd）</li>
<li>压缩表：支持表压缩，减少存储空间占用，文本数据通常可压缩至原大小的40%~70%</li>
</ul>
</li>
</ul>
<p><strong>3、Memory</strong></p>
<p>与Redis类似，Memory存储引擎将数据完全存储在内存中，因此具备极快的访问速度，但数据不持久化（Redis有持久化机制），系统重启或崩溃时所有数据都会丢失。适用于临时数据或缓存等场景</p>
<p>Memory的特性：</p>
<ul>
<li>
<p>数据存储与访问：所有数据存储在内存中，读写速度远超磁盘引擎（如InnoDB、MyISAM），适合需要响应快的场景；无持久化，MySQL服务重启或崩溃后，数据会丢失。需手动从其他表或外部（如磁盘表）重新加载</p>
</li>
<li>
<p>索引机制：</p>
<ul>
<li>哈希索引：哈希索引是一种基于<strong>哈希表</strong>的索引结构，通过哈希函数将键值映射到存储位置，实现<strong>O(1) 时间复杂度</strong>的等值查询</li>
<li>B-Tree索引：B-Tree索引基于B-Tree，B-Tree结构与B+Tree结构类似，区别是B-Tree的内部节点也会存储完整的数据行，</li>
</ul>
</li>
<li>
<p>表结构与限制：</p>
<ul>
<li>固定长度行格式：Memory表的所有字段按固定长度存储，例如VARCHAR(255)会占用255字符的完整空间，即时实际数据很短</li>
<li>数据类型限制：表字段有数据类型的限制，不支持TEXT、BLOB等大字段类型、不支持空间数据类型</li>
</ul>
</li>
<li>
<p>表级锁：读写锁互斥，读操作加共享锁，写操作会锁定整张表，高并发写入时性能急剧下降</p>
</li>
<li>
<p>内存管理与限制：存在内存分配的参数，</p>
</li>
</ul>
<h4 id="三、总结" tabindex="-1"><a class="header-anchor" href="#三、总结" aria-hidden="true">#</a> 三、总结</h4>
<p>现在在使用MySQL数据库一般都采用InnoDB，另外的两个MyISAM和Memory被MongoDB和Redis等NoSQL的DBMS所取代</p>
</div></template>


