
interface LayoutGridHelperVariables {
	gutter?: string;
	sides?: string;
	columns?: number;
	container?: string;
}

interface LayoutGridHelperConstructor extends LayoutGridHelperVariables {
	className?: string;
	prefix?: string;
	mobileFirst?: boolean,
	color?: string,
	responsible?: { [key: number]: LayoutGridHelperVariables; };
}
interface LayoutGridHelperApi {
	init(): void;
	show(): void;
	hide(): void;
	destroy(): void;
}



export default function LayoutGridHelper(params: LayoutGridHelperConstructor = {}): LayoutGridHelperApi {
	const color = params.color || 'rgb(255 0 0 / 0.2)';
	const gutter = params.gutter || '16px';
	const sides = params.sides || '20px';
	const columns = params.columns || 4;
	const container = params.container || '100%';
	const prefix = params.prefix || 'gh';
	const responsible = params.responsible || {};
	const className = params.className || 'layout-grid-helper';
	const mobileFirst = typeof params.mobileFirst !== 'undefined' ? params.mobileFirst : true;
	let isShow = false;

	function initStyleVariables(variables: LayoutGridHelperVariables): string {
		let style = ``;
		Object.entries(variables).forEach(([key, value]) => {
			if (typeof value !== "undefined") {
				style += `--${prefix}-${key}: ${value};`;
			}
		});
		return style;
	}

	function initStyleBase(): string {
		const initVar = initStyleVariables({
			gutter,
			sides,
			columns,
			container
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
				((100% - (var(--${prefix}-gutter) * (var(--${prefix}-columns) - 1))) - var(--${prefix}-sides) * 0) / var(--${prefix}-columns)
			);
			
			/* margin: 0px var(--${prefix}-sides); */ 
			border-width: 0px  var(--${prefix}-sides);
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



		Object.entries(responsible).forEach(([size, value]) => {
			const vars = initStyleVariables(value);
			style += `
					@media screen and (${mobileFirst ? 'min-width' : 'max-width'}: ${size}px) {
						.${className}::before {
							${vars}
						}
					}
				`;
		});
		return style;
	}

	function createStyleElement(): HTMLStyleElement {
		const link = document.createElement('style');
		link.id = `id-grid-helper`;
		link.innerHTML = initStyleBase();
		return link;
	}

	function show() {
		isShow = true;
		document.body.classList.add(className);
	}
	function hide() {
		isShow = false;
		document.body.classList.remove(className);
	}

	function keydown({ ctrlKey, code }: KeyboardEvent) {
		if (ctrlKey === true && code === "KeyM") {
			if (isShow) {
				hide();
			} else {
				show();
			}
		}
	}
	function init() {
		document.head.append(createStyleElement());
		window.addEventListener('keydown', keydown);
	}

	function destroy() {
		window.removeEventListener('keydown', keydown);
		const style = document.getElementById(`id-${className}`);
		if (style) {
			style.parentElement?.removeChild(style);
		}

	}

	function api(): LayoutGridHelperApi {
		return {
			init,
			show,
			hide,
			destroy
		};
	}
	return api();
}
