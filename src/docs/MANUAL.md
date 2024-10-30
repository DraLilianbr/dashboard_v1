# Manual do Sistema de Anamnese de Acupuntura

## Visão Geral
Este sistema é uma aplicação web para realizar anamnese em pacientes de acupuntura, guiando-os através de uma série de vídeos e coletando suas respostas.

## Estrutura do Código

### 1. Componentes Principais

#### App.tsx
- Componente principal da aplicação
- Gerencia o estado global (índice do vídeo atual e respostas)
- Controla a navegação entre vídeos
- Estrutura: cabeçalho, conteúdo principal e rodapé

#### VideoPlayer.tsx
- Responsável pela reprodução dos vídeos
- Gerencia os indicadores de progresso
- Interface para entrada de respostas
- Botões de navegação (anterior/próximo)

#### ProgressDots.tsx
- Indicador visual do progresso
- Mostra vídeos completados, atual e futuros
- Pontos interativos para cada vídeo

### 2. Tipos e Interfaces

```typescript
// Video
interface Video {
  id: number;          // Identificador único do vídeo
  title: string;       // Título do vídeo
  url: string;         // URL do YouTube
  type: string;        // Tipo: introdução, pergunta ou conclusão
}

// Props do VideoPlayer
interface VideoPlayerProps {
  currentVideo: Video;              // Vídeo atual
  onNext: () => void;              // Função para próximo vídeo
  onPrevious: () => void;          // Função para vídeo anterior
  totalVideos: number;             // Total de vídeos
  currentIndex: number;            // Índice atual
  response: string;                // Resposta do usuário
  onResponseChange: (r: string);   // Função para atualizar resposta
}
```

### 3. Gerenciamento de Estado

#### Respostas
- Armazenadas em um objeto: `Record<number, string>`
- Chave: índice do vídeo
- Valor: resposta do paciente

#### Navegação
- `currentIndex`: Controla posição atual
- `responses`: Armazena respostas dos usuários

## Guia de Uso

1. **Iniciar Consulta**
   - O paciente começa com o vídeo de introdução
   - Interface intuitiva com controles simples

2. **Responder Perguntas**
   - Campo de texto para respostas
   - Respostas são salvas automaticamente

3. **Navegação**
   - Botões "Anterior" e "Próximo"
   - Barra de progresso visual
   - Pontos indicadores de progresso

4. **Conclusão**
   - Vídeo final de agradecimento
   - Todas as respostas são mantidas no estado da aplicação