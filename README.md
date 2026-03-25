# Aura Recall SaaS - Restauração de Fotos com IA

Este é o código completo (Frontend + Backend + Banco de Dados + Fluxo de Pagamento) para o seu SaaS de restauração de fotos antigas focado em lucratividade e simplicidade.

## Estrutura do Projeto

O projeto foi dividido em dois subdiretórios principais:

*   `/frontend`: Onde o seu app em React/Next.js (com o layout Digital Heirloom) roda usando o Tailwind v4.
*   `/backend`: Um servidor Express com Node.js usando Prisma e um banco de dados PostgreSQL. As regras de autenticação (simplificadas), upload no Cloudinary, Mock de IA e Checkout no Stripe vivem aqui.

---

## 🚀 Como Rodar o Projeto

Para rodar este projeto na sua máquina, siga os passos:

### 1. Configurar o Backend
Abra um terminal, acesse a pasta `backend` e instale as dependências.
```bash
cd backend
npm install
```

Você precisará de um banco de dados PostgreSQL rodando localmente (ou na nuvem, como o Supabase/Neon). 
Atualize a string de conexão no arquivo `backend/.env` na variável `DATABASE_URL`.

Após configurar o `.env`, rode as migrações para criar as tabelas (User, Photo, Transaction) e inicie o servidor:
```bash
npx prisma db push
npm run dev
```
*(O servidor rodará na porta 3001)*

### 2. Configurar o Frontend
Abra um **segundo terminal**, acesse a pasta `frontend` e instale as dependências:
```bash
cd frontend
npm install
```
Em seguida, inicialize a aplicação:
```bash
npm run dev
```
Acesse `http://localhost:3000` no seu navegador. Você já deve ver a Landing Page lindamente desenhada e o Dashboard logado (/dashboard)!

---

## 🤖 Como Conectar a API de IA Real (Replicate)

Atualmente no backend (`backend/src/routes/upload.ts`), nós criamos um mock `simulateAiProcessing()` que simula um processo de 5 segundos de inteligência artificial. Para ligar a sua API de IA com o Replicate, basta fazer o seguinte:

1. Instale o pacote oficial do Replicate no backend:
   ```bash
   cd backend
   npm install replicate
   ```

2. Adicione sua chave (API Key) do Replicate ao arquivo `backend/.env`:
   ```env
   REPLICATE_API_TOKEN="r8_suachaveaqui..."
   ```

3. Modifique o arquivo `upload.ts` (ou um controller) para chamar a API nos momentos exatos:
   ```typescript
   import Replicate from "replicate";
   const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
   
   // Dentro do seu fluxo logo após o upload original da foto...
   const output = await replicate.run(
     "tencentarc/gfpgan:92836...", // Modelo famoso para Upscale / Correção Facial
     {
       input: {
         img: photo.originalUrl,
         scale: 2, // Melhorar nitidez 2x
         version: "v1.4"
       }
     }
   );
   
   // A API devolverá uma URL! Adicione ao banco:
   await prisma.photo.update({
     where: { id: photo.id },
     data: { restoredUrl: output, status: 'COMPLETED' }
   });
   ```

## 💳 Checkout & Pagamentos

O sistema de checkout no `backend/src/routes/payment.ts` inclui 3 pacotes (5, 10, e 20 fotos). 
1. Crie a conta gratuita no portal da [Stripe](https://stripe.com).
2. Adicione a sua `STRIPE_SECRET_KEY` no `backend/.env` e `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` no frontend `.env.local`.
3. Configure o webhook do backend (`/api/webhook/checkout`) dentro da interface da Stripe para alimentar a variável `STRIPE_WEBHOOK_SECRET`. Assim que o usuário paga, o banco de dados é atualizado em tempo real.

**Pronto! Seu produto simples e altamente funcional já está construído.**
