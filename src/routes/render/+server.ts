import crypto from 'node:crypto';

import { h } from 'hastscript';
import { toHast } from 'mdast-util-to-hast';

import { process } from '$lib/render-markdown';

import css from '../../app.css';
import { toHtml } from 'hast-util-to-html';

type RenderOptions = {
  host: string;
  nonce: string;
};

/**
 * Generate a random nonce.
 */
const generateNonce = (): string => crypto.randomBytes(16).toString('hex');

/**
 * Generate a Content Security Policy header value.
 * @param nonce
 * @returns
 */
const generateContentSecurityPolicy = ({ nonce, host }: RenderOptions) => {
  return `base-uri 'self'; default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}'; frame-ancestors 'self'; form-action 'none'; sandbox allow-same-origin allow-scripts;`;
};

/**
 * Create a new HTML page with the given AST.
 */
const createPage = (ast: ReturnType<typeof toHast>, { nonce, host }: RenderOptions) => {
  return toHtml(
    h('html', [
      h('head', [
        h('title', 'Rendered Markdown'),
        h('meta', { charset: 'utf-8' }),
        h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
        h('style', { nonce }, String(css)),
      ]),
      h('body.prose', h('main', ast)),
    ]),
  );
};

export const GET = async (req: Request) => {
  const url = new URL(req.url);

  const host = url.origin;
  const content = url.searchParams.get('content') || '';

  if (host === null) return new Response('Not found', { status: 404 });
  if (content === null) return new Response('Not found', { status: 404 });

  const nonce = generateNonce();

  const response = new Response(createPage(await process(content), { nonce, host }), {
    headers: {
      'Content-Type': 'text/html',
      'Content-Security-Policy': generateContentSecurityPolicy({ nonce, host }),
    },
  });

  return response;
};
