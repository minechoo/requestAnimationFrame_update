/*
  peformance.now();
  1ms단위로 정밀한 시간계산이 가능
  브라우저가 로딩된 순간부터 해당 구문이 호출된 시점까지의 시간을 ms단위로 반환
  정밀한 시간계산이 필요할때 활용됨
*/
const btn = document.querySelector('button');
const box = document.querySelector('#box');
let num = 0;
let startTime = 0;

btn.addEventListener('click', () => {
	startTime = performance.now();
	console.log('시작시간', startTime);
	requestAnimationFrame(move);
});

function move(time) {
	console.log('반복사이클 마다의 누적시간', time);
	num++;
	box.style.marginLeft = num + 'px';
	if (num >= 60) {
		console.log('총 모션 시간', time - startTime);
		return;
	}
	requestAnimationFrame(move);
}
