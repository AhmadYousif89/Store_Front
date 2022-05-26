/* Create User_Tokens */
CREATE TABLE IF NOT EXISTS user_tokens (
    _id UUID REFERENCES users(_id) ON DELETE CASCADE PRIMARY KEY,
    token VARCHAR NOT NULL,
    i_at TIMESTAMPTZ DEFAULT NOW()
);