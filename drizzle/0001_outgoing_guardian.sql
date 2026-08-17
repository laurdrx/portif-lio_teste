CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text DEFAULT (''),
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`portfolioName` varchar(255) NOT NULL DEFAULT 'Meu Portfólio',
	`tagline` varchar(500) DEFAULT '',
	`aboutTitle` varchar(255) DEFAULT 'Sobre',
	`aboutText` text DEFAULT (''),
	`shortBio` text DEFAULT (''),
	`profileImageUrl` text DEFAULT (''),
	`profileImageKey` text DEFAULT (''),
	`whatsapp` varchar(30) DEFAULT '',
	`emailPublic` varchar(320) DEFAULT '',
	`location` varchar(255) DEFAULT '',
	`socialLinks` json DEFAULT ('[]'),
	`contactIntro` text DEFAULT (''),
	`uxVoice` varchar(64) DEFAULT 'direto',
	`themeConfig` json DEFAULT ('{}'),
	`faviconUrl` text DEFAULT (''),
	`faviconKey` text DEFAULT (''),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_blocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`userId` int NOT NULL,
	`type` enum('text','image','youtube','audio') NOT NULL,
	`content` text DEFAULT (''),
	`mediaUrl` text DEFAULT (''),
	`mediaKey` text DEFAULT (''),
	`altText` varchar(500) DEFAULT '',
	`caption` text DEFAULT (''),
	`transcript` text DEFAULT (''),
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_blocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`categoryId` int,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`shortDescription` text DEFAULT (''),
	`coverImageUrl` text DEFAULT (''),
	`coverImageKey` text DEFAULT (''),
	`coverImageAlt` varchar(500) DEFAULT '',
	`year` varchar(10) DEFAULT '',
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`featured` boolean NOT NULL DEFAULT false,
	`displayOrder` int NOT NULL DEFAULT 0,
	`metaDescription` text DEFAULT (''),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
