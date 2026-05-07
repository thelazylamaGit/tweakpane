import {ValueController} from '../../controller/value.js';
import {Value, ValueChangeOptions} from '../../model/value.js';
import {ViewProps} from '../../model/view-props.js';
import {getHorizontalStepKeys, getStepForKey} from '../../ui.js';
import {
	PointerData,
	PointerHandler,
	PointerHandlerEvent,
} from '../../view/pointer-handler.js';
import {constrainRange, mapRange} from '../util.js';
import {SliderProps, SliderView} from '../view/slider.js';

/**
 * @hidden
 */
interface Config {
	props: SliderProps;
	value: Value<number>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class SliderController implements ValueController<number, SliderView> {
	public readonly value: Value<number>;
	public readonly view: SliderView;
	public readonly viewProps: ViewProps;
	public readonly props: SliderProps;

	private readonly ptHandler_: PointerHandler;
	private dragging_ = false;

	constructor(doc: Document, config: Config) {
		this.onKeyDown_ = this.onKeyDown_.bind(this);
		this.onKeyUp_ = this.onKeyUp_.bind(this);
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;
		this.props = config.props;

		this.view = new SliderView(doc, {
			props: this.props,
			value: this.value,
			viewProps: this.viewProps,
		});

		this.view.syncDisplayRange();

		this.ptHandler_ = new PointerHandler(this.view.trackElement);
		this.ptHandler_.emitter.on('down', this.onPointerDown_);
		this.ptHandler_.emitter.on('move', this.onPointerMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);

		this.view.trackElement.addEventListener('keydown', this.onKeyDown_);
		this.view.trackElement.addEventListener('keyup', this.onKeyUp_);

		this.value.emitter.on('change', this.onValueChange_);
	}

	private handlePointerEvent_(d: PointerData, opts: ValueChangeOptions): void {
		if (!d.point) {
			return;
		}

		const range = this.view.displayRange;

		this.value.setRawValue(
			mapRange(
				constrainRange(d.point.x, 0, d.bounds.width),
				0,
				d.bounds.width,
				range.min,
				range.max,
			),
			opts,
		);
	}

	private onPointerDown_(ev: PointerHandlerEvent): void {
		this.dragging_ = true;

		// Important:
		// Do not call syncDisplayRange() here.
		// The current display range is the active drag limit.
		this.handlePointerEvent_(ev.data, {
			forceEmit: false,
			last: false,
		});
	}

	private onPointerMove_(ev: PointerHandlerEvent): void {
		this.handlePointerEvent_(ev.data, {
			forceEmit: false,
			last: false,
		});
	}

	private onPointerUp_(ev: PointerHandlerEvent): void {
		this.handlePointerEvent_(ev.data, {
			forceEmit: true,
			last: true,
		});

		this.dragging_ = false;

		const range = this.view.defaultRange;
		const value = this.value.rawValue;

		if (value >= range.min && value <= range.max) {
			this.view.setDisplayRange(null);
		}
	}

	private onKeyDown_(ev: KeyboardEvent): void {
		const step = getStepForKey(
			this.props.get('keyScale'),
			getHorizontalStepKeys(ev),
		);
		if (step === 0) {
			return;
		}

		this.value.setRawValue(this.value.rawValue + step, {
			forceEmit: false,
			last: false,
		});
	}

	private onKeyUp_(ev: KeyboardEvent): void {
		const step = getStepForKey(
			this.props.get('keyScale'),
			getHorizontalStepKeys(ev),
		);
		if (step === 0) {
			return;
		}

		this.value.setRawValue(this.value.rawValue, {
			forceEmit: true,
			last: true,
		});
	}

	private onValueChange_(ev: {options: ValueChangeOptions}): void {
		if (this.dragging_) {
			return;
		}

		if (ev.options.last) {
			this.view.syncDisplayRange();
		}
	}
}
