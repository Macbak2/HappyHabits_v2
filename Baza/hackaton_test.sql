-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Wrz 30, 2024 at 11:52 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hackaton_test`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `teksty`
--

CREATE TABLE `teksty` (
  `id` int(11) NOT NULL,
  `tresc` varchar(100) NOT NULL,
  `data_wykonania` date DEFAULT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  `explanation` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Dumping data for table `teksty`
--

INSERT INTO `teksty` (`id`, `tresc`, `data_wykonania`, `status`, `explanation`) VALUES
(6, 'Iść do lekarza', '2024-10-29', 'completed', NULL),
(8, 'Ugotować zupę', '2024-10-29', 'completed', NULL),
(10, 'Przerobić jeden odcinek MegaK', '2024-09-29', 'failed', 'bo mi się nie chciało'),
(11, 'Przyjść o 12.00 na Hackaton', '2024-10-29', 'completed', NULL),
(12, 'Przerobić dwa odcinki Frontowców z notatkami', '2024-09-30', 'failed', 'bo tak'),
(13, 'Do godziny 00:00 zaznaczyć, które cele się udały, a które nie', '2024-10-30', 'pending', NULL),
(21, 'qwertiiii', '2024-09-27', 'failed', 'gugggjgjgjgjg');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `teksty`
--
ALTER TABLE `teksty`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `teksty`
--
ALTER TABLE `teksty`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
