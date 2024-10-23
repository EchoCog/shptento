import { Image, Media, MetafieldOwnerType, ProductClaimOwnershipInput, ProductCompareAtPriceRange, ProductOption, ProductPriceRangeV2, ProductStatus, ResourceFeedback, Seo } from "../../graphql/gen/graphql";
import { Metafield } from "../metafield";
import { MetafieldFieldType } from "../metafield/types";
import { ListConfigQueryItem } from "../types";

export type Simplify<T> = {
    [K in keyof T]: T[K];
} & {};

export type InferSelectMetafield = {
    /** A globally-unique metafield ID. */
    id: string,
    /** The unique identifier for the metafield within its namespace. */
    key: string,
    /** The container for a group of metafields that the metafield is associated with. */
    namespace: string,
    /** The description of the metafield. */
    description?: string,
    /** The type of resource that the metafield is attached to. */
    ownerType: `${MetafieldOwnerType}`,
    /** The type of data that is stored in the metafield. Refer to the list of [supported types](https://shopify.dev/apps/metafields/types). */
    type: MetafieldFieldType,
    /** The data stored in the metafield. Always stored as a string, regardless of the metafield's type. */
    value: string,
};

export type InferUpdatedMetafield = Simplify<Omit<InferSelectMetafield, 'description'>>;

export type InferSelectModel = Simplify<
    {
        /** A globally-unique ID. */
        id: string,
        /** The date and time ([ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601)) when the product was created. */
        createdAt: Date,
        /** 
        * The date and time when the product was last modified. A product's updatedAt value can change for different reasons. 
        * For example, if an order is placed for a product that has inventory tracking set up, then the inventory adjustment is counted as an update. 
        * 
        */
        updatedAt: Date,
        /** Whether the product is a gift card. */
        isGiftCard: boolean,
        category?: ProductTaxonomyCategory,
        /** The combined listing. */
        combinedListing?: ProductDefinitionConfig,
        /** The metafields to associate with this product. */
        metafield?: InferSelectMetafield, // think about it
        /** A list of product options. The limit is specified by Shop.resourceLimits.maxProductOptions. */
        options: ProductOption[], // TODO() write it on your own !!! + think about it
        /** The compare-at price range of the product in the default shop currency. */
        compareAtPriceRange?: ProductCompareAtPriceRange, // TODO() write it on your own !!!
        /** A default cursor that returns the single next record, sorted ascending by ID. */
        defaultCursor: string,
        /** A stripped description of the product, single line with HTML tags removed. */
        description: string,
        /** The featured image for the product. */
        featuredImage?: Image, // TODO() write it on your own !!!
        /** The featured media for the product. */
        featuredMedia?: Media, // TODO() write it on your own !!!
        /** The featured media for the product. */
        feedback?: ResourceFeedback, // TODO() write it on your own !!!
        /** Whether the product has only a single variant with the default option and value. */
        hasOnlyDefaultVariant: boolean,
        /** Whether the product has out of stock variants. */
        hasOutOfStockVariants: boolean,
        /** Determines if at least one of the product variant requires components. The default value is false. */
        hasVariantsThatRequiresComponents: boolean,
        /** The ID of the corresponding resource in the REST Admin API. */
        legacyResourceId: number,
        /** The ID of the corresponding resource in the REST Admin API. */
        mediaCount?: ProductCount,
        /** The online store preview URL. */
        onlineStorePreviewUrl?: string;
        /** The online store URL for the product. A value of null indicates that the product isn't published to the Online Store sales channel. */
        onlineStoreUrl?: string;
        /** The price range of the product with prices formatted as decimals. */
        priceRangeV2: ProductPriceRangeV2, // TODO() write it on your own !!!
        /** Count of selling plan groups associated with the product. */
        sellingPlanGroupsCount?: ProductCount,
        /** The quantity of inventory in stock. */
        totalInventory: number,
        /** Whether inventory tracking has been enabled for the product. */
        tracksInventory: boolean,
    } & ProductDefinitionConfig
>;

// TODO() Do we need this or better to respond with all InferSelectModel fields ?!!!
export type DefaultInferSelect = Pick<InferSelectModel, 'id' | 'title' | 'handle'>;
export const defaultFieldsInferSelect: DefaultInferSelect = {
    id: '',
    title: '',
    handle: '',
};

export type MetafieldForProductUpdate<TMetafield extends Metafield = Metafield> = {
    metafield: TMetafield,
    value: string | Date | number | boolean,
}

export type InferUpdateModel = Simplify<
    Partial<{
        /** The ID of the category associated with the product. */
        category?: string,
        /** Claim ownership of a product. */
        claimOwnership?: ProductClaimOwnershipInput,
        /** The IDs of the collections that this product will be added to. */
        collectionsToJoin?: string[],
        /** The IDs of collections that will no longer include the existing product. */
        collectionsToLeave?: string[],
        /** The custom product type specified by the merchant. */
        customProductType: string,
        /** Whether the product is a gift card. */
        giftCard: boolean,
        /** The metafields to associate with this product. */
        metafields: MetafieldForProductUpdate[],
        /** 
         * List of custom product options and option values (maximum of 3 per product). Supported as input with the productCreate mutation only. 
         * 
         */
        productOptions: ProductOption[], // TODO() write it on your own !!!
        /** 
         * Whether a redirect is required after a new handle has been provided. 
         * If true, then the old handle is redirected to the new one automatically. 
         * 
         */
        redirectNewHandle: boolean,
    } & ProductDefinitionConfig>
>;

export interface UpdateConfig {
    fields: InferUpdateModel,
};

export type ListConfigFields<T extends InferSelectModel | InferUpdateModel> = {
    [K in keyof T]?: boolean | 0 | 1;
};

export type ListConfigQuery =
    // !!! TODO() Do we need to query just string? If so need to understand what field is default !!!
    // | string
    | {
        /** Text entered without a field constraint searches multiple aspects of the record. */
        default?: ListConfigQueryItem<string>;
        /**
         * Filter query by the product variant barcode field.
         * Example: 
         *  - ABC-abc-1234
         */
        barcode?: ListConfigQueryItem<string>;
        bundles?: boolean; // пососу ТУТ ???
        /** Filter by the category ID of the product */
        categoryId?: ListConfigQueryItem<string>;
        /** Filter by The role of the product in a combined listing */
        combinedListingRole?: 'PARENT' | 'CHILD';
        /**
         * Filter by the date and time when the product was created.
         * Example: 
         *  - >'2020-10-21T23:39:20Z'
         *  - <now
         * 
         */
        createdAt?: ListConfigQueryItem<Date | string>;
        /** Filter query by delivery profile ID */
        deliveryProfileId?: ListConfigQueryItem<string>;
        // error_feedback ???
        /** Filter query by the product isGiftCard field. */
        giftCard?: boolean;
        /** Filter query a comma-separated list of handles. */
        handle?: ListConfigQueryItem<string>;
        /** Filter query by has_only_composites. */
        hasOnlyComposites?: boolean;
        /** Filter query by products that have only a default variant. */
        hasOnlyDefaultVariant?: boolean;
        /** Filter query by products which have variant(s) with components. */
        hasVariantWithComponents?: boolean;
        /** Filter by id range. */
        id?: ListConfigQueryItem<string>;
        /**
         * Filter query by inventory count.
         * Example: 
         *  - 0
         *  - >150
         * 
         */
        inventoryTotal?: ListConfigQueryItem<number>;
        /** Filter query by products that have a reduced price. See the [CollectionRule](https://shopify.dev/api/admin-graphql/latest/enums/CollectionRuleColumn) for more information. */
        isPriceReduced?: boolean;
        /** Filter query by products that are out of stock in at least one location. */
        outOfStockSomewhere?: boolean;
        /**
         * Filter query by the product variants price field.
         * Example: 
         *  - 100.57
         */
        price?: ListConfigQueryItem<number>; // decimal
        /**
         * Filter by the app ID that claims ownership of a product configuration.
         * Example: 
         *  - 10001
         */
        productConfigurationOwner?: ListConfigQueryItem<string>;
        // TODO() need to made it as function with channel APP ID prefix before status to filter
        // productPublicationStatus?: 'APPROVED' | 'REJECTED' | 'NEEDS_ACTION' | 'AWAITING_REVIEW' | 'PUBLISHED' | 'DEMOTED' | 'SCHEDULED' | 'provisionally_PUBLISHED';
        /** Filter query by a comma-separated list of product types */
        productType?: ListConfigQueryItem<string>;
        publishableStatus?: 'ONLINE_STORE_CHANNEL' | 'PUBLISHED' | 'UNPUBLISHED' | 'VISIBLE' | 'UNAVAILABLE' | 'HIDDEN' | 'INTENDED' | 'VISIBLE';
        /** Filter by the date and time when the product was published to the Online Store. */
        publishedAt?: ListConfigQueryItem<Date | string>;
        publishedStatus?: 'UNSET' | 'PENDING' | 'APPROVED' | 'NOT APPROVED';
        /** Filter query by the product variants sku field. */
        sku?: ListConfigQueryItem<string>;
        /** Filter query by a comma-separated list of statuses. */
        status?: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
        /**
         * Filter query by tag field.
         * Example: 
         *  - my_tag
         *  - <my_tag2
         * 
         */
        tag?: string;
        /**
         * Filter query by objects that don’t have the specified tag.
         * Example: 
         *  - my_tag
         *  - <my_tag2
         * 
         */
        tagNot?: string;
        /** Filter query by the product title field. */
        title?: ListConfigQueryItem<string>;
        /**
         * Filter by the date and time when the product was last updated.
         * Example: 
         *  - >'2020-10-21T23:39:20Z'
         *  - <now
         * 
         */
        updatedAt?: ListConfigQueryItem<Date | string>;
        /** Filter query by a comma-separated list of vendors. */
        vendor?: ListConfigQueryItem<string>;
    }
    | {
        /**
         * A raw query string to be used as-is in the request. Incompatible with other query properties.
         */
        $raw: string;
    }
    | {
        /**
         * A list of queries that are combined with `OR`.
         */
        $or: ListConfigQuery[];
    }
    | ListConfigQuery[];

export type SortKey =
    /** Sort by the created_at value. */
    | 'created_at'
    /** Sort by the id value. */
    | 'id'
    /** Sort by the inventory_total value. */
    | 'inventory_total'
    /** Sort by the product_type value. */
    | 'product_type'
    /** Sort by the published_at value. */
    | 'published_at'
    /** 
     * Sort by relevance to the search terms when the query parameter is specified on the connection. 
     * Don't use this sort key when no search query is specified. Pagination isn't supported when using this sort key. 
     * 
     * */
    | 'relevance'
    /** Sort by the title value. */
    | 'title'
    /** Sort by the updated_at value. */
    | 'updated_at'
    /** Sort by the vendor value. */
    | 'vendor';

export interface ListConfig {
    query?: ListConfigQuery;
    after?: string;
    before?: string;
    first?: number; // or last required
    last?: number; // or first required
    reverse?: boolean;
    sortKey?: SortKey;
    savedSearchId?: string;
};

export type ProductTaxonomyCategory = {
    /** The full name of the product taxonomy node. For example,  Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Beds. */
    fullName: string;
    /** The ID of the product taxonomy node. */
    id: string;
    /** Whether the node is a leaf node. */
    isLeaf: boolean;
    /** Whether the node is a root node. */
    isRoot: boolean;
    /** The name of the product taxonomy node. For example, Dog Beds. */
    name: string;
    /** The IDs of the category's ancestor categories. */
    ancestorIds: number[];
    /** The IDs of the category's child categories. */
    childrenIds: number[];
    /** Whether the category is archived. The default value is false. */
    isArchived: boolean;
    /**
     * The level of the category in the taxonomy tree. Levels indicate the depth of the category from the root. 
     * For example, in Animals & Pet Supplies > Pet Supplies > Dog Supplies, Animals & Pet Supplies is at level 1, Animals & Pet Supplies > Pet Supplies is at level 2, and Animals & Pet Supplies > Pet Supplies > Dog Supplies is at level 3.
     * 
     */
    level: number;
    /** The ID of the category's parent category. */
    parentId?: number;
};

export type CombinedListingsRole = 'CHILD' | 'PARENT';

/** The count's precision, or how exact the value is. */
export type CountPrecision = 'AT_LEAST' | 'EXACT';
export type ProductCount = {
    /** The count of elements. */
    count: number,
    /** The count's precision, or how exact the value is. */
    precision: CountPrecision;
};

export type ProductDefinitionConfig = {
    /** The role of the product in a combined listing. If null, the product not a part of any combined_listing. */
    combinedListingRole?: CombinedListingsRole,
    /** The product type specified by the merchant. */
    productType: string,
    /** The description of the product, complete with HTML formatting. */
    descriptionHtml: string,
    /** The theme template used when viewing the gift card in a store. */
    giftCardTemplateSuffix?: string,
    /** A unique human-friendly string of the product's title. */
    handle: string,
    /**
     * Whether the product can only be purchased with a selling plan (subscription). 
     * Products that are sold on subscription (requiresSellingPlan: true) can be updated only for online stores. 
     * If you update a product to be subscription only, then the product is unpublished from all channels except the online store.
     * 
     */
    requiresSellingPlan: boolean,
    /** SEO information of the product. */
    seo: Seo, // TODO() write it on your own !!!
    /** The product status. This controls visibility across all channels. */
    status: `${ProductStatus}`,
    /** 
     * A comma separated list of tags associated with the product. 
     * Updating tags overwrites any existing tags that were previously added to the product. 
     * To add new tags without overwriting existing tags, use the [tagsAdd](https://shopify.dev/api/admin-graphql/latest/mutations/tagsadd) mutation.
     * 
     */
    tags: string[],
    /** The theme template used when viewing the product in a store. */
    templateSuffix?: string,
    /** The title of the product. */
    title: string,
    /** The name of the product's vendor. */
    vendor: string,
};

export type ResultItem<
    TFields extends Record<string, keyof InferSelectModel | Metafield> | undefined,
> = TFields extends undefined
    ? Simplify<DefaultInferSelect>
    : Simplify<
        {
            // @ts-expect-error
            [K in keyof TFields]: TFields[K] extends Metafield ? Simplify<InferSelectModel['metafield']> : InferSelectModel[TFields[K]];
        }>;

export type UpdateResultItem<
    TFields extends ListConfigFields<InferUpdateModel>
> = Simplify<
    {
        // @ts-expect-error
        [K in keyof TFields]-?: K extends 'metafields' ? InferUpdatedMetafield[] : InferUpdateModel[K]
    }>;

export type ListResult<TFields extends Record<string, keyof InferSelectModel | Metafield> | undefined> = Simplify<{
    items: ResultItem<TFields>[];
    pageInfo: {
        startCursor: string;
        endCursor: string;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}>;

export type SelectedFields = Record<string, keyof Omit<InferSelectModel, 'metafield'> | Metafield>;