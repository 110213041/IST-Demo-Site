CREATE TABLE message_board (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20),
    `content` VARCHAR(2000),
    PRIMARY KEY (`id`)
);

INSERT INTO
    message_board (`name`, `content`)
VALUES
    ("John Doe", "Foo"),
    (
        "Christ Wong",
        "This website must be very secure!"
    );