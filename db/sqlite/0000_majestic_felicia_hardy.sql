CREATE TABLE `authenticator` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`credentialID` text NOT NULL,
	`credentialPublicKey` text NOT NULL,
	`counter` integer NOT NULL,
	`transports` text
);
--> statement-breakpoint
CREATE TABLE `storage` (
	`sessionID` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`authenticator_id` integer,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`challenge` text,
	`jwt_id` text,
	`active` integer NOT NULL,
	`isAdmin` integer,
	`metadata` text,
	`appdata` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`authenticator_id`) REFERENCES `authenticator`(`id`) ON UPDATE no action ON DELETE no action
);
