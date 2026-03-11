### 🚀 Como configurar o Supabase (Dados Permanentes)

Para que seus dados não sumam no Vercel, siga estes passos:

1. **Crie uma conta no Supabase**: Acesse [supabase.com](https://supabase.com) e crie um projeto.
2. **Crie a Tabela**: No painel do Supabase, vá em **"SQL Editor"** e cole este código:
   ```sql
   create table students (
     id text primary key,
     name text not null,
     registration text not null,
     pairId text,
     grades jsonb default '{}'::jsonb
   );
   ```
   Clique em **"Run"**.
3. **Pegue as Chaves**: Vá em **Project Settings > API**.
4. **Configure no Vercel**:
   - No painel do seu projeto no Vercel, vá em **Settings > Environment Variables**.
   - Adicione `SUPABASE_URL` com a URL do seu projeto.
   - Adicione `SUPABASE_ANON_KEY` com a chave "anon public".
5. **Re-deploy**: O Vercel vai atualizar o site e agora tudo será salvo no banco de dados real!

---

# Instruções para Deploy no Vercel

Para colocar seu sistema de Prótese Total no Vercel, siga estes passos:

1. **Exporte o Código**: Vá em **Settings > Export to ZIP** aqui no AI Studio.
2. **GitHub**: Crie um repositório no seu GitHub e suba todos os arquivos que você baixou.
3. **Vercel**:
   - Vá em [vercel.com](https://vercel.com) e faça login com seu GitHub.
   - Clique em **"Add New" > "Project"**.
   - Importe o repositório que você acabou de criar.
   - O Vercel vai detectar as configurações automaticamente (Vite + Node.js).
   - Clique em **"Deploy"**.

### ⚠️ Atenção sobre os Dados (Importante!)
O Vercel é "estático/serverless". Isso significa que o arquivo `students.json` **não salva permanentemente** lá. Se o site reiniciar, os dados voltam ao que estavam no momento do deploy.

**Como resolver isso de forma definitiva:**
A melhor forma gratuita é usar o **Supabase** (um banco de dados gratuito). Se você decidir usar o Supabase, me avise e eu troco o código para você em um minuto!

Por enquanto, você pode usar o Vercel para a parte visual, mas lembre-se de sempre baixar o **Backup** no aplicativo para não perder nada.
