import type {
	MetafieldDefinitionValidationInput,
	MetaobjectDefinitionCreateInput,
	MetaobjectFieldDefinitionCreateInput,
} from '../graphql/gen/graphql';
import type { MetaobjectFieldBuilder, MetaobjectFields } from './fields/metaobject-fields';
import type { Metaobject } from './metaobject';

export type InferInsertModel<T extends Metaobject<Record<string, MetaobjectFieldBuilder<any>>>> = Simplify<
	{
		_handle?: string;
	} & {
		[K in keyof T['_']['fieldBuilders'] as T['_']['fieldBuilders'][K]['_']['optional'] extends true
			? K
			: never]: T['_']['fieldBuilders'][K]['_']['dataType'];
	} & {
		[K in keyof T['_']['fieldBuilders'] as T['_']['fieldBuilders'][K]['_']['optional'] extends false ? K : never]?:
			| T['_']['fieldBuilders'][K]['_']['dataType']
			| null;
	}
>;

export type Simplify<T> = {
	[K in keyof T]: T[K];
} & {};

export type InferSelectModel<T extends Metaobject<Record<string, MetaobjectFieldBuilder<any>>>> = Simplify<
	{
		_id: string;
		_handle: string;
		_updatedAt: Date;
	} & {
		[K in keyof T['_']['fieldBuilders']]:
			| T['_']['fieldBuilders'][K]['_']['dataType']
			| (T['_']['fieldBuilders'][K]['_']['optional'] extends true ? null : never);
	}
>;

export type InferUpdateModel<T extends Metaobject<Record<string, MetaobjectFieldBuilder<any>>>> = Simplify<
	{
		_handle?: string;
	} & {
		[K in keyof T['_']['fieldBuilders']]?: T['_']['fieldBuilders'][K]['_']['dataType'];
	}
>;

export interface TentoMetaobjectDefinition extends Omit<MetaobjectDefinitionCreateInput, 'fieldDefinitions'> {
	fieldDefinitions: (fields: MetaobjectFields) => Record<string, MetaobjectFieldBuilder>;
}

export interface TentoMetaobjectFieldDefinitionInput<
	TValidators extends Record<string, (...args: any[]) => MetafieldDefinitionValidationInput> = Record<string, never>,
> extends Omit<MetaobjectFieldDefinitionCreateInput, 'key' | 'type' | 'validations'> {
	key?: string;
	validations?: (validators: TValidators) => MetafieldDefinitionValidationInput[];
}

export interface MetaobjectFieldDefinitionConfigWithType<
	TValidators extends Record<string, (...args: any[]) => MetafieldDefinitionValidationInput>,
> extends TentoMetaobjectFieldDefinitionInput<TValidators> {
	type: string;
}

export type KnownKeysOnly<T, U> = {
	[K in keyof T]: K extends keyof U ? T[K] : never;
};

export interface ShopifizzleTypeError<T extends string> {
	$error: T;
}

export type SortKey = 'id' | 'type' | 'updated_at' | 'display_name';

export type ListConfigFields<T extends Metaobject<any>> = {
	[K in keyof T['$inferSelect']]?: boolean | 0 | 1;
};

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

export type MetaobjectListConfigQuery =
	| string
	| {
			displayName?: ListConfigQueryItem<string>;
			updatedAt?: ListConfigQueryItem<Date | string>;
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
			$or: MetaobjectListConfigQuery[];
	  }
	| MetaobjectListConfigQuery[];

export interface MetaobjectListConfig<T extends Metaobject<any>> {
	fields?: ListConfigFields<T>;
	query?: MetaobjectListConfigQuery;
	after?: string;
	before?: string;
	first?: number;
	last?: number;
	reverse?: boolean;
	sortKey?: SortKey;
}

export interface IteratorConfig<T extends Metaobject<any>> {
	fields?: ListConfigFields<T>;
	query?: MetaobjectListConfigQuery;
	reverse?: boolean;
	sortKey?: SortKey;
	pageSize?: number;
	limit?: number;
}

export interface UpdateConfig<T extends Metaobject<any>> {
	capabilities?: {
		publishable: {
			status: 'ACTIVE' | 'DRAFT';
		};
	};
	fields?: T['$inferUpdate'];
}

export type ResultItem<
	T extends Metaobject<any>,
	TFields extends ListConfigFields<T> | undefined,
> = TFields extends undefined
	? T['$inferSelect']
	: TFields[keyof TFields] extends false
	  ? {
				[K in Exclude<keyof T['$inferSelect'], keyof TFields>]: T['$inferSelect'][K];
		  }
	  : Simplify<
				{
					[K in keyof TFields as TFields[K] extends true ? K : never]: T['$inferSelect'][K];
				} & {
					[K2 in keyof TFields as boolean extends TFields[K2] ? K2 : never]: ShopifizzleTypeError<`'${K2 &
						string}' must be either static true or static false, not a dynamic value`>;
				}
		  >;

export type ListResult<T extends Metaobject<any>, TFields extends ListConfigFields<T> | undefined> = Simplify<{
	items: ResultItem<T, TFields>[];
	pageInfo: {
		startCursor: string;
		endCursor: string;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}>;
