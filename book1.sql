-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 07 Jul 2021 pada 08.13
-- Versi server: 10.4.17-MariaDB
-- Versi PHP: 7.4.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `book1`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `id_product` text DEFAULT NULL,
  `name` text DEFAULT NULL,
  `price` text DEFAULT NULL,
  `category` text DEFAULT NULL,
  `path` text DEFAULT NULL,
  `file` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `product`
--

INSERT INTO `product` (`id`, `id_product`, `name`, `price`, `category`, `path`, `file`) VALUES
(10, 'oal2XRKGeh5UZqdW', 'Computer', '100000', 'hardware', 'f1xIeoHHUQL3k5bP3VU7XXK3NNbI2mUT', 'N6oyUPih9wcdewOV-1625630185012-joel-filipe-QwoNAhbmLLo-unsplash.jpg'),
(11, 'j4xn8sZsDkZJlKCX', 'SSD', '20000', 'hardware', 'bWYqYMWeMrPyEsukmVpnmrHYp7HENCfx', 'QhzuuRvXI6B9ZPQk-1625630255697-image.jpg'),
(12, 'amQhmF8gLbLt7bpS', 'OS &amp; &lt;tag/&gt;', '30000', 'software', 'J6Ewy3FJU1deSOgOFxgoZ6Dzp9epU9fA', 'xpEsiavTqqX5MdAf-1625630294045-joel-filipe-QwoNAhbmLLo-unsplash.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `id_key` text DEFAULT NULL,
  `id_user` text DEFAULT NULL,
  `level` text DEFAULT NULL,
  `status` text DEFAULT NULL,
  `name` text DEFAULT NULL,
  `username` text DEFAULT NULL,
  `password` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id`, `id_key`, `id_user`, `level`, `status`, `name`, `username`, `password`) VALUES
(1, 'sk7hEmbhAbzzIkUmPaMTnm1OwT6noj3nugQgetMbQE4Mn6XgVlNpOr7EFd3AwzEc', 'G6aFhmsGJUSJHRqMRx5USdcmzUjXVzxdA9L4AQ4XdwcgkpXKrNxg9u9hVR6Qg4xa', 'super', 'active', 'Andika Chamberlin', 'andikachamberlin', '7c222fb2927d828af22f592134e8932480637c0d'),
(2, 'riESYWZs8x3jmXMUXDv2Y4aITiuaCmtaGjw4G5bcFdraqDvDIqp4w5YLbEkj0mwY', '3Wk7qqrobh8x5C3nZF2SYM2zu8EuUIf9yeBmblogmLC8Kpvknyw2tgWBBVmCRcB4', 'user', 'active', 'Peraja', 'peraja', '7c222fb2927d828af22f592134e8932480637c0d'),
(3, 'lx58d7c0S749tQd3O7czK2FJxVw0uCItBo2SWzj0c3zaAgeRoeLmgSqCW3UUYNmK', 'kLhuArQ6dqMvhLbhbdyUfU3YMjn0qCw12kbB12YCl4XteQp66r3xUx5noD0ksHr0', 'admin', 'active', 'Ayu Ananda', 'ayuananda', '7c222fb2927d828af22f592134e8932480637c0d');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
