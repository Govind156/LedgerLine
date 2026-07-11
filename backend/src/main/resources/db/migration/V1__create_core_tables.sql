-- ============================================================
-- V1: Core schema for the Personal Finance Tracker
-- ============================================================

CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    full_name     VARCHAR(120)  NOT NULL,
    email         VARCHAR(180)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(80)  NOT NULL,
    type        VARCHAR(10)  NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    color       VARCHAR(20)  DEFAULT '#6366f1',
    created_at  TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT uq_category_user_name_type UNIQUE (user_id, name, type)
);

CREATE TABLE transactions (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id     BIGINT        NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    type            VARCHAR(10)   NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    amount          NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    description     VARCHAR(255),
    transaction_date DATE         NOT NULL,
    created_at      TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE TABLE budgets (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id   BIGINT        NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    monthly_limit NUMERIC(14,2) NOT NULL CHECK (monthly_limit > 0),
    month         INT           NOT NULL CHECK (month BETWEEN 1 AND 12),
    year          INT           NOT NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP     NOT NULL DEFAULT now(),
    CONSTRAINT uq_budget_user_category_month_year UNIQUE (user_id, category_id, month, year)
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_user_month_year ON budgets(user_id, month, year);