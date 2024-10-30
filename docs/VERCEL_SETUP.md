# Guia de Configuração do Backend com Vercel Postgres

## 1. Configuração do Vercel Postgres

### 1.1 Criar um Projeto na Vercel

1. Acesse [https://vercel.com](https://vercel.com)
2. Faça login ou crie uma conta
3. Crie um novo projeto:
   - Clique em "Add New Project"
   - Conecte com seu repositório Git
   - Configure o nome do projeto
   - Mantenha as configurações padrão do framework
   - Clique em "Deploy"

### 1.2 Adicionar Vercel Postgres

1. No dashboard do seu projeto na Vercel:
   - Vá para a aba "Storage"
   - Clique em "Connect Store"
   - Selecione "Vercel Postgres"
   - Escolha a região mais próxima
   - Clique em "Create"

### 1.3 Configurar Variáveis de Ambiente

O Vercel criará automaticamente estas variáveis:
```env
POSTGRES_URL=seu_url_postgres
POSTGRES_PRISMA_URL=seu_url_prisma
POSTGRES_URL_NON_POOLING=seu_url_non_pooling
POSTGRES_USER=seu_usuario
POSTGRES_HOST=seu_host
POSTGRES_PASSWORD=sua_senha
POSTGRES_DATABASE=seu_database
```

Para desenvolvimento local:
1. Na dashboard do Vercel:
   - Vá para Settings > Environment Variables
   - Clique em "Development" para cada variável
   - Copie todas as variáveis
2. Crie um arquivo `.env.local` na raiz do projeto
3. Cole as variáveis copiadas

## 2. Estrutura do Banco de Dados

### 2.1 Conectar ao Banco

1. Instale a CLI do Vercel:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Vincule o projeto:
```bash
vercel link
```

4. Puxe as variáveis de ambiente:
```bash
vercel env pull .env.local
```

### 2.2 Criar Tabelas

Execute estes comandos no Vercel Postgres Dashboard (Storage > Database > Query):

```sql
-- Criar tabela de pacientes
-- Armazena informações básicas dos pacientes
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,                                    -- ID único autoincremental
  name VARCHAR(255) NOT NULL,                              -- Nome completo do paciente
  email VARCHAR(255) UNIQUE NOT NULL,                      -- Email único do paciente
  phone VARCHAR(20),                                       -- Telefone (opcional)
  birth_date DATE,                                         -- Data de nascimento
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,  -- Data de criação
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP   -- Data de atualização
);

-- Criar tabela de consultas
-- Registra todas as consultas marcadas
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,                                    -- ID único autoincremental
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,  -- Referência ao paciente
  date DATE NOT NULL,                                      -- Data da consulta
  time TIME NOT NULL,                                      -- Hora da consulta
  type VARCHAR(20) CHECK (type IN ('first_visit', 'follow_up')) NOT NULL,  -- Tipo de consulta
  status VARCHAR(20) CHECK (
    status IN ('scheduled', 'confirmed', 'cancelled', 'completed')
  ) NOT NULL,                                              -- Status da consulta
  notes TEXT,                                              -- Observações (opcional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de questionários
-- Armazena os questionários de anamnese
CREATE TABLE questionnaires (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  submitted_at TIMESTAMP WITH TIME ZONE,                    -- Data de envio
  status VARCHAR(20) CHECK (status IN ('complete', 'incomplete')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de respostas do questionário
-- Armazena as respostas individuais de cada questionário
CREATE TABLE questionnaire_responses (
  id SERIAL PRIMARY KEY,
  questionnaire_id INTEGER REFERENCES questionnaires(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,                        -- Número da questão
  response TEXT NOT NULL,                                  -- Resposta do paciente
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de recibos
-- Registra todos os pagamentos e recibos emitidos
CREATE TABLE receipts (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,                          -- Valor do pagamento
  payment_method VARCHAR(50) NOT NULL,                    -- Método de pagamento
  status VARCHAR(20) CHECK (
    status IN ('paid', 'pending', 'cancelled')
  ) NOT NULL,                                            -- Status do pagamento
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL,           -- Data de emissão
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar função para atualizar automaticamente o updated_at
-- Esta função será chamada por triggers quando um registro for atualizado
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para cada tabela
-- Estes triggers atualizam automaticamente o campo updated_at
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questionnaires_updated_at
  BEFORE UPDATE ON questionnaires
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questionnaire_responses_updated_at
  BEFORE UPDATE ON questionnaire_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_receipts_updated_at
  BEFORE UPDATE ON receipts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 3. Implementação do Backend

### 3.1 Instalar Dependências

```bash
npm install @vercel/postgres
```

### 3.2 Configurar Cliente do Banco de Dados

Crie o arquivo `src/lib/db.ts`:

```typescript
import { sql } from '@vercel/postgres';
import { Database } from '../types/database';

// Cliente de banco de dados com métodos utilitários
export const db = {
  // Executa uma query e retorna múltiplas linhas
  async query<T>(
    query: string,
    values?: any[]
  ): Promise<T[]> {
    try {
      const result = await sql.query(query, values);
      return result.rows as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  // Executa uma query e retorna uma única linha
  async queryOne<T>(
    query: string,
    values?: any[]
  ): Promise<T | null> {
    const results = await this.query<T>(query, values);
    return results[0] || null;
  }
};
```

### 3.3 Criar API Routes

Crie o arquivo `api/patients.ts`:

```typescript
import { sql } from '@vercel/postgres';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    // Roteamento baseado no método HTTP
    switch (request.method) {
      // Buscar todos os pacientes
      case 'GET':
        const result = await sql`
          SELECT * FROM patients 
          ORDER BY created_at DESC
        `;
        return response.status(200).json(result.rows);

      // Criar novo paciente
      case 'POST':
        const { name, email, phone, birth_date } = request.body;
        const inserted = await sql`
          INSERT INTO patients (name, email, phone, birth_date)
          VALUES (${name}, ${email}, ${phone}, ${birth_date})
          RETURNING *
        `;
        return response.status(201).json(inserted.rows[0]);

      // Atualizar paciente existente
      case 'PUT':
        const { id, ...updates } = request.body;
        const fields = Object.keys(updates)
          .map(key => `${key} = ${updates[key]}`)
          .join(', ');
        
        const updated = await sql`
          UPDATE patients
          SET ${sql(fields)}
          WHERE id = ${id}
          RETURNING *
        `;
        return response.status(200).json(updated.rows[0]);

      // Deletar paciente
      case 'DELETE':
        const { id: deleteId } = request.query;
        await sql`DELETE FROM patients WHERE id = ${deleteId}`;
        return response.status(204).end();

      default:
        return response.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return response.status(500).json({ error: error.message });
  }
}
```

## 4. Uso no Frontend

### 4.1 Criar Hook para Pacientes

```typescript
// src/hooks/usePatients.ts
import { useState, useEffect } from 'react';
import { Patient } from '../types/database';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Buscar todos os pacientes
  async function fetchPatients() {
    try {
      const response = await fetch('/api/patients');
      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  // Criar novo paciente
  async function createPatient(patient: Omit<Patient, 'id'>) {
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient)
    });
    if (!response.ok) throw new Error('Failed to create patient');
    await fetchPatients();
  }

  // Atualizar paciente
  async function updatePatient(id: number, updates: Partial<Patient>) {
    const response = await fetch('/api/patients', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    });
    if (!response.ok) throw new Error('Failed to update patient');
    await fetchPatients();
  }

  // Deletar paciente
  async function deletePatient(id: number) {
    const response = await fetch(`/api/patients?id=${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete patient');
    await fetchPatients();
  }

  // Carregar pacientes ao montar o componente
  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    refetch: fetchPatients,
    createPatient,
    updatePatient,
    deletePatient
  };
}
```

## 5. Manutenção e Boas Práticas

### 5.1 Backups

1. Configure backups automáticos:
   - No dashboard do Vercel, vá para Storage > Database
   - Ative "Automatic Backups"
   - Escolha a frequência (diária recomendada)

2. Para backup manual:
```bash
pg_dump -h seu_host -U seu_usuario -d seu_database > backup.sql
```

### 5.2 Monitoramento

1. Configure alertas no Vercel:
   - Vá para Settings > Monitoring
   - Configure alertas para:
     - Uso de CPU
     - Uso de memória
     - Conexões ativas
     - Espaço em disco

2. Monitore logs:
   - Use o Vercel Dashboard > Logs
   - Configure retenção de logs

### 5.3 Segurança

1. Mantenha senhas seguras
2. Use sempre prepared statements
3. Implemente rate limiting
4. Configure CORS adequadamente
5. Faça validação de dados
6. Use HTTPS sempre

### 5.4 Performance

1. Use índices apropriados:
```sql
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_questionnaires_patient_id ON questionnaires(patient_id);
```

2. Otimize queries:
   - Use EXPLAIN ANALYZE
   - Evite SELECT *
   - Use paginação
   - Implemente cache quando apropriado

## 6. Troubleshooting

### 6.1 Problemas Comuns

1. Erro de conexão:
   - Verifique variáveis de ambiente
   - Teste conectividade com `pg_isready`
   - Verifique limites de conexão

2. Queries lentas:
   - Use EXPLAIN ANALYZE
   - Verifique índices
   - Otimize JOINs

3. Erros de permissão:
   - Verifique roles do banco
   - Confirme grants necessários

### 6.2 Suporte

1. Documentação:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [PostgreSQL](https://www.postgresql.org/docs/)

2. Suporte Vercel:
   - Dashboard > Support
   - [Fórum da Comunidade](https://github.com/vercel/community)

## 7. Próximos Passos

1. Implementar cache
2. Adicionar testes automatizados
3. Configurar CI/CD
4. Implementar auditoria
5. Adicionar métricas de negócio
6. Configurar disaster recovery