# 🦁 Simba Smart Market

A world-class e-commerce web app for fresh groceries in Rwanda — built with Next.js 16, TypeScript, and TailwindCSS.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State**: Zustand (localStorage persistence)
- **Notifications**: react-hot-toast
- **Icons**: Lucide React

## ✨ Features

- 🛍️ 28+ products across 8 categories
- 🔍 Real-time search with debounce + text highlight
- 🛒 Cart drawer with localStorage persistence
- 💳 Multi-step checkout with MTN MoMo simulation
- 🌙 Dark / Light mode toggle
- 🌍 English, French, Kinyarwanda
- 📱 Mobile-first responsive design
- ⭐ Smart recommendations based on cart
- 🔥 Trending, deals, new arrivals sections
- 💸 Price range + category filters

## 📂 Structure

```
src/
├── app/            # Next.js App Router pages
├── components/     # Reusable UI components
│   ├── cart/
│   ├── home/
│   ├── layout/
│   ├── product/
│   └── ui/
├── data/           # products.json
├── lib/            # Utilities + translations
├── store/          # Zustand global state
└── types/          # TypeScript types
```

## 🌐 Deploy on Vercel

Push to GitHub → import on Vercel → zero config required.

## 🎨 Brand Colors

| Token | Hex |
|-------|-----|
| Primary Orange | `#F97316` |
| Green (prices) | `#22C55E` |
| Blue (links) | `#2563EB` |
| Dark bg | `#0F172A` |
