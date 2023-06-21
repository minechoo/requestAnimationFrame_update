const btn = document.querySelector('button');
const box = document.querySelector('#box');

btn.addEventListener('click', () => {
	anime(window, {
		prop: 'scroll',
		value: 1000,
		duration: 500,
	});
});

function anime(selector, option) {
	const startTime = performance.now();
	let currentValue = null;

	//option객체의 prop속성명이 scroll이면 scrollY값을 활용하고 그렇지 않은 나머지 경우에는 getComputedStyle로 스타일값을 가져옴
	option.prop === 'scroll' ? (currentValue = selector.scrollY) : (currentValue = parseFloat(getComputedStyle(selector)[option.prop]));

	//만약 value속성으로 받은 값이 문자열이면 퍼센트연산처리 해야되므로 정수가 아닌 실수로 값을 변환
	const isString = typeof option.value;
	if (isString === 'string') {
		//option.value값이 문자열이면 기존의 currentValue값도 퍼센트 처리
		//퍼센트로 값을 변환하기 위해서는 부모요소의 전체넓이, 전체 높이값을 구함
		const parentW = parseInt(getComputedStyle(selector.parentElement).width);
		const parentH = parseInt(getComputedStyle(selector.parentElement).height);

		//가로나 세로축으로 퍼센트로 적용될만한 속성명을 배열로 그룹화
		const x = ['left', 'right', 'width'];
		const y = ['top', 'bottom', 'height'];
		const errProps = ['margin-left', 'margin-right', 'padding-left', 'padding-right', 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom'];

		//퍼센트로 적용할수 없는 속성값이 들어오면 경고문구 출력하고 종료
		for (let cond of errProps) if (option.prop === cond) return console.error('margin, padding값은 퍼센트 모션처리할 수 없습니다.');

		//option.prop값으로 위의 배열로 설정한 속성이 들어오면 currentValue값을 부모요소의 크기대비 퍼센트로 변환
		for (let cond of x) option.prop === cond && (currentValue = (currentValue / parentW) * 100);
		for (let cond of y) option.prop === cond && (currentValue = (currentValue / parentH) * 100);

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
		//속성명이 opacity이면 실수값을 그대로 스타일에 적용
		else if (option.prop === 'opacity') selector.style[option.prop] = result;
		//속성명이 scroll이면 window의 scroll값 적용
		else if (option.prop === 'scroll') selector.scroll(0, result);
		else selector.style[option.prop] = result + 'px';
	}
}
