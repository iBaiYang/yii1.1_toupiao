-- ----------------------------
-- Table structure for tek_year
-- ----------------------------
DROP TABLE IF EXISTS `tek_year`;
CREATE TABLE `tek_year` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `content` text COMMENT '节目编号',
  `mobile` varchar(255) DEFAULT NULL COMMENT '手机号码',
  `create_date` int(11) DEFAULT NULL COMMENT '写入时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='节目投票记录表';

-- ----------------------------
-- Records of tek_year
-- ----------------------------
INSERT INTO `tek_year` VALUES ('1', '5', '18630145129', '1484100405');
INSERT INTO `tek_year` VALUES ('2', '1', '13916543049', '1484299551');
INSERT INTO `tek_year` VALUES ('3', '2', '13916543049', '1484299561');