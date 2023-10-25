CREATE TABLE message_board (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20),
    `content` VARCHAR(2000),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO
    message_board (`name`, `content`)
VALUES
    ("John Doe", "Foo"),
    (
        "Christ Wong",
        "This website must be very secure!"
    );