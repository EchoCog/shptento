import { Client } from '../gql-client';
import { SelectBuilder } from './query-builders/select';
import { UpdateBuilder } from './query-builders/update';
import { SelectedFields } from './types';

export class ShopifyProductOperations {
	constructor(private client: Client) {}

	list(): SelectBuilder<undefined>;
	list<TSelection extends SelectedFields>(fields: TSelection): SelectBuilder<TSelection>;
	list(fields?: SelectedFields): SelectBuilder<SelectedFields | undefined> {
		return new SelectBuilder({ fields: fields ?? undefined, client: this.client });
	}

	update(id: string): UpdateBuilder {
		return new UpdateBuilder({ productId: id, client: this.client });
	}
}
