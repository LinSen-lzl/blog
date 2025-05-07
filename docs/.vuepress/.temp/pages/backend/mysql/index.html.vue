<template><div><h2 id="mysql的存储引擎" tabindex="-1"><a class="header-anchor" href="#mysql的存储引擎" aria-hidden="true">#</a> MySQL的存储引擎</h2>
<h4 id="一、什么是存储引擎" tabindex="-1"><a class="header-anchor" href="#一、什么是存储引擎" aria-hidden="true">#</a> 一、什么是存储引擎</h4>
<p>MySQL的存储引擎是负责用于管理数据存储、检索和操作的核心组件，数据库使用存储引擎进行创建、查询、更新和删除数据，不同的存储引擎提供不同的存储机制、索引技巧、锁级别、事务等功能。存储引擎是基于表的，而非数据库。</p>
<p><img src="/img/mysql_structure.jpg" alt="ms"></p>
<h4 id="二、常用的存储引擎" tabindex="-1"><a class="header-anchor" href="#二、常用的存储引擎" aria-hidden="true">#</a> 二、常用的存储引擎</h4>
<p><strong>1、InnoDB（推荐）</strong></p>
<p>在MySQL5.5版本之后，InnoDB成为默认引擎，InnoDB是MySQL的默认事务型引擎</p>
<p>特点：</p>
<ul>
<li>事务支持（ACID）：在一个事务中的操作保证要么全部成功，要么全部回滚</li>
</ul>
<p><strong>2、MyISAM</strong></p>
<p><strong>3、Memory</strong></p>
</div></template>


