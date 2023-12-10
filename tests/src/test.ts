import dotenv from 'dotenv';
import { createGraphQLClient } from '@shopify/graphql-client';
import { parseEnv, z } from 'znv';

import { shopify } from '@drizzle-team/shopify';
import * as schema from './test_schema.js';

dotenv.config({ path: '../../.env' });

const env = parseEnv(process.env, {
	SHOPIFY_ADMIN_API_TOKEN: z.string(),
});

const client = createGraphQLClient({
	url: 'https://d91122.myshopify.com/admin/api/2023-10/graphql.json',
	headers: {
		'Content-Type': 'application/json',
		'X-Shopify-Access-Token': env.SHOPIFY_ADMIN_API_TOKEN,
	},
});

const sp = shopify(client, { schema });

// {
// 	sp.orms.list({
// 		query: {
// 			$raw: 'state:disabled AND ("sale shopper" OR VIP)',
// 		},
// 	});
// 	sp.orms.list({
// 		query: ['Bob', 'Norman'],
// 	});
// 	sp.orms.list({
// 		query: {
// 			displayName: {
// 				$raw: 'Bob Norman',
// 			},
// 		},
// 	});
// 	sp.orms.list({
// 		query: {
// 			displayName: 'Bob Norman',
// 			updatedAt: new Date('2023-01-01'),
// 		},
// 	});
// 	sp.orms.list({
// 		query: {
// 			updatedAt: {
// 				$gte: new Date('2023-01-01'),
// 				$lte: new Date('2024-01-01'),
// 			},
// 		},
// 	});
// 	sp.orms.list({
// 		query: {
// 			displayName: {
// 				$not: 'bob',
// 			},
// 		},
// 	});
// 	sp.orms.list({
// 		query: [{ $or: ['bob', 'norman'] }, 'Shopify'],
// 	});
// 	sp.orms.list({
// 		query: [{ displayName: 'Bob' }, { $or: ['sale shopper', 'VIP'] }],
// 	});
// 	sp.orms.list({
// 		query: {
// 			displayName: 'Bob Norman',
// 		},
// 	});
// 	sp.orms.list({
// 		query: 'norm*',
// 	});
// 	sp.orms.list({
// 		query: {
// 			displayName: 'norm*',
// 		},
// 	});
// }

// const iterator = sp.orms.iterator({
// 	pageSize: 30,
// 	// fields: {
// 	// 	_id: true,
// 	// 	_handle: true,
// 	// 	name: true,
// 	// 	git_hub_repo: true,
// 	// 	stars: true,
// 	// },
// 	// query: {
// 	// 	displayName: 'Drizma',
// 	// 	updatedAt: {
// 	// 		$gte: new Date('2021-01-01'),
// 	// 	},
// 	// },
// 	// pageSize: 100,
// 	// sortKey: 'id',
// 	// reverse: true,
// });

// for await (const orm of iterator) {
// 	console.log(orm);
// }

// const item = await sp.orms.get(
// 	'gid://shopify/Metaobject/35479388463' /*, {
// 	name: true,
// 	github_repo: true,
// 	stars: true,
// }*/,
// );

// const item = await sp.orms.get('gid://shopify/Metaobject/35479388463');

// console.log(item);

// const item = await sp.orms.get('gid://shopify/ORM/123');

// await sp.orms.update('gid://shopify/Metaobject/35528114479', {
// 	fields: {
// 		_handle: 'drizzle-1',
// 		decimalList: [],
// 	},
// });

// await sp.orms.delete('gid://shopify/Metaobject/35528147247');

const items = await sp.orms.list({
	query: {
		$raw: 'display_name:drizzle',
	},
	first: 10,
});

console.log(items);

export type ORM = typeof sp.orms.$inferSelect;
//           ^?
export type InsertORM = typeof sp.orms.$inferInsert;
//           ^?
export type UpdateORM = typeof sp.orms.$inferUpdate;
//           ^?
