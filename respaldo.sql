-- MySQL dump 10.13  Distrib 9.4.0, for Win64 (x86_64)
--
-- Host: gateway01.ap-northeast-1.prod.aws.tidbcloud.com    Database: storyteller
-- ------------------------------------------------------
-- Server version	8.0.11-TiDB-v7.5.2-serverless

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answer` (
  `id_answer` int(11) NOT NULL AUTO_INCREMENT,
  `answer_text` varchar(50) NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `id_excercise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_answer`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`id_excercise`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_excercise`) REFERENCES `storyteller`.`excercises` (`id_excercise`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `excercises`
--

DROP TABLE IF EXISTS `excercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `excercises` (
  `id_excercise` int(11) NOT NULL AUTO_INCREMENT,
  `excercise_name` varchar(100) NOT NULL,
  `question` text NOT NULL,
  `excercise_type` enum('listening','writting','reading') NOT NULL,
  `id_lesson` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_excercise`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`id_lesson`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_lesson`) REFERENCES `storyteller`.`lessons` (`id_lesson`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `excercises`
--

LOCK TABLES `excercises` WRITE;
/*!40000 ALTER TABLE `excercises` DISABLE KEYS */;
/*!40000 ALTER TABLE `excercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `id_lesson` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `id_tale` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_lesson`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`id_tale`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_tale`) REFERENCES `storyteller`.`tale` (`id_tale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tale`
--

DROP TABLE IF EXISTS `tale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tale` (
  `id_tale` int(11) NOT NULL AUTO_INCREMENT,
  `tale_name` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `level_type` enum('A1','A2','B1','B2','C1','C2') NOT NULL,
  PRIMARY KEY (`id_tale`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=90001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tale`
--

LOCK TABLES `tale` WRITE;
/*!40000 ALTER TABLE `tale` DISABLE KEYS */;
INSERT INTO `tale` VALUES (60001,'El Principito','El Principito narra la historia de un aviador que, tras sufrir un accidente en el desierto del Sahara, conoce a un niño proveniente de un pequeño planeta llamado asteroide B-612. El principito vive allí solo, acompañado únicamente de tres volcanes y una rosa vanidosa a la que quiere, pero que lo hace sentir confundido.\r\n\r\nAl viajar por el universo, el principito visita distintos planetas, cada uno habitado por un personaje peculiar: un rey que cree gobernar todo, un vanidoso que busca admiración, un borracho atrapado en su vergüenza, un farolero que enciende y apaga su lámpara sin descanso, y un geógrafo que nunca explora. Estas figuras representan comportamientos de los adultos que el principito no comprende.\r\n\r\nAl llegar a la Tierra, se siente solo hasta que encuentra un zorro, quien le enseña una gran lección: “Lo esencial es invisible a los ojos”. Con ello, el principito entiende que su rosa, a pesar de ser como muchas otras, es única porque él la eligió y cuidó.\r\n\r\nFinalmente, decide regresar a su planeta para estar con su flor. El aviador, conmovido por su sabiduría, recuerda siempre a aquel niño que le enseñó a mirar con el corazón.','A2'),(60002,'Sherk','Shrek es una película animada que cuenta la historia de un ogro solitario que vive tranquilo en su pantano. Su paz se ve interrumpida cuando el malvado Lord Farquaad decide expulsar a todas las criaturas mágicas de su reino y las envía a vivir en la ciénaga de Shrek. Enojado, el ogro busca reclamar su hogar y, para lograrlo, acepta una misión: rescatar a la princesa Fiona, prisionera en un castillo custodiado por un dragón.\r\n\r\nDurante la aventura, Shrek es acompañado por Burro, un simpático y parlanchín compañero que le aporta humor y lealtad. Juntos enfrentan desafíos hasta llegar al castillo. Allí descubren que Fiona esconde un secreto: por las noches se convierte en ogro debido a un hechizo, y solo el “beso del verdadero amor” puede romperlo.\r\n\r\nAunque Fiona inicialmente espera casarse con un príncipe, pronto desarrolla sentimientos por Shrek. Sin embargo, por miedo al rechazo, oculta su transformación. Cuando Farquaad intenta casarse con ella para convertirse en rey, Shrek irrumpe en la boda y le declara su amor. Al besarse, Fiona queda convertida en ogro para siempre, aceptándose tal como es.\r\n\r\nFinalmente, Fiona y Shrek se casan y viven felices en el pantano junto a sus amigos.','A1'),(60003,'Blanca Nieves','Blanca Nieves es un cuento clásico recopilado por los hermanos Grimm. Narra la historia de una princesa de gran belleza, cuya madrastra, la Reina, siente envidia de ella. La Reina posee un espejo mágico al que pregunta cada día quién es la más hermosa del reino. Mientras el espejo responde que es la Reina, todo marcha bien, pero un día anuncia que la más bella es Blanca Nieves.\r\n\r\nLlenándose de celos, la Reina ordena a un cazador llevar a la joven al bosque y acabar con ella. Sin embargo, el hombre se apiada y la deja huir. Perdida, Blanca Nieves encuentra una cabaña habitada por siete enanitos, quienes la acogen con cariño y la protegen.\r\n\r\nLa Reina descubre que Blanca Nieves sigue viva y decide acabar con ella personalmente. Disfrazada de anciana, intenta tres veces engañarla: primero con un corsé apretado, luego con un peine envenenado, y finalmente con una manzana envenenada. Blanca Nieves muerde la manzana y cae en un sueño profundo que parece la muerte.\r\n\r\nTiempo después, un príncipe la encuentra y, al besarla, rompe el hechizo. Blanca Nieves despierta y se casa con él, mientras la Reina recibe su castigo.','B2');
/*!40000 ALTER TABLE `tale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `password` varchar(30) NOT NULL,
  `email` varchar(100) NOT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `role` enum('administrador','usuario') DEFAULT NULL,
  PRIMARY KEY (`id_user`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=60001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Marcos Acosta','Marcos_12.','marcos.acostagarcia17@gmail.com','2025-09-22 19:15:59','2025-09-22 19:15:51','administrador'),(30001,'Angela Gonzalez','Angela_12.','gola2@gmail.com','2025-09-22 19:42:44','2025-09-22 19:40:49','usuario');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_session_history`
--

DROP TABLE IF EXISTS `user_session_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_session_history` (
  `id_session` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `login_at` timestamp NULL DEFAULT NULL,
  `logout_at` timestamp NULL DEFAULT NULL,
  `duration_seconds` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_session`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`id_user`),
  CONSTRAINT `fk_1` FOREIGN KEY (`id_user`) REFERENCES `storyteller`.`user` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=60001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_session_history`
--

LOCK TABLES `user_session_history` WRITE;
/*!40000 ALTER TABLE `user_session_history` DISABLE KEYS */;
INSERT INTO `user_session_history` VALUES (1,1,'2025-09-22 19:15:59',NULL,NULL),(30001,30001,'2025-09-22 19:41:00',NULL,NULL),(30002,30001,'2025-09-22 19:42:44',NULL,NULL);
/*!40000 ALTER TABLE `user_session_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-23  9:34:10
