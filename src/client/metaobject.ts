import type { MetaobjectDefinitionCreateInput } from '../graphql/gen/graphql';
import { MetaobjectField, metaobjectFields, type MetaobjectFieldBuilder } from './fields/metaobject-fields';
import type { TentoMetaobjectDefinition, InferSelectModel, InferUpdateModel, InferInsertModel } from './types';

const isMetaobjectSym = Symbol.for('tento:isMetaobject');

export interface TentoMetaobjectTypeConfig {
	selectModel: unknown;
	insertModel: unknown;
	updateModel: unknown;
}

export class Metaobject<TFields extends Record<string, MetaobjectFieldBuilder>> {
	private readonly [isMetaobjectSym] = true;

	/** @internal */
	readonly fieldKeysMap: Record<string, string> = {};

	readonly _: {
		readonly createConfig: MetaobjectDefinitionCreateInput;
		readonly config: TentoMetaobjectDefinition;
		readonly fieldBuilders: TFields;
		readonly fields: Record<string, MetaobjectField>;
	};
	declare readonly $inferSelect: InferSelectModel<this>;
	declare readonly $inferInsert: InferInsertModel<this>;
	declare readonly $inferUpdate: InferUpdateModel<this>;

	constructor(config: TentoMetaobjectDefinition) {
		const builders = config.fieldDefinitions(metaobjectFields);
		const fields = Object.fromEntries(
			Object.entries(builders).map(([key, builder]) => {
				const field = new MetaobjectField(builder, key);
				this.fieldKeysMap[key] = field._.config.key;
				return [key, field];
			}),
		);
		const fieldDefinitions = Object.values(fields).map((f) => f._.config);

		this._ = {
			config,
			createConfig: {
				...config,
				fieldDefinitions,
			},
			fieldBuilders: builders as TFields,
			fields,
		};
	}

	static [Symbol.hasInstance](instance: unknown) {
		return (
			typeof instance === 'object' &&
			instance !== null &&
			isMetaobjectSym in instance &&
			instance[isMetaobjectSym] === true
		);
	}
}

export function metaobject<T extends TentoMetaobjectDefinition>(
	config: T,
): Metaobject<ReturnType<T['fieldDefinitions']>> {
	return new Metaobject(config);
}
