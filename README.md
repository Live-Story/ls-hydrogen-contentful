# Hydrogen template: Skeleton

Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to dovetail with [Remix](https://remix.run/), Shopify’s full stack web framework. This template contains a **minimal setup** of components, queries and tooling to get started with Hydrogen.

[Check out Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)
[Get familiar with Remix](https://remix.run/docs/en/v1)

## What's included

- Remix
- Hydrogen
- Oxygen
- Vite
- Shopify CLI
- ESLint
- Prettier
- GraphQL generator
- TypeScript and JavaScript flavors
- Minimal setup of components and routes
- Contentful entries [fetch](https://github.com/Live-Story/ls-hydrogen-contentful/blob/11089de57c5d5268bb0fb01f0277fb4ab4984e73/app/routes/(%24locale).contentful.entries.livestory._index.tsx#L30)
- Live Story SSR [fetch](https://github.com/Live-Story/ls-hydrogen-contentful/blob/11089de57c5d5268bb0fb01f0277fb4ab4984e73/app/routes/(%24locale).contentful.entries.livestory.%24id.tsx#L70). Learn more about [Live Story server-side rendering](https://livestory.nyc/documentation/articles/enhanced-client-side-integration#enable-ssr-support) and our API to fetch it described in the ***API SPECIFICATION*** section
- Live Story entries [rendering](https://github.com/Live-Story/ls-hydrogen-contentful/blob/11089de57c5d5268bb0fb01f0277fb4ab4984e73/app/routes/(%24locale).contentful.entries.livestory.%24id.tsx#L124) with [Live Story client SDK](https://github.com/Live-Story/ls-client-sdk) npm package

## Getting started

**Requirements:**

- Node.js version 18.0.0 or higher

```bash
npm create @shopify/hydrogen@latest
```

## Building for production

```bash
npm run build
```

## Local development

```bash
npm run dev
```

## Setup for using Customer Account API (`/account` section)

Follow step 1 and 2 of <https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development>
