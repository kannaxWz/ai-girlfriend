CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL
);

CREATE TABLE conversations (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    conversation_id SERIAL PRIMARY KEY
);

CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    content TEXT,
    created_at SET DEFAULT CURRENT_TIMESTAMP;
);

