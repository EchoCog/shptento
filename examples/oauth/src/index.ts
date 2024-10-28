import 'dotenv/config';
import '@shopify/shopify-api/adapters/node';
import cookieParser from 'cookie-parser';
import express from 'express';
import { CookieNotFound, InvalidOAuthError, LATEST_API_VERSION, Session, shopifyApi } from '@shopify/shopify-api';
import * as schema from './schema';
import { parseEnv, z } from 'znv';
import { tento } from '@drizzle-team/tento';

const env = parseEnv(process.env, {
	SHOPIFY_API_KEY: z.string(),
	SHOPIFY_API_SECRET_KEY: z.string(),
	SHOPIFY_SCOPES: z.string().transform((scopes) => scopes.split(/,\s*/)),
	SHOPIFY_SHOP: z.string(),
});

const shopify = shopifyApi({
	apiKey: env.SHOPIFY_API_KEY,
	apiSecretKey: env.SHOPIFY_API_SECRET_KEY,
	scopes: env.SHOPIFY_SCOPES as string[],
	hostName: 'localhost:3000', // ngrok link
	hostScheme: 'http', // https for ngrok
	apiVersion: LATEST_API_VERSION,
	isEmbeddedApp: true,
});

async function main() {
	const app = express();

	app.use(cookieParser());
	app.use(express.json());

	let session: Session | undefined = undefined;

	app.get('/auth', async (req, res) => {
		await shopify.auth.begin({
			shop: shopify.utils.sanitizeShop(env.SHOPIFY_SHOP, true)!,
			callbackPath: '/auth/callback',
			isOnline: false,
			rawRequest: req,
			rawResponse: res,
		});
	});

	app.get('/auth/callback', async (req, res) => {
		try {
			const callback = await shopify.auth.callback({
				rawRequest: req,
				rawResponse: res,
			});

			session = callback.session;

			return res.redirect('/');
		} catch (e: any) {
			console.log('err: ', e);
			if (e instanceof InvalidOAuthError) {
				return res.status(400).json({
					status: 'ERROR',
					message: 'express suka',
					code: 200,
				});
			}
			if (e instanceof CookieNotFound) {
				await shopify.auth.begin({
					shop: shopify.utils.sanitizeShop(env.SHOPIFY_SHOP, true)!,
					callbackPath: '/auth/callback',
					isOnline: false,
					rawRequest: req,
					rawResponse: res,
				});
			}
		}
	});

	app.get('/', async (req, res) => {
		if (!session) {
			return res.redirect('/auth');
		}

		return res.json(session);
	});

	app.get('/apply', async (req, res) => {
		if (!session) {
			return res.redirect('/auth');
		}

		const gqlClient = new shopify.clients.Graphql({
			session,
		});

		const client = tento({ client: gqlClient, schema });

		await client.applySchema();
		const createdDesigner = await client.metaobjects.designer.insert({
			name: 'Tento',
			description: 'Made by Drizzle team',
			website: 'https://www.google.com/',
		});

		const allProducts = await client.products.list({ id: 'id', metafield: schema.designer_reference }).query();
		if (allProducts.items?.length) {
			const productsToUpdate = allProducts.items.filter((product) => typeof product.metafield === 'undefined');
			for await (const product of productsToUpdate) {
				await client.products.update(product.id).set({
					fields: {
						metafields: [
							{
								metafield: schema.designer_reference,
								value: createdDesigner._id,
							},
						],
						tags: ['tento'],
					},
				});
			}
		}

		return res.json({ success: true });
	});

	app.get('/designers', async (req, res) => {
		if (!session) {
			return res.redirect('/auth');
		}

		const gqlClient = new shopify.clients.Graphql({
			session,
		});

		const client = tento({ client: gqlClient, schema });

		const designers = client.metaobjects.designer.list({
			first: 50,
		});

		return res.json(designers);
	});

	app.get('/products', async (req, res) => {
		if (!session) {
			return res.redirect('/auth');
		}

		const gqlClient = new shopify.clients.Graphql({
			session,
		});

		const client = tento({ client: gqlClient, schema });

		const tentoProducts = client.products
			.list({
				id: 'id',
				title: 'title',
				designerReference: schema.designer_reference,
			})
			.query({
				first: 10,
				query: {
					tag: 'tento',
				},
			});

		return res.json(tentoProducts);
	});

	app.listen(5000, () => {
		console.log('App listening on the port 5000');
	});
}

main();
