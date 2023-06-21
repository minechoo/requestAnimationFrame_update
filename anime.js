/*
  peformance.now();
  1ms단위로 정밀한 시간계산이 가능
  브라우저가 로딩된 순간부터 해당 구문이 호출된 시점까지의 시간을 ms단위로 반환
  정밀한 시간계산이 필요할때 활용됨

  특정시간동안 특정 수치값까지 변경
  반복횟수(x), 고정된 반복횟수안에서 변화량을 제어 (0)
*/
//1초동안 500px이동
const btn = document.querySelector('button');
const box = document.querySelector('#box');

btn.addEventListener('click', () => {
	anime(box, {
		prop: 'margin-left',
		value: 500,
		duration: 500,
	});
});

function anime(selector, option) {
	let startTime = performance.now();
	requestAnimationFrame(move);

	function move(time) {
		let timelast = time - startTime;
		let progress = timelast / option.duration;

		console.log('진행률', progress);

		if (progress < 1) {
			requestAnimationFrame(move);
		}
		selector.style[option.prop] = option.value * progress + 'px';
	}
}
