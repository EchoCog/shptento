import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import type {
	MetaobjectFieldDefinitionBuilder,
	MetaobjectFieldDefinitionConfig,
	MetaobjectFieldDefinitionConfigWithType,
} from './types';
import { allowedDomains, choices, max, maxPrecision, min, regex, type Validations } from '../validations';

dayjs.extend(utc);

export abstract class Field<T, TRequired extends boolean = boolean> {
	declare readonly _: {
		readonly type: T;
		readonly config: MetaobjectFieldDefinitionBuilder;
		readonly required: TRequired extends true ? true : false;
	};

	constructor(
		config: MetaobjectFieldDefinitionConfigWithType<any, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		this._ = {
			config: buildMetaobjectFieldDefinition(config, validations),
			type: undefined as T,
			required: config.required as TRequired extends true ? true : false,
		};
	}

	static toAPIValue(value: any): any {
		return value;
	}

	toAPIValue(value: T): any {
		return (this.constructor as typeof Field).toAPIValue(value);
	}

	static fromAPIValue(value: any): any {
		return value;
	}

	fromAPIValue(value: any): T {
		return (this.constructor as typeof Field).fromAPIValue(value);
	}
}

export function buildMetaobjectFieldDefinition(
	config: MetaobjectFieldDefinitionConfigWithType<any, boolean>,
	validations: Validations,
): MetaobjectFieldDefinitionBuilder {
	return {
		...config,
		validations: config.validations?.(validations),
	};
}

export const fields = {
	singleLineTextField,
	multiLineTextField,
	url,
	integer,
	decimal,
	decimalList,
	date,
	dateList,
	dateTime,
	dimension,
	dimensionList,
	volume,
	volumeList,
	weight,
	weightList,
};

export type Fields = typeof fields;

export class SingleLineTextField<TRequired extends boolean = false> extends Field<string, TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<SingleLineTextFieldValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'single_line_text_field' }, validations);
	}
}

export function singleLineTextField<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<SingleLineTextFieldValidations, TRequired extends true ? true : false>,
>(config?: T): SingleLineTextField<T['required'] extends true ? true : false> {
	return new SingleLineTextField<T['required'] extends true ? true : false>(
		(config as any) ?? {},
		singleLineTextFieldValidations,
	);
}

export const singleLineTextFieldValidations = {
	min(value: number) {
		return min(value.toString());
	},
	max(value: number) {
		return max(value.toString());
	},
	regex,
	choices,
};

export type SingleLineTextFieldValidations = typeof singleLineTextFieldValidations;

export class SingleLineTextListField extends Field<string[]> {
	constructor(config: MetaobjectFieldDefinitionConfig<SingleLineTextListFieldValidations>, validations: Validations) {
		super({ ...config, type: 'list.single_line_text_field' }, validations);
	}
}

export function singleLineTextList<T extends MetaobjectFieldDefinitionConfig<SingleLineTextListFieldValidations>>(
	config?: T,
): SingleLineTextListField {
	return new SingleLineTextListField(config ?? {}, singleLineTextListFieldValidations);
}

export const singleLineTextListFieldValidations = singleLineTextFieldValidations;

export type SingleLineTextListFieldValidations = typeof singleLineTextListFieldValidations;

export class MultiLineTextField<TRequired extends boolean = false> extends Field<string, TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<MultiLineTextFieldValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'multi_line_text_field' }, validations);
	}
}

export function multiLineTextField<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<MultiLineTextFieldValidations, TRequired extends true ? true : false>,
>(config?: T): MultiLineTextField<T['required'] extends true ? true : false> {
	return new MultiLineTextField<T['required'] extends true ? true : false>(
		(config as any) ?? {},
		multiLineTextFieldValidations,
	);
}

export const multiLineTextFieldValidations = {
	min(value: number) {
		return min(value.toString());
	},
	max(value: number) {
		return max(value.toString());
	},
	regex,
};

export type MultiLineTextFieldValidations = typeof multiLineTextFieldValidations;

export class DecimalField<TRequired extends boolean = false> extends Field<number, TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<DecimalFieldValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'number_decimal' }, validations);
	}

	static override toAPIValue(value: number): string {
		const str = value.toString();
		if (str.includes('.')) {
			return str;
		}
		return `${str}.0`;
	}

	static override fromAPIValue(value: string): number {
		return Number(value);
	}
}

export function decimal<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<DecimalFieldValidations, TRequired extends true ? true : false>,
>(config?: T): DecimalField<T['required'] extends true ? true : false> {
	return new DecimalField<T['required'] extends true ? true : false>((config as any) ?? {}, decimalFieldValidations);
}

export const decimalFieldValidations = {
	min(value: number) {
		return min(DecimalField.toAPIValue(value));
	},
	max(value: number) {
		return max(DecimalField.toAPIValue(value));
	},
	maxPrecision,
};

export type DecimalFieldValidations = typeof decimalFieldValidations;

export class DecimalListField<TRequired extends boolean = false> extends Field<number[], TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<DecimalListFieldValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'list.number_decimal' }, validations);
	}

	static override toAPIValue(value: number[]): string {
		return JSON.stringify(value.map((v) => DecimalField.toAPIValue(v)));
	}

	static override fromAPIValue(value: string): number[] {
		return JSON.parse(value).map((v: string) => DecimalField.fromAPIValue(v));
	}
}

export function decimalList<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<DecimalListFieldValidations, TRequired extends true ? true : false>,
>(config?: T): DecimalListField<T['required'] extends true ? true : false> {
	return new DecimalListField<T['required'] extends true ? true : false>(
		(config as any) ?? {},
		decimalListFieldValidations,
	);
}

export const decimalListFieldValidations = decimalFieldValidations;

export type DecimalListFieldValidations = typeof decimalListFieldValidations;

export class UrlField<TRequired extends boolean = false> extends Field<string, TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<UrlValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'url' }, validations);
	}
}

export function url<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<UrlValidations, TRequired extends true ? true : false>,
>(config?: T): UrlField<T['required'] extends true ? true : false> {
	return new UrlField<T['required'] extends true ? true : false>((config as any) ?? {}, urlValidations);
}

export const urlValidations = {
	allowedDomains,
};

export type UrlValidations = typeof urlValidations;

export class UrlListField extends Field<string[]> {
	constructor(config: MetaobjectFieldDefinitionConfig<UrlListValidations>, validations: Validations) {
		super({ ...config, type: 'list.url' }, validations);
	}
}

export function urlList<T extends MetaobjectFieldDefinitionConfig<UrlListValidations>>(config?: T): UrlListField {
	return new UrlListField(config ?? {}, urlListValidations);
}

export const urlListValidations = urlValidations;

export type UrlListValidations = typeof urlListValidations;

export class IntegerField<TRequired extends boolean = false> extends Field<number, TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<IntegerValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'number_integer' }, validations);
	}

	static override toAPIValue(value: number): string {
		return value.toString();
	}

	static override fromAPIValue(value: string): number {
		return Number(value);
	}
}

export function integer<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<IntegerValidations, TRequired extends true ? true : false>,
>(config?: T): IntegerField<T['required'] extends true ? true : false> {
	return new IntegerField<T['required'] extends true ? true : false>((config as any) ?? {}, integerValidations);
}

export const integerValidations = {
	min(value: number) {
		return min(value.toString());
	},
	max(value: number) {
		return max(value.toString());
	},
};

export type IntegerValidations = typeof integerValidations;

export class IntegerListField extends Field<number[]> {
	constructor(config: MetaobjectFieldDefinitionConfig<IntegerListValidations>, validations: Validations) {
		super({ ...config, type: 'list.number_integer' }, validations);
	}

	static override toAPIValue(value: number[]): string {
		return JSON.stringify(value.map((v) => IntegerField.toAPIValue(v)));
	}

	static override fromAPIValue(value: string): number[] {
		return JSON.parse(value).map((v: string) => IntegerField.fromAPIValue(v));
	}
}

export function integerList<T extends MetaobjectFieldDefinitionConfig<IntegerListValidations>>(
	config?: T,
): IntegerListField {
	return new IntegerListField(config ?? {}, integerListValidations);
}

export const integerListValidations = integerValidations;

export type IntegerListValidations = typeof integerListValidations;

export class DateField<TRequired extends boolean = false> extends Field<Date, TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<DateValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'date' }, validations);
	}

	static override toAPIValue(value: Date): string {
		return dayjs(value).utc().format('YYYY-MM-DD');
	}

	static override fromAPIValue(value: string): Date {
		return new Date(value);
	}
}

export function date<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<DateValidations, TRequired extends true ? true : false>,
>(config?: T): DateField<T['required'] extends true ? true : false> {
	return new DateField<T['required'] extends true ? true : false>((config as any) ?? {}, dateValidations);
}

export const dateValidations = {
	min(value: Date | string) {
		return min(typeof value === 'string' ? value : DateField.toAPIValue(value));
	},
	max(value: Date | string) {
		return max(typeof value === 'string' ? value : DateField.toAPIValue(value));
	},
};

export type DateValidations = typeof dateValidations;

export class DateListField<TRequired extends boolean = false> extends Field<Date[], TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<DateListValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'list.date' }, validations);
	}

	static override toAPIValue(value: Date[]): string {
		return JSON.stringify(value.map((v) => DateField.toAPIValue(v)));
	}

	static override fromAPIValue(value: string): Date[] {
		return JSON.parse(value).map((v: string) => DateField.fromAPIValue(v));
	}
}

export function dateList<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<DateListValidations, TRequired extends true ? true : false>,
>(config?: T): DateListField<T['required'] extends true ? true : false> {
	return new DateListField<T['required'] extends true ? true : false>((config as any) ?? {}, dateListValidations);
}

export const dateListValidations = dateValidations;

export type DateListValidations = typeof dateListValidations;

export class DateTimeField<TRequired extends boolean = false> extends Field<Date, TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<DateTimeValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'date_time' }, validations);
	}

	static override toAPIValue(value: Date): string {
		return dayjs(value).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
	}

	static override fromAPIValue(value: string): Date {
		return new Date(value);
	}
}

export function dateTime<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<DateTimeValidations, TRequired extends true ? true : false>,
>(config?: T): DateTimeField<T['required'] extends true ? true : false> {
	return new DateTimeField<T['required'] extends true ? true : false>((config as any) ?? {}, dateTimeValidations);
}

export const dateTimeValidations = {
	min(value: Date | string) {
		return min(typeof value === 'string' ? value : DateTimeField.toAPIValue(value));
	},
	max(value: Date | string) {
		return max(typeof value === 'string' ? value : DateTimeField.toAPIValue(value));
	},
};

export type DateTimeValidations = typeof dateTimeValidations;

export class DateTimeListField extends Field<Date[]> {
	constructor(config: MetaobjectFieldDefinitionConfig<DateTimeListValidations>, validations: Validations) {
		super({ ...config, type: 'list.date_time' }, validations);
	}

	static override toAPIValue(value: Date[]): string {
		return JSON.stringify(value.map((v) => DateTimeField.toAPIValue(v)));
	}

	static override fromAPIValue(value: string): Date[] {
		return JSON.parse(value).map((v: string) => DateTimeField.fromAPIValue(v));
	}
}

export function dateTimeList<T extends MetaobjectFieldDefinitionConfig<DateTimeListValidations>>(
	config?: T,
): DateTimeListField {
	return new DateTimeListField(config ?? {}, dateTimeListValidations);
}

export const dateTimeListValidations = dateTimeValidations;

export type DateTimeListValidations = typeof dateTimeListValidations;

export type DimensionUnit = 'METERS' | 'CENTIMETERS' | 'MILLIMETERS' | 'INCHES' | 'FEET' | 'YARDS';

export interface DimensionFieldValue {
	value: number;
	unit: DimensionUnit | Omit<string, DimensionUnit>;
}

export class DimensionField<TRequired extends boolean = false> extends Field<DimensionFieldValue, TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<DimensionValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'dimension' }, validations);
	}

	static override toAPIValue(value: DimensionFieldValue): string {
		return `{"value":${DecimalField.toAPIValue(value.value)},"unit":"${value.unit}"}`;
	}

	static override fromAPIValue(value: string): DimensionFieldValue {
		return JSON.parse(value);
	}
}

export function dimension<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<DimensionValidations, TRequired extends true ? true : false>,
>(config?: T): DimensionField<T['required'] extends true ? true : false> {
	return new DimensionField<T['required'] extends true ? true : false>((config as any) ?? {}, dimensionValidations);
}

export const dimensionValidations = {
	min(value: DimensionFieldValue) {
		return min(DimensionField.toAPIValue(value));
	},

	max(value: DimensionFieldValue) {
		return max(DimensionField.toAPIValue(value));
	},
};

export type DimensionValidations = typeof dimensionValidations;

export class DimensionListField<TRequired extends boolean = false> extends Field<DimensionFieldValue[], TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<DimensionListValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'list.dimension' }, validations);
	}

	static override toAPIValue(value: DimensionFieldValue[]): string {
		return JSON.stringify(value.map((v) => DimensionField.toAPIValue(v)));
	}

	static override fromAPIValue(value: string): DimensionFieldValue[] {
		return JSON.parse(value).map((v: string) => DimensionField.fromAPIValue(v));
	}
}

export function dimensionList<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<DimensionListValidations, TRequired extends true ? true : false>,
>(config?: T): DimensionListField<T['required'] extends true ? true : false> {
	return new DimensionListField<T['required'] extends true ? true : false>(
		(config as any) ?? {},
		dimensionListValidations,
	);
}

export const dimensionListValidations = dimensionValidations;

export type DimensionListValidations = typeof dimensionListValidations;

export type VolumeUnit =
	| 'MILLILITERS'
	| 'CENTILITERS'
	| 'LITERS'
	| 'PINTS'
	| 'CUBIC_INCHES'
	| 'CUBIC_FEET'
	| 'CUBIC_METERS'
	| 'IMPERIAL_FLUID_OUNCES';

export interface VolumeFieldValue {
	value: number;
	unit: VolumeUnit | Omit<string, VolumeUnit>;
}

export class VolumeField<TRequired extends boolean = false> extends Field<VolumeFieldValue, TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<VolumeValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'volume' }, validations);
	}

	static override toAPIValue(value: VolumeFieldValue): string {
		return `{"value":${DecimalField.toAPIValue(value.value)},"unit":"${value.unit}"}`;
	}

	static override fromAPIValue(value: string): VolumeFieldValue {
		return JSON.parse(value);
	}
}

export function volume<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<VolumeValidations, TRequired extends true ? true : false>,
>(config?: T): VolumeField<T['required'] extends true ? true : false> {
	return new VolumeField<T['required'] extends true ? true : false>((config as any) ?? {}, volumeValidations);
}

export const volumeValidations = {
	min(value: VolumeFieldValue) {
		return min(VolumeField.toAPIValue(value));
	},

	max(value: VolumeFieldValue) {
		return max(VolumeField.toAPIValue(value));
	},
};

export type VolumeValidations = typeof volumeValidations;

export class VolumeListField<TRequired extends boolean = false> extends Field<VolumeFieldValue[], TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<VolumeListValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'list.volume' }, validations);
	}

	static override toAPIValue(value: VolumeFieldValue[]): string {
		return JSON.stringify(value.map((v) => VolumeField.toAPIValue(v)));
	}

	static override fromAPIValue(value: string): VolumeFieldValue[] {
		return JSON.parse(value).map((v: string) => VolumeField.fromAPIValue(v));
	}
}

export function volumeList<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<VolumeListValidations, TRequired extends true ? true : false>,
>(config?: T): VolumeListField<T['required'] extends true ? true : false> {
	return new VolumeListField<T['required'] extends true ? true : false>((config as any) ?? {}, volumeListValidations);
}

export const volumeListValidations = volumeValidations;

export type VolumeListValidations = typeof volumeListValidations;

export type WeightUnit = 'KILOGRAMS' | 'GRAMS' | 'POUNDS' | 'OUNCES';

export interface WeightFieldValue {
	value: number;
	unit: WeightUnit | Omit<string, WeightUnit>;
}

export class WeightField<TRequired extends boolean = false> extends Field<WeightFieldValue, TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<WeightValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'weight' }, validations);
	}

	static override toAPIValue(value: WeightFieldValue): string {
		return `{"value":${DecimalField.toAPIValue(value.value)},"unit":"${value.unit}"}`;
	}

	static override fromAPIValue(value: string): WeightFieldValue {
		return JSON.parse(value);
	}
}

export function weight<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<WeightValidations, TRequired extends true ? true : false>,
>(config?: T): WeightField<T['required'] extends true ? true : false> {
	return new WeightField<T['required'] extends true ? true : false>((config as any) ?? {}, weightValidations);
}

export const weightValidations = {
	min(value: WeightFieldValue) {
		return min(WeightField.toAPIValue(value));
	},

	max(value: WeightFieldValue) {
		return max(WeightField.toAPIValue(value));
	},
};

export type WeightValidations = typeof weightValidations;

export class WeightListField<TRequired extends boolean = false> extends Field<WeightFieldValue[], TRequired> {
	constructor(
		config: MetaobjectFieldDefinitionConfig<WeightListValidations, TRequired extends true ? true : false>,
		validations: Validations,
	) {
		super({ ...config, type: 'list.weight' }, validations);
	}

	static override toAPIValue(value: WeightFieldValue[]): string {
		return JSON.stringify(value.map((v) => WeightField.toAPIValue(v)));
	}

	static override fromAPIValue(value: string): WeightFieldValue[] {
		return JSON.parse(value).map((v: string) => WeightField.fromAPIValue(v));
	}
}

export function weightList<
	TRequired extends boolean,
	T extends MetaobjectFieldDefinitionConfig<WeightListValidations, TRequired extends true ? true : false>,
>(config?: T): WeightListField<T['required'] extends true ? true : false> {
	return new WeightListField<T['required'] extends true ? true : false>((config as any) ?? {}, weightListValidations);
}

export const weightListValidations = weightValidations;

export type WeightListValidations = typeof weightListValidations;
