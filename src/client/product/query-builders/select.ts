import { Client } from "../../gql-client";
import { CurrencyCode, MediaContentType, MediaStatus } from "../../../graphql/gen/graphql";
import { KnownKeysOnly, ListConfigQueryItem } from "../../types";
import { defaultFieldsInferSelect, InferSelectModel, ListConfig, ListConfigQuery, ListResult, ResultItem, SelectedFields } from "../types";
import { Metafield } from "../../metafield";

export class SelectBuilder<TSelection extends SelectedFields | undefined> {
    private readonly fields: TSelection;
    private readonly client: Client;
    private readonly prefix: string;

    constructor(
        config: {
            fields: TSelection;
            client: Client;
            prefix: string;
        },
    ) {
        this.fields = config.fields;
        this.client = config.client;
        this.prefix = config.prefix;
    }

    private formatObjectToString(obj: Record<string, any>): string {
        return Object.entries(obj).map(([key, value]) => {
            if (typeof value === 'object' && value instanceof Metafield) {
                const { namespace, key } = value._.config;
                return `${namespace}_${key}: metafield(namespace: "${this.prefix}_${namespace}", key: "${key}") { id, key, description, namespace, ownerType, type, value }`
            }
            if (typeof value === 'object' && value !== null && !(value instanceof Date) && !(value instanceof Array)) {
                const innerStr = this.formatObjectToString(value);
                return `${key} { ${innerStr} }`;
            } else {
                return key;
            }
        }).join(', ');
    }

    private initializeField<K extends keyof Omit<InferSelectModel, 'metafield'>>(key: K) {
        /**
         * processed:
         *  - boolean -> true
         *  - Date -> new Date()
         *  - string -> '' (empty string)
         *  - number -> 1
         *  - 'status' -> 'ACTIVE'
         *  - 'tags' -> ['']
         *  - 'combinedListingRole' -> 'PARENT'
         *  - 'category' -> ProductTaxonomyCategory
         *  - 'combinedListing' -> ProductDefinitionConfig
         *  - 'seo' -> SEO
         *  - 'options' -> ProductOption[]
         *  - 'compareAtPriceRange' -> ProductCompareAtPriceRange
         *  - 'featuredImage' -> Image
         *  - 'featuredMedia' -> Media
         *  - 'feedback' -> 
         *  - 'mediaCount' | 'sellingPlanGroupsCount' -> ProductCount
         *  - 'priceRangeV2' -> ProductPriceRangeV2
         */
        switch (key) {
            case 'createdAt':
            case 'updatedAt':
                return new Date() as InferSelectModel[K];
            case 'requiresSellingPlan':
            case 'isGiftCard':
            case 'hasOnlyDefaultVariant':
            case 'hasOutOfStockVariants':
            case 'hasVariantsThatRequiresComponents':
            case 'tracksInventory':
                return true as InferSelectModel[K];
            case 'legacyResourceId':
            case 'totalInventory':
                return 1 as InferSelectModel[K];
            case 'status':
                return 'ACTIVE' as InferSelectModel[K];
            case 'tags':
                return [''] as InferSelectModel[K];
            case 'combinedListingRole':
                return 'PARENT' as InferSelectModel[K];
            case 'category':
                return {
                    fullName: '',
                    id: '',
                    isLeaf: true,
                    isRoot: true,
                    name: '',
                    ancestorIds: [1],
                    childrenIds: [1],
                    isArchived: true,
                    level: 1,
                    parentId: 1,
                } as InferSelectModel[K];
            case 'combinedListing':
                return {
                    combinedListingRole: 'PARENT',
                    productType: '',
                    descriptionHtml: '',
                    giftCardTemplateSuffix: '',
                    handle: '',
                    requiresSellingPlan: true,
                    seo: {
                        description: '',
                        title: '',
                    },
                    status: 'ACTIVE',
                    tags: [''],
                    templateSuffix: '',
                    title: '',
                    vendor: '',
                } as InferSelectModel[K];
            case 'seo':
                return {
                    description: '',
                    title: '',
                } as InferSelectModel[K];
            case 'options':
                return [{
                    id: '',
                    name: '',
                    position: 1,
                    translations: [{
                        key: '',
                        locale: '',
                        outdated: true,
                        updatedAt: new Date(),
                    }],
                    values: [''],
                }] as InferSelectModel[K];
            case 'mediaCount':
            case 'sellingPlanGroupsCount':
            case 'compareAtPriceRange':
                return {
                    maxVariantCompareAtPrice: {
                        amount: 1,
                        currencyCode: CurrencyCode.Aed,
                    },
                    minVariantCompareAtPrice: {
                        amount: 1,
                        currencyCode: CurrencyCode.Aed,
                    }
                } as InferSelectModel[K];
            case 'featuredImage':
                return {
                    originalSrc: '',
                    src: '',
                    transformedSrc: '',
                    url: '',
                } as InferSelectModel[K];
            case 'featuredMedia':
                return {
                    id: '',
                    status: MediaStatus.Ready,
                    mediaContentType: MediaContentType.Image,
                } as InferSelectModel[K];
            case 'feedback':
                return {
                    summary: '',
                    appFeedback: [{
                        link: {
                            url: '',
                        }
                    }]
                } as InferSelectModel[K];
            case 'priceRangeV2':
                return {
                    maxVariantPrice: {
                        amount: 1,
                        currencyCode: CurrencyCode.Aed,
                    },
                    minVariantPrice: {
                        amount: 1,
                        currencyCode: CurrencyCode.Aed,
                    },
                } as InferSelectModel[K];
            default:
                return '' as InferSelectModel[K];
        }
    }

    private buildItemSelection(): string {
        let selectedFields: Record<string, any> = {};
        if (this.fields) {
            for (const [key, value] of Object.entries(this.fields)) {
                if (typeof value === 'string') {
                    selectedFields[value] = this.initializeField(value);
                }
                if (value instanceof Metafield) {
                    selectedFields[key] = value;
                }
            }
        } else {
            selectedFields = defaultFieldsInferSelect;
        }

        return this.formatObjectToString(selectedFields);
    }

    private mapItemResult(
        node: any,
    ): ResultItem<TSelection> {
        const result: Record<string, unknown> = {};
        const allFields: Record<string, any> = this.fields ?? defaultFieldsInferSelect;

        for (let i = 0; i < Object.keys(allFields).length; i++) {
            const [key, value] = Object.entries(allFields)[i]!;

            const rawValue = this.fields
                ? value instanceof Metafield
                    ? node[`${value._.config.namespace}_${value._.config.key}`]
                    : node[value]
                : node[key] ?? null;
            result[key] = rawValue;
        }

        return result as any;
    }

    async query<TConfig extends ListConfig>(
        config?: KnownKeysOnly<TConfig, ListConfig>,
    ): Promise<ListResult<TSelection>> {
        const query = `
			query ListProducts($query: String, $after: String, $before: String, $first: Int, $last: Int, $reverse: Boolean, $sortKey: ProductSortKeys, $savedSearchId: ID) {
				products(query: $query, after: $after, before: $before, first: $first, last: $last, reverse: $reverse, sortKey: $sortKey, savedSearchId: $savedSearchId) {
					edges {
						node {
                            ${this.buildItemSelection()}
						}
					}
					pageInfo {
						startCursor, endCursor, hasNextPage, hasPreviousPage
					}
				}
			}
		`;

        const first: TConfig["first"] | undefined = typeof config?.first !== 'number' && typeof config?.last !== 'number' ? 50 : config.first;
        const response = await this.client(query, {
            query: buildListQuery(config?.query),
            after: config?.after,
            before: config?.before,
            first,
            last: config?.last,
            reverse: config?.reverse,
            sortKey: config?.sortKey?.toUpperCase(),
            savedSearchId: config?.savedSearchId,
        });

        if (response.errors) {
            throw new Error(response.errors.graphQLErrors?.map((e) => e.message).join('\n'));
        }

        const items = response.data.products.edges.map((edge: any) => this.mapItemResult(edge.node));

        return {
            items,
            pageInfo: response.data.products.pageInfo,
        };
    }
}

export function buildListQueryItem(query: ListConfigQueryItem<string | number | boolean | Date>): string {
    if (typeof query === 'string' || typeof query === 'number' || typeof query === 'boolean') {
        return `"${query}"`;
    }
    if (query instanceof Date) {
        return `"${query.toISOString()}"`;
    }
    if (Object.keys(query).length > 1) {
        throw new Error(`Query item must have only one key: ${JSON.stringify(query)}`);
    }
    if ('$raw' in query && query.$raw !== undefined) {
        return query.$raw;
    }
    if ('$not' in query && query.$not !== undefined) {
        return `NOT ${buildListQueryItem(query.$not)}`;
    }
    if ('$lt' in query && query.$lt !== undefined) {
        return `<${buildListQueryItem(query.$lt)}`;
    }
    if ('$lte' in query && query.$lte !== undefined) {
        return `<=${buildListQueryItem(query.$lte)}`;
    }
    if ('$gt' in query && query.$gt !== undefined) {
        return `>${buildListQueryItem(query.$gt)}`;
    }
    if ('$gte' in query && query.$gte !== undefined) {
        return `>=${buildListQueryItem(query.$gte)}`;
    }
    throw new Error(`Invalid query item: ${JSON.stringify(query)}`);
}

// TODO() check all of them
export function buildListQuery(query: ListConfigQuery | undefined): string | undefined {
    if (query === undefined) {
        return undefined;
    }
    // TODO() We don't have just a string | numbder | boolean param in query
    // if (typeof query === 'string' || typeof query === 'number' || typeof query === 'boolean') {
    //     return `"${query}"`;
    // }
    // if (query instanceof Date) {
    //     return `"${query.toISOString()}"`;
    // }
    if (Array.isArray(query)) {
        return `(${query.map(buildListQuery).join(' AND ')})`;
    }
    if ('$raw' in query) {
        if (Object.keys(query).length > 1) {
            throw new Error(`$raw must be the only key in the query: ${JSON.stringify(query)}`);
        }
        return query.$raw;
    }
    if ('$or' in query) {
        if (Object.keys(query).length > 1) {
            throw new Error(`$or must be the only key in the query: ${JSON.stringify(query)}`);
        }
        return `(${query.$or.map(buildListQuery).join(' OR ')})`;
    }
    const parts: string[] = [];
    if ('title' in query && query.title !== undefined) {
        parts.push(`title:${buildListQueryItem(query.title)}`);
    }
    if ('updatedAt' in query && query.updatedAt !== undefined) {
        parts.push(`updated_at:${buildListQueryItem(query.updatedAt)}`);
    }
    if ('default' in query && query.default !== undefined) {
        parts.push(`default:${buildListQueryItem(query.default)}`);
    }
    if ('barcode' in query && query.barcode !== undefined) {
        parts.push(`barcode:${buildListQueryItem(query.barcode)}`);
    }
    if ('bundles' in query && query.bundles !== undefined) {
        parts.push(`bundles:${buildListQueryItem(query.bundles)}`);
    }
    if ('categoryId' in query && query.categoryId !== undefined) {
        parts.push(`category_id:${buildListQueryItem(query.categoryId)}`);
    }
    if ('combinedListingRole' in query && query.combinedListingRole !== undefined) {
        parts.push(`combined_listing_role:${buildListQueryItem(query.combinedListingRole.toLowerCase())}`);
    }
    if ('createdAt' in query && query.createdAt !== undefined) {
        parts.push(`created_at:${buildListQueryItem(query.createdAt)}`);
    }
    // TODO() ???
    if ('deliveryProfileId' in query && query.deliveryProfileId !== undefined) {
        parts.push(`delivery_profile_id:${buildListQueryItem(query.deliveryProfileId)}`);
    }
    if ('giftCard' in query && query.giftCard !== undefined) {
        parts.push(`gift_card:${buildListQueryItem(query.giftCard)}`);
    }
    if ('handle' in query && query.handle !== undefined) {
        parts.push(`handle:${buildListQueryItem(query.handle)}`);
    }
    if ('hasOnlyComposites' in query && query.hasOnlyComposites !== undefined) {
        parts.push(`has_only_composites:${buildListQueryItem(query.hasOnlyComposites)}`);
    }
    if ('hasOnlyDefaultVariant' in query && query.hasOnlyDefaultVariant !== undefined) {
        parts.push(`has_only_default_variant:${buildListQueryItem(query.hasOnlyDefaultVariant)}`);
    }
    if ('hasVariantWithComponents' in query && query.hasVariantWithComponents !== undefined) {
        parts.push(`has_variant_with_components:${buildListQueryItem(query.hasVariantWithComponents)}`);
    }
    if ('id' in query && query.id !== undefined) {
        parts.push(`id:${buildListQueryItem(query.id)}`);
    }
    if ('inventoryTotal' in query && query.inventoryTotal !== undefined) {
        parts.push(`inventory_total:${buildListQueryItem(query.inventoryTotal)}`);
    }
    if ('isPriceReduced' in query && query.isPriceReduced !== undefined) {
        parts.push(`is_price_reduced:${buildListQueryItem(query.isPriceReduced)}`);
    }
    if ('outOfStockSomewhere' in query && query.outOfStockSomewhere !== undefined) {
        parts.push(`out_of_stock_somewhere:${buildListQueryItem(query.outOfStockSomewhere)}`);
    }
    if ('price' in query && query.price !== undefined) {
        parts.push(`price:${buildListQueryItem(query.price)}`);
    }
    if ('productConfigurationOwner' in query && query.productConfigurationOwner !== undefined) {
        parts.push(`product_configuration_owner:${buildListQueryItem(query.productConfigurationOwner)}`);
    }
    // TODO() made it as function first
    // if ('productPublicationStatus' in query && query.productPublicationStatus !== undefined) {
    //     parts.push(`product_publication_status:${buildListQueryItem(query.productPublicationStatus)}`);
    // }
    if ('productType' in query && query.productType !== undefined) {
        parts.push(`product_type:${buildListQueryItem(query.productType)}`);
    }
    if ('publishableStatus' in query && query.publishableStatus !== undefined) {
        parts.push(`publishable_status:${buildListQueryItem(query.publishableStatus.toLowerCase())}`);
    }
    if ('publishedAt' in query && query.publishedAt !== undefined) {
        parts.push(`published_at:${buildListQueryItem(query.publishedAt)}`);
    }
    if ('publishedStatus' in query && query.publishedStatus !== undefined) {
        parts.push(`published_status:${buildListQueryItem(query.publishedStatus.toLowerCase())}`);
    }
    if ('sku' in query && query.sku !== undefined) {
        parts.push(`sku:${buildListQueryItem(query.sku)}`);
    }
    if ('status' in query && query.status !== undefined) {
        parts.push(`status:${buildListQueryItem(query.status)}`);
    }
    if ('tag' in query && query.tag !== undefined) {
        parts.push(`tag:${buildListQueryItem(query.tag)}`);
    }
    if ('tagNot' in query && query.tagNot !== undefined) {
        parts.push(`tag_not:${buildListQueryItem(query.tagNot)}`);
    }
    if ('vendor' in query && query.vendor !== undefined) {
        parts.push(`vendor:${buildListQueryItem(query.vendor)}`);
    }


    return parts.join(' AND ');
}