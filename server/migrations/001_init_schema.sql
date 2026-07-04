CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL
);

CREATE TABLE conversations (
    user_id INT REFERENCES users(user_id),
    conversation_id SERIAL PRIMARY KEY
);

CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(conversation_id),
    role VARCHAR(50) NOT NULL,
    content TEXT,
    created_at TIMESTAMP
);