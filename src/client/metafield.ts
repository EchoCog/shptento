import type { DataType } from './fields/data-types';
import type {
	MetafieldDefinitionInput,
	MetafieldDefinitionValidationInput,
	MetafieldOwnerType,
} from '../graphql/gen/graphql';
import type { Validations } from './validations';
import type { Client } from './gql-client';

const isMetafieldSym = Symbol.for('tento:isMetafield');

export class Metafield<T extends DataType<any, Validations> = DataType<any, Validations>> {
	private readonly [isMetafieldSym] = true;

	readonly _: T['_'] & {
		readonly config: MetafieldDefinitionInput;
	};

	constructor(config: TentoMetafieldDefinition<T['_']['validations']>, field: T) {
		this._ = {
			...field._,
			config: {
				...config,
				type: field._.type,
				validations: config.validations?.(field._.validations),
				ownerType: config.ownerType as MetafieldOwnerType,
			},
		};
	}

	static [Symbol.hasInstance](instance: unknown) {
		return (
			typeof instance === 'object' &&
			instance !== null &&
			isMetafieldSym in instance &&
			instance[isMetafieldSym] === true
		);
	}
}

export interface TentoMetafieldDefinition<TValidations extends Validations>
	extends Omit<MetafieldDefinitionInput, 'type' | 'validations' | 'ownerType'> {
	validations?: (validators: TValidations) => MetafieldDefinitionValidationInput[];
	ownerType: `${MetafieldOwnerType}`;
}

export class TentoMetafieldOperations<T extends Metafield<any>> {
	constructor(_metafield: T, private _client: Client) {
		// this._ = { metaobject };
	}
}
