import {ValueMap} from '../../../common/model/value-map.js';
import {createValue} from '../../../common/model/values.js';
import {deepEqualsArray} from '../../../misc/type-util.js';
import {BladePosition} from './blade-positions.js';

export type Blade = ValueMap<{
	description: string | null | undefined;
	positions: BladePosition[];
}>;

export function createBlade(description?: string | null | undefined): Blade {
	return new ValueMap({
		description: createValue(description),
		positions: createValue<BladePosition[]>([], {
			equals: deepEqualsArray,
		}),
	});
}
