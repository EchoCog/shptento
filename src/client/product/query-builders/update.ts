import { Client } from "../../gql-client";
import { ListConfigFields, UpdateConfig, UpdateResultItem, MetafieldForProductUpdate, InferUpdatedMetafield } from "../types";

export class UpdateBuilder {
    private readonly client: Client;
    private readonly productId: string;
    private readonly prefix: string;

    constructor(
        config: {
            productId: string,
            client: Client;
            prefix: string;
        },
    ) {
        this.client = config.client;
        this.productId = config.productId;
        this.prefix = config.prefix;
    }

    private buildMetafieldSelection(selectedMetafields: MetafieldForProductUpdate[]): string {
        let metafields: string = '';
        for (const metafieldValues of Object.values(selectedMetafields)) {
            const { namespace, key } = metafieldValues.metafield._.config;
            metafields += `${namespace}_${key}: metafield(namespace: "${this.prefix}_${namespace}", key: "${key}") { id, key, namespace, ownerType, type, value }`;
        }
        return metafields;
    }

    private buildItemSelection(selectedFields: Record<string, any>): string {
        return Object.entries(selectedFields).map(([key, value]) => {
            if (key === 'metafields' && typeof value === 'object') {
                return this.buildMetafieldSelection(value);
            }
            if (typeof value === 'object' && value !== null && !(value instanceof Date) && !(value instanceof Array)) {
                const innerStr = this.buildItemSelection(value);
                return `${key} { ${innerStr} }`;
            } else {
                return key;
            }
        }).join(', ');
    }

    private mapItemResult<TUpdate extends UpdateConfig>(
        node: any,
        updates: TUpdate,
    ): UpdateResultItem<ListConfigFields<TUpdate['fields']>> {
        const result: Record<string, unknown> = {};

        for (let i = 0; i < Object.keys(updates.fields).length; i++) {
            const key = Object.keys(updates.fields)[i]!;

            if (key === 'metafields') {
                let metafields: InferUpdatedMetafield[] = [];
                for (const value of Object.values(updates.fields.metafields!)) {
                    const { key, namespace } = value.metafield._.config;
                    const nodeValue = node[`${namespace}_${key}`];

                    if (nodeValue) metafields.push(nodeValue);
                }

                result[key] = metafields;
            } else {
                const rawValue = node[key] ?? null;
                result[key] = rawValue;
            }
        }

        return result as any;
    }

    async set<TUpdate extends UpdateConfig>(
        updates: TUpdate
    ): Promise<UpdateResultItem<ListConfigFields<TUpdate['fields']>>> {
        const query = `
			mutation ProductUpdate($input: ProductInput!) {
				productUpdate(input: $input) {
					product {
						${this.buildItemSelection(updates.fields)}
					}
					userErrors {
						field, message
					}
				}
			}`;

        const metafields: {
            id?: string,
            namespace: string,
            key: string,
            value: string,
            type: string,
        }[] = [];
        if (updates.fields.metafields?.length) {
            const productQuery = `
			    query GetProduct($id: ID!) {
			    	product(id: $id) {
			    		${this.buildMetafieldSelection(updates.fields.metafields)}
			    	}
			    }
		    `;

            const productResponse = await this.client(productQuery, {
                id: this.productId,
            });

            if (productResponse.errors) {
                throw new Error(productResponse.errors.graphQLErrors?.map((e) => e.message).join('\n'));
            }

            for (const value of Object.values(updates.fields.metafields)) {
                const { namespace, key, fieldDefinition } = value.metafield._.config;

                metafields.push({
                    id: productResponse.data?.product[`${namespace}_${key}`]?.id ?? undefined,
                    namespace: `${this.prefix}_${namespace!}`,
                    key: key!,
                    value: value.value.toString(),
                    type: fieldDefinition.type,
                });
            }
        }
        const fields: Record<string, any> = {};
        for (const [key, value] of Object.entries(updates.fields)) {
            if (key !== 'metafields') {
                fields[key] = value;
            }
        }
        if (Object.values(metafields).length > 0) {
            fields['metafields'] = metafields;
        }

        const response = await this.client(query, {
            input: {
                id: this.productId,
                ...fields,
            }
        });

        if (response.errors) {
            throw new Error(response.errors.graphQLErrors?.map((e) => e.message).join('\n'));
        }

        if (response.data?.productUpdate?.userErrors.length) {
            throw new Error(
                response.data.productUpdate.userErrors
                    .map((e: any) => e.message)
                    .join('\n'),
            );
        }

        return this.mapItemResult(response.data?.productUpdate.product, updates);
    }
}