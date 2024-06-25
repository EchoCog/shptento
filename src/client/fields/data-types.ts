import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { allowedDomains, choices, fileTypes, max, maxPrecision, min, regex, type Validations } from '../validations';
import type { Metaobject } from '../metaobject';

dayjs.extend(utc);

export abstract class DataType<TDataType, TValidations extends Validations> {
	readonly _: {
		readonly dataType: TDataType;
		readonly type: string;
		readonly validations: TValidations;
	};

	constructor(type: string, validations: TValidations) {
		this._ = {
			dataType: undefined as TDataType,
			type,
			validations,
		};
	}

	static toAPIValue(value: any): any {
		return value;
	}

	toAPIValue(value: TDataType): any {
		return (this.constructor as typeof DataType).toAPIValue(value);
	}

	static fromAPIValue(value: any): any {
		return value;
	}

	fromAPIValue(value: any): TDataType {
		return (this.constructor as typeof DataType).fromAPIValue(value);
	}
}

export class SingleLineTextField extends DataType<string, SingleLineTextFieldValidations> {
	constructor() {
		super('single_line_text_field', singleLineTextFieldValidations);
	}
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

export class SingleLineTextListField extends DataType<string[], SingleLineTextListFieldValidations> {
	constructor() {
		super('list.single_line_text_field', singleLineTextListFieldValidations);
	}
}

export const singleLineTextListFieldValidations = singleLineTextFieldValidations;

export type SingleLineTextListFieldValidations = typeof singleLineTextListFieldValidations;

export class MultiLineTextField extends DataType<string, MultiLineTextFieldValidations> {
	constructor() {
		super('multi_line_text_field', multiLineTextFieldValidations);
	}
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

export class DecimalField extends DataType<number, DecimalValidations> {
	constructor() {
		super('number_decimal', decimalValidations);
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

export const decimalValidations = {
	min(value: number) {
		return min(DecimalField.toAPIValue(value));
	},
	max(value: number) {
		return max(DecimalField.toAPIValue(value));
	},
	maxPrecision,
};

export type DecimalValidations = typeof decimalValidations;

export class DecimalList extends DataType<number[], DecimalListValidations> {
	constructor() {
		super('list.number_decimal', decimalListValidations);
	}

	static override toAPIValue(value: number[]): string {
		return JSON.stringify(value.map((v) => DecimalField.toAPIValue(v)));
	}

	static override fromAPIValue(value: string): number[] {
		return JSON.parse(value).map((v: string) => DecimalField.fromAPIValue(v));
	}
}

export const decimalListValidations = decimalValidations;

export type DecimalListValidations = typeof decimalListValidations;

export class UrlField extends DataType<string, UrlValidations> {
	constructor() {
		super('url', urlValidations);
	}
}

export const urlValidations = {
	allowedDomains,
};

export type UrlValidations = typeof urlValidations;

export class UrlListField extends DataType<string[], UrlListValidations> {
	constructor() {
		super('list.url', urlListValidations);
	}
}

export const urlListValidations = urlValidations;

export type UrlListValidations = typeof urlListValidations;

export class IntegerField extends DataType<number, IntegerValidations> {
	constructor() {
		super('number_integer', integerValidations);
	}

	static override toAPIValue(value: number): string {
		return value.toString();
	}

	static override fromAPIValue(value: string): number {
		return Number(value);
	}
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

export class IntegerListField extends DataType<number[], IntegerListValidations> {
	constructor() {
		super('list.number_integer', integerListValidations);
	}

	static override toAPIValue(value: number[]): string {
		return JSON.stringify(value.map((v) => IntegerField.toAPIValue(v)));
	}

	static override fromAPIValue(value: string): number[] {
		return JSON.parse(value).map((v: string) => IntegerField.fromAPIValue(v));
	}
}

export const integerListValidations = integerValidations;

export type IntegerListValidations = typeof integerListValidations;

export class DateField extends DataType<Date, DateValidations> {
	constructor() {
		super('date', dateValidations);
	}

	static override toAPIValue(value: Date): string {
		return dayjs(value).utc().format('YYYY-MM-DD');
	}

	static override fromAPIValue(value: string): Date {
		return new Date(value);
	}
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

export class DateListField extends DataType<Date[], DateListValidations> {
	constructor() {
		super('list.date', dateListValidations);
	}

	static override toAPIValue(value: Date[]): string {
		return JSON.stringify(value.map((v) => DateField.toAPIValue(v)));
	}

	static override fromAPIValue(value: string): Date[] {
		return JSON.parse(value).map((v: string) => DateField.fromAPIValue(v));
	}
}

export const dateListValidations = dateValidations;

export type DateListValidations = typeof dateListValidations;

export class DateTimeField extends DataType<Date, DateTimeValidations> {
	constructor() {
		super('date_time', dateTimeValidations);
	}

	static override toAPIValue(value: Date): string {
		return dayjs(value).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
	}

	static override fromAPIValue(value: string): Date {
		return new Date(value);
	}
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

export class DateTimeListField extends DataType<Date[], DateTimeListValidations> {
	constructor() {
		super('list.date_time', dateTimeListValidations);
	}

	static override toAPIValue(value: Date[]): string {
		return JSON.stringify(value.map((v) => DateTimeField.toAPIValue(v)));
	}

	static override fromAPIValue(value: string): Date[] {
		return JSON.parse(value).map((v: string) => DateTimeField.fromAPIValue(v));
	}
}

export const dateTimeListValidations = dateTimeValidations;

export type DateTimeListValidations = typeof dateTimeListValidations;

export class ProductField<T> extends DataType<T, ProductValidations> {
	constructor() {
		super('product_reference', productValidations);
	}

	static override toAPIValue(value: any): string {
		return JSON.stringify(value);
	}

	static override fromAPIValue(value: string): any {
		return JSON.parse(value);
	}
}

export const productValidations = {};

export type ProductValidations = typeof productValidations;

export class ProductListField<T> extends DataType<T[], ProductListValidations> {
	constructor() {
		super('list.product_reference', productListValidations);
	}

	static override toAPIValue(value: any): string {
		return JSON.stringify(value);
	}

	static override fromAPIValue(value: string): any {
		return JSON.parse(value);
	}
}

export const productListValidations = productValidations;

export type ProductListValidations = typeof productListValidations;

export class FileField extends DataType<Blob, FileValidations> {
	constructor() {
		super('file_reference', fileValidations);
	}
}

export const fileValidations = {
	fileTypes,
};

export type FileValidations = typeof fileValidations;

export class FileListField extends DataType<Blob[], FileListValidations> {
	constructor() {
		super('list.file_reference', fileListValidations);
	}
}

export const fileListValidations = fileValidations;

export type FileListValidations = typeof fileListValidations;

export type DimensionUnit = 'METERS' | 'CENTIMETERS' | 'MILLIMETERS' | 'INCHES' | 'FEET' | 'YARDS';

export interface DimensionFieldValue {
	value: number;
	unit: DimensionUnit | Omit<string, DimensionUnit>;
}

export class DimensionField extends DataType<DimensionFieldValue, DimensionValidations> {
	constructor() {
		super('dimension', dimensionValidations);
	}

	static override toAPIValue(value: DimensionFieldValue): string {
		return `{"value":${DecimalField.toAPIValue(value.value)},"unit":"${value.unit}"}`;
	}

	static override fromAPIValue(value: string): DimensionFieldValue {
		return JSON.parse(value);
	}
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

export class DimensionListField extends DataType<DimensionFieldValue[], DimensionListValidations> {
	constructor() {
		super('list.dimension', dimensionListValidations);
	}

	static override toAPIValue(value: DimensionFieldValue[]): string {
		return JSON.stringify(value.map((v) => DimensionField.toAPIValue(v)));
	}

	static override fromAPIValue(value: string): DimensionFieldValue[] {
		return JSON.parse(value).map((v: string) => DimensionField.fromAPIValue(v));
	}
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

export class VolumeField extends DataType<VolumeFieldValue, VolumeValidations> {
	constructor() {
		super('volume', volumeValidations);
	}

	static override toAPIValue(value: VolumeFieldValue): string {
		return `{"value":${DecimalField.toAPIValue(value.value)},"unit":"${value.unit}"}`;
	}

	static override fromAPIValue(value: string): VolumeFieldValue {
		return JSON.parse(value);
	}
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

export class VolumeListField extends DataType<VolumeFieldValue[], VolumeListValidations> {
	constructor() {
		super('list.volume', volumeListValidations);
	}

	static override toAPIValue(value: VolumeFieldValue[]): string {
		return JSON.stringify(value.map((v) => VolumeField.toAPIValue(v)));
	}

	static override fromAPIValue(value: string): VolumeFieldValue[] {
		return JSON.parse(value).map((v: string) => VolumeField.fromAPIValue(v));
	}
}

export const volumeListValidations = volumeValidations;

export type VolumeListValidations = typeof volumeListValidations;

export type WeightUnit = 'KILOGRAMS' | 'GRAMS' | 'POUNDS' | 'OUNCES';

export interface WeightFieldValue {
	value: number;
	unit: WeightUnit | Omit<string, WeightUnit>;
}

export class WeightField extends DataType<WeightFieldValue, WeightValidations> {
	constructor() {
		super('weight', weightValidations);
	}

	static override toAPIValue(value: WeightFieldValue): string {
		return `{"value":${DecimalField.toAPIValue(value.value)},"unit":"${value.unit}"}`;
	}

	static override fromAPIValue(value: string): WeightFieldValue {
		return JSON.parse(value);
	}
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

export class WeightListField extends DataType<WeightFieldValue[], WeightListValidations> {
	constructor() {
		super('list.weight', weightListValidations);
	}

	static override toAPIValue(value: WeightFieldValue[]): string {
		return JSON.stringify(value.map((v) => WeightField.toAPIValue(v)));
	}

	static override fromAPIValue(value: string): WeightFieldValue[] {
		return JSON.parse(value).map((v: string) => WeightField.fromAPIValue(v));
	}
}

export const weightListValidations = weightValidations;

export type WeightListValidations = typeof weightListValidations;

export class MetaobjectReferenceField<T extends Metaobject<any>> extends DataType<T, MetaobjectReferenceValidations> {
	constructor() {
		super('metaobject_reference', metaobjectReferenceValidations);
	}
}

export const metaobjectReferenceValidations = {};

export type MetaobjectReferenceValidations = typeof metaobjectReferenceValidations;
