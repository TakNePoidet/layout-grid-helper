interface Options {
	gutter: string;
	sides: string;
	columns: number;
	container: string;
}

interface Params extends Options {
	className: string;
	prefix: string;
	color: string;
	mobileFirst: boolean;
	responsible: Record<number, Options>;
}

interface LayoutGridHelper {
	isShow: boolean;
	show(): void;
	hide(): void;
	destroy(): void;
}

export function layoutGridHelper(params: Partial<Params> = {}): LayoutGridHelper {
	const root: HTMLElement = document.createElement('div');
	const styleTag = document.createElement('style');

	const options: Params = {
		gutter: '16px',
		sides: '20px',
		columns: 4,
		container: '100%',
		className: 'layout-grid-helper',
		prefix: 'lgh',
		color: 'rgb(255 0 0 / 0.2)',
		mobileFirst: false,
		responsible: {},
		...params
	};

	const state = Object.create(Object.prototype, {
		_show: { value: false, writable: true },
		show: {
			get() {
				return this._show;
			},
			set(value: boolean) {
				this._show = value;
				root.style.display = value ? 'block' : 'none';
			}
		}
	});

	function variable(key: string, value: string | undefined = undefined) {
		const { prefix } = options;

		return `--${prefix}-${key}${value ? ` : ${value};` : ''}`;
	}

	function toggle(value?: boolean) {
		state.show = value ?? !state.show;
	}
	function keydown(event: KeyboardEvent) {
		const { ctrlKey, code } = event;

		if (ctrlKey && code === 'KeyM') {
			toggle();
		}
	}

	function insertVariable(variables: Partial<Options>): string {
		let style = '';

		for (const key in variables) {
			if (Object.prototype.hasOwnProperty.call(variables, key)) {
				const value = variables[key as keyof Options];

				if (typeof value === 'string' || typeof value === 'number') {
					style += variable(key, value.toString());
				}
			}
		}
		return style;
	}
	function responsive() {
		const { responsible, mobileFirst, className } = options;
		const keysResponsible = Object.keys(responsible)
			.map(Number)
			.sort((a: number, b: number) => {
				if (mobileFirst) {
					return a > b ? 1 : -1;
				}
				return a > b ? -1 : 1;
			});

		let style = '';

		for (const size of keysResponsible) {
			style += `
							@media screen and (${mobileFirst ? 'min-width' : 'max-width'}: ${size}px) {
								.${className} {
									${insertVariable(responsible[size])}
								}
							}
						`;
		}
		return style;
	}
	function generateStyle(): string {
		const { className, color } = options;

		const { columns, container, gutter, sides } = options;

		const variables = insertVariable({
			columns,
			container,
			gutter,
			sides
		});

		let columnWidthFormula = `((100% - (var(${variable('gutter')})`;

		columnWidthFormula += `* (var(${variable('columns')}) - 1)))`;
		columnWidthFormula += `var(${variable('sides')}) * 0) / var(${variable('columns')})`;

		return `
				.${className} {
					${variable('color', color)};
					${variables}
					${variable('column-width', `calc(${columnWidthFormula})`)}
					display: none;
					position: fixed;
					top: 0;
					width: 100%;
					height: 100%;
					pointer-events: none;
					z-index: 9999;
					background-repeat: no-repeat;
					left: 50%;
					transform: translateX(-50%);
					border: 0px solid transparent;
					border-width: 0px  var(${variable('sides')});
					max-width: var(${variable('container')});
					background-image: repeating-linear-gradient(
						90deg,
						var(${variable('color')}) 0,
						var(${variable('color')}) var(${variable('column-width')}),
						transparent var(${variable('column-width')}),
						transparent calc(var(${variable('column-width')}) + var(${variable('gutter')}))
					);
				}
				
				${responsive()}
			`;
	}

	function init() {
		root.classList.add(options.className);
		document.body.append(root);
		styleTag.innerHTML = generateStyle();
		document.head.append(styleTag);
		window.addEventListener('keydown', keydown);
	}

	function destroy() {
		root.remove();
		root.remove();
		window.removeEventListener('keydown', keydown);
	}

	function api(): LayoutGridHelper {
		return {
			get isShow() {
				return state.show;
			},
			show: () => toggle(true),
			hide: () => toggle(false),
			destroy
		};
	}
	init();
	return api();
}
