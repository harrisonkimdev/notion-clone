This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

Here’s a polished **README.md** draft you can drop straight into your repo 👇

---

# Notion-Clone (Next.js + gpt-oss-20b)

A Notion-style collaborative workspace built with **Next.js**, **PostgreSQL**, and **AI features powered by gpt-oss-20b**.
The project starts as a lightweight document editor and evolves into a fully collaborative knowledge base.

---

## ✨ Features (MVP)

* 🔑 Authentication with NextAuth.js
* 📄 Page & Block CRUD (text, headings, lists, todos, etc.)
* 🖊️ Rich text editor (Tiptap or Lexical) with slash commands
* 📂 File uploads via S3-compatible storage
* 🔍 Search (Postgres full-text + pgvector embeddings)
* 🤖 AI Assistance (rewrite, summarize, translate, bulletify) using **gpt-oss-20b** via Ollama / llama.cpp / vLLM

### 🚀 Planned Extensions

* 👥 Real-time collaboration with Yjs (multi-cursor, offline sync)
* 🗂️ AI-powered workspace organization (duplicate detection, tag suggestions, restructure proposals)
* 🔗 Sharing & permissions (workspace roles, public links)
* 📦 Desktop app packaging with Tauri

---

## 🏗️ Tech Stack

* **Frontend/Backend**: Next.js (App Router, Server Actions, Route Handlers)
* **Database**: PostgreSQL + Prisma ORM (+ `pgvector` extension)
* **Editor**: Tiptap (ProseMirror) or Lexical
* **Authentication**: NextAuth.js (Google OAuth by default)
* **File Storage**: S3-compatible (AWS S3, R2, or MinIO)
* **AI Runtime**: gpt-oss-20b hosted via:

  * [Ollama](https://ollama.ai) – easiest local Mac option
  * [llama.cpp](https://github.com/ggerganov/llama.cpp) – lightweight C++ runtime (Metal support on Apple Silicon)
  * [vLLM](https://github.com/vllm-project/vllm) – high-throughput GPU server for production

---

## 📂 Project Structure

```
app/
  (app)/w/[workspaceId]/p/[pageId]/page.tsx  # Editor page
  api/
    files/route.ts       # File upload presign
    ai/complete/route.ts # AI chat completions
    ai/embed/route.ts    # Embeddings
components/
  editor/                # Editor UI components
lib/
  db.ts                  # Prisma client
  auth.ts                # NextAuth config
  ai.ts                  # AI client (OpenAI-compatible)
  vector.ts              # Embedding utils
prisma/
  schema.prisma          # Database schema
```

---

## ⚡ Getting Started

### 1. Clone & install

```bash
git clone https://github.com/yourusername/notion-clone.git
cd notion-clone
npm install
```

### 2. Set environment variables

Create `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/notionclone"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
AI_BASE_URL="http://localhost:11434/v1"   # Ollama or llama.cpp
AI_API_KEY="dummy"                        # not required for local runtimes
S3_BUCKET_NAME="your-bucket"
S3_ACCESS_KEY="your-key"
S3_SECRET_KEY="your-secret"
S3_ENDPOINT="https://s3.your-provider.com"
```

### 3. Setup database

```bash
npx prisma migrate dev
npx prisma db seed   # optional
```

### 4. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🤖 AI Integration

Run gpt-oss-20b locally with [Ollama](https://ollama.ai):

```bash
ollama pull gpt-oss-20b
ollama serve
```

Or with **llama.cpp**:

```bash
llama-server -m ./models/gpt-oss-20b.Q4_K_M.gguf --port 11434
```

Both expose an **OpenAI-compatible API** at `http://localhost:11434/v1`.

---

## 🛠️ Development Roadmap

* [x] Authentication + Workspace/Page CRUD
* [x] Block editor with AI rewrite/summarize
* [ ] File upload integration
* [ ] Full-text + vector search
* [ ] AI workspace organization (beta)
* [ ] Permissions & sharing
* [ ] Real-time collaboration with Yjs
* [ ] Desktop client with Tauri

---

## 📜 License

This project is open source under the [MIT License](LICENSE).
The integrated **gpt-oss-20b** model is licensed under [Apache-2.0](https://huggingface.co/mlabonne/gpt-oss-20b).

---

Would you like me to make a **concise version** of this README (for GitHub front page, <200 lines) or a **developer-focused extended version** (with migration, testing, deployment, and contribution guidelines)?
