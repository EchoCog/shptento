import { Metafield } from './metafield';
import { Metaobject } from './metaobject';

export type Simplify<T> = {
    [K in keyof T]: T[K];
} & {};

/**
 * Type for validation names
 */
export type ValidationInputName =
    | 'min'
    | 'max'
    | 'regex'
    | 'allowed_domains'
    | 'choices'
    | 'file_type_options'
    | 'max_precision'
    | 'metaobject_definition_id'
    | 'metaobject_definition_ids'
    | 'schema'

/**
 * The name and value for a metafield definition validation.
 *
 * For example, for a metafield definition of `single_line_text_field` type, you can set a validation with the name `min` and a value of `10`.
 * This validation will ensure that the value of the metafield is at least 10 characters.
 *
 * Refer to the [list of supported validations](https://shopify.dev/api/admin/graphql/reference/common-objects/metafieldDefinitionTypes#examples-Fetch_all_metafield_definition_types).
 *
 */
export type MetafieldDefinitionValidationInput = {
    /** The name for the metafield definition validation. */
    name: ValidationInputName;
    /** The value for the metafield definition validation. */
    value: string;
};

export type ExtractMetaobjectSchema<TSchema extends Record<string, unknown>> = Simplify<{
    [K in keyof TSchema as TSchema[K] extends Metaobject<any> ? K : never]: TSchema[K] extends Metaobject<any>
    ? TSchema[K]
    : never;
}>;

export type ExtractMetafieldSchema<TSchema extends Record<string, unknown>> = Simplify<{
    [K in keyof TSchema as TSchema[K] extends Metafield ? K : never]: TSchema[K] extends Metafield
    ? TSchema[K]
    : never;
}>;

export type KnownKeysOnly<T, U> = {
    [K in keyof T]: K extends keyof U ? T[K] : never;
};

export interface ShopifizzleTypeError<T extends string> {
    $error: T;
}

export type ListConfigQueryItem<T> =
    | {
        /**
         * A raw query string to be used as-is in the request. Incompatible with other query properties.
         */
        $raw?: string;
        /**
         * A search that excludes documents that include the specified value.
         */
        $not?: ListConfigQueryItem<T>;
        /**
         * A search that includes documents where the value is less than the specified value.
         */
        $lt?: ListConfigQueryItem<T>;
        /**
         * A search that includes documents where the value is less than or equal to the specified value.
         */
        $lte?: ListConfigQueryItem<T>;
        /**
         * A search that includes documents where the value is greater than the specified value.
         */
        $gt?: ListConfigQueryItem<T>;
        /**
         * A search that includes documents where the value is greater than or equal to the specified value.
         */
        $gte?: ListConfigQueryItem<T>;
    }
    | T;