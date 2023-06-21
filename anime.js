const btn = document.querySelector('button');
const box = document.querySelector('#box');

btn.addEventListener('click', () => {
	anime(box, {
		prop: 'margin-top',
		value: '50%',
		duration: 500,
	});
});

function anime(selector, option) {
	const startTime = performance.now();
	let currentValue = parseInt(getComputedStyle(selector)[option.prop]);

	//만약 value속성으로 받은 값이 문자열이면 퍼센트연산처리 해야되므로 정수가 아닌 실수로 값을 변환
	const isString = typeof option.value;
	if (isString === 'string') {
		//option.value값이 문자열이면 기존의 currentValue값도 퍼센트 처리
		//퍼센트로 값을 변환하기 위해서는 부모요소의 전체넓이, 전체 높이값을 구함
		const parentW = parseInt(getComputedStyle(selector.parentElement).width);
		const parentH = parseInt(getComputedStyle(selector.parentElement).height);

		//가로나 세로축으로 퍼센트로 적용될만한 속성명을 배열로 그룹화
		const x = ['margin-left', 'margin-right', 'left', 'right', 'width'];
		const y = ['margin-top', 'marginb-bottom', 'top', 'bottom', 'height'];

		//option.prop값으로 위의 배열로 설정한 속성이 들어오면 currentValue값을 부모요소의 크기대비 퍼센트로 변환
		for (let cond of x) {
			if (option.prop === cond) {
				currentValue = (currentValue / parentW) * 100;
			}
		}
		for (let cond of y) {
			if (option.prop === cond) {
				currentValue = (currentValue / parentH) * 100;
			}
		}
		option.value = parseFloat(option.value);
	}

	option.value !== currentValue && requestAnimationFrame(run);

	function run(time) {
		let timelast = time - startTime;
		let progress = timelast / option.duration;

		progress < 0 && (progress = 0);
		progress > 1 && (progress = 1);
		progress < 1 ? requestAnimationFrame(run) : option.callback && option.callback();

		let result = currentValue + (option.value - currentValue) * progress;

		//속성값이 퍼센트이면 적용도 퍼센트 처리 그렇지 않으면 그냥 px처리
		if (isString === 'string') selector.style[option.prop] = result + '%';
		else selector.style[option.prop] = result + 'px';
	}
}
