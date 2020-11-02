
interface GridHelperVariables {
	gutter?: string;
	sides?: string;
	columns?: number;
	container?: string;
}

interface GridHelperConstructor extends GridHelperVariables {
	className?: string;
	prefix?: string;
	mobileFirst?: boolean,
	color?: string,
	responsible?: { [key: number]: GridHelperVariables; };
}
interface GridHelperApi {
	init(): GridHelperApi;
	show(): GridHelperApi;
	hide(): GridHelperApi;
	destroy(): void;
}



export default function GridHelper(params: GridHelperConstructor = {}): GridHelperApi {
	const color = params.color || 'rgb(255 0 0 / 0.2)';
	const gutter = params.gutter || '16px';
	const sides = params.sides || '20px';
	const columns = params.columns || 4;
	const container = params.container || '100%';
	const prefix = params.prefix || 'gh';
	const responsible = params.responsible || {};
	const className = params.className || 'grid-helper';
	const mobileFirst = typeof params.mobileFirst !== 'undefined' ? params.mobileFirst : true;
	let isShow = false;
	function createStyleElement(): HTMLStyleElement {
		const link = document.createElement('style');
		link.id = `id-grid-helper`;
		link.innerHTML = initStyleBase();
		return link;
	}
	function initStyleVariables(variables: GridHelperVariables): string {
		let style = ``;
		for (const key in variables) {
			if (Object.prototype.hasOwnProperty.call(variables, key)) {
				// @ts-ignore
				const value: string | number = variables[key];
				style += `--${prefix}-${key}: ${value};`;
			}
		}
		return style;
	}
	function initStyleBase(): string {
		const initVar = initStyleVariables({
			gutter,
			sides,
			columns,
			container,
		});
		let style = `
		.${className}::before {

			--${prefix}-color: ${color}; /* цвет колонки */
			${initVar}

			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			content: '';
			pointer-events: none;
			z-index: 9999;
			background-repeat: no-repeat;
			max-width: var(--gh-container);
			left: 50%;
			transform: translateX(-50%);
			border: 0px solid transparent;

			--${prefix}-column-width: calc(
				((100% - (var(--${prefix}-gutter) * (var(--${prefix}-columns) - 1))) - var(--${prefix}-sides) * 2) / var(--${prefix}-columns)
			);
			
			margin: 0px var(--${prefix}-sides);
			/* 
				Градиент
			*/
			background-image: repeating-linear-gradient(
				90deg,
				var(--${prefix}-color) 0,
				var(--${prefix}-color) var(--${prefix}-column-width),
				transparent var(--${prefix}-column-width),
				transparent calc(var(--${prefix}-column-width) + var(--${prefix}-gutter))
			);
			
			
		}`;

		for (const size in responsible) {
			if (Object.prototype.hasOwnProperty.call(responsible, size)) {
				const vars = initStyleVariables(responsible[size]);
				style += `
					@media screen and (${mobileFirst ? 'min-width' : 'max-width'}: ${size}px) {
						.${className}::before {
							${vars}
						}
					}
				`;
			}
		}
		return style;
	}

	function keydown({ ctrlKey, code }: KeyboardEvent) {
		if (ctrlKey === true && code === "KeyM") {
			isShow ? hide() : show();
		}
	}
	function init() {
		document.head.append(createStyleElement());
		window.addEventListener('keydown', keydown);
		return api();
	}

	function destroy() {
		window.removeEventListener('keydown', keydown);
		const style = document.getElementById(`id-${className}`);
		if (style) {
			style.parentElement?.removeChild(style);
		}

	}
	function show() {
		isShow = true;
		document.body.classList.add(className);
		return api();
	}
	function hide() {
		isShow = false;
		document.body.classList.remove(className);
		return api();
	}
	function api(): GridHelperApi {
		return {
			init,
			show,
			hide,
			destroy
		};
	}
	return api();
}
