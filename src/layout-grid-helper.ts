import { defu } from 'defu';

interface Options {
	gutter: string;
	sides: string;
	columns: number;
	container: string;
}

export interface Params extends Options {
	className: string;
	prefix: string;
	color: string;
	mobileFirst: boolean;
	responsible: Record<number, Options>;
}

interface Api {
	active: boolean;
	show: () => void;
	hide: () => void;
	destroy: () => void;
}

export class LayoutGridHelper implements Api {
	readonly #options: Params;
	#show: boolean = false;
	#root = document.createElement('div');
	#style = document.createElement('style');
	#keydown: (event: KeyboardEvent) => void;

	constructor(params: Partial<Params> = {}) {
		this.#options = defu(params, {
			gutter: '16px',
			sides: '20px',
			columns: 4,
			container: '100%',
			className: 'layout-grid-helper',
			prefix: 'lgh',
			color: 'rgb(255 0 0 / 0.2)',
			mobileFirst: false,
			responsible: {}
		});

		this.#root.classList.add(this.#options.className);
		document.body.append(this.#root);
		this.#style.innerHTML = this.#render();
		document.head.append(this.#style);
		const keydown = ({ ctrlKey, code }: KeyboardEvent) => {
			if (ctrlKey && code === 'KeyM') {
				this.toggle();
			}
		};

		this.#keydown = keydown.bind(this);
		window.addEventListener('keydown', this.#keydown);
	}

	get active() {
		return this.#show;
	}

	set active(value) {
		this.#show = value;
		this.#root.style.display = value ? 'block' : 'none';
	}

	toggle(value?: boolean) {
		this.active = value ?? !this.active;
	}

	hide(): void {
		this.toggle(false);
	}

	show(): void {
		this.toggle(true);
	}

	destroy() {
		this.#root.remove();
		this.#style.remove();
		window.removeEventListener('keydown', this.#keydown);
	}

	#variable(key: string, value: string | undefined = undefined) {
		const { prefix } = this.#options;
		return `--${prefix}-${key}${value != null ? ` : ${value};` : ''}`;
	}

	#variables(variables: Partial<Options>): string {
		let style = '';

		for (const key in variables) {
			if (Object.prototype.hasOwnProperty.call(variables, key)) {
				const value = variables[key as keyof Options];

				if (typeof value === 'string' || typeof value === 'number') {
					style += this.#variable(key, value.toString());
				}
			}
		}
		return style;
	}

	#responsive() {
		const { responsible, mobileFirst, className } = this.#options;
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
							@media (width ${mobileFirst ? '>' : '<'} ${size}px) {
								.${className} {
									${this.#variables(responsible[size])}
								}
							}
						`;
		}
		return style;
	}

	#render(): string {
		const { className, color, columns, container, gutter, sides } = this.#options;

		const variables = this.#variables({
			columns,
			container,
			gutter,
			sides
		});

		let columnWidthFormula = `((100% - (var(${this.#variable('gutter')})`;

		columnWidthFormula += ` * (var(${this.#variable('columns')}) - 1)))`;
		columnWidthFormula += ` + var(${this.#variable('sides')}) * 0) / var(${this.#variable('columns')})`;

		return `
				.${className} {
					${this.#variable('color', color)};
					${variables}
					${this.#variable('column-width', `calc(${columnWidthFormula})`)}
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
					border-width: 0px  var(${this.#variable('sides')});
					max-width: var(${this.#variable('container')});
					background-image: repeating-linear-gradient(
						90deg,
						var(${this.#variable('color')}) 0,
						var(${this.#variable('color')}) var(${this.#variable('column-width')}),
						transparent var(${this.#variable('column-width')}),
						transparent calc(var(${this.#variable('column-width')}) + var(${this.#variable('gutter')}))
					);
				}
				
				${this.#responsive()}
			`;
	}
}
