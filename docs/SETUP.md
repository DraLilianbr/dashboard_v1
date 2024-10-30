# Guia de Configuração do Backend

## 1. Configuração do Supabase

### 1.1 Criar uma conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub ou crie uma conta
4. Crie um novo projeto:
   - Escolha um nome para o projeto
   - Defina uma senha forte para o banco de dados
   - Escolha a região mais próxima
   - Clique em "Create project"

### 1.2 Configurar o Banco de Dados

Execute os seguintes comandos SQL no Editor SQL do Supabase:

```sql
-- Criar tabela de pacientes
CREATE TABLE patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  birth_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de consultas
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type TEXT CHECK (type IN ('first_visit', 'follow_up')) NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de questionários
CREATE TABLE questionnaires (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('complete', 'incomplete')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de respostas do questionário
CREATE TABLE questionnaire_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  questionnaire_id UUID REFERENCES questionnaires(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de recibos
CREATE TABLE receipts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT CHECK (status IN ('paid', 'pending', 'cancelled')) NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar triggers para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_questionnaires_updated_at
  BEFORE UPDATE ON questionnaires
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_questionnaire_responses_updated_at
  BEFORE UPDATE ON questionnaire_responses
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_receipts_updated_at
  BEFORE UPDATE ON receipts
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
```

### 1.3 Configurar Políticas de Segurança (RLS)

Execute estes comandos para configurar as políticas de acesso:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- Criar políticas para cada tabela
CREATE POLICY "Permitir acesso completo para usuários autenticados" ON patients
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir acesso completo para usuários autenticados" ON appointments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir acesso completo para usuários autenticados" ON questionnaires
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir acesso completo para usuários autenticados" ON questionnaire_responses
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir acesso completo para usuários autenticados" ON receipts
  FOR ALL USING (auth.role() = 'authenticated');
```

## 2. Integração com o Frontend

### 2.1 Instalar Dependências

```bash
npm install @supabase/supabase-js
```

### 2.2 Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

### 2.3 Configurar Cliente Supabase

Crie um arquivo `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

## 3. Implementação das Funcionalidades

### 3.1 Autenticação

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return { isAuthenticated, login, logout }
}
```

### 3.2 Operações CRUD

Exemplo de como implementar operações CRUD para pacientes:

```typescript
// src/services/patients.ts
import { supabase } from '../lib/supabase'
import { Database } from '../types/database'

type Patient = Database['public']['Tables']['patients']['Row']
type PatientInsert = Database['public']['Tables']['patients']['Insert']

export const patientsService = {
  // Buscar todos os pacientes
  async getAll() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar um paciente por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar novo paciente
  async create(patient: PatientInsert) {
    const { data, error } = await supabase
      .from('patients')
      .insert(patient)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar paciente
  async update(id: string, updates: Partial<PatientInsert>) {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar paciente
  async delete(id: string) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
```

## 4. Uso nos Componentes

Exemplo de como usar os serviços nos componentes:

```typescript
// src/pages/admin/Patients.tsx
import { useEffect, useState } from 'react'
import { patientsService } from '../../services/patients'

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPatients()
  }, [])

  async function loadPatients() {
    try {
      const data = await patientsService.getAll()
      setPatients(data)
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error)
    } finally {
      setLoading(false)
    }
  }

  // ... resto do componente
}
```

## 5. Próximos Passos

1. Implementar serviços para outras entidades (appointments, questionnaires, etc.)
2. Adicionar tratamento de erros global
3. Implementar cache de dados
4. Adicionar testes
5. Configurar CI/CD

## 6. Dicas Importantes

1. Sempre use tipos TypeScript para garantir segurança
2. Implemente tratamento de erros em todas as operações
3. Use loading states para melhorar UX
4. Mantenha as políticas de segurança atualizadas
5. Faça backup regular do banco de dados
6. Monitore o uso de recursos no Supabase