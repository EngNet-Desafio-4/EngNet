---------------------------------------
-- ENUM TYPES
---------------------------------------
CREATE TYPE refund_status AS ENUM ('Pendente', 'Aprovado', 'Rejeitado');
CREATE TYPE customer_status AS ENUM ('VIP', 'Ativo', 'Novo', 'Inativo');
CREATE TYPE report_status AS ENUM ('Disponível', 'Processando', 'Indisponível');
CREATE TYPE report_frequency AS ENUM ('Diário', 'Semanal', 'Mensal', 'Trimestral', 'Semestral', 'Anual');

---------------------------------------
-- OPTIONAL DOMAIN TYPES
---------------------------------------
CREATE DOMAIN type_email AS TEXT
    CHECK (VALUE ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
CREATE DOMAIN type_phone AS CHAR(11);

---------------------------------------
-- TABLES
---------------------------------------
CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   email type_email UNIQUE NOT NULL,
   password TEXT NOT NULL
);

CREATE TABLE employee
(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email type_email UNIQUE NOT NULL,
    phone type_phone,
    photo BYTEA,
    birthday DATE
);

CREATE TABLE refund_category
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE
);

CREATE TABLE customer
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email type_email UNIQUE NOT NULL,
    phone type_phone,
    total_purchases NUMERIC(12, 2) DEFAULT 0,
    status customer_status DEFAULT 'Novo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refund
(
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employee(id) ON DELETE CASCADE,
    category_id INT REFERENCES refund_category(id) ON DELETE SET NULL,
    description TEXT,
    amount NUMERIC(10, 2) CHECK (amount > 0),
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status refund_status DEFAULT 'Pendente'
);

CREATE TABLE report_type
(
    id SERIAL PRIMARY KEY,
    name CHAR(30) NOT NULL UNIQUE
);

CREATE TABLE report
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type_id INT REFERENCES report_type(id) ON DELETE SET NULL,
    frequency report_frequency NOT NULL,
    status report_status DEFAULT 'Processando',
    size CHAR(10),
    file BYTEA,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---------------------------------------
-- AUDIT LOG
---------------------------------------
CREATE TABLE event_log (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    record_id TEXT,
    username TEXT,
    ip TEXT,
    event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_values JSONB,
    new_values JSONB
);

---------------------------------------
-- AUDIT FUNCTION
---------------------------------------
CREATE OR REPLACE FUNCTION fn_register_event_log()
RETURNS TRIGGER AS $$
DECLARE
v_username TEXT;
    v_ip TEXT;
BEGIN
    v_username := current_user;

    BEGIN
        v_ip := current_setting('session.client_ip');
    EXCEPTION WHEN OTHERS THEN
        v_ip := '127.0.0.1';
    END;

    INSERT INTO event_log (
        table_name,
        operation,
        record_id,
        username,
        ip,
        old_values,
        new_values
    )
    VALUES (
        TG_TABLE_NAME,
        TG_OP,
        COALESCE(NEW.id::TEXT, OLD.id::TEXT, '-'),
        v_username,
        v_ip,
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) END
    );

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

---------------------------------------
-- TRIGGERS FOR ALL TABLES
---------------------------------------
CREATE TRIGGER trg_log_users
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION fn_register_event_log();

CREATE TRIGGER trg_log_employee
    AFTER INSERT OR UPDATE OR DELETE ON employee
    FOR EACH ROW EXECUTE FUNCTION fn_register_event_log();

CREATE TRIGGER trg_log_category
    AFTER INSERT OR UPDATE OR DELETE ON refund_category
    FOR EACH ROW EXECUTE FUNCTION fn_register_event_log();

CREATE TRIGGER trg_log_customer
    AFTER INSERT OR UPDATE OR DELETE ON customer
    FOR EACH ROW EXECUTE FUNCTION fn_register_event_log();

CREATE TRIGGER trg_log_refund
    AFTER INSERT OR UPDATE OR DELETE ON refund
    FOR EACH ROW EXECUTE FUNCTION fn_register_event_log();

CREATE TRIGGER trg_log_report_type
    AFTER INSERT OR UPDATE OR DELETE ON report_type
    FOR EACH ROW EXECUTE FUNCTION fn_register_event_log();

CREATE TRIGGER trg_log_report
    AFTER INSERT OR UPDATE OR DELETE ON report
    FOR EACH ROW EXECUTE FUNCTION fn_register_event_log();
