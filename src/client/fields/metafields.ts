import { Metafield, type TentoMetafieldDefinition } from '../metafield';
import { SingleLineTextField, type SingleLineTextFieldValidations } from './data-types';

export const metafield = {
	singleLineTextField<T extends TentoMetafieldDefinition<SingleLineTextFieldValidations>>(
		config: T,
	): Metafield<SingleLineTextField> {
		return new Metafield(config, new SingleLineTextField());
	},

	// metaobjectReference<T extends Metaobject<any>>(
	// 	metaobject: T,
	// 	config: TentoMetafieldDefinition<MetaobjectReferenceValidations>,
	// ): Metafield<MetaobjectReference> {
	// 	return new Metafield(config, new MetaobjectReference(metaobject));
	// },
};
