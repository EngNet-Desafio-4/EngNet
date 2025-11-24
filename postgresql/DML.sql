BEGIN TRANSACTION;

INSERT INTO report_type (name) VALUES
('Vendas'),
('Estoque'),
('Clientes'),
('Financeiro'),
('Análise');

INSERT INTO refund_category (name) VALUES
('Combustível'),
('Alimentação'),
('Material'),
('Transporte'),
('Hospedagem'),
('Manutenção'),
('Serviços'),
('Ferramentas'),
('Equipamentos'),
('Limpeza'),
('Saúde'),
('Educação'),
('Lazer'),
('Comunicação'),
('Energia'),
('Internet'),
('Impostos'),
('Seguros'),
('Documentação'),
('Outros');


COMMIT;