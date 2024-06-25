import type { MetaobjectFieldDefinitionCreateInput } from '../../graphql/gen/graphql';
import type { TentoMetaobjectFieldDefinitionInput } from '../types';
import type { Validations } from '../validations';
import {
	SingleLineTextField,
	type DataType,
	type SingleLineTextFieldValidations,
	SingleLineTextListField,
	type SingleLineTextListFieldValidations,
	MultiLineTextField,
	DecimalField,
	type DecimalValidations,
	type DecimalListValidations,
	DateField,
	DateListField,
	DateTimeField,
	DateTimeListField,
	DimensionField,
	DimensionListField,
	FileField,
	FileListField,
	IntegerField,
	IntegerListField,
	ProductField,
	ProductListField,
	UrlField,
	UrlListField,
	VolumeField,
	VolumeListField,
	WeightField,
	WeightListField,
	type DateListValidations,
	type DateTimeListValidations,
	type DateTimeValidations,
	type DateValidations,
	type DimensionListValidations,
	type DimensionValidations,
	type FileListValidations,
	type FileValidations,
	type IntegerListValidations,
	type IntegerValidations,
	type MultiLineTextFieldValidations,
	type UrlListValidations,
	type UrlValidations,
	type VolumeListValidations,
	type VolumeValidations,
	type WeightListValidations,
	type WeightValidations,
	DecimalList,
} from './data-types';

export function buildMetaobjectFieldDefinition(
	config: TentoMetaobjectFieldDefinitionInput<any>,
	validations: Validations,
): Omit<MetaobjectFieldDefinitionCreateInput, 'key' | 'type'> & { key?: string } {
	return {
		...config,
		validations: config.validations?.(validations),
	};
}

export const metaobjectFields = {
	singleLineTextField,
	multiLineTextField,
	url,
	integer,
	decimal,
	decimalList,
	date,
	dateList,
	dateTime,
	// product,
	// productList,
	// file,
	// fileList,
	dimension,
	dimensionList,
	volume,
	volumeList,
	weight,
	weightList,
};

export type MetaobjectFields = typeof metaobjectFields;

export type Optional<T extends MetaobjectFieldBuilder> = T & {
	readonly _: {
		optional: true;
	};
};

export type CreateMetaobjectFieldBuilder<
	TField extends DataType<any, any>,
	TConfig extends TentoMetaobjectFieldDefinitionInput<any>,
> = TConfig extends {
	required: true;
}
	? MetaobjectFieldBuilder<TField>
	: Optional<MetaobjectFieldBuilder<TField>>;

export class MetaobjectFieldBuilder<T extends DataType<any, Validations> = DataType<any, Validations>> {
	readonly _: {
		dataType: T;
		config: Omit<MetaobjectFieldDefinitionCreateInput, 'key'> & { key?: string };
		optional: boolean;
	};

	constructor(config: TentoMetaobjectFieldDefinitionInput<any> | undefined, dataType: T) {
		this._ = {
			optional: !config?.required,
			config: {
				...buildMetaobjectFieldDefinition(config ?? {}, dataType._.validations),
				type: dataType._.type,
			},
			dataType,
		};
	}
}

export class MetaobjectField<T extends DataType<any, Validations> = DataType<any, Validations>> {
	readonly _: Omit<MetaobjectFieldBuilder<T>['_'], 'config'> & {
		config: MetaobjectFieldDefinitionCreateInput;
	};

	constructor(builder: MetaobjectFieldBuilder<T>, key: string) {
		this._ = {
			...builder._,
			config: {
				...builder._.config,
				key: builder._.config.key ?? key,
			},
		};
	}
}

export function singleLineTextField<T extends TentoMetaobjectFieldDefinitionInput<SingleLineTextFieldValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<SingleLineTextField, T> {
	return new MetaobjectFieldBuilder(config, new SingleLineTextField()) as CreateMetaobjectFieldBuilder<
		SingleLineTextField,
		T
	>;
}

export function singleLineTextList<T extends TentoMetaobjectFieldDefinitionInput<SingleLineTextListFieldValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<SingleLineTextListField, T> {
	return new MetaobjectFieldBuilder(config, new SingleLineTextListField()) as CreateMetaobjectFieldBuilder<
		SingleLineTextListField,
		T
	>;
}

export function multiLineTextField<T extends TentoMetaobjectFieldDefinitionInput<MultiLineTextFieldValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<MultiLineTextField, T> {
	return new MetaobjectFieldBuilder(config, new MultiLineTextField()) as CreateMetaobjectFieldBuilder<
		MultiLineTextField,
		T
	>;
}

export function decimal<T extends TentoMetaobjectFieldDefinitionInput<DecimalValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<DecimalField, T> {
	return new MetaobjectFieldBuilder(config, new DecimalField()) as CreateMetaobjectFieldBuilder<DecimalField, T>;
}

export function decimalList<T extends TentoMetaobjectFieldDefinitionInput<DecimalListValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<DecimalList, T> {
	return new MetaobjectFieldBuilder(config, new DecimalList()) as CreateMetaobjectFieldBuilder<DecimalList, T>;
}

export function url<T extends TentoMetaobjectFieldDefinitionInput<UrlValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<UrlField, T> {
	return new MetaobjectFieldBuilder(config, new UrlField()) as CreateMetaobjectFieldBuilder<UrlField, T>;
}

export function urlList<T extends TentoMetaobjectFieldDefinitionInput<UrlListValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<UrlListField, T> {
	return new MetaobjectFieldBuilder(config, new UrlListField()) as CreateMetaobjectFieldBuilder<UrlListField, T>;
}

export function integer<T extends TentoMetaobjectFieldDefinitionInput<IntegerValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<IntegerField, T> {
	return new MetaobjectFieldBuilder(config, new IntegerField()) as CreateMetaobjectFieldBuilder<IntegerField, T>;
}

export function integerList<T extends TentoMetaobjectFieldDefinitionInput<IntegerListValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<IntegerListField, T> {
	return new MetaobjectFieldBuilder(config, new IntegerListField()) as CreateMetaobjectFieldBuilder<
		IntegerListField,
		T
	>;
}

export function date<T extends TentoMetaobjectFieldDefinitionInput<DateValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<DateField, T> {
	return new MetaobjectFieldBuilder(config, new DateField()) as CreateMetaobjectFieldBuilder<DateField, T>;
}

export function dateList<T extends TentoMetaobjectFieldDefinitionInput<DateListValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<DateListField, T> {
	return new MetaobjectFieldBuilder(config, new DateListField()) as CreateMetaobjectFieldBuilder<DateListField, T>;
}

export function dateTime<T extends TentoMetaobjectFieldDefinitionInput<DateTimeValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<DateTimeField, T> {
	return new MetaobjectFieldBuilder(config, new DateTimeField()) as CreateMetaobjectFieldBuilder<DateTimeField, T>;
}

export function dateTimeList<T extends TentoMetaobjectFieldDefinitionInput<DateTimeListValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<DateTimeListField, T> {
	return new MetaobjectFieldBuilder(config, new DateTimeListField()) as CreateMetaobjectFieldBuilder<
		DateTimeListField,
		T
	>;
}

export function product<T extends TentoMetaobjectFieldDefinitionInput>(
	config?: T,
): CreateMetaobjectFieldBuilder<ProductField<T>, T> {
	return new MetaobjectFieldBuilder(config, new ProductField()) as CreateMetaobjectFieldBuilder<ProductField<T>, T>;
}

export function productList<T extends TentoMetaobjectFieldDefinitionInput>(
	config?: T,
): CreateMetaobjectFieldBuilder<ProductListField<T>, T> {
	return new MetaobjectFieldBuilder(config, new ProductListField()) as CreateMetaobjectFieldBuilder<
		ProductListField<T>,
		T
	>;
}

export function file<T extends TentoMetaobjectFieldDefinitionInput<FileValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<FileField, T> {
	return new MetaobjectFieldBuilder(config, new FileField()) as CreateMetaobjectFieldBuilder<FileField, T>;
}

export function fileList<T extends TentoMetaobjectFieldDefinitionInput<FileListValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<FileListField, T> {
	return new MetaobjectFieldBuilder(config, new FileListField()) as CreateMetaobjectFieldBuilder<FileListField, T>;
}
export function dimension<T extends TentoMetaobjectFieldDefinitionInput<DimensionValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<DimensionField, T> {
	return new MetaobjectFieldBuilder(config, new DimensionField()) as CreateMetaobjectFieldBuilder<DimensionField, T>;
}

export function dimensionList<T extends TentoMetaobjectFieldDefinitionInput<DimensionListValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<DimensionListField, T> {
	return new MetaobjectFieldBuilder(config, new DimensionListField()) as CreateMetaobjectFieldBuilder<
		DimensionListField,
		T
	>;
}

export function volume<T extends TentoMetaobjectFieldDefinitionInput<VolumeValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<VolumeField, T> {
	return new MetaobjectFieldBuilder(config, new VolumeField()) as CreateMetaobjectFieldBuilder<VolumeField, T>;
}
export function volumeList<T extends TentoMetaobjectFieldDefinitionInput<VolumeListValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<VolumeListField, T> {
	return new MetaobjectFieldBuilder(config, new VolumeListField()) as CreateMetaobjectFieldBuilder<VolumeListField, T>;
}

export function weight<T extends TentoMetaobjectFieldDefinitionInput<WeightValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<WeightField, T> {
	return new MetaobjectFieldBuilder(config, new WeightField()) as CreateMetaobjectFieldBuilder<WeightField, T>;
}
export function weightList<T extends TentoMetaobjectFieldDefinitionInput<WeightListValidations>>(
	config?: T,
): CreateMetaobjectFieldBuilder<WeightListField, T> {
	return new MetaobjectFieldBuilder(config, new WeightListField()) as CreateMetaobjectFieldBuilder<WeightListField, T>;
}
